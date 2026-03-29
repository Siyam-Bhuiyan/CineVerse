// YouTube Data API v3 — server-side only

export interface YouTubeTrailer {
  videoId: string;
  title: string;
  thumbnail: string;
}

interface YouTubeSearchResponse {
  items: {
    id: { videoId: string };
    snippet: {
      title: string;
      thumbnails: {
        high: { url: string };
      };
    };
  }[];
}

function getApiKey(): string {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error("YOUTUBE_API_KEY is not set");
  return key;
}

export async function searchTrailer(query: string): Promise<YouTubeTrailer | null> {
  try {
    const params = new URLSearchParams({
      part: "snippet",
      q: `${query} official trailer`,
      type: "video",
      maxResults: "1",
      key: getApiKey(),
    });

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params.toString()}`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) return null;

    const data = (await res.json()) as YouTubeSearchResponse;
    const item = data.items[0];
    if (!item) return null;

    return {
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
    };
  } catch {
    return null;
  }
}
