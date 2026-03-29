import type { WatchlistItem } from "@/types/storage";
import { STORAGE_KEYS } from "@/types/storage";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getWatchlist(): WatchlistItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.watchlist);
    if (!raw) return [];
    return JSON.parse(raw) as WatchlistItem[];
  } catch {
    return [];
  }
}

export function addToWatchlist(item: WatchlistItem): void {
  if (!isBrowser()) return;
  const list = getWatchlist();
  const exists = list.some((i) => i.id === item.id && i.type === item.type);
  if (exists) return;
  list.unshift({ ...item, addedAt: Date.now() });
  localStorage.setItem(STORAGE_KEYS.watchlist, JSON.stringify(list));
}

export function removeFromWatchlist(id: number, type: WatchlistItem["type"]): void {
  if (!isBrowser()) return;
  const list = getWatchlist().filter((i) => !(i.id === id && i.type === type));
  localStorage.setItem(STORAGE_KEYS.watchlist, JSON.stringify(list));
}

export function isInWatchlist(id: number, type: WatchlistItem["type"]): boolean {
  return getWatchlist().some((i) => i.id === id && i.type === type);
}
