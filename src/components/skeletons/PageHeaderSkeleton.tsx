import { Skeleton } from "@/components/ui/skeleton";

interface PageHeaderSkeletonProps {
  showButton?: boolean;
}

const PageHeaderSkeleton = ({ showButton = true }: PageHeaderSkeletonProps) => {
  return (
    <div className="mb-8 flex items-start justify-between animate-pulse">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
        <Skeleton className="h-5 w-48" />
      </div>
      {showButton && <Skeleton className="h-11 w-40 rounded-md" />}
    </div>
  );
};

export default PageHeaderSkeleton;
