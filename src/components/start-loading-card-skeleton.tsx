import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function StatCardSkeleton() {
  return (
    <Card className="w-full max-w-sm">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Title */}
          <Skeleton className="h-5 w-32" />

          {/* Large Number */}
          <Skeleton className="h-12 w-26" />

          {/* Subtitle */}
          <Skeleton className="h-4 w-36" />
        </div>
      </CardContent>
    </Card>
  );
}
