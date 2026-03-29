"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight font-[family-name:var(--font-outfit)] text-[var(--text-primary)]">
          Something went wrong
        </h2>
        <p className="text-[var(--text-secondary)] max-w-md">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent-focus)] text-white font-semibold text-sm hover:bg-[var(--accent-focus)]/90 transition-colors"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    </div>
  );
}
