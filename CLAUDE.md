# CineVerse — CLAUDE.md

> This file is the single source of truth for Claude Code.
> Read it fully before touching any file.

---

## Project Overview

CineVerse is a premium, fully free streaming site for movies, TV shows, and anime.
Built as a portfolio/CV project. No backend, no database, no paid services.
The goal is to look better than every existing free streaming site — Netflix-level UI.

---

## Tech Stack

| Layer | Tool | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | Server components, streaming, ISR, Vercel-native |
| Language | TypeScript (strict) | Type safety everywhere |
| Styling | Tailwind CSS v4 | Utility-first, fast |# CineVerse — CLAUDE.md

> This file is the single source of truth for Claude Code.
> Read it fully before touching any file.

---

## Project Overview

CineVerse is a premium, fully free streaming site for movies, TV shows, and anime.
Built as a portfolio/CV project. No backend, no database, no paid services.
The goal is to look better than every existing free streaming site — Netflix-level UI.

---

## Tech Stack

| Layer | Tool | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | Server components, streaming, ISR, Vercel-native |
| Language | TypeScript (strict) | Type safety everywhere |
| Styling | Tailwind CSS v4 | Utility-first, fast |
| UI Components | shadcn/ui | Accessible, unstyled base |
| Data Fetching | TanStack Query (React Query v5) | Client-side caching, background refetch |
| Server Caching | Next.js fetch cache + revalidate | Reduces API calls server-side |
| Animation | Framer Motion | Page transitions, card hovers |
| Icons | Lucide React | Consistent icon set |
| Hosting | Vercel (free tier) | Zero-config Next.js deploy |
| Repo | GitHub | Version control + CI |

---

## APIs — Complete List

### Video Players (in fallback order)
1. **Vidking** → `https://www.vidking.net/embed/movie/{tmdbId}` and `/embed/tv/{tmdbId}/{season}/{episode}`
2. **vidsrc.icu** → `https://vidsrc.icu/embed/movie/{tmdbId}` and `/embed/tv/{tmdbId}/{season}/{episode}`
3. **2embed.cc** → `https://www.2embed.cc/embed/{tmdbId}` (last resort)

Vidking supports postMessage events for watch progress tracking. Always implement the message listener.

### Data APIs
| API | Purpose | Auth | Base URL |
|---|---|---|---|
| TMDB v3 | Movies, TV, metadata, images, search | API Key (header) | `https://api.themoviedb.org/3` |
| AniList | Anime data, tracking, airing schedule | None (GraphQL, public) | `https://graphql.anilist.co` |
| Fanart.tv | HD logos, clearart, backgrounds | API Key (query param) | `https://webservice.fanart.tv/v3` |
| OpenSubtitles | Subtitles in 40+ languages | API Key (header) | `https://api.opensubtitles.com/api/v1` |
| YouTube Data v3 | Trailers, clips | API Key (query param) | `https://www.googleapis.com/youtube/v3` |
| Trace.moe | Anime scene search from screenshot | None (free) | `https://api.trace.moe` |
| OMDb | IMDb ratings, Rotten Tomatoes scores | API Key (query param) | `https://www.omdbapi.com` |

### AI
| API | Model | Purpose | Limit |
|---|---|---|---|
| Google Gemini | gemini-2.5-flash-lite | AI movie/anime suggestions | 1,000 req/day, no expiry, no card |

**AI caching rule:** Always cache Gemini responses in localStorage for 24 hours per user session.
Never call Gemini more than once per user per day. Check cache before every call.

### Image CDN
- TMDB images: `https://image.tmdb.org/t/p/{size}{path}`
  - Sizes: `w92`, `w154`, `w185`, `w342`, `w500`, `w780`, `original`
  - Backdrops: `w1280`, `original`
- Fanart.tv images: served directly from their CDN URLs in the API response

---

## Environment Variables

All API keys live in `.env.local` only. Never commit `.env.local`.
All external API calls must go through Next.js API routes (`/app/api/`) — never call from the browser directly.

```env
# TMDB
TMDB_API_KEY=
TMDB_ACCESS_TOKEN=

# Fanart.tv
FANART_API_KEY=

# OpenSubtitles
OPENSUBTITLES_API_KEY=

# YouTube
YOUTUBE_API_KEY=

# Google Gemini
GEMINI_API_KEY=

# OMDb
OMDB_API_KEY=
```

---

## Architecture

### Rendering Strategy

