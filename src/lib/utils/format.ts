/**
 * Format runtime in minutes to "Xh Ym" format
 */
export function formatRuntime(minutes: number): string {
  if (!minutes || minutes <= 0) return "N/A";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/**
 * Format date string to readable format "Mar 29, 2026"
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "TBA";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "TBA";
  }
}

/**
 * Format rating to one decimal place
 */
export function formatRating(rating: number | null | undefined): string {
  if (rating === null || rating === undefined || rating === 0) return "N/A";
  return rating.toFixed(1);
}

/**
 * Format episode code "S01E05"
 */
export function formatEpisodeCode(season: number, episode: number): string {
  const s = String(season).padStart(2, "0");
  const e = String(episode).padStart(2, "0");
  return `S${s}E${e}`;
}

/**
 * Extract year from date string
 */
export function extractYear(dateStr: string | null | undefined): string {
  if (!dateStr) return "TBA";
  const match = dateStr.match(/^(\d{4})/);
  return match ? match[1] : "TBA";
}

/**
 * Truncate text to max length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}
