"use client";

import Image from "next/image";
import { useFanart } from "@/lib/hooks/useFanart";

interface FanartLogoProps {
  tmdbId: number;
  type: "movie" | "tv";
  fallbackTitle: string;
}

export default function FanartLogo({ tmdbId, type, fallbackTitle }: FanartLogoProps) {
  const { data: fanart } = useFanart(tmdbId, type);

  if (fanart?.logo) {
    return (
      <div className="relative h-16 md:h-20 w-auto max-w-[400px]">
        <Image
          src={fanart.logo}
          alt={fallbackTitle}
          fill
          sizes="400px"
          className="object-contain object-left"
          onError={() => {
            // Will fall through to text fallback on next re-render if needed
          }}
        />
      </div>
    );
  }

  // Fallback: styled text title
  return (
    <h1 className="text-3xl md:text-5xl font-bold tracking-tight font-[family-name:var(--font-outfit)] text-[var(--text-primary)]">
      {fallbackTitle}
    </h1>
  );
}
