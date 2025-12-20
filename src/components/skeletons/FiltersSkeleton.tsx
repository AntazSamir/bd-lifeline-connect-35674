import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const FiltersSkeleton = () => {
  return (
    <Card className="animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-8 w-full mt-2" />
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {/* Filter groups */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-3 rounded-lg bg-background space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}
        
        {/* Toggle filters */}
        <div className="space-y-3 pt-2 border-t">
          <div className="flex items-center justify-between p-3 rounded-lg bg-background">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-10 rounded-full" />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-background">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-10 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FiltersSkeleton;
