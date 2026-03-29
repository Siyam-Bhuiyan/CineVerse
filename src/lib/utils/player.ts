import { PlayerServer } from "@/types/player";

const PLAYER_BASE_URLS: Record<PlayerServer, string> = {
  [PlayerServer.VIDKING]: "https://www.vidking.net/embed",
  [PlayerServer.VIDSRC]: "https://vidsrc.icu/embed",
  [PlayerServer.TWOEMBED]: "https://www.2embed.cc/embed",
};

/**
 * Build embed URL for any player server
 */
export function buildPlayerUrl(
  server: PlayerServer,
  type: "movie" | "tv",
  tmdbId: number,
  season?: number,
  episode?: number,
  progress?: number
): string {
  const base = PLAYER_BASE_URLS[server];

  if (server === PlayerServer.TWOEMBED) {
    // 2embed only supports movie by tmdbId, no TV episode-level embeds
    return `${base}/${tmdbId}`;
  }

  if (type === "movie") {
    const url = `${base}/movie/${tmdbId}`;
    if (server === PlayerServer.VIDKING) {
      const params = new URLSearchParams({ autoPlay: "true" });
      if (progress && progress > 0) {
        params.set("progress", String(Math.floor(progress)));
      }
      return `${url}?${params.toString()}`;
    }
    return url;
  }

  // TV show
  if (season === undefined || episode === undefined) {
    throw new Error("Season and episode are required for TV shows");
  }

  const url = `${base}/tv/${tmdbId}/${season}/${episode}`;
  if (server === PlayerServer.VIDKING) {
    const params = new URLSearchParams({
      autoPlay: "true",
      nextEpisode: "true",
      episodeSelector: "true",
    });
    if (progress && progress > 0) {
      params.set("progress", String(Math.floor(progress)));
    }
    return `${url}?${params.toString()}`;
  }

  return url;
}
