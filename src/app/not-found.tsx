import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="space-y-6">
        <div className="text-8xl font-bold tracking-tighter font-[family-name:var(--font-outfit)] text-[var(--bg-tertiary)]">
          404
        </div>
        <h1 className="text-3xl font-bold tracking-tight font-[family-name:var(--font-outfit)] text-[var(--text-primary)]">
          Page Not Found
        </h1>
        <p className="text-[var(--text-secondary)] max-w-md">
          The content you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent-focus)] text-white font-semibold text-sm hover:bg-[var(--accent-focus)]/90 transition-colors"
        >
          <Home size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
