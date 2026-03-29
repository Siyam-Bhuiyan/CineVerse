// AniList GraphQL API — server-side, no API key needed
import type {
  AniListTrendingResponse,
  AniListDetailResponse,
  AniListSearchResponse,
} from "@/types/anilist";

const ANILIST_URL = "https://graphql.anilist.co";

const MEDIA_FIELDS = `
  id
  idMal
  title { romaji english native }
  description(asHtml: false)
  coverImage { extraLarge large medium color }
  bannerImage
  format
  status
  episodes
  duration
  season
  seasonYear
  startDate { year month day }
  endDate { year month day }
  averageScore
  meanScore
  popularity
  favourites
  genres
  tags { id name rank }
  studios { nodes { id name isAnimationStudio } }
  nextAiringEpisode { airingAt timeUntilAiring episode }
  trailer { id site }
  siteUrl
`;

const DETAIL_FIELDS = `
  ${MEDIA_FIELDS}
  relations {
    edges {
      relationType
      node {
        id
        title { romaji english native }
        coverImage { extraLarge large medium color }
        format
        type
      }
    }
  }
  characters(sort: ROLE, perPage: 12) {
    edges {
      node {
        id
        name { full }
        image { large medium }
      }
      role
      voiceActors(language: JAPANESE, sort: RELEVANCE) {
        id
        name { full }
        image { large }
        languageV2
      }
    }
  }
  externalLinks { url site icon color }
`;

async function anilistFetch<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`AniList API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function getTrendingAnime(
  page: number = 1,
  perPage: number = 20
): Promise<AniListTrendingResponse> {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { total currentPage lastPage hasNextPage perPage }
        media(type: ANIME, sort: TRENDING_DESC, isAdult: false) {
          ${MEDIA_FIELDS}
        }
      }
    }
  `;
  return anilistFetch(query, { page, perPage });
}

export async function getAnimeDetail(id: number): Promise<AniListDetailResponse> {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        ${DETAIL_FIELDS}
      }
    }
  `;
  return anilistFetch(query, { id });
}

export async function searchAnime(
  search: string,
  page: number = 1,
  perPage: number = 20
): Promise<AniListSearchResponse> {
  const query = `
    query ($search: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { total currentPage lastPage hasNextPage perPage }
        media(type: ANIME, search: $search, sort: SEARCH_MATCH, isAdult: false) {
          ${MEDIA_FIELDS}
        }
      }
    }
  `;
  return anilistFetch(query, { search, page, perPage });
}

export async function getPopularAnime(
  page: number = 1,
  perPage: number = 20
): Promise<AniListTrendingResponse> {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { total currentPage lastPage hasNextPage perPage }
        media(type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
          ${MEDIA_FIELDS}
        }
      }
    }
  `;
  return anilistFetch(query, { page, perPage });
}
