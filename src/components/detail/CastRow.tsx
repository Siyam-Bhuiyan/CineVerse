"use client";

import Image from "next/image";
import Link from "next/link";
import { buildProfileUrl } from "@/lib/utils/image";
import type { TMDBCast } from "@/types/tmdb";

interface CastRowProps {
  cast: TMDBCast[];
}

export default function CastRow({ cast }: CastRowProps) {
  if (cast.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight font-[family-name:var(--font-outfit)] text-[var(--text-primary)]">
        Cast
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {cast.slice(0, 20).map((member) => (
          <Link
            key={member.id}
            href={`/person/${member.id}`}
            className="flex-shrink-0 w-[120px] group"
          >
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[var(--bg-secondary)]">
              <Image
                src={buildProfileUrl(member.profile_path)}
                alt={member.name}
                fill
                sizes="120px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="mt-2 text-xs font-medium text-[var(--text-primary)] truncate">
              {member.name}
            </p>
            <p className="text-[10px] text-[var(--text-muted)] truncate">
              {member.character}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
