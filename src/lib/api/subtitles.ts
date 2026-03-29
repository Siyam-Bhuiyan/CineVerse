// OpenSubtitles API — server-side only

export interface SubtitleResult {
  id: string;
  language: string;
  release: string;
  url: string;
  downloadCount: number;
}

interface OSResponse {
  total_count: number;
  data: {
    id: string;
    attributes: {
      language: string;
      release: string;
      download_count: number;
      files: { file_id: number; file_name: string }[];
      url: string;
    };
  }[];
}

function getApiKey(): string {
  const key = process.env.OPENSUBTITLES_API_KEY;
  if (!key) throw new Error("OPENSUBTITLES_API_KEY is not set");
  return key;
}

export async function searchSubtitles(
  imdbId: string,
  language?: string
): Promise<SubtitleResult[]> {
  try {
    const params = new URLSearchParams({ imdb_id: imdbId });
    if (language) params.set("languages", language);

    const res = await fetch(
      `https://api.opensubtitles.com/api/v1/subtitles?${params.toString()}`,
      {
        headers: {
          "Api-Key": getApiKey(),
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) return [];

    const data = (await res.json()) as OSResponse;
    return data.data.map((item) => ({
      id: item.id,
      language: item.attributes.language,
      release: item.attributes.release,
      url: item.attributes.url,
      downloadCount: item.attributes.download_count,
    }));
  } catch {
    return [];
  }
}
