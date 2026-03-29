"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const cardVariants = {
  rest: { scale: 1, filter: "brightness(1)" },
  hover: {
    scale: 1.03,
    filter: "brightness(1.1)",
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

const overlayVariants = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.2 } },
};

interface AnimeCardProps {
  id: number;
  title: string;
  coverImage: string | null;
  score: number | null;
  episodes: number | null;
  format: string | null;
  className?: string;
}

export default function AnimeCard({
  id,
  title,
  coverImage,
  score,
  episodes,
  format,
  className,
}: AnimeCardProps) {
  return (
    <Link href={`/anime/${id}`} className={cn("block flex-shrink-0 w-[180px]", className)}>
      <motion.div
        className={cn(
          "relative rounded-lg overflow-hidden cursor-pointer",
          "bg-[var(--bg-secondary)] border border-[var(--border-subtle)]",
        )}
        variants={cardVariants}
        initial="rest"
        whileHover="hover"
        whileTap={{ scale: 0.98 }}
      >
        {/* Cover */}
        <div className="relative aspect-[2/3] overflow-hidden">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fill
              sizes="180px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[var(--bg-tertiary)] flex items-center justify-center">
              <span className="text-[var(--text-muted)] text-xs">No Image</span>
            </div>
          )}

          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
            variants={overlayVariants}
          >
            <div className="w-12 h-12 rounded-full bg-[var(--accent-anime)]/30 backdrop-blur-sm flex items-center justify-center border border-[var(--accent-anime)]/50">
              <Play size={20} className="text-white ml-0.5" fill="white" />
            </div>
          </motion.div>

          {/* Score */}
          {score && (
            <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-xs font-semibold text-[var(--text-primary)]">
              <Star size={10} className="text-amber-400" fill="currentColor" />
              {(score / 10).toFixed(1)}
            </div>
          )}

          {/* Format badge */}
          {format && (
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[var(--accent-anime)]/80 text-xs font-semibold text-white">
              {format}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 border-t border-white/10">
          <p className="text-sm font-medium text-[var(--text-primary)] truncate tracking-tight">
            {title}
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {episodes ? `${episodes} eps` : "Ongoing"}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
