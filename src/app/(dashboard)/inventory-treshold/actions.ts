'use server';

import { parse } from 'csv-parse/sync';
import { revalidatePath } from 'next/cache';
import { calculateThresholdLevels } from '@/lib/utils';

interface InventoryFormData {
  csvFile: string;
  leadTimeDays?: string | number;
  safetyStockPercentage?: string | number;
  fulfillmentTimeDays?: string | number;
}

export async function processInventoryOrderData(formData: InventoryFormData) {
  try {
    const file = formData.csvFile;
    const defaultLeadTimeDays = parseInt(formData.leadTimeDays?.toString() || '7', 10);
    const safetyStockPercentage = parseInt(formData.safetyStockPercentage?.toString() || '20', 10) / 100;
    const fulfillmentTimeDays = parseInt(formData.fulfillmentTimeDays?.toString() || '2', 10);

    if (!file) {
      return { success: false, error: 'No file uploaded' };
    }

    // Get the file content as text
    const csvText = file;

    console.log(csvText);

    // Parse the CSV
    const records = parse(csvText, {
      delimiter: ';', // Use semicolon as delimiter
      columns: true, // Use the first line as column names
      skip_empty_lines: true, // Skip empty lines
      cast: true, // Automatically convert strings to native types when possible
      trim: true, // Trim whitespace from fields
    });

    if (records.length === 0) {
      return { success: false, error: 'CSV file is empty' };
    }

    // Validate expected columns
    const requiredColumns = ['product_id', 'product_name', 'date', 'inventory_level', 'orders', 'lead_time_days'];
    const headers = Object.keys(records[0]);
    const missingColumns = requiredColumns.filter((col) => !headers.includes(col));

    if (missingColumns.length > 0) {
      return {
        success: false,
        error: `Missing required columns: ${missingColumns.join(', ')}`,
      };
    }

    // Calculate threshold levels by product
    const productData = calculateThresholdLevels(
      records,
      defaultLeadTimeDays,
      safetyStockPercentage,
      fulfillmentTimeDays
    );

    // console.log(productData);

    // Refresh any pages showing inventory data
    revalidatePath('/inventory-treshold');

    return {
      success: true,
      recordCount: records.length,
      data: productData,
      productsAnalyzed: Object.keys(productData).length,
      message: `Successfully processed ${records.length} inventory records and calculated thresholds for ${
        Object.keys(productData).length
      } products`,
    };
  } catch (error) {
    console.error('Error processing inventory data:', error);
    return {
      success: false,
      error: 'Failed to process CSV data: ' + error,
    };
  }
}
