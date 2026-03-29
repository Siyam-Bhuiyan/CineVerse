"use client";

import { useQuery } from "@tanstack/react-query";
import type { TMDBPaginatedResponse, TMDBMovie, TMDBTVShow, TMDBMovieDetail } from "@/types/tmdb";

const STALE_TIMES = {
  trending: 5 * 60 * 1000,
  detail: 60 * 60 * 1000,
};

export function useTrendingMovies(timeWindow: "day" | "week" = "week") {
  return useQuery<TMDBPaginatedResponse<TMDBMovie | TMDBTVShow>>({
    queryKey: ["trending", "movie", timeWindow],
    queryFn: async () => {
      const res = await fetch(`/api/tmdb/trending?type=movie&timeWindow=${timeWindow}`);
      if (!res.ok) throw new Error("Failed to fetch trending movies");
      return res.json();
    },
    staleTime: STALE_TIMES.trending,
  });
}

export function useTrendingAll(timeWindow: "day" | "week" = "week") {
  return useQuery<TMDBPaginatedResponse<TMDBMovie | TMDBTVShow>>({
    queryKey: ["trending", "all", timeWindow],
    queryFn: async () => {
      const res = await fetch(`/api/tmdb/trending?type=all&timeWindow=${timeWindow}`);
      if (!res.ok) throw new Error("Failed to fetch trending");
      return res.json();
    },
    staleTime: STALE_TIMES.trending,
  });
}

export function useMovieDetail(id: number | null) {
  return useQuery<TMDBMovieDetail>({
    queryKey: ["movie", id],
    queryFn: async () => {
      const res = await fetch(`/api/tmdb/movie/${id}`);
      if (!res.ok) throw new Error("Failed to fetch movie detail");
      return res.json();
    },
    enabled: id !== null,
    staleTime: STALE_TIMES.detail,
  });
}
