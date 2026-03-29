// localStorage schema types — match CLAUDE.md spec exactly

export interface WatchProgress {
  progress: number;
  timestamp: number;
  duration: number;
}

export interface TVWatchProgress {
  progress: number;
  timestamp: number;
}

export interface WatchlistItem {
  id: number;
  type: "movie" | "tv" | "anime";
  title: string;
  poster: string;
  addedAt: number;
}

export interface WatchHistoryItem {
  id: number;
  type: string;
  genres: string[];
  title: string;
  watchedAt: number;
}

export interface AISuggestionsCache {
  results: AISuggestionItem[];
  generatedAt: number;
}

export interface AISuggestionItem {
  id: number;
  title: string;
  type: "movie" | "tv";
  reason: string;
}

// Storage key builders
export const STORAGE_KEYS = {
  movieProgress: (tmdbId: number) => `progress:movie:${tmdbId}`,
  tvProgress: (tmdbId: number, season: number, episode: number) =>
    `progress:tv:${tmdbId}:${season}:${episode}`,
  watchlist: "watchlist",
  history: "history",
  aiSuggestions: "ai:suggestions",
} as const;

export const AI_CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
