"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Star } from "lucide-react";
import { buildImageUrl } from "@/lib/utils/image";
import { formatRating, extractYear } from "@/lib/utils/format";
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

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  voteAverage: number;
  releaseDate?: string;
  mediaType?: "movie" | "tv";
  className?: string;
}

export default function MovieCard({
  id,
  title,
  posterPath,
  voteAverage,
  releaseDate,
  mediaType = "movie",
  className,
}: MovieCardProps) {
  const href = mediaType === "tv" ? `/tv/${id}` : `/movie/${id}`;

  return (
    <Link href={href} className={cn("block flex-shrink-0 w-[180px]", className)}>
      <motion.div
        className={cn(
          "relative rounded-lg overflow-hidden cursor-pointer",
          "bg-[var(--bg-secondary)] border border-[var(--border-subtle)]",
          "transition-shadow duration-300"
        )}
        variants={cardVariants}
        initial="rest"
        whileHover="hover"
        style={{
          boxShadow: "0 0 0 rgba(59,130,246,0)",
        }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={buildImageUrl(posterPath, "w342")}
            alt={title}
            fill
            sizes="180px"
            className="object-cover"
          />

          {/* Hover overlay with play button */}
          <motion.div
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
            variants={overlayVariants}
          >
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Play size={20} className="text-white ml-0.5" fill="white" />
            </div>
          </motion.div>

          {/* Rating badge */}
          {voteAverage > 0 && (
            <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-xs font-semibold text-[var(--text-primary)]">
              <Star size={10} className="text-amber-400" fill="currentColor" />
              {formatRating(voteAverage)}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 border-t border-white/10">
          <p className="text-sm font-medium text-[var(--text-primary)] truncate tracking-tight">
            {title}
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {extractYear(releaseDate)}
            {mediaType === "tv" && " • TV"}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
