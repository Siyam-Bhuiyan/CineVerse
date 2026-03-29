"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info } from "lucide-react";
import { buildBackdropUrl } from "@/lib/utils/image";
import { formatRating } from "@/lib/utils/format";
import type { TMDBMovie, TMDBTVShow } from "@/types/tmdb";

interface HeroBannerProps {
  items: (TMDBMovie | TMDBTVShow)[];
}

function getTitle(item: TMDBMovie | TMDBTVShow): string {
  return "title" in item ? item.title : item.name;
}

function getDate(item: TMDBMovie | TMDBTVShow): string | undefined {
  return "release_date" in item ? item.release_date : item.first_air_date;
}

function getMediaType(item: TMDBMovie | TMDBTVShow): "movie" | "tv" {
  if ("title" in item) return "movie";
  return "tv";
}

export default function HeroBanner({ items }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const featured = items.slice(0, 5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featured.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featured.length]);

  if (featured.length === 0) return null;

  const item = featured[current];
  const title = getTitle(item);
  const mediaType = getMediaType(item);
  const year = getDate(item)?.slice(0, 4) ?? "";

  return (
    <div className="relative w-full aspect-[16/9] max-h-[75vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src={buildBackdropUrl(item.backdrop_path, "original")}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-primary)]/20 to-[var(--bg-primary)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)]/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="max-w-3xl space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight font-[family-name:var(--font-outfit)] text-[var(--text-primary)]">
              {title}
            </h1>

            <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                ⭐ {formatRating(item.vote_average)}
              </span>
              {year && <span>{year}</span>}
              <span className="uppercase text-xs px-2 py-0.5 rounded bg-white/10">
                {mediaType === "tv" ? "TV Series" : "Movie"}
              </span>
            </div>

            <p className="text-sm md:text-base text-[var(--text-secondary)] line-clamp-3 max-w-2xl leading-relaxed">
              {item.overview}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href={`/watch/${mediaType}/${item.id}`}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent-focus)] text-white font-semibold text-sm hover:bg-[var(--accent-focus)]/90 transition-colors shadow-lg shadow-[var(--accent-focus)]/25"
              >
                <Play size={18} fill="white" />
                Watch Now
              </Link>
              <Link
                href={`/${mediaType}/${item.id}`}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 text-[var(--text-primary)] font-semibold text-sm hover:bg-white/20 transition-colors border border-white/10 backdrop-blur-sm"
              >
                <Info size={18} />
                More Info
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex items-center gap-2 mt-6">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1 rounded-full transition-all ${
                i === current
                  ? "w-8 bg-[var(--accent-focus)]"
                  : "w-4 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
