"use client";

import { cn } from "@/lib/utils/cn";

interface CardSkeletonProps {
  className?: string;
}

export default function CardSkeleton({ className }: CardSkeletonProps) {
  return (
    <div
      className={cn(
        "flex-shrink-0 w-[180px] animate-pulse rounded-lg overflow-hidden",
        "bg-[var(--bg-secondary)] border border-[var(--border-subtle)]",
        className
      )}
    >
      {/* Poster skeleton — 2:3 aspect ratio */}
      <div className="aspect-[2/3] bg-[var(--bg-tertiary)] shimmer" />
      {/* Title area */}
      <div className="p-3 space-y-2">
        <div className="h-3 w-3/4 rounded bg-[var(--bg-tertiary)] shimmer" />
        <div className="h-2 w-1/2 rounded bg-[var(--bg-tertiary)] shimmer" />
      </div>
    </div>
  );
}
