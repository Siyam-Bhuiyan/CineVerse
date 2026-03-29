// TMDB API functions — server-side only
import type {
  TMDBPaginatedResponse,
  TMDBMovie,
  TMDBTVShow,
  TMDBMovieDetail,
  TMDBTVDetail,
  TMDBPerson,
  TMDBPersonCredits,
  TMDBSearchMultiResult,
  TMDBGenre,
  TMDBSeasonDetail,
} from "@/types/tmdb";

const BASE_URL = "https://api.themoviedb.org/3";

function getHeaders(): HeadersInit {
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) {
    throw new Error("TMDB_ACCESS_TOKEN is not set in environment variables");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function tmdbFetch<T>(path: string, revalidate?: number): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: getHeaders(),
    next: revalidate !== undefined ? { revalidate } : undefined,
  });
  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

// Trending
export async function getTrending(
  type: "movie" | "tv" | "all" = "all",
  timeWindow: "day" | "week" = "week"
): Promise<TMDBPaginatedResponse<TMDBMovie | TMDBTVShow>> {
  return tmdbFetch(`/trending/${type}/${timeWindow}`, 3600);
}

// Movie detail
export async function getMovieDetail(id: number): Promise<TMDBMovieDetail> {
  return tmdbFetch(
    `/movie/${id}?append_to_response=credits,videos,similar,recommendations`,
    86400
  );
}

// TV detail
export async function getTVDetail(id: number): Promise<TMDBTVDetail> {
  return tmdbFetch(
    `/tv/${id}?append_to_response=credits,videos,similar,external_ids`,
    86400
  );
}

// Season detail
export async function getSeasonDetail(
  tvId: number,
  seasonNumber: number
): Promise<TMDBSeasonDetail> {
  return tmdbFetch(`/tv/${tvId}/season/${seasonNumber}`, 86400);
}

// Search multi
export async function searchMulti(
  query: string,
  page: number = 1
): Promise<TMDBPaginatedResponse<TMDBSearchMultiResult>> {
  return tmdbFetch(
    `/search/multi?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
  );
}

// Search movie
export async function searchMovies(
  query: string,
  page: number = 1
): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  return tmdbFetch(
    `/search/movie?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
  );
}

// Search TV
export async function searchTV(
  query: string,
  page: number = 1
): Promise<TMDBPaginatedResponse<TMDBTVShow>> {
  return tmdbFetch(
    `/search/tv?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
  );
}

// Person detail
export async function getPersonDetail(id: number): Promise<TMDBPerson> {
  return tmdbFetch(`/person/${id}`, 86400);
}

// Person credits
export async function getPersonCredits(id: number): Promise<TMDBPersonCredits> {
  return tmdbFetch(`/person/${id}/combined_credits`, 86400);
}

// Genre list
export async function getGenreList(
  type: "movie" | "tv"
): Promise<{ genres: TMDBGenre[] }> {
  return tmdbFetch(`/genre/${type}/list`, 86400);
}

// Discover by genre
export async function discoverByGenre(
  type: "movie" | "tv",
  genreId: number,
  page: number = 1
): Promise<TMDBPaginatedResponse<TMDBMovie | TMDBTVShow>> {
  return tmdbFetch(
    `/discover/${type}?with_genres=${genreId}&page=${page}&sort_by=popularity.desc`,
    3600
  );
}

// Popular movies
export async function getPopularMovies(
  page: number = 1
): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  return tmdbFetch(`/movie/popular?page=${page}`, 3600);
}

// Top rated movies
export async function getTopRatedMovies(
  page: number = 1
): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  return tmdbFetch(`/movie/top_rated?page=${page}`, 3600);
}

// Popular TV
export async function getPopularTV(
  page: number = 1
): Promise<TMDBPaginatedResponse<TMDBTVShow>> {
  return tmdbFetch(`/tv/popular?page=${page}`, 3600);
}

// Top rated TV
export async function getTopRatedTV(
  page: number = 1
): Promise<TMDBPaginatedResponse<TMDBTVShow>> {
  return tmdbFetch(`/tv/top_rated?page=${page}`, 3600);
}
