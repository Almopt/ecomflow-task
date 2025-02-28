import { z } from 'zod';

// Maximum file size (in bytes) - 5MB example
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Schema for a single CSV file - modified to handle File objects with preview
const csvFileSchema = z
  .custom<File>((value) => value instanceof File, {
    message: 'Please upload a valid file',
  })
  .refine((file) => file.name.endsWith('.csv'), 'File must have a .csv extension')
  .refine((file) => file.size <= MAX_FILE_SIZE, 'File size must be less than 5MB')
  .refine((file) => file.size > 0, 'File cannot be empty');

export const inventoryThresholdSchema = z.object({
  leadTimeDays: z.coerce
    .number({ required_error: 'Lead time is required' })
    .positive('Lead time must be a positive number')
    .describe('Lead time in days to restock inventory'),

  safetyStockPercentage: z.coerce
    .number({ required_error: 'Safety stock percentage is required' })
    .min(0, 'Safety stock percentage cannot be negative')
    .max(100, 'Safety stock percentage cannot exceed 100%')
    .describe('Safety stock percentage to maintain as buffer'),

  fulfillmentTimeDays: z.coerce
    .number({ required_error: 'Fulfillment time is required' })
    .nonnegative('Fulfillment time cannot be negative')
    .describe('Time in days to fulfill orders'),

  // Use an array to match your component but extract first file in the server action
  files: z
    .array(csvFileSchema)
    .min(1, 'Please upload at least one CSV file')
    .max(1, 'You can upload a maximum of 1 CSV file')
    .describe('CSV files with inventory data'),
});
