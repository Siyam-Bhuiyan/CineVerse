import { notFound } from "next/navigation";
import Image from "next/image";
import { getPersonDetail, getPersonCredits } from "@/lib/api/tmdb";
import { buildProfileUrl } from "@/lib/utils/image";
import { formatDate } from "@/lib/utils/format";
import MovieCard from "@/components/cards/MovieCard";
import ContentRow from "@/components/home/ContentRow";
import type { Metadata } from "next";

export const revalidate = 86400;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const person = await getPersonDetail(parseInt(id, 10));
    return {
      title: `${person.name} — CineVerse`,
      description: person.biography?.slice(0, 160),
    };
  } catch {
    return { title: "Person — CineVerse" };
  }
}

export default async function PersonPage({ params }: Props) {
  const { id } = await params;
  const personId = parseInt(id, 10);
  if (isNaN(personId)) notFound();

  let person;
  let credits;
  try {
    [person, credits] = await Promise.all([
      getPersonDetail(personId),
      getPersonCredits(personId),
    ]);
  } catch {
    notFound();
  }

  // Deduplicate and sort cast credits by popularity
  const castCredits = credits.cast
    .filter((c, i, arr) => arr.findIndex((a) => a.id === c.id) === i)
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
    .slice(0, 30);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Profile header */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Photo */}
        <div className="flex-shrink-0 w-48 mx-auto md:mx-0">
          <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[var(--bg-secondary)]">
            <Image
              src={buildProfileUrl(person.profile_path, "h632")}
              alt={person.name}
              fill
              sizes="192px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4 flex-1">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-[family-name:var(--font-outfit)] text-[var(--text-primary)]">
            {person.name}
          </h1>

          <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">
            {person.known_for_department && (
              <span className="px-3 py-1 rounded-full bg-[var(--accent-focus)]/20 text-[var(--accent-focus)] text-xs font-semibold">
                {person.known_for_department}
              </span>
            )}
            {person.birthday && (
              <span>Born: {formatDate(person.birthday)}</span>
            )}
            {person.place_of_birth && (
              <span>{person.place_of_birth}</span>
            )}
            {person.deathday && (
              <span>Died: {formatDate(person.deathday)}</span>
            )}
          </div>

          {person.biography && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Biography
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line line-clamp-[12]">
                {person.biography}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Filmography */}
      {castCredits.length > 0 && (
        <ContentRow title="Known For">
          {castCredits.map((credit) => {
            const isMovie = credit.media_type === "movie";
            const title = isMovie
              ? (credit as typeof credit & { title: string }).title
              : (credit as typeof credit & { name: string }).name;
            const date = isMovie
              ? (credit as typeof credit & { release_date?: string }).release_date
              : (credit as typeof credit & { first_air_date?: string }).first_air_date;

            return (
              <MovieCard
                key={`${credit.media_type}-${credit.id}`}
                id={credit.id}
                title={title ?? "Unknown"}
                posterPath={credit.poster_path}
                voteAverage={credit.vote_average}
                releaseDate={date}
                mediaType={isMovie ? "movie" : "tv"}
              />
            );
          })}
        </ContentRow>
      )}
    </div>
  );
}