| Page | Strategy | Reason |
|---|---|---|
| Homepage `/` | ISR (revalidate: 3600) | Trending data, refresh hourly |
| Movie detail `/movie/[id]` | ISR (revalidate: 86400) | Stable metadata, refresh daily |
| TV detail `/tv/[id]` | ISR (revalidate: 86400) | Stable metadata |
| Anime detail `/anime/[id]` | ISR (revalidate: 3600) | Airing status changes |
| Search `/search` | Dynamic (SSR) | Query-dependent, no cache |
| Watch `/watch/[type]/[id]` | Dynamic | Player state, no cache |
| Person `/person/[id]` | ISR (revalidate: 86400) | Rarely changes |

### Server vs Client Components

- **Server Components (default):** All pages, data fetching, metadata generation, SEO
- **Client Components (`'use client'`):** Video player, search input, genre filter tabs, watchlist button, continue-watching row, AI suggestion section, trailer modal, anything with useState/useEffect

### Data Flow

```
Browser Request
    ↓
Next.js Server Component (fetches from API route or directly server-side)
    ↓
Page renders with initial data (SSR/ISR)
    ↓
Client hydrates → React Query takes over for client-side updates
    ↓
localStorage for user state (watchlist, progress, watch history)
```

### API Route Pattern

Every external API call is proxied through `/app/api/`:

```
/app/api/
  tmdb/
    trending/route.ts
    movie/[id]/route.ts
    tv/[id]/route.ts
    search/route.ts
    person/[id]/route.ts
  anime/
    trending/route.ts
    detail/[id]/route.ts
    search/route.ts
  ai/
    suggestions/route.ts      ← Gemini, always check localStorage cache first
  subtitles/
    search/route.ts
  trailers/
    [id]/route.ts
  fanart/
    [id]/route.ts
```

---

## Folder Structure

