"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import VideoPlayer from "@/components/player/VideoPlayer";
import EpisodeSelector from "@/components/player/EpisodeSelector";
import SubtitleSelector from "@/components/player/SubtitleSelector";
import type { TMDBMovieDetail, TMDBTVDetail, TMDBEpisode, TMDBSeason } from "@/types/tmdb";

interface Props {
  params: Promise<{ type: string; id: string }>;
}

export default function WatchPage({ params }: Props) {
  const searchParams = useSearchParams();
  const [resolvedParams, setResolvedParams] = useState<{ type: string; id: string } | null>(null);
  const [mediaData, setMediaData] = useState<TMDBMovieDetail | TMDBTVDetail | null>(null);
  const [episodes, setEpisodes] = useState<Record<number, TMDBEpisode[]>>({});
  const [currentSeason, setCurrentSeason] = useState(1);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [loading, setLoading] = useState(true);

  // Resolve params
  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  // Read season/episode from URL
  useEffect(() => {
    const s = searchParams.get("s");
    const e = searchParams.get("e");
    if (s) setCurrentSeason(parseInt(s, 10));
    if (e) setCurrentEpisode(parseInt(e, 10));
  }, [searchParams]);

  // Fetch media data
  useEffect(() => {
    if (!resolvedParams) return;
    const { type, id } = resolvedParams;

    setLoading(true);
    fetch(`/api/tmdb/${type}/${id}`)
      .then((res) => res.json())
      .then((data: TMDBMovieDetail | TMDBTVDetail) => {
        setMediaData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [resolvedParams]);

  // Fetch episodes for TV
  const fetchEpisodes = useCallback(
    async (seasonNum: number) => {
      if (!resolvedParams || resolvedParams.type !== "tv") return;
      if (episodes[seasonNum]) return;

      try {
        const res = await fetch(
          `/api/tmdb/tv/${resolvedParams.id}`
        );
        const data = (await res.json()) as TMDBTVDetail;
        // We need season detail - for now use the seasons info we have
        if (data.seasons) {
          const season = data.seasons.find((s) => s.season_number === seasonNum);
          if (season) {
            // Generate episode stubs from season data
            const eps: TMDBEpisode[] = Array.from(
              { length: season.episode_count },
              (_, i) => ({
                id: i + 1,
                name: `Episode ${i + 1}`,
                overview: "",
                air_date: season.air_date,
                episode_number: i + 1,
                season_number: seasonNum,
                still_path: null,
                vote_average: 0,
                vote_count: 0,
                runtime: null,
              })
            );
            setEpisodes((prev) => ({ ...prev, [seasonNum]: eps }));
          }
        }
      } catch {
        // Silently fail
      }
    },
    [resolvedParams, episodes]
  );

  useEffect(() => {
    if (resolvedParams?.type === "tv") {
      fetchEpisodes(currentSeason);
    }
  }, [resolvedParams, currentSeason, fetchEpisodes]);

  if (!resolvedParams) return null;

  const { type, id } = resolvedParams;
  const tmdbId = parseInt(id, 10);
  const isTV = type === "tv";

  const title =
    mediaData
      ? "title" in mediaData
        ? mediaData.title
        : "name" in mediaData
        ? (mediaData as TMDBTVDetail).name
        : "Loading..."
      : "Loading...";

  const imdbId =
    mediaData
      ? "imdb_id" in mediaData
        ? mediaData.imdb_id
        : (mediaData as TMDBTVDetail).external_ids?.imdb_id ?? null
      : null;

  const genres =
    mediaData?.genres?.map((g) => g.name) ?? [];

  const tvData = isTV ? (mediaData as TMDBTVDetail | null) : null;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Back button + title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={isTV ? `/tv/${id}` : `/movie/${id}`}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-[var(--text-secondary)] hover:text-white"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-lg font-semibold tracking-tight font-[family-name:var(--font-outfit)] text-white">
                {loading ? "Loading..." : title}
              </h1>
              {isTV && (
                <p className="text-sm text-[var(--text-muted)]">
                  Season {currentSeason}, Episode {currentEpisode}
                </p>
              )}
            </div>
          </div>

          {/* Subtitle selector */}
          <SubtitleSelector imdbId={imdbId ?? null} />
        </div>

        {/* Video Player */}
        <VideoPlayer
          type={isTV ? "tv" : "movie"}
          tmdbId={tmdbId}
          title={title}
          genres={genres}
          season={isTV ? currentSeason : undefined}
          episode={isTV ? currentEpisode : undefined}
        />

        {/* Episode selector for TV */}
        {isTV && tvData?.seasons && (
          <EpisodeSelector
            seasons={tvData.seasons as TMDBSeason[]}
            episodes={episodes}
            currentSeason={currentSeason}
            currentEpisode={currentEpisode}
            onSelect={(s, e) => {
              setCurrentSeason(s);
              setCurrentEpisode(e);
            }}
            onSeasonChange={(s) => {
              setCurrentSeason(s);
              setCurrentEpisode(1);
              fetchEpisodes(s);
            }}
          />
        )}
      </div>
    </div>
  );
}
