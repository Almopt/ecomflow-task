import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Define the raw record interface from input data
export interface Record {
  product_id: string;
  product_name: string;
  date: string;
  inventory_level: number;
  orders: number;
  lead_time_days: number;
}

// Define processed record interface with parsed date
interface ProcessedRecord {
  date: Date;
  inventory_level: number;
  orders: number;
  lead_time_days: number;
}

// Define product group interface
interface ProductGroup {
  name: string;
  records: ProcessedRecord[];
}

// Define product groups dictionary
interface ProductGroups {
  [productId: string]: ProductGroup;
}

// Define monthly data point interface
export interface MonthlyDataPoint {
  month: string;
  desktop: number;
  year?: number;
  monthNum?: number;
}

// Define monthly data dictionary
interface MonthlyData {
  [monthKey: string]: MonthlyDataPoint;
}

// Define product data interface
interface ProductData {
  [productId: string]: MonthlyDataPoint[];
}

// Define product inventory result interface
export interface ProductInventoryResult {
  product_id: string;
  product_name: string;
  current_inventory: number;
  inventory_status: 'Low' | 'Medium' | 'High';
  avg_daily_sales: number;
  order_frequency_days: number;
  lead_time_days: number;
  fulfillment_time_days: number;
  total_lead_time: number;
  safety_stock_percentage: number;
  adjusted_safety_stock_percentage: number;
  low_threshold: number;
  medium_threshold: number;
  high_threshold: number;
  safety_stock: number;
  data_points: number;
  date_range_days: number;
  total_orders: number;
  days_until_stockout: number;
  reorder_needed: boolean;
  inventoryData: MonthlyDataPoint[];
  salesData: MonthlyDataPoint[];
}

// Define return type for the function
export type ProductInventoryArray = ProductInventoryResult[];