```
cineverse/
├── .env.local                     # API keys — never commit
├── .env.example                   # Placeholder keys — commit this
├── CLAUDE.md                      # This file
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── components.json                # shadcn/ui config
│
├── public/
│   ├── logo.svg
│   └── favicon.ico
│
└── src/
    ├── app/                       # Next.js App Router
    │   ├── layout.tsx             # Root layout (fonts, providers, navbar, footer)
    │   ├── page.tsx               # Homepage (ISR)
    │   ├── loading.tsx            # Root loading skeleton
    │   ├── error.tsx              # Root error boundary
    │   │
    │   ├── (media)/               # Route group — shared media layout
    │   │   ├── movie/
    │   │   │   └── [id]/
    │   │   │       ├── page.tsx
    │   │   │       └── loading.tsx
    │   │   ├── tv/
    │   │   │   └── [id]/
    │   │   │       ├── page.tsx
    │   │   │       └── loading.tsx
    │   │   └── anime/
    │   │       └── [id]/
    │   │           ├── page.tsx
    │   │           └── loading.tsx
    │   │
    │   ├── watch/
    │   │   └── [type]/
    │   │       └── [id]/
    │   │           └── page.tsx   # Full-screen player page
    │   │
    │   ├── search/
    │   │   └── page.tsx           # Search results (SSR)
    │   │
    │   ├── person/
    │   │   └── [id]/
    │   │       └── page.tsx       # Actor/director profile
    │   │
    │   ├── genre/
    │   │   └── [type]/
    │   │       └── [id]/
    │   │           └── page.tsx   # Browse by genre
    │   │
    │   └── api/                   # API routes (proxy — hides API keys)
    │       ├── tmdb/
    │       │   ├── trending/route.ts
    │       │   ├── movie/[id]/route.ts
    │       │   ├── tv/[id]/route.ts
    │       │   ├── search/route.ts
    │       │   └── person/[id]/route.ts
    │       ├── anime/
    │       │   ├── trending/route.ts
    │       │   ├── detail/[id]/route.ts
    │       │   └── search/route.ts
    │       ├── ai/
    │       │   └── suggestions/route.ts
    │       ├── subtitles/
    │       │   └── search/route.ts
    │       ├── trailers/
    │       │   └── [id]/route.ts
    │       └── fanart/
    │           └── [id]/route.ts
    │
    ├── components/
    │   ├── ui/                    # shadcn/ui primitives (auto-generated, don't edit)
    │   │
    │   ├── layout/
    │   │   ├── Navbar.tsx         # Top nav with search, logo, links
    │   │   ├── Footer.tsx
    │   │   └── Providers.tsx      # QueryClientProvider, ThemeProvider wrapping
    │   │
    │   ├── home/
    │   │   ├── HeroBanner.tsx     # Featured content with backdrop
    │   │   ├── ContentRow.tsx     # Horizontal scroll row (generic, reused everywhere)
    │   │   ├── ContinueWatching.tsx  # Client — reads localStorage
    │   │   ├── AISuggestions.tsx  # Client — Gemini powered, cached
    │   │   └── GenrePills.tsx     # Client — filter tabs
    │   │
    │   ├── cards/
    │   │   ├── MovieCard.tsx      # Poster card with hover glow effect
    │   │   ├── AnimeCard.tsx      # Anime-specific card (MAL score, episodes)
    │   │   └── EpisodeCard.tsx    # Episode thumbnail card
    │   │
    │   ├── detail/
    │   │   ├── MediaHero.tsx      # Backdrop + metadata (shared movie/TV)
    │   │   ├── FanartLogo.tsx     # HD logo from Fanart.tv (falls back to text)
    │   │   ├── CastRow.tsx        # Horizontal cast scroll
    │   │   ├── TrailerModal.tsx   # Client — YouTube trailer in modal
    │   │   ├── WatchlistButton.tsx # Client — localStorage toggle
    │   │   └── RatingBadges.tsx   # TMDB + IMDb + RT ratings
    │   │
    │   ├── player/
    │   │   ├── VideoPlayer.tsx    # Client — iframe player with server switcher
    │   │   ├── ServerSelector.tsx # Client — Vidking / vidsrc.icu / 2embed tabs
    │   │   ├── EpisodeSelector.tsx # Client — season/episode picker for TV
    │   │   └── SubtitleSelector.tsx # Client — OpenSubtitles integration
    │   │
    │   ├── search/
    │   │   ├── SearchBar.tsx      # Client — debounced input
    │   │   ├── SearchFilters.tsx  # Client — type, genre, year, rating filters
    │   │   └── SearchResults.tsx  # Results grid
    │   │
    │   └── skeletons/
    │       ├── CardSkeleton.tsx
    │       ├── HeroSkeleton.tsx
    │       ├── DetailSkeleton.tsx
    │       └── RowSkeleton.tsx
    │
    ├── lib/
    │   ├── api/
    │   │   ├── tmdb.ts            # TMDB fetch functions (server-side)
    │   │   ├── anilist.ts         # AniList GraphQL queries (server-side)
    │   │   ├── fanart.ts          # Fanart.tv fetch (server-side)
    │   │   ├── omdb.ts            # OMDb ratings fetch (server-side)
    │   │   ├── subtitles.ts       # OpenSubtitles (server-side)
    │   │   ├── youtube.ts         # YouTube trailer search (server-side)
    │   │   ├── gemini.ts          # Gemini AI suggestions (server-side, API route only)
    │   │   └── tracemoe.ts        # Trace.moe anime scene search (server-side)
    │   │
    │   ├── hooks/                 # React Query hooks (client-side)
    │   │   ├── useMovies.ts
    │   │   ├── useTVShows.ts
    │   │   ├── useAnime.ts
    │   │   ├── useSearch.ts
    │   │   ├── useTrailer.ts
    │   │   └── useFanart.ts
    │   │
    │   ├── storage/
    │   │   ├── watchlist.ts       # localStorage: add/remove/check watchlist
    │   │   ├── progress.ts        # localStorage: save/get watch progress per item
    │   │   ├── history.ts         # localStorage: track what user has watched
    │   │   └── aiCache.ts         # localStorage: cache Gemini results 24h
    │   │
    │   └── utils/
    │       ├── cn.ts              # clsx + tailwind-merge helper
    │       ├── format.ts          # formatRuntime, formatDate, formatRating
    │       ├── image.ts           # TMDB image URL builder
    │       └── player.ts          # Build embed URLs for all 3 players
    │
    └── types/
        ├── tmdb.ts                # TMDB API response types
        ├── anilist.ts             # AniList GraphQL types
        ├── player.ts              # Player server types
        └── storage.ts             # localStorage schema types
```

---

## Design System

Colors
CSS
/* Lighter, blue-shifted background foundation */
--bg-primary:    #080810;   /* Slate Deep - Main background */
--bg-secondary:  #0F0F1A;   /* Slate Card - Surface background */
--bg-tertiary:   #1A1A2E;   /* Slate Elevated - Borders/Elevated Surfaces */

/* Refined Accents - Toned down saturation for premium feel */
--accent-primary:#FFFFFF;   /* High Contrast - CTAs, main icons, text */
--accent-focus:  #3B82F6;   /* Interactivity - Focus rings, active states, special highlights */

/* Refined Anime Accents - Use sparingly, restricted to Anime routes */
--accent-anime:  #6D28D9;   /* Controlled Purple - Anime highlight */
--accent-badge:  #DB2777;   /* Controlled Pink - Special badges */

/* Text Hierarchy */
--text-primary:  #FFFFFF;   /* Maximum contrast */
--text-secondary:#A0A0B0;   /* Subtitles, secondary metadata */
--text-muted:    #606070;   /* Low-priority info, disabled states */

