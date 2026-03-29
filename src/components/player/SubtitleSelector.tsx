"use client";

import { useState, useEffect } from "react";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Subtitle {
  id: string;
  language: string;
  release: string;
}

interface SubtitleSelectorProps {
  imdbId: string | null;
}

export default function SubtitleSelector({ imdbId }: SubtitleSelectorProps) {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!imdbId) return;
    setLoading(true);
    fetch(`/api/subtitles/search?imdbId=${imdbId}`)
      .then((res) => res.json())
      .then((data: { results?: Subtitle[] }) => {
        setSubtitles(data.results ?? []);
      })
      .catch(() => setSubtitles([]))
      .finally(() => setLoading(false));
  }, [imdbId]);

  if (!imdbId) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
          "bg-[var(--bg-secondary)] border border-[var(--border-subtle)]",
          "text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        )}
      >
        <Languages size={16} />
        Subtitles
        {subtitles.length > 0 && (
          <span className="text-xs text-[var(--text-muted)]">
            ({subtitles.length})
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute top-full mt-2 right-0 w-64 max-h-60 overflow-y-auto",
            "rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]",
            "shadow-xl z-50 scrollbar-thin"
          )}
        >
          {loading ? (
            <div className="p-4 text-sm text-[var(--text-muted)] text-center">
              Loading subtitles...
            </div>
          ) : subtitles.length === 0 ? (
            <div className="p-4 text-sm text-[var(--text-muted)] text-center">
              No subtitles found
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {subtitles.map((sub) => (
                <button
                  key={sub.id}
                  className="w-full text-left px-3 py-2 rounded-md text-sm text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)] transition-colors"
                >
                  <span className="uppercase font-medium">{sub.language}</span>
                  <span className="text-xs text-[var(--text-muted)] ml-2 truncate">
                    {sub.release}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
