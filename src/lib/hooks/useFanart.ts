"use client";

import { useQuery } from "@tanstack/react-query";
import type { FanartImages } from "@/lib/api/fanart";

const STALE_TIME = 24 * 60 * 60 * 1000; // 24 hours

export function useFanart(id: number | null, type: "movie" | "tv" = "movie") {
  return useQuery<FanartImages>({
    queryKey: ["fanart", id, type],
    queryFn: async () => {
      const res = await fetch(`/api/fanart/${id}?type=${type}`);
      if (!res.ok) throw new Error("Failed to fetch fanart");
      return res.json();
    },
    enabled: id !== null,
    staleTime: STALE_TIME,
  });
}
