import { notFound } from "next/navigation";
import Link from "next/link";
import { Play } from "lucide-react";
import { getMovieDetail } from "@/lib/api/tmdb";
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
    const movie = await getMovieDetail(parseInt(id, 10));
    return {
      title: `${movie.title} — CineVerse`,
      description: movie.overview?.slice(0, 160),
    };
  } catch {
    return { title: "Movie — CineVerse" };
  }
}

export default async function MovieDetailPage({ params }: Props) {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  if (isNaN(movieId)) notFound();

  let movie;
  try {
    movie = await getMovieDetail(movieId);
  } catch {
    notFound();
  }

  const trailerKey = movie.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  )?.key;

  return (
    <div className="space-y-10 pb-10">
      <MediaHero
        id={movie.id}
        title={movie.title}
        tagline={movie.tagline}
        overview={movie.overview}
        backdropPath={movie.backdrop_path}
        posterPath={movie.poster_path}
        voteAverage={movie.vote_average}
        releaseDate={movie.release_date}
        runtime={movie.runtime}
        genres={movie.genres}
        mediaType="movie"
        imdbId={movie.imdb_id}
        fanartId={movie.id}
      >
        <Link
          href={`/watch/movie/${movie.id}`}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent-focus)] text-white font-semibold text-sm hover:bg-[var(--accent-focus)]/90 transition-colors shadow-lg shadow-[var(--accent-focus)]/25"
        >
          <Play size={18} fill="white" />
          Watch Now
        </Link>
        {trailerKey && (
          <TrailerModal title={movie.title} tmdbVideoKey={trailerKey} />
        )}
      </MediaHero>

      <div className="max-w-7xl mx-auto px-4 space-y-10">
        {/* Cast */}
        {movie.credits?.cast && <CastRow cast={movie.credits.cast} />}

        {/* Similar Movies */}
        {movie.similar && movie.similar.results.length > 0 && (
          <ContentRow title="Similar Movies">
            {movie.similar.results.slice(0, 20).map((m) => (
              <MovieCard
                key={m.id}
                id={m.id}
                title={m.title}
                posterPath={m.poster_path}
                voteAverage={m.vote_average}
                releaseDate={m.release_date}
                mediaType="movie"
              />
            ))}
          </ContentRow>
        )}

        {/* Recommendations */}
        {movie.recommendations && movie.recommendations.results.length > 0 && (
          <ContentRow title="You Might Also Like">
            {movie.recommendations.results.slice(0, 20).map((m) => (
              <MovieCard
                key={m.id}
                id={m.id}
                title={m.title}
                posterPath={m.poster_path}
                voteAverage={m.vote_average}
                releaseDate={m.release_date}
                mediaType="movie"
              />
            ))}
          </ContentRow>
        )}
      </div>
    </div>
  );
}
