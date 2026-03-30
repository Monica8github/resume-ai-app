import { Skeleton } from "@/components/ui/skeleton"

export function AnalysisSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Score Skeleton */}
      <div className="p-6 rounded-2xl bg-secondary/30 border border-border">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Skeleton className="w-[120px] h-[120px] rounded-full" />
          <div className="flex-1 w-full">
            <Skeleton className="h-5 w-40 mb-2 mx-auto sm:mx-0" />
            <Skeleton className="h-4 w-24 mb-4 mx-auto sm:mx-0" />
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Skills Skeleton */}
      <div className="p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="w-6 h-6 rounded-md" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-7 w-20 rounded-lg" />
          <Skeleton className="h-7 w-24 rounded-lg" />
          <Skeleton className="h-7 w-16 rounded-lg" />
          <Skeleton className="h-7 w-28 rounded-lg" />
        </div>
      </div>

      {/* Missing Skills Skeleton */}
      <div className="p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="w-6 h-6 rounded-md" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-7 w-14 rounded-lg" />
          <Skeleton className="h-7 w-20 rounded-lg" />
          <Skeleton className="h-7 w-16 rounded-lg" />
        </div>
      </div>

      {/* Suggestions Skeleton */}
      <div className="p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="w-6 h-6 rounded-md" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 bg-secondary/30 rounded-lg">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Section Review Skeleton */}
      <div className="p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="w-6 h-6 rounded-md" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 bg-secondary/30 rounded-lg">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-14 rounded" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
