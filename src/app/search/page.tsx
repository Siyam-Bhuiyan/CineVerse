import { Suspense } from "react";
import { searchMulti } from "@/lib/api/tmdb";
import SearchBar from "@/components/search/SearchBar";
import SearchFilters from "@/components/search/SearchFilters";
import SearchResults from "@/components/search/SearchResults";
import type { TMDBSearchMultiResult } from "@/types/tmdb";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ q?: string; page?: string; type?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const query = sp.q;
  return {
    title: query ? `"${query}" — Search — CineVerse` : "Search — CineVerse",
    description: "Search for movies, TV shows, anime, and people on CineVerse.",
  };
}

async function SearchResultsLoader({ query, page }: { query: string; page: number }) {
  if (!query || query.length < 2) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-[var(--text-secondary)]">
          Start typing to search
        </p>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Search for movies, TV shows, anime, and people
        </p>
      </div>
    );
  }

  try {
    const data = await searchMulti(query, page);
    return (
      <SearchResults
        results={data.results as TMDBSearchMultiResult[]}
        isLoading={false}
        totalResults={data.total_results}
      />
    );
  } catch {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-[var(--text-secondary)]">Search failed</p>
        <p className="text-sm text-[var(--text-muted)] mt-1">Please try again</p>
      </div>
    );
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const query = sp.q ?? "";
  const page = parseInt(sp.page ?? "1", 10);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Search Header */}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight font-[family-name:var(--font-outfit)] text-[var(--text-primary)]">
          Search
        </h1>
        <Suspense>
          <SearchBar />
        </Suspense>
        <Suspense>
          <SearchFilters />
        </Suspense>
      </div>

      {/* Results */}
      <Suspense
        fallback={
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] rounded-lg bg-[var(--bg-tertiary)] shimmer" />
                <div className="mt-2 h-3 w-3/4 rounded bg-[var(--bg-tertiary)] shimmer" />
              </div>
            ))}
          </div>
        }
      >
        <SearchResultsLoader query={query} page={page} />
      </Suspense>

      {/* Pagination */}
      {query && (
        <div className="flex justify-center gap-2 pt-4">
          {page > 1 && (
            <a
              href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}`}
              className="px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              ← Previous
            </a>
          )}
          <span className="px-4 py-2 text-sm text-[var(--text-muted)]">
            Page {page}
          </span>
          <a
            href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}`}
            className="px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Next →
          </a>
        </div>
      )}
    </div>
  );
}
