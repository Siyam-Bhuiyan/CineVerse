"use client";

export default function HeroSkeleton() {
  return (
    <div className="relative w-full aspect-[16/9] max-h-[70vh] animate-pulse bg-[var(--bg-secondary)]">
      {/* Backdrop shimmer */}
      <div className="absolute inset-0 shimmer bg-[var(--bg-tertiary)]" />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-primary)]" />
      {/* Content area */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 space-y-4">
        {/* Logo placeholder */}
        <div className="h-12 w-64 rounded bg-[var(--bg-tertiary)] shimmer" />
        {/* Tagline */}
        <div className="h-4 w-96 max-w-full rounded bg-[var(--bg-tertiary)] shimmer" />
        {/* Meta */}
        <div className="flex gap-3">
          <div className="h-8 w-24 rounded-full bg-[var(--bg-tertiary)] shimmer" />
          <div className="h-8 w-24 rounded-full bg-[var(--bg-tertiary)] shimmer" />
          <div className="h-8 w-32 rounded-full bg-[var(--bg-tertiary)] shimmer" />
        </div>
      </div>
    </div>
  );
}
