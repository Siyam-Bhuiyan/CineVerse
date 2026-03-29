// OMDb API — server-side only, for IMDb & RT ratings

export interface OMDBRatings {
  imdbRating: string | null;
  imdbVotes: string | null;
  rottenTomatoes: string | null;
  metascore: string | null;
}

interface OMDBResponse {
  Response: string;
  imdbRating?: string;
  imdbVotes?: string;
  Metascore?: string;
  Ratings?: { Source: string; Value: string }[];
  [key: string]: unknown;
}

function getApiKey(): string {
  const key = process.env.OMDB_API_KEY;
  if (!key) throw new Error("OMDB_API_KEY is not set");
  return key;
}

export async function getOMDBRatings(imdbId: string): Promise<OMDBRatings> {
  try {
    const res = await fetch(
      `https://www.omdbapi.com/?i=${imdbId}&apikey=${getApiKey()}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return { imdbRating: null, imdbVotes: null, rottenTomatoes: null, metascore: null };

    const data = (await res.json()) as OMDBResponse;
    if (data.Response === "False") {
      return { imdbRating: null, imdbVotes: null, rottenTomatoes: null, metascore: null };
    }

    const rtRating = data.Ratings?.find((r) => r.Source === "Rotten Tomatoes");

    return {
      imdbRating: data.imdbRating && data.imdbRating !== "N/A" ? data.imdbRating : null,
      imdbVotes: data.imdbVotes && data.imdbVotes !== "N/A" ? data.imdbVotes : null,
      rottenTomatoes: rtRating ? rtRating.Value : null,
      metascore: data.Metascore && data.Metascore !== "N/A" ? data.Metascore : null,
    };
  } catch {
    return { imdbRating: null, imdbVotes: null, rottenTomatoes: null, metascore: null };
  }
}
