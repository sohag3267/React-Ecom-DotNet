import { Card } from "@/components/shared/ui/card";
import { Skeleton } from "@/components/shared/ui/skeleton";

interface ProductsGridSkeletonProps {
  count?: number;
}

export function ProductsGridSkeleton({ count = 12 }: ProductsGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="space-y-4 p-4">
            {/* Image skeleton */}
            <Skeleton className="w-full aspect-square rounded-md" />

            {/* Title skeleton */}
            <Skeleton className="h-5 w-3/4" />

            {/* Rating skeleton */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
            </div>

            {/* Price skeleton */}
            <Skeleton className="h-6 w-24" />

            {/* Buttons skeleton */}
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 w-9" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
