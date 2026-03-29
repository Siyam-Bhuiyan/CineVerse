"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { getCachedSuggestions, cacheSuggestions } from "@/lib/storage/aiCache";
import { getHistory } from "@/lib/storage/history";
import MovieCard from "@/components/cards/MovieCard";
import ContentRow from "./ContentRow";
import type { AISuggestionItem } from "@/types/storage";

export default function AISuggestions() {
  const [suggestions, setSuggestions] = useState<AISuggestionItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Always check cache first
    const cached = getCachedSuggestions();
    if (cached && cached.length > 0) {
      setSuggestions(cached);
      return;
    }

    // Check if user has watch history
    const history = getHistory();
    if (history.length === 0) return;

    // Fetch from API
    setLoading(true);
    fetch("/api/ai/suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history }),
    })
      .then((res) => res.json())
      .then((data: { suggestions?: AISuggestionItem[] }) => {
        const items = data.suggestions ?? [];
        if (items.length > 0) {
          cacheSuggestions(items);
          setSuggestions(items);
        }
      })
      .catch(() => {
        // Silently fail
      })
      .finally(() => setLoading(false));
  }, []);

  if (suggestions.length === 0 && !loading) return null;

  return (
    <ContentRow
      title={
        loading
          ? "Getting AI Recommendations..."
          : "✨ Recommended For You"
      }
    >
      {loading
        ? Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[180px] animate-pulse"
            >
              <div className="aspect-[2/3] rounded-lg bg-[var(--bg-tertiary)] shimmer" />
              <div className="mt-2 h-3 w-3/4 rounded bg-[var(--bg-tertiary)] shimmer" />
            </div>
          ))
        : suggestions.map((item) => (
            <div key={item.id} className="flex-shrink-0 w-[180px]">
              <MovieCard
                id={item.id}
                title={item.title}
                posterPath={null}
                voteAverage={0}
                mediaType={item.type}
                className="w-full"
              />
              {item.reason && (
                <p className="mt-1 text-[10px] text-[var(--text-muted)] line-clamp-2 flex items-start gap-1">
                  <Sparkles size={10} className="text-amber-400 mt-0.5 shrink-0" />
                  {item.reason}
                </p>
              )}
            </div>
          ))}
    </ContentRow>
  );
}
