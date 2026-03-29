"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const GENRE_PILLS = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Sci-Fi" },
  { id: 10749, name: "Romance" },
  { id: 53, name: "Thriller" },
  { id: 16, name: "Animation" },
  { id: 99, name: "Documentary" },
  { id: 14, name: "Fantasy" },
  { id: 10752, name: "War" },
  { id: 80, name: "Crime" },
];

export default function GenrePills() {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-2">
      {GENRE_PILLS.map((genre) => (
        <button
          key={genre.id}
          onClick={() => router.push(`/genre/movie/${genre.id}`)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all",
            "bg-white/5 border border-[var(--border-subtle)]",
            "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
            "hover:bg-white/10 hover:border-white/20"
          )}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}
