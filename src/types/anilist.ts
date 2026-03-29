// AniList GraphQL types — strict, zero `any`

export interface AniListTitle {
  romaji: string;
  english: string | null;
  native: string | null;
}

export interface AniListCoverImage {
  extraLarge: string | null;
  large: string | null;
  medium: string | null;
  color: string | null;
}

export interface AniListDate {
  year: number | null;
  month: number | null;
  day: number | null;
}

export interface AniListStudio {
  nodes: { id: number; name: string; isAnimationStudio: boolean }[];
}

export interface AniListCharacterEdge {
  node: {
    id: number;
    name: { full: string };
    image: { large: string | null; medium: string | null };
  };
  role: "MAIN" | "SUPPORTING" | "BACKGROUND";
  voiceActors: {
    id: number;
    name: { full: string };
    image: { large: string | null };
    languageV2: string;
  }[];
}

export interface AniListAnime {
  id: number;
  idMal: number | null;
  title: AniListTitle;
  description: string | null;
  coverImage: AniListCoverImage;
  bannerImage: string | null;
  format: "TV" | "TV_SHORT" | "MOVIE" | "SPECIAL" | "OVA" | "ONA" | "MUSIC" | null;
  status: "FINISHED" | "RELEASING" | "NOT_YET_RELEASED" | "CANCELLED" | "HIATUS" | null;
  episodes: number | null;
  duration: number | null;
  season: "WINTER" | "SPRING" | "SUMMER" | "FALL" | null;
  seasonYear: number | null;
  startDate: AniListDate;
  endDate: AniListDate;
  averageScore: number | null;
  meanScore: number | null;
  popularity: number;
  favourites: number;
  genres: string[];
  tags: { id: number; name: string; rank: number }[];
  studios: AniListStudio;
  relations: {
    edges: {
      relationType: string;
      node: {
        id: number;
        title: AniListTitle;
        coverImage: AniListCoverImage;
        format: string | null;
        type: "ANIME" | "MANGA";
      };
    }[];
  };
  characters: {
    edges: AniListCharacterEdge[];
  };
  nextAiringEpisode: {
    airingAt: number;
    timeUntilAiring: number;
    episode: number;
  } | null;
  trailer: {
    id: string;
    site: string;
  } | null;
  externalLinks: {
    url: string;
    site: string;
    icon: string | null;
    color: string | null;
  }[];
  siteUrl: string;
}

export interface AniListPageInfo {
  total: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
  perPage: number;
}

export interface AniListTrendingResponse {
  data: {
    Page: {
      pageInfo: AniListPageInfo;
      media: AniListAnime[];
    };
  };
}

export interface AniListDetailResponse {
  data: {
    Media: AniListAnime;
  };
}

export interface AniListSearchResponse {
  data: {
    Page: {
      pageInfo: AniListPageInfo;
      media: AniListAnime[];
    };
  };
}
