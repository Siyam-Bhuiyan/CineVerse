"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { formatRating } from "@/lib/utils/format";

interface RatingBadgesProps {
  imdbId: string;
  tmdbRating: number;
}

interface OMDBData {
  imdbRating: string | null;
  rottenTomatoes: string | null;
  metascore: string | null;
}

export default function RatingBadges({ imdbId, tmdbRating }: RatingBadgesProps) {
  const [omdb, setOmdb] = useState<OMDBData | null>(null);

  useEffect(() => {
    if (!imdbId) return;
    // Note: We'd need an OMDb API route for this. For now show TMDB rating.
    // In a full implementation, fetch /api/omdb?imdbId=...
    setOmdb(null);
  }, [imdbId]);

  return (
    <div className="flex flex-wrap items-center gap-3 pt-1">
      {/* TMDB */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
        <Star size={14} className="text-amber-400" fill="currentColor" />
        <span className="text-xs font-semibold text-[var(--text-primary)]">
          {formatRating(tmdbRating)}
        </span>
        <span className="text-[10px] text-[var(--text-muted)]">TMDB</span>
      </div>

      {/* IMDb */}
      {omdb?.imdbRating && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
          <span className="text-xs font-bold text-amber-500">IMDb</span>
          <span className="text-xs font-semibold text-[var(--text-primary)]">
            {omdb.imdbRating}
          </span>
        </div>
      )}

      {/* Rotten Tomatoes */}
      {omdb?.rottenTomatoes && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
          <span className="text-xs font-bold text-red-500">🍅</span>
          <span className="text-xs font-semibold text-[var(--text-primary)]">
            {omdb.rottenTomatoes}
          </span>
        </div>
      )}

      {/* Metascore */}
      {omdb?.metascore && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
          <span className="text-xs font-bold text-green-400">MC</span>
          <span className="text-xs font-semibold text-[var(--text-primary)]">
            {omdb.metascore}
          </span>
        </div>
      )}
    </div>
  );
}
