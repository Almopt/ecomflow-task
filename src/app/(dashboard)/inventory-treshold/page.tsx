'use client';

import ChartLoadingSkeleton from '@/components/chart-loading-skeleton';
import ExportCSV from '@/components/export-data-csv-button';
import { FileUploadDialog } from '@/components/file-upload-dialog';
import { InventoryChart } from '@/components/invetory-chart';
import { SalesChart } from '@/components/sales-chart';
import StatCardSkeleton from '@/components/start-loading-card-skeleton';
import StatsData from '@/components/stats-data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MonthlyDataPoint } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';

export interface ProductInventoryData {
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

export type ProductInventoryArray = ProductInventoryData[];

export default function InventoryTreshold() {
  const [data, setData] = useState<ProductInventoryArray>([]);

  return (
    <main className="w-full">
      <div className="border-b border-border/40">
        <div className="p-6 flex justify-between ">
          <h1 className=" text-3xl font-bold">Inventory Dashboard</h1>
          <div className="flex gap-2">
            {data.length > 0 && <ExportCSV data={data} buttonText="Export Data"></ExportCSV>}
            <FileUploadDialog updateData={setData} />
          </div>
        </div>
      </div>
      <div className="p-6">
        {data.length > 0 ? (
          <Tabs defaultValue={data[0].product_id} className="">
            <TabsList>
              {data.map((product) => {
                return (
                  <TabsTrigger
                    key={product.product_id}
                    value={product.product_id}
                    // onClick={() => setCurrentProduct(product.product_id)}
                  >
                    {product.product_name}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {data.map((item) => (
              <TabsContent key={item.product_id} value={item.product_id}>
                <div className="flex flex-col gap-4 mt-4">
                  {item.reorder_needed && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Attention!</AlertTitle>
                      <AlertDescription>
                        Place a new order as soon as you can, your stock is at risk of crashing.
                      </AlertDescription>
                    </Alert>
                  )}
                  <StatsData data={item} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InventoryChart
                      data={item.inventoryData}
                      lowTreshold={item.low_threshold}
                      mediumTreshold={item.medium_threshold}
                      highTreshold={item.high_threshold}
                    />
                    <SalesChart data={item.salesData} />
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              {Array.from({ length: 5 }, (_, i) => (
                <StatCardSkeleton key={i} />
              ))}
            </div>
            <div className="flex gap-4">
              <ChartLoadingSkeleton barCount={4} />
              <ChartLoadingSkeleton barCount={4} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
