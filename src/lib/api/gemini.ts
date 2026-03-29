// Google Gemini AI — server-side only, API route only
import type { WatchHistoryItem } from "@/types/storage";
import type { AISuggestionItem } from "@/types/storage";

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  return key;
}

export async function getAISuggestions(
  watchHistory: WatchHistoryItem[]
): Promise<AISuggestionItem[]> {
  const apiKey = getApiKey();

  // Build a concise prompt from watch history (max 200 tokens input)
  const recentItems = watchHistory.slice(0, 10);
  const historyText = recentItems
    .map((item) => `${item.title} (${item.type}, genres: ${item.genres.join(", ")})`)
    .join("; ");

  const prompt = `Based on this watch history: ${historyText}

Recommend exactly 6 movies or TV shows. Return ONLY a JSON array with this exact format, no other text:
[{"id": <tmdb_id>, "title": "<title>", "type": "<movie or tv>", "reason": "<short reason>"}]`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512,
          },
        }),
      }
    );

    if (!res.ok) {
      console.error("Gemini API error:", res.status);
      return [];
    }

    const data = (await res.json()) as {
      candidates?: {
        content?: {
          parts?: { text?: string }[];
        };
      }[];
    };

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return [];

    // Extract JSON array from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const parsed = JSON.parse(jsonMatch[0]) as AISuggestionItem[];
    return parsed.slice(0, 6);
  } catch {
    return [];
  }
}
