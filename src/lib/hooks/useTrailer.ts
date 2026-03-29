"use client";

import { useQuery } from "@tanstack/react-query";
import type { YouTubeTrailer } from "@/lib/api/youtube";

const STALE_TIME = 24 * 60 * 60 * 1000; // 24 hours

export function useTrailer(title: string | null) {
  return useQuery<{ trailer: YouTubeTrailer | null }>({
    queryKey: ["trailer", title],
    queryFn: async () => {
      const res = await fetch(`/api/trailers/${encodeURIComponent(title!)}`);
      if (!res.ok) throw new Error("Failed to fetch trailer");
      return res.json();
    },
    enabled: title !== null && title.length > 0,
    staleTime: STALE_TIME,
  });
}
