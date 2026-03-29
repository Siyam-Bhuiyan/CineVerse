"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { buildImageUrl } from "@/lib/utils/image";
import { formatEpisodeCode } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

const cardVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
};

const overlayVariants = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.2 } },
};

interface EpisodeCardProps {
  seasonNumber: number;
  episodeNumber: number;
  name: string;
  stillPath: string | null;
  voteAverage?: number;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function EpisodeCard({
  seasonNumber,
  episodeNumber,
  name,
  stillPath,
  isActive = false,
  onClick,
  className,
}: EpisodeCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "flex-shrink-0 w-[240px] rounded-lg overflow-hidden text-left",
        "bg-[var(--bg-secondary)] border transition-colors",
        isActive
          ? "border-[var(--accent-focus)] ring-1 ring-[var(--accent-focus)]"
          : "border-[var(--border-subtle)] hover:border-white/20",
        className
      )}
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={buildImageUrl(stillPath, "w342")}
          alt={name}
          fill
          sizes="240px"
          className="object-cover"
        />
        <motion.div
          className="absolute inset-0 bg-black/40 flex items-center justify-center"
          variants={overlayVariants}
        >
          <Play size={24} className="text-white" fill="white" />
        </motion.div>

        {/* Episode code */}
        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-semibold text-white">
          {formatEpisodeCode(seasonNumber, episodeNumber)}
        </div>
      </div>

      {/* Title */}
      <div className="p-2">
        <p className="text-xs font-medium text-[var(--text-primary)] truncate">
          {name}
        </p>
      </div>
    </motion.button>
  );
}
