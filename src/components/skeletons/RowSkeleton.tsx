"use client";

import CardSkeleton from "./CardSkeleton";

interface RowSkeletonProps {
  count?: number;
}

export default function RowSkeleton({ count = 7 }: RowSkeletonProps) {
  return (
    <div className="space-y-4">
      {/* Section heading */}
      <div className="h-7 w-48 rounded bg-[var(--bg-tertiary)] shimmer animate-pulse" />
      {/* Cards row */}
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: count }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
