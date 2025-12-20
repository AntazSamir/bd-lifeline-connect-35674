import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const DonorCardSkeleton = () => {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {/* Avatar */}
            <Skeleton className="w-16 h-16 rounded-full" />

            <div className="space-y-3">
              {/* Name */}
              <Skeleton className="h-5 w-32" />

              {/* Location */}
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-24" />
              </div>

              {/* Badges */}
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-12 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>

              {/* Last donation */}
              <Skeleton className="h-4 w-36" />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-9 w-28 rounded-md" />
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const DonorListSkeleton = ({ count = 5 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <DonorCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default DonorCardSkeleton;
