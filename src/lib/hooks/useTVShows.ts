"use client";

import { useQuery } from "@tanstack/react-query";
import type { TMDBPaginatedResponse, TMDBMovie, TMDBTVShow, TMDBTVDetail } from "@/types/tmdb";

const STALE_TIMES = {
  trending: 5 * 60 * 1000,
  detail: 60 * 60 * 1000,
};

export function useTrendingTV(timeWindow: "day" | "week" = "week") {
  return useQuery<TMDBPaginatedResponse<TMDBMovie | TMDBTVShow>>({
    queryKey: ["trending", "tv", timeWindow],
    queryFn: async () => {
      const res = await fetch(`/api/tmdb/trending?type=tv&timeWindow=${timeWindow}`);
      if (!res.ok) throw new Error("Failed to fetch trending TV");
      return res.json();
    },
    staleTime: STALE_TIMES.trending,
  });
}

export function useTVDetail(id: number | null) {
  return useQuery<TMDBTVDetail>({
    queryKey: ["tv", id],
    queryFn: async () => {
      const res = await fetch(`/api/tmdb/tv/${id}`);
      if (!res.ok) throw new Error("Failed to fetch TV detail");
      return res.json();
    },
    enabled: id !== null,
    staleTime: STALE_TIMES.detail,
  });
}
