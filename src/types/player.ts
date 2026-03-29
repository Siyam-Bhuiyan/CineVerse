// Player types — strict, zero `any`

export enum PlayerServer {
  VIDKING = "vidking",
  VIDSRC = "vidsrc",
  TWOEMBED = "twoembed",
}

export interface PlayerConfig {
  server: PlayerServer;
  type: "movie" | "tv";
  tmdbId: number;
  season?: number;
  episode?: number;
  progress?: number;
}

export interface PlayerMessage {
  type: string;
  data: {
    event: string;
    currentTime?: number;
    duration?: number;
    [key: string]: unknown;
  };
}

export interface EpisodeInfo {
  seasonNumber: number;
  episodeNumber: number;
  name: string;
  still_path: string | null;
  overview: string;
  air_date: string | null;
  runtime: number | null;
  vote_average: number;
}

export interface SubtitleTrack {
  id: string;
  language: string;
  label: string;
  url: string;
}

export const PLAYER_SERVERS: { id: PlayerServer; name: string; description: string }[] = [
  { id: PlayerServer.VIDKING, name: "Vidking", description: "Primary — lowest ads" },
  { id: PlayerServer.VIDSRC, name: "vidsrc.icu", description: "Fallback — reliable" },
  { id: PlayerServer.TWOEMBED, name: "2embed", description: "Last resort" },
];

export const FALLBACK_TIMEOUT_MS = 6000;