--border-subtle: rgba(255, 255, 255, 0.08); /* Minimalist structure */
Design Principles
Controlled Palette — Beauty through constraint. While the background has a slight blue hue, color comes primarily from the movie posters. Bright accents are used only for interaction feedback.

Micro-Glow Feedback — On card hover, use shadow-[0_0_15px_rgba(59,130,246,0.3)] for a subtle, professional glow that responds to user focus. Do not use intense, multi-colored neon gradients.

Glassmorphism (Subtle) — Apply backdrop-blur-lg bg-black/60 border border-white/10 to the Navbar and Modals for a clear sense of depth and focus.

Cinematic Hero Overlay — Use a dynamic, deep linear-gradient(to bottom, transparent 30%, var(--bg-primary) 100%) overlay on hero banners to make them fade naturally into the darker interface.

Zero Layout Shift Skeletons — Every async content block must have a Shimmer loading skeleton that perfectly matches the final aspect ratio of the posters or heroes (2:3 or 16:9).

Framer Motion Performance — Utilize hardware-accelerated animations (opacity, scale, translate) for page and card interactions to ensure a consistent 60fps experience.

Typography
Headings (Outfit): Use font-bold tracking-tight (e.g., Hero title text-5xl).

Body (Inter): Use font-medium tracking-tight for UI elements (Card title text-sm); font-normal for descriptions.

Metadata (Inter): text-xs font-semibold text-text-secondary.

Card Design (Refined)
┌────────────────┐
│                │  ← Optimized next/image (w342 aspect-ratio: 2/3)
│   [POSTER]     │
│                │
│ Title text     │  ← White/10 border-top, title below poster
│ [META]         │  ← Muted metadata (Year • Genre)
└────────────────┐
     ↑ on hover: scale(1.03), subtle subtle shadow-blur, brightness(110%)
