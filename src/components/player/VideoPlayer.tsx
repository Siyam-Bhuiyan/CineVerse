"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PlayerServer, FALLBACK_TIMEOUT_MS } from "@/types/player";
import { buildPlayerUrl } from "@/lib/utils/player";
import { saveMovieProgress, saveTVProgress, getMovieProgress, getTVProgress } from "@/lib/storage/progress";
import { addToHistory } from "@/lib/storage/history";
import ServerSelector from "./ServerSelector";
import { cn } from "@/lib/utils/cn";

interface VideoPlayerProps {
  type: "movie" | "tv";
  tmdbId: number;
  title: string;
  genres?: string[];
  season?: number;
  episode?: number;
}

export default function VideoPlayer({
  type,
  tmdbId,
  title,
  genres = [],
  season,
  episode,
}: VideoPlayerProps) {
  const [activeServer, setActiveServer] = useState<PlayerServer>(PlayerServer.VIDKING);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const receivedMessage = useRef(false);
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Get saved progress
  const getSavedProgress = useCallback((): number => {
    if (type === "movie") {
      const p = getMovieProgress(tmdbId);
      return p?.progress ?? 0;
    }
    if (season !== undefined && episode !== undefined) {
      const p = getTVProgress(tmdbId, season, episode);
      return p?.progress ?? 0;
    }
    return 0;
  }, [type, tmdbId, season, episode]);

  const playerUrl = buildPlayerUrl(
    activeServer,
    type,
    tmdbId,
    season,
    episode,
    getSavedProgress()
  );

  // Vidking postMessage listener
  useEffect(() => {
    receivedMessage.current = false;

    const handleMessage = (event: MessageEvent) => {
      if (typeof event.data !== "string") return;
      try {
        const data = JSON.parse(event.data) as {
          type?: string;
          data?: { event?: string; currentTime?: number; duration?: number };
        };

        if (data.type === "PLAYER_EVENT") {
          receivedMessage.current = true;

          // Cancel fallback timer on first message
          if (fallbackTimer.current) {
            clearTimeout(fallbackTimer.current);
            fallbackTimer.current = null;
          }

          if (data.data?.event === "timeupdate" && data.data.currentTime !== undefined) {
            // Save progress
            if (type === "movie") {
              saveMovieProgress(tmdbId, {
                progress: data.data.currentTime,
                timestamp: Date.now(),
                duration: data.data.duration ?? 0,
              });
            } else if (season !== undefined && episode !== undefined) {
              saveTVProgress(tmdbId, season, episode, {
                progress: data.data.currentTime,
                timestamp: Date.now(),
              });
            }
          }

          if (data.data?.event === "ended") {
            addToHistory({ id: tmdbId, type, genres, title });
          }
        }
      } catch {
        // Silently ignore parse errors from other sources
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [tmdbId, type, season, episode, title, genres]);

  // Fallback detection: 6-second timer
  useEffect(() => {
    receivedMessage.current = false;

    fallbackTimer.current = setTimeout(() => {
      if (!receivedMessage.current && activeServer !== PlayerServer.TWOEMBED) {
        const nextServer =
          activeServer === PlayerServer.VIDKING
            ? PlayerServer.VIDSRC
            : PlayerServer.TWOEMBED;
        setActiveServer(nextServer);
        setToastMessage("Switching to backup server...");
        setTimeout(() => setToastMessage(null), 3000);
      }
    }, FALLBACK_TIMEOUT_MS);

    return () => {
      if (fallbackTimer.current) {
        clearTimeout(fallbackTimer.current);
      }
    };
  }, [activeServer]);

  return (
    <div className="space-y-4">
      {/* Server selector */}
      <ServerSelector activeServer={activeServer} onServerChange={setActiveServer} />

      {/* Player iframe */}
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        <iframe
          key={`${activeServer}-${season}-${episode}`}
          src={playerUrl}
          title={`${title} Player`}
          className="w-full h-full border-0"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          referrerPolicy="origin"
        />
      </div>

      {/* Toast notification */}
      {toastMessage && (
        <div
          className={cn(
            "fixed bottom-6 left-1/2 -translate-x-1/2 z-[200]",
            "px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]",
            "text-sm text-[var(--text-primary)] shadow-lg backdrop-blur-sm",
            "animate-in fade-in slide-in-from-bottom-4"
          )}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
