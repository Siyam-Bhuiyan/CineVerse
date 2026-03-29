"use client";

import { PlayerServer, PLAYER_SERVERS } from "@/types/player";
import { cn } from "@/lib/utils/cn";

interface ServerSelectorProps {
  activeServer: PlayerServer;
  onServerChange: (server: PlayerServer) => void;
}

export default function ServerSelector({ activeServer, onServerChange }: ServerSelectorProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] w-fit">
      {PLAYER_SERVERS.map((server) => (
        <button
          key={server.id}
          onClick={() => onServerChange(server.id)}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-all",
            activeServer === server.id
              ? "bg-[var(--accent-focus)] text-white shadow-sm"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5"
          )}
          title={server.description}
        >
          {server.name}
        </button>
      ))}
    </div>
  );
}
