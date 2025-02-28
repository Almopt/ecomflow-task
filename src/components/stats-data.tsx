import { ProductInventoryData } from '@/app/(dashboard)/inventory-treshold/page';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CircleAlert, PackageCheck, Warehouse } from 'lucide-react';

interface StatsDataProps {
  data: ProductInventoryData;
}

export default function StatsData({ data }: StatsDataProps) {
  const cardColor =
    data.inventory_status === 'Low'
      ? 'border-l-red-500'
      : data.inventory_status === 'Medium'
      ? 'border-l-yellow-500'
      : 'border-l-green-500';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card className={`overflow-hidden border-l-4 ${cardColor}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Inventory</CardTitle>
          <Warehouse />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.current_inventory}</div>
        </CardContent>
      </Card>
      <Card className={`overflow-hidden border-l-4 ${cardColor}`}>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Inventory Status</CardTitle>
          <CircleAlert />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.inventory_status}</div>
        </CardContent>
      </Card>
      <Card className={`overflow-hidden border-l-4 border-l-green-500`}>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Days Until Stock Out</CardTitle>
          {/* <ShoppingBag className="h-4 w-4 text-muted-foreground" /> */}
          <PackageCheck />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.days_until_stockout}</div>
        </CardContent>
      </Card>
      <Card className={`overflow-hidden border-l-4 border-l-green-500`}>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <PackageCheck />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.total_orders}</div>
        </CardContent>
      </Card>
      <Card className={`overflow-hidden border-l-4 border-l-green-500`}>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Average Daily Sales</CardTitle>
          {/* <ShoppingBag className="h-4 w-4 text-muted-foreground" /> */}
          <PackageCheck />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.avg_daily_sales.toFixed(1)}</div>
        </CardContent>
      </Card>
    </div>
  );
}