// Helper function to calculate inventory thresholds
export function calculateThresholdLevels(
  records: Record[],
  defaultLeadTimeDays: number,
  safetyStockPercentage: number,
  fulfillmentTimeDays: number
): ProductInventoryArray {
  // Group records by product_id
  const productGroups: ProductGroups = {};

  // First pass: Group by product
  records.forEach((record) => {
    const { product_id, product_name, date, inventory_level, orders, lead_time_days } = record;

    if (!productGroups[product_id]) {
      productGroups[product_id] = {
        name: product_name,
        records: [],
      };
    }

    productGroups[product_id].records.push({
      date: new Date(date),
      inventory_level: Number(inventory_level),
      orders: Number(orders),
      lead_time_days: Number(lead_time_days) || defaultLeadTimeDays,
    });
  });

  // Create monthly inventory and sales chart data for each product
  const productInventoryData: ProductData = {};
  const productSalesData: ProductData = {};

  Object.keys(productGroups).forEach((productId) => {
    const { records } = productGroups[productId];

    // Create a mapping of month numbers to month names
    const monthNames: string[] = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    // Maps to store inventory and sales by month
    const inventoryByMonth: MonthlyData = {};
    const salesByMonth: MonthlyData = {};

    // Process each record
    records.forEach((record) => {
      const date = record.date;
      const month = date.getMonth(); // 0-11
      const monthName = monthNames[month];
      const year = date.getFullYear();

      // Create a key that includes year to handle multi-year data
      const monthKey = `${year}-${month}`;

      // Initialize inventory data if not exists
      if (!inventoryByMonth[monthKey]) {
        inventoryByMonth[monthKey] = {
          month: monthName,
          desktop: 0,
          year: year,
          monthNum: month,
        };
      }

      // Initialize sales data if not exists
      if (!salesByMonth[monthKey]) {
        salesByMonth[monthKey] = {
          month: monthName,
          desktop: 0,
          year: year,
          monthNum: month,
        };
      }

      // Add inventory level to the month (use the most recent inventory level)
      inventoryByMonth[monthKey].desktop = record.inventory_level;

      // Add orders/sales to the month (accumulate all sales within the month)
      salesByMonth[monthKey].desktop += record.orders;
    });

    // Convert the inventory mapping to an array and sort by year and month
    const inventoryData = Object.values(inventoryByMonth).sort((a, b) => {
      if (a.year !== b.year) {
        return a.year! - b.year!;
      }
      return a.monthNum! - b.monthNum!;
    });

    // Convert the sales mapping to an array and sort by year and month
    const salesData = Object.values(salesByMonth).sort((a, b) => {
      if (a.year !== b.year) {
        return a.year! - b.year!;
      }
      return a.monthNum! - b.monthNum!;
    });

    // Remove the extra fields we used for sorting
    productInventoryData[productId] = inventoryData.map(({ month, desktop }) => ({ month, desktop }));
    productSalesData[productId] = salesData.map(({ month, desktop }) => ({ month, desktop }));
  });

  // Second pass: Calculate metrics for each product
  const productDataArray: ProductInventoryArray = [];

  Object.keys(productGroups).forEach((productId) => {
    const { name, records } = productGroups[productId];

    // Sort records by date
    records.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Calculate date range in days
    const startDate = records[0].date;
    const endDate = records[records.length - 1].date;
    const daysDifference = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

    // Calculate total orders
    const totalOrders = records.reduce((sum, record) => sum + record.orders, 0);

    // Calculate average daily sales/usage
    const avgDailySales = totalOrders / daysDifference;

    // Calculate order frequency (average days between orders)
    const orderRecords = records.filter((r) => r.orders > 0);
    const orderFrequency = daysDifference / Math.max(1, orderRecords.length);

    // Get average lead time from the data or use default
    const avgLeadTime = records.reduce((sum, r) => sum + r.lead_time_days, 0) / records.length;

    // Calculate combined lead time (supplier lead time + fulfillment time)
    const totalLeadTime = avgLeadTime + fulfillmentTimeDays;

    // Calculate threshold levels with order frequency factor
    // If orders come in frequently (e.g., daily), the orderFrequencyFactor will be lower,
    // reducing the safety stock needed because demand is consistent and predictable.
    // If orders come in infrequently (e.g., once every two weeks), the orderFrequencyFactor will be higher,
    // increasing the safety stock to account for less predictable demand patterns.
    const orderFrequencyFactor = Math.min(1.5, Math.max(0.8, orderFrequency / 7));

    // Calculate expected usage during lead time
    // This is how much inventory you expect to use during the lead time period.
    const expectedLeadTimeUsage = avgDailySales * totalLeadTime;

    // Adjust safety stock based on order frequency
    const adjustedSafetyStockPercentage = safetyStockPercentage * orderFrequencyFactor;
    const safetyStock = expectedLeadTimeUsage * adjustedSafetyStockPercentage;

    // Low threshold = Reorder point
    const lowThreshold = expectedLeadTimeUsage + safetyStock;

    // Medium threshold with buffer based on order frequency
    const bufferFactor = Math.max(0.3, Math.min(0.7, 7 / orderFrequency));
    const mediumThreshold = lowThreshold + expectedLeadTimeUsage * bufferFactor;

    // High threshold = Optimal stock level
    const highThreshold = lowThreshold + expectedLeadTimeUsage * Math.max(1, orderFrequencyFactor);

    // Get current inventory level (from most recent record)
    const currentInventory = records[records.length - 1].inventory_level;

    // Determine current inventory status
    let inventoryStatus: 'Low' | 'Medium' | 'High';
    if (currentInventory <= lowThreshold) {
      inventoryStatus = 'Low';
    } else if (currentInventory <= mediumThreshold) {
      inventoryStatus = 'Medium';
    } else {
      inventoryStatus = 'High';
    }

    productDataArray.push({
      product_id: productId,
      product_name: name,
      current_inventory: currentInventory,
      inventory_status: inventoryStatus,
      avg_daily_sales: avgDailySales,
      order_frequency_days: orderFrequency,
      lead_time_days: avgLeadTime,
      fulfillment_time_days: fulfillmentTimeDays,
      total_lead_time: totalLeadTime,
      safety_stock_percentage: safetyStockPercentage * 100,
      adjusted_safety_stock_percentage: adjustedSafetyStockPercentage * 100,
      low_threshold: Math.ceil(lowThreshold),
      medium_threshold: Math.ceil(mediumThreshold),
      high_threshold: Math.ceil(highThreshold),
      safety_stock: Math.ceil(safetyStock),
      data_points: records.length,
      date_range_days: daysDifference,
      total_orders: totalOrders,
      days_until_stockout: currentInventory > 0 ? Math.floor(currentInventory / avgDailySales) : 0,
      reorder_needed: currentInventory <= lowThreshold,
      inventoryData: productInventoryData[productId] || [],
      salesData: productSalesData[productId] || [],
    });
  });

  return productDataArray;
}
