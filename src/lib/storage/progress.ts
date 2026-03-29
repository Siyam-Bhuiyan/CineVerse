import type { WatchProgress, TVWatchProgress } from "@/types/storage";
import { STORAGE_KEYS } from "@/types/storage";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function saveMovieProgress(tmdbId: number, data: WatchProgress): void {
  if (!isBrowser()) return;
  const key = STORAGE_KEYS.movieProgress(tmdbId);
  localStorage.setItem(key, JSON.stringify({ ...data, timestamp: Date.now() }));
}

export function getMovieProgress(tmdbId: number): WatchProgress | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.movieProgress(tmdbId));
    if (!raw) return null;
    return JSON.parse(raw) as WatchProgress;
  } catch {
    return null;
  }
}

export function saveTVProgress(
  tmdbId: number,
  season: number,
  episode: number,
  data: TVWatchProgress
): void {
  if (!isBrowser()) return;
  const key = STORAGE_KEYS.tvProgress(tmdbId, season, episode);
  localStorage.setItem(key, JSON.stringify({ ...data, timestamp: Date.now() }));
}

export function getTVProgress(
  tmdbId: number,
  season: number,
  episode: number
): TVWatchProgress | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.tvProgress(tmdbId, season, episode));
    if (!raw) return null;
    return JSON.parse(raw) as TVWatchProgress;
  } catch {
    return null;
  }
}

/**
 * Get all items with watch progress for "Continue Watching" row
 */
export function getAllProgress(): { key: string; data: WatchProgress | TVWatchProgress }[] {
  if (!isBrowser()) return [];
  const results: { key: string; data: WatchProgress | TVWatchProgress }[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("progress:")) {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          results.push({ key, data: JSON.parse(raw) as WatchProgress | TVWatchProgress });
        }
      } catch {
        // Skip invalid entries
      }
    }
  }
  return results.sort((a, b) => b.data.timestamp - a.data.timestamp);
}
