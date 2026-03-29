import { NextRequest } from "next/server";
import { searchAnime } from "@/lib/api/anilist";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  if (!query) {
    return Response.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  try {
    const data = await searchAnime(query, page);
    return Response.json(data);
  } catch (error) {
    console.error("AniList search error:", error);
    return Response.json({ error: "Failed to search anime" }, { status: 500 });
  }
}
