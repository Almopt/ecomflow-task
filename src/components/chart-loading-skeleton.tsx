import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ChartLoadingSkeletonProps {
  barCount: number;
}

export default function ChartLoadingSkeleton({ barCount }: ChartLoadingSkeletonProps) {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-0 pb-2">
        <CardTitle>
          <Skeleton className="h-6 w-[250px]" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[600px]">
          <div className="relative h-[550px] w-full">
            {/* Bar groups */}
            <div className="absolute bottom-12 w-full flex justify-between px-2">
              {[...Array(barCount)].map((_, index) => (
                <div key={index} className="flex gap-1 h-full items-end" style={{ width: `${90 / barCount}%` }}>
                  <Skeleton className="h-[400px] w-[150px]  bg-green-500/20" />
                  <Skeleton className="h-[290px] w-[150px]  bg-green-500/20" />
                  {/* <div className="w-5/12 h-[350px] bg-green-500/20 border border-green-500"></div> */}
                </div>
              ))}
            </div>

            {/* Labels */}
            <div className="absolute bottom-0 w-full flex justify-between px-2">
              {[...Array(barCount)].map((_, index) => (
                <Skeleton key={index} className="h-4 bg-gray-200" style={{ width: `${90 / barCount}%` }} />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
