// Fanart.tv API — server-side only

interface FanartMovieResponse {
  hdmovielogo?: { url: string; lang: string }[];
  movielogo?: { url: string; lang: string }[];
  moviebackground?: { url: string; lang: string }[];
  hdmovieclearart?: { url: string; lang: string }[];
  [key: string]: unknown;
}

interface FanartTVResponse {
  hdtvlogo?: { url: string; lang: string }[];
  tvlogo?: { url: string; lang: string }[];
  showbackground?: { url: string; lang: string }[];
  hdclearart?: { url: string; lang: string }[];
  [key: string]: unknown;
}

export interface FanartImages {
  logo: string | null;
  background: string | null;
  clearart: string | null;
}

const BASE_URL = "https://webservice.fanart.tv/v3";

function getApiKey(): string {
  const key = process.env.FANART_API_KEY;
  if (!key) throw new Error("FANART_API_KEY is not set");
  return key;
}

function pickBest(items: { url: string; lang: string }[] | undefined, preferLang: string = "en"): string | null {
  if (!items || items.length === 0) return null;
  const preferred = items.find((i) => i.lang === preferLang);
  return preferred ? preferred.url : items[0].url;
}

export async function getMovieImages(tmdbId: number): Promise<FanartImages> {
  try {
    const res = await fetch(`${BASE_URL}/movies/${tmdbId}?api_key=${getApiKey()}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return { logo: null, background: null, clearart: null };
    const data = (await res.json()) as FanartMovieResponse;
    return {
      logo: pickBest(data.hdmovielogo) ?? pickBest(data.movielogo),
      background: pickBest(data.moviebackground),
      clearart: pickBest(data.hdmovieclearart),
    };
  } catch {
    return { logo: null, background: null, clearart: null };
  }
}

export async function getTVImages(tvdbId: number): Promise<FanartImages> {
  try {
    const res = await fetch(`${BASE_URL}/tv/${tvdbId}?api_key=${getApiKey()}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return { logo: null, background: null, clearart: null };
    const data = (await res.json()) as FanartTVResponse;
    return {
      logo: pickBest(data.hdtvlogo) ?? pickBest(data.tvlogo),
      background: pickBest(data.showbackground),
      clearart: pickBest(data.hdclearart),
    };
  } catch {
    return { logo: null, background: null, clearart: null };
  }
}
