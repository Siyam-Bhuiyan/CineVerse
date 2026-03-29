"use client";

import Image from "next/image";
import { buildBackdropUrl } from "@/lib/utils/image";
import { formatRuntime, formatDate, formatRating } from "@/lib/utils/format";
import { Star, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import FanartLogo from "./FanartLogo";
import WatchlistButton from "./WatchlistButton";
import RatingBadges from "./RatingBadges";

interface MediaHeroProps {
  id: number;
  title: string;
  tagline?: string;
  overview: string;
  backdropPath: string | null;
  posterPath: string | null;
  voteAverage: number;
  releaseDate?: string;
  runtime?: number;
  genres: { id: number; name: string }[];
  mediaType: "movie" | "tv" | "anime";
  imdbId?: string | null;
  fanartId?: number;
  numberOfSeasons?: number;
  children?: React.ReactNode;
}

export default function MediaHero({
  id,
  title,
  tagline,
  overview,
  backdropPath,
  voteAverage,
  releaseDate,
  runtime,
  genres,
  mediaType,
  imdbId,
  fanartId,
  numberOfSeasons,
  children,
}: MediaHeroProps) {
  return (
    <div className="relative">
      {/* Backdrop */}
      <div className="relative w-full aspect-[16/9] max-h-[70vh]">
        <Image
          src={buildBackdropUrl(backdropPath, "original")}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-primary)]/30 to-[var(--bg-primary)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)]/80 via-transparent to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Fanart logo or title */}
          <FanartLogo tmdbId={fanartId ?? id} type={mediaType === "anime" ? "tv" : mediaType} fallbackTitle={title} />

          {/* Tagline */}
          {tagline && (
            <p className="text-sm md:text-base text-[var(--text-secondary)] italic max-w-2xl">
              &ldquo;{tagline}&rdquo;
            </p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {voteAverage > 0 && (
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <Star size={14} fill="currentColor" />
                {formatRating(voteAverage)}
              </span>
            )}
            {releaseDate && (
              <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                <Calendar size={14} />
                {formatDate(releaseDate)}
              </span>
            )}
            {runtime && runtime > 0 && (
              <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                <Clock size={14} />
                {formatRuntime(runtime)}
              </span>
            )}
            {numberOfSeasons && (
              <span className="text-[var(--text-secondary)]">
                {numberOfSeasons} Season{numberOfSeasons > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <span
                key={genre.id}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  "bg-white/10 text-[var(--text-primary)] border border-white/10"
                )}
              >
                {genre.name}
              </span>
            ))}
          </div>

          {/* Overview */}
          <p className="text-sm md:text-base text-[var(--text-secondary)] max-w-3xl leading-relaxed line-clamp-4">
            {overview}
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {children}
            <WatchlistButton
              id={id}
              type={mediaType}
              title={title}
              poster={backdropPath ?? ""}
            />
          </div>

          {/* Rating badges */}
          {imdbId && <RatingBadges imdbId={imdbId} tmdbRating={voteAverage} />}
        </div>
      </div>
    </div>
  );
}
