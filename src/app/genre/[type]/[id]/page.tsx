import { notFound } from "next/navigation";
import { discoverByGenre, getGenreList } from "@/lib/api/tmdb";
import MovieCard from "@/components/cards/MovieCard";
import type { TMDBMovie, TMDBTVShow } from "@/types/tmdb";
import type { Metadata } from "next";

export const revalidate = 3600;

interface Props {
  params: Promise<{ type: string; id: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type, id } = await params;
  try {
    const genreType = type === "tv" ? "tv" : "movie";
    const genreData = await getGenreList(genreType);
    const genre = genreData.genres.find((g) => g.id === parseInt(id, 10));
    const genreName = genre?.name ?? "Genre";
    return {
      title: `${genreName} ${type === "tv" ? "TV Shows" : "Movies"} — CineVerse`,
      description: `Browse ${genreName} ${type === "tv" ? "TV shows" : "movies"} on CineVerse.`,
    };
  } catch {
    return { title: "Browse — CineVerse" };
  }
}

export default async function GenrePage({ params, searchParams }: Props) {
  const { type, id } = await params;
  const sp = await searchParams;
  const genreId = parseInt(id, 10);
  const page = parseInt(sp.page ?? "1", 10);

  if (isNaN(genreId)) notFound();
  const genreType = (type === "tv" ? "tv" : "movie") as "movie" | "tv";

  let data;
  let genreName = "Genre";
  try {
    const [discoverData, genreData] = await Promise.all([
      discoverByGenre(genreType, genreId, page),
      getGenreList(genreType),
    ]);
    data = discoverData;
    genreName = genreData.genres.find((g) => g.id === genreId)?.name ?? "Genre";
  } catch {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-[family-name:var(--font-outfit)] text-[var(--text-primary)]">
          {genreName} {genreType === "tv" ? "TV Shows" : "Movies"}
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          {data.total_results} titles found • Page {page}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {data.results.map((item: TMDBMovie | TMDBTVShow) => {
          const title = "title" in item ? item.title : item.name;
          const date = "release_date" in item ? item.release_date : item.first_air_date;
          return (
            <MovieCard
              key={item.id}
              id={item.id}
              title={title}
              posterPath={item.poster_path}
              voteAverage={item.vote_average}
              releaseDate={date}
              mediaType={genreType}
              className="w-full"
            />
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 pt-4">
        {page > 1 && (
          <a
            href={`/genre/${type}/${id}?page=${page - 1}`}
            className="px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            ← Previous
          </a>
        )}
        <span className="px-4 py-2 text-sm text-[var(--text-muted)]">
          Page {page} of {data.total_pages}
        </span>
        {page < data.total_pages && (
          <a
            href={`/genre/${type}/${id}?page=${page + 1}`}
            className="px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Next →
          </a>
        )}
      </div>
    </div>
  );
}
