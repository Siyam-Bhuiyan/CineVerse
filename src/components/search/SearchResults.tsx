"use client";

import MovieCard from "@/components/cards/MovieCard";
import CardSkeleton from "@/components/skeletons/CardSkeleton";
import type { TMDBSearchMultiResult } from "@/types/tmdb";
import { buildImageUrl } from "@/lib/utils/image";
import Link from "next/link";
import Image from "next/image";

interface SearchResultsProps {
  results: TMDBSearchMultiResult[];
  isLoading: boolean;
  totalResults: number;
}

export default function SearchResults({ results, isLoading, totalResults }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <CardSkeleton key={i} className="w-full" />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-[var(--text-secondary)]">No results found</p>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Try a different search term
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--text-muted)]">
        {totalResults} result{totalResults !== 1 ? "s" : ""} found
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {results.map((item) => {
          if (item.media_type === "person") {
            return (
              <Link
                key={`person-${item.id}`}
                href={`/person/${item.id}`}
                className="block group"
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[var(--bg-secondary)]">
                  <Image
                    src={buildImageUrl(item.profile_path ?? item.poster_path, "w342")}
                    alt={item.name ?? "Person"}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <p className="mt-2 text-sm font-medium text-[var(--text-primary)] truncate">
                  {item.name}
                </p>
                <p className="text-xs text-[var(--text-muted)]">Person</p>
              </Link>
            );
          }

          return (
            <MovieCard
              key={`${item.media_type}-${item.id}`}
              id={item.id}
              title={item.title ?? item.name ?? "Unknown"}
              posterPath={item.poster_path}
              voteAverage={item.vote_average ?? 0}
              releaseDate={item.release_date ?? item.first_air_date}
              mediaType={item.media_type as "movie" | "tv"}
              className="w-full"
            />
          );
        })}
      </div>
    </div>
  );
}
