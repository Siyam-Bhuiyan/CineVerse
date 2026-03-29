// TMDB image URL builder — never hardcode paths

type PosterSize = "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original";
type BackdropSize = "w300" | "w780" | "w1280" | "original";
type ProfileSize = "w45" | "w185" | "h632" | "original";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";
const PLACEHOLDER_POSTER = "/placeholder-poster.svg";
const PLACEHOLDER_BACKDROP = "/placeholder-backdrop.svg";
const PLACEHOLDER_PROFILE = "/placeholder-profile.svg";

/**
 * Build TMDB poster image URL
 */
export function buildImageUrl(
  path: string | null | undefined,
  size: PosterSize = "w342"
): string {
  if (!path) return PLACEHOLDER_POSTER;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

/**
 * Build TMDB backdrop image URL
 */
export function buildBackdropUrl(
  path: string | null | undefined,
  size: BackdropSize = "w1280"
): string {
  if (!path) return PLACEHOLDER_BACKDROP;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

/**
 * Build TMDB profile image URL
 */
export function buildProfileUrl(
  path: string | null | undefined,
  size: ProfileSize = "w185"
): string {
  if (!path) return PLACEHOLDER_PROFILE;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}
