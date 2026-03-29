"use client";

import { useState, useEffect } from "react";
import { getAllProgress } from "@/lib/storage/progress";
import MovieCard from "@/components/cards/MovieCard";
import ContentRow from "./ContentRow";

interface ProgressItem {
  key: string;
  type: "movie" | "tv";
  tmdbId: number;
  title?: string;
  posterPath?: string;
}

function parseProgressKey(key: string): { type: "movie" | "tv"; tmdbId: number } | null {
  // Keys: progress:movie:123 or progress:tv:123:1:5
  const parts = key.split(":");
  if (parts.length < 3) return null;
  const type = parts[1] as "movie" | "tv";
  const tmdbId = parseInt(parts[2], 10);
  if (isNaN(tmdbId)) return null;
  return { type, tmdbId };
}

export default function ContinueWatching() {
  const [items, setItems] = useState<ProgressItem[]>([]);

  useEffect(() => {
    const progress = getAllProgress();
    const parsed: ProgressItem[] = [];
    const seen = new Set<string>();

    for (const { key } of progress) {
      const info = parseProgressKey(key);
      if (!info) continue;
      const uniqueKey = `${info.type}:${info.tmdbId}`;
      if (seen.has(uniqueKey)) continue;
      seen.add(uniqueKey);
      parsed.push({ key, type: info.type, tmdbId: info.tmdbId });
    }

    setItems(parsed.slice(0, 10));
  }, []);

  if (items.length === 0) return null;

  return (
    <ContentRow title="Continue Watching">
      {items.map((item) => (
        <MovieCard
          key={item.key}
          id={item.tmdbId}
          title={`#${item.tmdbId}`}
          posterPath={null}
          voteAverage={0}
          mediaType={item.type}
        />
      ))}
    </ContentRow>
  );
}
