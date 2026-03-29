"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import EpisodeCard from "@/components/cards/EpisodeCard";
import type { TMDBSeason, TMDBEpisode } from "@/types/tmdb";
import { cn } from "@/lib/utils/cn";

interface EpisodeSelectorProps {
  seasons: TMDBSeason[];
  episodes: Record<number, TMDBEpisode[]>;
  currentSeason: number;
  currentEpisode: number;
  onSelect: (season: number, episode: number) => void;
  onSeasonChange: (season: number) => void;
}

export default function EpisodeSelector({
  seasons,
  episodes,
  currentSeason,
  currentEpisode,
  onSelect,
  onSeasonChange,
}: EpisodeSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const validSeasons = seasons.filter((s) => s.season_number > 0);

  return (
    <div className="space-y-4">
      {/* Season selector + toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold tracking-tight font-[family-name:var(--font-outfit)] text-[var(--text-primary)]">
            Episodes
          </h3>
          <select
            value={currentSeason}
            onChange={(e) => onSeasonChange(Number(e.target.value))}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm",
              "bg-[var(--bg-secondary)] border border-[var(--border-subtle)]",
              "text-[var(--text-primary)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--accent-focus)]"
            )}
          >
            {validSeasons.map((season) => (
              <option key={season.season_number} value={season.season_number}>
                Season {season.season_number}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ChevronDown
            size={20}
            className={cn("transition-transform", isExpanded && "rotate-180")}
          />
        </button>
      </div>

      {/* Episode grid */}
      {isExpanded && (
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin">
          {(episodes[currentSeason] ?? []).map((ep) => (
            <EpisodeCard
              key={ep.id}
              seasonNumber={ep.season_number}
              episodeNumber={ep.episode_number}
              name={ep.name}
              stillPath={ep.still_path}
              voteAverage={ep.vote_average}
              isActive={
                ep.season_number === currentSeason &&
                ep.episode_number === currentEpisode
              }
              onClick={() => onSelect(ep.season_number, ep.episode_number)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
