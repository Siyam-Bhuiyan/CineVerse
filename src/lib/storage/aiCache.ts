import type { AISuggestionsCache, AISuggestionItem } from "@/types/storage";
import { STORAGE_KEYS, AI_CACHE_DURATION_MS } from "@/types/storage";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * Get cached AI suggestions if they exist and haven't expired (24h)
 */
export function getCachedSuggestions(): AISuggestionItem[] | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.aiSuggestions);
    if (!raw) return null;
    const cache = JSON.parse(raw) as AISuggestionsCache;
    const isExpired = Date.now() - cache.generatedAt > AI_CACHE_DURATION_MS;
    if (isExpired) {
      localStorage.removeItem(STORAGE_KEYS.aiSuggestions);
      return null;
    }
    return cache.results;
  } catch {
    return null;
  }
}

/**
 * Cache AI suggestions for 24 hours
 */
export function cacheSuggestions(results: AISuggestionItem[]): void {
  if (!isBrowser()) return;
  const cache: AISuggestionsCache = {
    results,
    generatedAt: Date.now(),
  };
  localStorage.setItem(STORAGE_KEYS.aiSuggestions, JSON.stringify(cache));
}
