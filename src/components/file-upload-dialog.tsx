'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { inventoryThresholdSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import FileUploadDropzone from './file-upload-dropzone';
import { processInventoryOrderData } from '@/app/(dashboard)/inventory-treshold/actions';
import { ProductInventoryArray } from '@/app/(dashboard)/inventory-treshold/page';
import { useState } from 'react';

// Define the interface for the FileUploadDialog props
interface FileUploadDialogProps {
  updateData: (data: ProductInventoryArray) => void;
}

// Define the interface for the process data sent to the server
interface ProcessData {
  csvFile: string;
  leadTimeDays: string;
  safetyStockPercentage: string;
  fulfillmentTimeDays: string;
}

export function FileUploadDialog({ updateData }: FileUploadDialogProps) {
  const [open, setOpen] = useState(false);
  // Define the form with typed schema inference
  const form = useForm<z.infer<typeof inventoryThresholdSchema>>({
    resolver: zodResolver(inventoryThresholdSchema),
    defaultValues: {
      files: [],
      leadTimeDays: 5,
      safetyStockPercentage: 25,
      fulfillmentTimeDays: 2,
    },
  });

  // Define a submit handler with proper type inference
  async function onSubmit(values: z.infer<typeof inventoryThresholdSchema>) {
    const processData: ProcessData = {
      csvFile: '',
      leadTimeDays: values.leadTimeDays.toString(),
      safetyStockPercentage: values.safetyStockPercentage.toString(),
      fulfillmentTimeDays: values.fulfillmentTimeDays.toString(),
    };

    const reader = new FileReader();

    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');

    reader.onload = async () => {
      // Safely access reader.result and check its type
      if (typeof reader.result === 'string') {
        console.log(reader.result);
        processData.csvFile = reader.result;
      } else {
        console.error('Error: reader.result is not a string. It is:', reader.result);
        processData.csvFile = '';
        return;
      }

      try {
        const result = await processInventoryOrderData(processData);
        if (result.data) {
          updateData(result.data);

          // Close the dialog
          setOpen(false);

          // Reset the form to default values
          form.reset({
            files: [],
            leadTimeDays: 5,
            safetyStockPercentage: 25,
            fulfillmentTimeDays: 2,
          });
        }
      } catch (error) {
        console.error('Error processing inventory data:', error);
        // Handle the error appropriately (e.g., display an error message to the user)
      }
    };

    // Ensure the files array has elements before trying to read
    if (values.files && values.files.length > 0) {
      reader.readAsText(values.files[0]);
    } else {
      console.error('No file selected');
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Upload CSV</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload CSV</DialogTitle>
          <DialogDescription>Upload a CSV file containing historical inventory and order data</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Documents</FormLabel>
                  <FormControl>
                    <FileUploadDropzone field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="leadTimeDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lead Time (days)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="safetyStockPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Safety Stock (%)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fulfillmentTimeDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fulfillment Time (days)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button className="w-full" type="submit">
              Upload File
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
