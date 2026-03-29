import { NextRequest } from "next/server";
import { searchSubtitles } from "@/lib/api/subtitles";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const imdbId = searchParams.get("imdbId");
  const language = searchParams.get("language") ?? undefined;

  if (!imdbId) {
    return Response.json({ error: "imdbId parameter is required" }, { status: 400 });
  }

  try {
    const results = await searchSubtitles(imdbId, language);
    return Response.json({ results });
  } catch (error) {
    console.error("Subtitle search error:", error);
    return Response.json({ error: "Failed to search subtitles" }, { status: 500 });
  }
}
