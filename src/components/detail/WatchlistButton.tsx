"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/lib/storage/watchlist";
import { cn } from "@/lib/utils/cn";

interface WatchlistButtonProps {
  id: number;
  type: "movie" | "tv" | "anime";
  title: string;
  poster: string;
}

export default function WatchlistButton({ id, type, title, poster }: WatchlistButtonProps) {
  const [inList, setInList] = useState(false);

  useEffect(() => {
    setInList(isInWatchlist(id, type));
  }, [id, type]);

  const toggle = () => {
    if (inList) {
      removeFromWatchlist(id, type);
      setInList(false);
    } else {
      addToWatchlist({ id, type, title, poster, addedAt: Date.now() });
      setInList(true);
    }
  };

  return (
    <button
      onClick={toggle}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
        "border backdrop-blur-sm",
        inList
          ? "bg-[var(--accent-badge)]/20 border-[var(--accent-badge)]/50 text-[var(--accent-badge)]"
          : "bg-white/10 border-white/20 text-[var(--text-primary)] hover:bg-white/20"
      )}
      aria-label={inList ? "Remove from watchlist" : "Add to watchlist"}
    >
      <Heart
        size={16}
        fill={inList ? "currentColor" : "none"}
        className="transition-all"
      />
      {inList ? "In Watchlist" : "Add to Watchlist"}
    </button>
  );
}
