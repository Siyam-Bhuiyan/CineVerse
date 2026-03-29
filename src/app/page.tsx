import { getTrending } from "@/lib/api/tmdb";
import { getTrendingAnime } from "@/lib/api/anilist";
import type { TMDBMovie, TMDBTVShow } from "@/types/tmdb";
import HeroBanner from "@/components/home/HeroBanner";
import ContentRow from "@/components/home/ContentRow";
import ContinueWatching from "@/components/home/ContinueWatching";
import AISuggestions from "@/components/home/AISuggestions";
import GenrePills from "@/components/home/GenrePills";
import MovieCard from "@/components/cards/MovieCard";
import AnimeCard from "@/components/cards/AnimeCard";

export const revalidate = 3600; // ISR: 1 hour

export default async function HomePage() {
  const [trendingAll, trendingMovies, trendingTV, animeData] = await Promise.all([
    getTrending("all", "day").catch(() => ({ results: [] as (TMDBMovie | TMDBTVShow)[] })),
    getTrending("movie", "week").catch(() => ({ results: [] as (TMDBMovie | TMDBTVShow)[] })),
    getTrending("tv", "week").catch(() => ({ results: [] as (TMDBMovie | TMDBTVShow)[] })),
    getTrendingAnime(1, 20).catch(() => ({ data: { Page: { media: [] } } })),
  ]);

  const heroItems = trendingAll.results.filter(
    (item): item is TMDBMovie | TMDBTVShow => item.backdrop_path !== null
  );

  return (
    <div className="space-y-10 pb-10">
      {/* Hero Banner */}
      <HeroBanner items={heroItems.slice(0, 5)} />

      <div className="max-w-7xl mx-auto px-4 space-y-10">
        {/* Continue Watching (client) */}
        <ContinueWatching />

        {/* AI Suggestions (client) */}
        <AISuggestions />

        {/* Genre Pills */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight font-[family-name:var(--font-outfit)] text-[var(--text-primary)]">
            Browse by Genre
          </h2>
          <GenrePills />
        </section>

        {/* Trending Movies */}
        <ContentRow title="🔥 Trending Movies">
          {trendingMovies.results.slice(0, 20).map((item) => {
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
                mediaType="movie"
              />
            );
          })}
        </ContentRow>

        {/* Trending TV */}
        <ContentRow title="📺 Trending TV Shows">
          {trendingTV.results.slice(0, 20).map((item) => {
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
                mediaType="tv"
              />
            );
          })}
        </ContentRow>

        {/* Trending Anime */}
        <ContentRow title="🎌 Trending Anime">
          {animeData.data.Page.media.slice(0, 20).map((anime) => (
            <AnimeCard
              key={anime.id}
              id={anime.id}
              title={anime.title.english ?? anime.title.romaji}
              coverImage={anime.coverImage.large}
              score={anime.averageScore}
              episodes={anime.episodes}
              format={anime.format}
            />
          ))}
        </ContentRow>
      </div>
    </div>
  );
}
