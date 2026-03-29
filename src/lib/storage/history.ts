import type { WatchHistoryItem } from "@/types/storage";
import { STORAGE_KEYS } from "@/types/storage";

const MAX_HISTORY_ITEMS = 100;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getHistory(): WatchHistoryItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.history);
    if (!raw) return [];
    return JSON.parse(raw) as WatchHistoryItem[];
  } catch {
    return [];
  }
}

export function addToHistory(item: Omit<WatchHistoryItem, "watchedAt">): void {
  if (!isBrowser()) return;
  const history = getHistory();

  // Remove existing entry for same item
  const filtered = history.filter(
    (h) => !(h.id === item.id && h.type === item.type)
  );

  // Add to front with current timestamp
  filtered.unshift({ ...item, watchedAt: Date.now() });

  // Cap history length
  const trimmed = filtered.slice(0, MAX_HISTORY_ITEMS);

  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(trimmed));
}

export function clearHistory(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEYS.history);
}