Player Page Design
Full-screen dark layout (#000) - The player must be absolute focus.

Player iframe: Takes 16/9 aspect ratio, 100% width.

Server tabs: Above player, use minimalist styling. [ Vidking ] | vidsrc.icu | 2embed. The active tab uses the focused blue (--accent-focus).

Episode selector: Below player, accordion-style structure.

Subtitle selector: Dropdown overlay on player.

---

## Key Implementation Rules

### API Keys — Security
- NEVER import API keys in any component or client-side file
- ALL external API calls go through `/app/api/` route handlers
- Use `process.env.VARIABLE_NAME` only inside route handlers and server components
- Validate that env vars exist at startup, throw descriptive errors if missing

### React Query Caching Strategy
```ts
// Standard stale times
const STALE_TIMES = {
  trending:  5 * 60 * 1000,   // 5 minutes
  detail:    60 * 60 * 1000,  // 1 hour
  search:    2 * 60 * 1000,   // 2 minutes
  trailer:   24 * 60 * 60 * 1000, // 24 hours
  fanart:    24 * 60 * 60 * 1000, // 24 hours
}
```

### localStorage Schema
```ts
// Watch progress
`progress:movie:${tmdbId}` → { progress: number, timestamp: number, duration: number }
`progress:tv:${tmdbId}:${season}:${episode}` → { progress: number, timestamp: number }

// Watchlist
`watchlist` → Array<{ id: number, type: 'movie'|'tv'|'anime', title: string, poster: string, addedAt: number }>

// Watch history (for AI)
`history` → Array<{ id: number, type: string, genres: string[], title: string, watchedAt: number }>

// AI cache
`ai:suggestions` → { results: TMDBItem[], generatedAt: number } // expires after 24h
```

### Vidking Progress Tracking
Always attach this listener when VideoPlayer mounts:
```ts
window.addEventListener('message', (event) => {
  if (typeof event.data !== 'string') return
  const data = JSON.parse(event.data)
  if (data.type === 'PLAYER_EVENT' && data.data.event === 'timeupdate') {
    saveProgress(data.data) // write to localStorage
  }
})
```

### Gemini AI Suggestions
```ts
// In /app/api/ai/suggestions/route.ts
// 1. Receive watch history from request body
// 2. Build a short prompt (max 200 tokens input)
// 3. Ask for 6 recommendations as JSON array
// 4. Return results
// Client caches result in localStorage for 24 hours
// Client checks cache before calling this route
```

### AniList GraphQL
Always use POST to `https://graphql.anilist.co` with `Content-Type: application/json`.
No API key needed. Rate limit: 90 requests per minute.

### Fanart.tv Fallback
```ts
// Always try Fanart.tv logo first
// If no logo found → fall back to TMDB title text styled with CSS
// Never show broken images
```

---

## Git Conventions

```
feat:      new feature or page
fix:       bug fix
style:     UI, CSS, design changes (no logic change)
refactor:  code restructuring (no behavior change)
perf:      performance improvement
chore:     config, deps, tooling
docs:      README, comments
api:       new API route or integration
```

Commit when a logical unit of work is complete — not too small, not too large.
One feature, one fix, or one page per commit is a good rule of thumb.

---

## What NOT to Do

- Do NOT use Pages Router — App Router only
- Do NOT use `any` type in TypeScript — use proper types or `unknown`
- Do NOT call external APIs from client components directly — always via `/app/api/`
- Do NOT store API keys in client-side code or `.env` (only `.env.local`)
- Do NOT use Supabase or any database — localStorage only
- Do NOT add unnecessary dependencies — keep bundle lean
- Do NOT skip loading skeletons — every async section needs one
- Do NOT hardcode TMDB image paths — always use the `buildImageUrl()` util
- Do NOT call Gemini API without checking localStorage cache first
- Do NOT ignore TypeScript errors — fix them, never use `// @ts-ignore`

---

## Build & Deploy

```bash
# Development
npm run dev

# Type check
npm run type-check   # tsc --noEmit

# Build
npm run build

# Deploy — just push to main, Vercel auto-deploys
git push origin main
```

Vercel config: add all `.env.local` variables in Vercel dashboard → Project Settings → Environment Variables.
| UI Components | shadcn/ui | Accessible, unstyled base |
| Data Fetching | TanStack Query (React Query v5) | Client-side caching, background refetch |
| Server Caching | Next.js fetch cache + revalidate | Reduces API calls server-side |
| Animation | Framer Motion | Page transitions, card hovers |
| Icons | Lucide React | Consistent icon set |
| Hosting | Vercel (free tier) | Zero-config Next.js deploy |
| Repo | GitHub | Version control + CI |

---

## APIs — Complete List

### Video Players (in fallback order)
1. **Vidking** → `https://www.vidking.net/embed/movie/{tmdbId}` and `/embed/tv/{tmdbId}/{season}/{episode}`
2. **vidsrc.icu** → `https://vidsrc.icu/embed/movie/{tmdbId}` and `/embed/tv/{tmdbId}/{season}/{episode}`
3. **2embed.cc** → `https://www.2embed.cc/embed/{tmdbId}` (last resort)

Vidking supports postMessage events for watch progress tracking. Always implement the message listener.

### Data APIs
| API | Purpose | Auth | Base URL |
|---|---|---|---|
| TMDB v3 | Movies, TV, metadata, images, search | API Key (header) | `https://api.themoviedb.org/3` |
| AniList | Anime data, tracking, airing schedule | None (GraphQL, public) | `https://graphql.anilist.co` |
| Fanart.tv | HD logos, clearart, backgrounds | API Key (query param) | `https://webservice.fanart.tv/v3` |
| OpenSubtitles | Subtitles in 40+ languages | API Key (header) | `https://api.opensubtitles.com/api/v1` |
| YouTube Data v3 | Trailers, clips | API Key (query param) | `https://www.googleapis.com/youtube/v3` |
| Trace.moe | Anime scene search from screenshot | None (free) | `https://api.trace.moe` |
| OMDb | IMDb ratings, Rotten Tomatoes scores | API Key (query param) | `https://www.omdbapi.com` |

### AI
| API | Model | Purpose | Limit |
|---|---|---|---|
| Google Gemini | gemini-2.5-flash-lite | AI movie/anime suggestions | 1,000 req/day, no expiry, no card |

**AI caching rule:** Always cache Gemini responses in localStorage for 24 hours per user session.
Never call Gemini more than once per user per day. Check cache before every call.

### Image CDN
- TMDB images: `https://image.tmdb.org/t/p/{size}{path}`
  - Sizes: `w92`, `w154`, `w185`, `w342`, `w500`, `w780`, `original`
  - Backdrops: `w1280`, `original`
- Fanart.tv images: served directly from their CDN URLs in the API response

---

## Environment Variables

All API keys live in `.env.local` only. Never commit `.env.local`.
All external API calls must go through Next.js API routes (`/app/api/`) — never call from the browser directly.

```env
# TMDB
TMDB_API_KEY=
TMDB_ACCESS_TOKEN=

# Fanart.tv
FANART_API_KEY=

# OpenSubtitles
OPENSUBTITLES_API_KEY=

# YouTube
YOUTUBE_API_KEY=

# Google Gemini
GEMINI_API_KEY=

# OMDb
OMDB_API_KEY=
```

---

## Architecture

### Rendering Strategy

| Page | Strategy | Reason |
|---|---|---|
| Homepage `/` | ISR (revalidate: 3600) | Trending data, refresh hourly |
| Movie detail `/movie/[id]` | ISR (revalidate: 86400) | Stable metadata, refresh daily |
| TV detail `/tv/[id]` | ISR (revalidate: 86400) | Stable metadata |
| Anime detail `/anime/[id]` | ISR (revalidate: 3600) | Airing status changes |
| Search `/search` | Dynamic (SSR) | Query-dependent, no cache |
| Watch `/watch/[type]/[id]` | Dynamic | Player state, no cache |
| Person `/person/[id]` | ISR (revalidate: 86400) | Rarely changes |

### Server vs Client Components

- **Server Components (default):** All pages, data fetching, metadata generation, SEO
- **Client Components (`'use client'`):** Video player, search input, genre filter tabs, watchlist button, continue-watching row, AI suggestion section, trailer modal, anything with useState/useEffect

### Data Flow

```
Browser Request
    ↓
Next.js Server Component (fetches from API route or directly server-side)
    ↓
Page renders with initial data (SSR/ISR)
    ↓
Client hydrates → React Query takes over for client-side updates
    ↓
localStorage for user state (watchlist, progress, watch history)
```

### API Route Pattern

Every external API call is proxied through `/app/api/`:

```
/app/api/
  tmdb/
    trending/route.ts
    movie/[id]/route.ts
    tv/[id]/route.ts
    search/route.ts
    person/[id]/route.ts
  anime/
    trending/route.ts
    detail/[id]/route.ts
    search/route.ts
  ai/
    suggestions/route.ts      ← Gemini, always check localStorage cache first
  subtitles/
    search/route.ts
  trailers/
    [id]/route.ts
  fanart/
    [id]/route.ts
```

---

## Folder Structure

```
cineverse/
├── .env.local                     # API keys — never commit
├── .env.example                   # Placeholder keys — commit this
├── CLAUDE.md                      # This file
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── components.json                # shadcn/ui config
│
├── public/
│   ├── logo.svg
│   └── favicon.ico
│
└── src/
    ├── app/                       # Next.js App Router
    │   ├── layout.tsx             # Root layout (fonts, providers, navbar, footer)
    │   ├── page.tsx               # Homepage (ISR)
    │   ├── loading.tsx            # Root loading skeleton
    │   ├── error.tsx              # Root error boundary
    │   │
    │   ├── (media)/               # Route group — shared media layout
    │   │   ├── movie/
    │   │   │   └── [id]/
    │   │   │       ├── page.tsx
    │   │   │       └── loading.tsx
    │   │   ├── tv/
    │   │   │   └── [id]/
    │   │   │       ├── page.tsx
    │   │   │       └── loading.tsx
    │   │   └── anime/
    │   │       └── [id]/
    │   │           ├── page.tsx
    │   │           └── loading.tsx
    │   │
    │   ├── watch/
    │   │   └── [type]/
    │   │       └── [id]/
    │   │           └── page.tsx   # Full-screen player page
    │   │
    │   ├── search/
    │   │   └── page.tsx           # Search results (SSR)
    │   │
    │   ├── person/
    │   │   └── [id]/
    │   │       └── page.tsx       # Actor/director profile
    │   │
    │   ├── genre/
    │   │   └── [type]/
    │   │       └── [id]/
    │   │           └── page.tsx   # Browse by genre
    │   │
    │   └── api/                   # API routes (proxy — hides API keys)
    │       ├── tmdb/
    │       │   ├── trending/route.ts
    │       │   ├── movie/[id]/route.ts
    │       │   ├── tv/[id]/route.ts
    │       │   ├── search/route.ts
    │       │   └── person/[id]/route.ts
    │       ├── anime/
    │       │   ├── trending/route.ts
    │       │   ├── detail/[id]/route.ts
    │       │   └── search/route.ts
    │       ├── ai/
    │       │   └── suggestions/route.ts
    │       ├── subtitles/
    │       │   └── search/route.ts
    │       ├── trailers/
    │       │   └── [id]/route.ts
    │       └── fanart/
    │           └── [id]/route.ts
    │
    ├── components/
    │   ├── ui/                    # shadcn/ui primitives (auto-generated, don't edit)
    │   │
    │   ├── layout/
    │   │   ├── Navbar.tsx         # Top nav with search, logo, links
    │   │   ├── Footer.tsx
    │   │   └── Providers.tsx      # QueryClientProvider, ThemeProvider wrapping
    │   │
    │   ├── home/
    │   │   ├── HeroBanner.tsx     # Featured content with backdrop
    │   │   ├── ContentRow.tsx     # Horizontal scroll row (generic, reused everywhere)
    │   │   ├── ContinueWatching.tsx  # Client — reads localStorage
    │   │   ├── AISuggestions.tsx  # Client — Gemini powered, cached
    │   │   └── GenrePills.tsx     # Client — filter tabs
    │   │
    │   ├── cards/
    │   │   ├── MovieCard.tsx      # Poster card with hover glow effect
    │   │   ├── AnimeCard.tsx      # Anime-specific card (MAL score, episodes)
    │   │   └── EpisodeCard.tsx    # Episode thumbnail card
    │   │
    │   ├── detail/
    │   │   ├── MediaHero.tsx      # Backdrop + metadata (shared movie/TV)
    │   │   ├── FanartLogo.tsx     # HD logo from Fanart.tv (falls back to text)
    │   │   ├── CastRow.tsx        # Horizontal cast scroll
    │   │   ├── TrailerModal.tsx   # Client — YouTube trailer in modal
    │   │   ├── WatchlistButton.tsx # Client — localStorage toggle
    │   │   └── RatingBadges.tsx   # TMDB + IMDb + RT ratings
    │   │
    │   ├── player/
    │   │   ├── VideoPlayer.tsx    # Client — iframe player with server switcher
    │   │   ├── ServerSelector.tsx # Client — Vidking / vidsrc.icu / 2embed tabs
    │   │   ├── EpisodeSelector.tsx # Client — season/episode picker for TV
    │   │   └── SubtitleSelector.tsx # Client — OpenSubtitles integration
    │   │
    │   ├── search/
    │   │   ├── SearchBar.tsx      # Client — debounced input
    │   │   ├── SearchFilters.tsx  # Client — type, genre, year, rating filters
    │   │   └── SearchResults.tsx  # Results grid
    │   │
    │   └── skeletons/
    │       ├── CardSkeleton.tsx
    │       ├── HeroSkeleton.tsx
    │       ├── DetailSkeleton.tsx
    │       └── RowSkeleton.tsx
    │
    ├── lib/
    │   ├── api/
    │   │   ├── tmdb.ts            # TMDB fetch functions (server-side)
    │   │   ├── anilist.ts         # AniList GraphQL queries (server-side)
    │   │   ├── fanart.ts          # Fanart.tv fetch (server-side)
    │   │   ├── omdb.ts            # OMDb ratings fetch (server-side)
    │   │   ├── subtitles.ts       # OpenSubtitles (server-side)
    │   │   ├── youtube.ts         # YouTube trailer search (server-side)
    │   │   ├── gemini.ts          # Gemini AI suggestions (server-side, API route only)
    │   │   └── tracemoe.ts        # Trace.moe anime scene search (server-side)
    │   │
    │   ├── hooks/                 # React Query hooks (client-side)
    │   │   ├── useMovies.ts
    │   │   ├── useTVShows.ts
    │   │   ├── useAnime.ts
    │   │   ├── useSearch.ts
    │   │   ├── useTrailer.ts
    │   │   └── useFanart.ts
    │   │
    │   ├── storage/
    │   │   ├── watchlist.ts       # localStorage: add/remove/check watchlist
    │   │   ├── progress.ts        # localStorage: save/get watch progress per item
    │   │   ├── history.ts         # localStorage: track what user has watched
    │   │   └── aiCache.ts         # localStorage: cache Gemini results 24h
    │   │
    │   └── utils/
    │       ├── cn.ts              # clsx + tailwind-merge helper
    │       ├── format.ts          # formatRuntime, formatDate, formatRating
    │       ├── image.ts           # TMDB image URL builder
    │       └── player.ts          # Build embed URLs for all 3 players
    │
    └── types/
        ├── tmdb.ts                # TMDB API response types
        ├── anilist.ts             # AniList GraphQL types
        ├── player.ts              # Player server types
        └── storage.ts             # localStorage schema types
```

---

## Key Implementation Rules

### API Keys — Security
- NEVER import API keys in any component or client-side file
- ALL external API calls go through `/app/api/` route handlers
- Use `process.env.VARIABLE_NAME` only inside route handlers and server components
- Validate that env vars exist at startup, throw descriptive errors if missing

### React Query Caching Strategy
```ts
// Standard stale times
const STALE_TIMES = {
  trending:  5 * 60 * 1000,   // 5 minutes
  detail:    60 * 60 * 1000,  // 1 hour
  search:    2 * 60 * 1000,   // 2 minutes
  trailer:   24 * 60 * 60 * 1000, // 24 hours
  fanart:    24 * 60 * 60 * 1000, // 24 hours
}
```

### localStorage Schema
```ts
// Watch progress
`progress:movie:${tmdbId}` → { progress: number, timestamp: number, duration: number }
`progress:tv:${tmdbId}:${season}:${episode}` → { progress: number, timestamp: number }

// Watchlist
`watchlist` → Array<{ id: number, type: 'movie'|'tv'|'anime', title: string, poster: string, addedAt: number }>

// Watch history (for AI)
`history` → Array<{ id: number, type: string, genres: string[], title: string, watchedAt: number }>

// AI cache
`ai:suggestions` → { results: TMDBItem[], generatedAt: number } // expires after 24h
```

### Vidking Progress Tracking
Always attach this listener when VideoPlayer mounts:
```ts
window.addEventListener('message', (event) => {
  if (typeof event.data !== 'string') return
  const data = JSON.parse(event.data)
  if (data.type === 'PLAYER_EVENT' && data.data.event === 'timeupdate') {
    saveProgress(data.data) // write to localStorage
  }
})
```

### Gemini AI Suggestions
```ts
// In /app/api/ai/suggestions/route.ts
// 1. Receive watch history from request body
// 2. Build a short prompt (max 200 tokens input)
// 3. Ask for 6 recommendations as JSON array
// 4. Return results
// Client caches result in localStorage for 24 hours
// Client checks cache before calling this route
```

### AniList GraphQL
Always use POST to `https://graphql.anilist.co` with `Content-Type: application/json`.
No API key needed. Rate limit: 90 requests per minute.

### Fanart.tv Fallback
```ts
// Always try Fanart.tv logo first
// If no logo found → fall back to TMDB title text styled with CSS
// Never show broken images
```

---

## Git Conventions

```
feat:      new feature or page
fix:       bug fix
style:     UI, CSS, design changes (no logic change)
refactor:  code restructuring (no behavior change)
perf:      performance improvement
chore:     config, deps, tooling
docs:      README, comments
api:       new API route or integration
```

Commit when a logical unit of work is complete — not too small, not too large.
One feature, one fix, or one page per commit is a good rule of thumb.

---

## What NOT to Do

- Do NOT use Pages Router — App Router only
- Do NOT use `any` type in TypeScript — use proper types or `unknown`
- Do NOT call external APIs from client components directly — always via `/app/api/`
- Do NOT store API keys in client-side code or `.env` (only `.env.local`)
- Do NOT use Supabase or any database — localStorage only
- Do NOT add unnecessary dependencies — keep bundle lean
- Do NOT skip loading skeletons — every async section needs one
- Do NOT hardcode TMDB image paths — always use the `buildImageUrl()` util
- Do NOT call Gemini API without checking localStorage cache first
- Do NOT ignore TypeScript errors — fix them, never use `// @ts-ignore`

---

## Build & Deploy

```bash
# Development
npm run dev

# Type check
npm run type-check   # tsc --noEmit

# Build
npm run build

# Deploy — just push to main, Vercel auto-deploys
git push origin main
```

Vercel config: add all `.env.local` variables in Vercel dashboard → Project Settings → Environment Variables.


Github-
echo "# CineVerse" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/Siyam-Bhuiyan/CineVerse.git
git push -u origin main


## Vidking Player — Full Integration Spec

### Embed URLs
- Movie: `https://www.vidking.net/embed/movie/{tmdbId}?autoPlay=true&progress={seconds}`
- TV: `https://www.vidking.net/embed/tv/{tmdbId}/{season}/{episode}?autoPlay=true&nextEpisode=true&episodeSelector=true&progress={seconds}`

### postMessage Listener
The player communicates via window.postMessage. Always implement:
- Listen to window message events on VideoPlayer mount
- Parse event.data safely inside try/catch — never parse without it
- On `timeupdate` event → save currentTime to localStorage immediately
- On `ended` event → mark item as fully watched in history

### Progress Resume
- On player load → read saved progress from localStorage
- If progress exists → append `?progress={seconds}` to embed URL
- This makes Vidking start at the exact second the user left off

### Failure Detection & Auto Fallback
- Start a 6-second timer when player iframe loads
- If zero PLAYER_EVENT messages received within 6 seconds → player failed
- Automatically switch to next server in fallback chain:
  Vidking → vidsrc.icu → 2embed.cc
- Show a brief toast: "Switching to backup server..."
- Cancel the timer immediately on first successful message received

### Fallback Chain
1. Vidking (primary — lowest ads, progress tracking)
2. vidsrc.icu (fallback — reliable)
3. 2embed.cc (last resort)

## Component Rules
- All `'use client'` components go in their own file — never mix with server components
- Skeleton dimensions must match their content exactly (poster = aspect-ratio 2/3, hero = 16/9)
- All images use next/image with explicit width/height or fill + sizes
- Framer Motion variants defined at top of component, not inline

use the Cineverse logo.png attached