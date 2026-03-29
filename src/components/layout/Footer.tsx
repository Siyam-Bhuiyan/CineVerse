import Link from "next/link";
import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold tracking-tight font-[family-name:var(--font-outfit)] text-[var(--text-primary)]">
              CineVerse
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              A premium streaming experience. Watch movies, TV shows, and anime
              — completely free, no sign-up required.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">
              Browse
            </h4>
            <div className="flex flex-col gap-2">
              <Link href="/search?type=movie" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Movies
              </Link>
              <Link href="/search?type=tv" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                TV Shows
              </Link>
              <Link href="/search?type=anime" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Anime
              </Link>
            </div>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">
              Project
            </h4>
            <a
              href="https://github.com/Siyam-Bhuiyan/CineVerse"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Github size={16} />
              GitHub
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] text-center">
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} CineVerse. Built as a portfolio project.
            Not affiliated with any streaming service.
          </p>
        </div>
      </div>
    </footer>
  );
}
