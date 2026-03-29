"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const TYPE_FILTERS = [
  { value: "", label: "All" },
  { value: "movie", label: "Movies" },
  { value: "tv", label: "TV Shows" },
  { value: "anime", label: "Anime" },
];

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeType = searchParams.get("type") ?? "";

  const handleTypeChange = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type) {
      params.set("type", type);
    } else {
      params.delete("type");
    }
    params.set("page", "1");
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {TYPE_FILTERS.map((filter) => (
        <button
          key={filter.value}
          onClick={() => handleTypeChange(filter.value)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all",
            "border",
            activeType === filter.value
              ? "bg-[var(--accent-focus)] border-[var(--accent-focus)] text-white"
              : "bg-transparent border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-white/20 hover:text-[var(--text-primary)]"
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
