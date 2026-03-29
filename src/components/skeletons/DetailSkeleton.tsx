"use client";

export default function DetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Backdrop */}
      <div className="relative w-full aspect-[16/9] max-h-[60vh] bg-[var(--bg-secondary)]">
        <div className="absolute inset-0 shimmer bg-[var(--bg-tertiary)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-primary)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10 space-y-8">
        {/* Title + meta */}
        <div className="space-y-4">
          <div className="h-10 w-80 rounded bg-[var(--bg-tertiary)] shimmer" />
          <div className="h-4 w-48 rounded bg-[var(--bg-tertiary)] shimmer" />
          <div className="flex gap-3">
            <div className="h-6 w-16 rounded bg-[var(--bg-tertiary)] shimmer" />
            <div className="h-6 w-16 rounded bg-[var(--bg-tertiary)] shimmer" />
            <div className="h-6 w-16 rounded bg-[var(--bg-tertiary)] shimmer" />
          </div>
        </div>

        {/* Overview */}
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-[var(--bg-tertiary)] shimmer" />
          <div className="h-3 w-full rounded bg-[var(--bg-tertiary)] shimmer" />
          <div className="h-3 w-3/4 rounded bg-[var(--bg-tertiary)] shimmer" />
        </div>

        {/* Cast row */}
        <div className="space-y-3">
          <div className="h-6 w-24 rounded bg-[var(--bg-tertiary)] shimmer" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[120px] space-y-2">
                <div className="aspect-[2/3] rounded bg-[var(--bg-tertiary)] shimmer" />
                <div className="h-3 w-3/4 rounded bg-[var(--bg-tertiary)] shimmer" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
