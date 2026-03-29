// Trace.moe API — server-side, no API key needed

export interface TraceMoeResult {
  anilistId: number;
  filename: string;
  episode: number | null;
  from: number;
  to: number;
  similarity: number;
  video: string;
  image: string;
}

interface TraceMoeResponse {
  result: {
    anilist: number;
    filename: string;
    episode: number | null;
    from: number;
    to: number;
    similarity: number;
    video: string;
    image: string;
  }[];
}

export async function searchByScreenshot(
  imageUrl: string
): Promise<TraceMoeResult[]> {
  try {
    const res = await fetch(
      `https://api.trace.moe/search?url=${encodeURIComponent(imageUrl)}`
    );

    if (!res.ok) return [];

    const data = (await res.json()) as TraceMoeResponse;
    return data.result.slice(0, 5).map((r) => ({
      anilistId: r.anilist,
      filename: r.filename,
      episode: r.episode,
      from: r.from,
      to: r.to,
      similarity: r.similarity,
      video: r.video,
      image: r.image,
    }));
  } catch {
    return [];
  }
}
