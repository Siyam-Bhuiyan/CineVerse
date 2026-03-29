import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Play, Star, Calendar, Tv } from "lucide-react";
import { getAnimeDetail } from "@/lib/api/anilist";
import WatchlistButton from "@/components/detail/WatchlistButton";
import type { Metadata } from "next";

export const revalidate = 3600;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const data = await getAnimeDetail(parseInt(id, 10));
    const anime = data.data.Media;
    const title = anime.title.english ?? anime.title.romaji;
    return {
      title: `${title} — CineVerse Anime`,
      description: anime.description?.replace(/<[^>]*>/g, "").slice(0, 160),
    };
  } catch {
    return { title: "Anime — CineVerse" };
  }
}

export default async function AnimeDetailPage({ params }: Props) {
  const { id } = await params;
  const animeId = parseInt(id, 10);
  if (isNaN(animeId)) notFound();

  let data;
  try {
    data = await getAnimeDetail(animeId);
  } catch {
    notFound();
  }

  const anime = data.data.Media;
  const title = anime.title.english ?? anime.title.romaji;
  const cleanDescription = anime.description?.replace(/<[^>]*>/g, "") ?? "";

  return (
    <div className="space-y-10 pb-10">
      {/* Hero */}
      <div className="relative">
        {/* Banner */}
        <div className="relative w-full aspect-[16/9] max-h-[60vh]">
          {anime.bannerImage ? (
            <Image
              src={anime.bannerImage}
              alt={title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : anime.coverImage.extraLarge ? (
            <Image
              src={anime.coverImage.extraLarge}
              alt={title}
              fill
              priority
              sizes="100vw"
              className="object-cover blur-sm scale-110"
            />
          ) : (
            <div className="w-full h-full bg-[var(--bg-tertiary)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-primary)]/40 to-[var(--bg-primary)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)]/80 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16">
          <div className="max-w-7xl mx-auto flex gap-8 items-end">
            {/* Cover */}
            {anime.coverImage.large && (
              <div className="hidden md:block flex-shrink-0 w-48 rounded-lg overflow-hidden shadow-2xl border-2 border-[var(--accent-anime)]/30">
                <Image
                  src={anime.coverImage.large}
                  alt={title}
                  width={192}
                  height={288}
                  className="object-cover"
                />
              </div>
            )}

            <div className="space-y-4 flex-1">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight font-[family-name:var(--font-outfit)] text-[var(--text-primary)]">
                {title}
              </h1>

              {anime.title.romaji !== title && (
                <p className="text-sm text-[var(--text-secondary)]">
                  {anime.title.romaji}
                </p>
              )}

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3 text-sm">
                {anime.averageScore && (
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Star size={14} fill="currentColor" />
                    {(anime.averageScore / 10).toFixed(1)}
                  </span>
                )}
                {anime.seasonYear && (
                  <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                    <Calendar size={14} />
                    {anime.season} {anime.seasonYear}
                  </span>
                )}
                {anime.episodes && (
                  <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                    <Tv size={14} />
                    {anime.episodes} episodes
                  </span>
                )}
                {anime.format && (
                  <span className="px-2 py-0.5 rounded bg-[var(--accent-anime)]/20 text-[var(--accent-anime)] text-xs font-semibold border border-[var(--accent-anime)]/30">
                    {anime.format}
                  </span>
                )}
                {anime.status && (
                  <span className="px-2 py-0.5 rounded bg-white/10 text-[var(--text-secondary)] text-xs font-medium">
                    {anime.status}
                  </span>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {anime.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-[var(--text-primary)] border border-white/10"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Overview */}
              <p className="text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed line-clamp-4">
                {cleanDescription}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {anime.idMal && (
                  <Link
                    href={`/watch/tv/${anime.idMal}?s=1&e=1`}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent-anime)] text-white font-semibold text-sm hover:bg-[var(--accent-anime)]/90 transition-colors shadow-lg shadow-[var(--accent-anime)]/25"
                  >
                    <Play size={18} fill="white" />
                    Watch Now
                  </Link>
                )}
                {anime.trailer?.site === "youtube" && (
                  <a
                    href={`https://youtube.com/watch?v=${anime.trailer.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-lg bg-white/10 border border-white/20 text-sm font-medium text-[var(--text-primary)] hover:bg-white/20 transition-colors backdrop-blur-sm"
                  >
                    ▶ Trailer
                  </a>
                )}
                <WatchlistButton
                  id={anime.id}
                  type="anime"
                  title={title}
                  poster={anime.coverImage.large ?? ""}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-10">
        {/* Characters */}
        {anime.characters?.edges && anime.characters.edges.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight font-[family-name:var(--font-outfit)] text-[var(--text-primary)]">
              Characters
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
              {anime.characters.edges.map((edge) => (
                <div key={edge.node.id} className="flex-shrink-0 w-[100px] text-center">
                  <div className="relative aspect-square rounded-full overflow-hidden bg-[var(--bg-secondary)] mx-auto w-20 h-20">
                    {edge.node.image.large && (
                      <Image
                        src={edge.node.image.large}
                        alt={edge.node.name.full}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <p className="mt-2 text-xs font-medium text-[var(--text-primary)] truncate">
                    {edge.node.name.full}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)]">{edge.role}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Relations */}
        {anime.relations?.edges && anime.relations.edges.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight font-[family-name:var(--font-outfit)] text-[var(--text-primary)]">
              Related
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
              {anime.relations.edges
                .filter((e) => e.node.type === "ANIME")
                .map((edge) => (
                  <Link
                    key={edge.node.id}
                    href={`/anime/${edge.node.id}`}
                    className="flex-shrink-0 w-[140px] group"
                  >
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[var(--bg-secondary)]">
                      {edge.node.coverImage.large && (
                        <Image
                          src={edge.node.coverImage.large}
                          alt={edge.node.title.english ?? edge.node.title.romaji}
                          fill
                          sizes="140px"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      )}
                    </div>
                    <p className="mt-2 text-xs font-medium text-[var(--text-primary)] truncate">
                      {edge.node.title.english ?? edge.node.title.romaji}
                    </p>
                    <p className="text-[10px] text-[var(--accent-anime)]">
                      {edge.relationType}
                    </p>
                  </Link>
                ))}
            </div>
          </section>
        )}

        {/* Studios */}
        {anime.studios?.nodes && anime.studios.nodes.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">
              Studios
            </h3>
            <div className="flex flex-wrap gap-2">
              {anime.studios.nodes
                .filter((s) => s.isAnimationStudio)
                .map((studio) => (
                  <span
                    key={studio.id}
                    className="px-3 py-1 rounded-full text-xs bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                  >
                    {studio.name}
                  </span>
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
