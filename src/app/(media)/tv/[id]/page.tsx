import { notFound } from "next/navigation";
import Link from "next/link";
import { Play } from "lucide-react";
import { getTVDetail } from "@/lib/api/tmdb";
import MediaHero from "@/components/detail/MediaHero";
import CastRow from "@/components/detail/CastRow";
import TrailerModal from "@/components/detail/TrailerModal";
import ContentRow from "@/components/home/ContentRow";
import MovieCard from "@/components/cards/MovieCard";
import type { Metadata } from "next";

export const revalidate = 86400;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const tv = await getTVDetail(parseInt(id, 10));
    return {
      title: `${tv.name} — CineVerse`,
      description: tv.overview?.slice(0, 160),
    };
  } catch {
    return { title: "TV Show — CineVerse" };
  }
}

export default async function TVDetailPage({ params }: Props) {
  const { id } = await params;
  const tvId = parseInt(id, 10);
  if (isNaN(tvId)) notFound();

  let tv;
  try {
    tv = await getTVDetail(tvId);
  } catch {
    notFound();
  }

  const trailerKey = tv.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  )?.key;

  const firstSeason = tv.seasons?.find((s) => s.season_number === 1);

  return (
    <div className="space-y-10 pb-10">
      <MediaHero
        id={tv.id}
        title={tv.name}
        tagline={tv.tagline}
        overview={tv.overview}
        backdropPath={tv.backdrop_path}
        posterPath={tv.poster_path}
        voteAverage={tv.vote_average}
        releaseDate={tv.first_air_date}
        genres={tv.genres}
        mediaType="tv"
        imdbId={tv.external_ids?.imdb_id}
        fanartId={tv.id}
        numberOfSeasons={tv.number_of_seasons}
      >
        <Link
          href={`/watch/tv/${tv.id}?s=1&e=1`}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent-focus)] text-white font-semibold text-sm hover:bg-[var(--accent-focus)]/90 transition-colors shadow-lg shadow-[var(--accent-focus)]/25"
        >
          <Play size={18} fill="white" />
          Watch S01E01
        </Link>
        {trailerKey && <TrailerModal title={tv.name} tmdbVideoKey={trailerKey} />}
      </MediaHero>

      <div className="max-w-7xl mx-auto px-4 space-y-10">
        {/* Seasons overview */}
        {tv.seasons && tv.seasons.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight font-[family-name:var(--font-outfit)] text-[var(--text-primary)]">
              Seasons
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {tv.seasons
                .filter((s) => s.season_number > 0)
                .map((season) => (
                  <Link
                    key={season.id}
                    href={`/watch/tv/${tv.id}?s=${season.season_number}&e=1`}
                    className="group rounded-lg overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-white/20 transition-colors"
                  >
                    <div className="aspect-[2/3] relative bg-[var(--bg-tertiary)] flex items-center justify-center">
                      {season.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w342${season.poster_path}`}
                          alt={season.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <span className="text-[var(--text-muted)] text-sm">
                          S{season.season_number}
                        </span>
                      )}
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-medium text-[var(--text-primary)] truncate">
                        {season.name}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)]">
                        {season.episode_count} episodes
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        )}

        {/* Cast */}
        {tv.credits?.cast && <CastRow cast={tv.credits.cast} />}

        {/* Similar */}
        {tv.similar && tv.similar.results.length > 0 && (
          <ContentRow title="Similar Shows">
            {tv.similar.results.slice(0, 20).map((show) => (
              <MovieCard
                key={show.id}
                id={show.id}
                title={show.name}
                posterPath={show.poster_path}
                voteAverage={show.vote_average}
                releaseDate={show.first_air_date}
                mediaType="tv"
              />
            ))}
          </ContentRow>
        )}
      </div>
    </div>
  );
}
