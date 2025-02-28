'use client';

import { CartesianGrid, LabelList, Line, LineChart, XAxis, ReferenceLine, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { MonthlyDataPoint } from '@/lib/utils';

const chartConfig = {
  desktop: {
    label: 'Invetory',
    color: '#34B53A',
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

// Component props interface using our type
interface DeviceChartProps {
  data: MonthlyDataPoint[];
  lowTreshold: number;
  mediumTreshold: number;
  highTreshold: number;
  title?: string;
}

export function InventoryChart({ data, lowTreshold, mediumTreshold, highTreshold }: DeviceChartProps) {
  console.log(data);

  const chartData = data.map((item) => {
    return {
      month: item.month,
      desktop: item.desktop, // Using desktop value as the value property
      lowThreshold: lowTreshold,
      mediumThreshold: mediumTreshold,
      highThreshold: highTreshold,
    };
  });

  return (
    <Card className="max-w-[800px]">
      <CardHeader>
        <CardTitle>Inventory</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 0,
              right: 80,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />

            {/* Reference Lines */}
            <ReferenceLine
              key="lowThreshold"
              y={lowTreshold}
              stroke="hsl(var(--destructive))"
              label={{
                value: `Low: ${lowTreshold}`,
                position: 'right',
                fill: 'hsl(var(--destructive))',
                fontSize: 12,
              }}
            />

            <ReferenceLine
              key="mediumThreshold"
              y={mediumTreshold}
              stroke="#ffb703"
              label={{
                value: `Medium: ${mediumTreshold}`,
                position: 'right',
                fill: '#ffb703',
                fontSize: 12,
              }}
            />

            <ReferenceLine
              key="highThreshold"
              y={highTreshold}
              stroke="#2a9d8f"
              label={{
                value: `High: ${highTreshold}`,
                position: 'right',
                fill: '#2a9d8f',
                fontSize: 12,
              }}
            />

            {/* Main Line */}
            <Line
              dataKey="desktop"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={(props) => {
                const { cx, cy, payload, index } = props; // Note the added index

                // Determine if this point is below threshold
                const isBelowThreshold = payload.desktop < lowTreshold;

                // Change color and size based on threshold
                const fill = isBelowThreshold ? 'hsl(var(--destructive))' : 'var(--color-desktop)';

                // Make circles bigger when below threshold (6px vs 4px)
                const radius = isBelowThreshold ? 8 : 4;

                return <circle key={`dot-${index}`} cx={cx} cy={cy} r={radius} fill={fill} />;
              }}
              activeDot={{
                r: 8, // Slightly larger for active dots
              }}
            >
              <LabelList dataKey="desktop" position="top" offset={12} className="fill-foreground" fontSize={12} />
            </Line>
            {/* <ChartLegend content={<ChartLegendContent />} /> */}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
