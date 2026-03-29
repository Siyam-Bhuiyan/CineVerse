"use client";

import { useQuery } from "@tanstack/react-query";
import type { AniListTrendingResponse, AniListDetailResponse } from "@/types/anilist";

const STALE_TIMES = {
  trending: 5 * 60 * 1000,
  detail: 60 * 60 * 1000,
};

export function useTrendingAnime(page: number = 1) {
  return useQuery<AniListTrendingResponse>({
    queryKey: ["anime", "trending", page],
    queryFn: async () => {
      const res = await fetch(`/api/anime/trending?page=${page}`);
      if (!res.ok) throw new Error("Failed to fetch trending anime");
      return res.json();
    },
    staleTime: STALE_TIMES.trending,
  });
}

export function useAnimeDetail(id: number | null) {
  return useQuery<AniListDetailResponse>({
    queryKey: ["anime", id],
    queryFn: async () => {
      const res = await fetch(`/api/anime/detail/${id}`);
      if (!res.ok) throw new Error("Failed to fetch anime detail");
      return res.json();
    },
    enabled: id !== null,
    staleTime: STALE_TIMES.detail,
  });
}
