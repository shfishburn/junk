import { Skeleton } from "@/components/ui/skeleton";

export function TestimonialCardSkeleton() {
  return (
    <div className="relative p-6 rounded-lg bg-card border border-border">
      {/* Stars skeleton */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-4 rounded-full" />
        ))}
      </div>

      {/* Text skeleton */}
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Author skeleton */}
      <div className="border-t border-border pt-4 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

export function TestimonialSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <TestimonialCardSkeleton key={i} />
      ))}
    </div>
  );
}
