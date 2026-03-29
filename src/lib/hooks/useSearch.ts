"use client";

import { useQuery } from "@tanstack/react-query";
import type { TMDBPaginatedResponse, TMDBSearchMultiResult } from "@/types/tmdb";

const STALE_TIME = 2 * 60 * 1000; // 2 minutes

export function useSearch(query: string, page: number = 1, type?: "movie" | "tv") {
  return useQuery<TMDBPaginatedResponse<TMDBSearchMultiResult>>({
    queryKey: ["search", query, page, type],
    queryFn: async () => {
      const params = new URLSearchParams({ q: query, page: String(page) });
      if (type) params.set("type", type);
      const res = await fetch(`/api/tmdb/search?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to search");
      return res.json();
    },
    enabled: query.length >= 2,
    staleTime: STALE_TIME,
  });
}
