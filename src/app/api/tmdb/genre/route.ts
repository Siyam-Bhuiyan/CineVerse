import { NextRequest } from "next/server";
import { discoverByGenre, getGenreList } from "@/lib/api/tmdb";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = (searchParams.get("type") ?? "movie") as "movie" | "tv";
  const genreId = searchParams.get("genreId");
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  try {
    // If no genreId, return genre list
    if (!genreId) {
      const data = await getGenreList(type);
      return Response.json(data);
    }

    const data = await discoverByGenre(type, parseInt(genreId, 10), page);
    return Response.json(data);
  } catch (error) {
    console.error("TMDB genre error:", error);
    return Response.json({ error: "Failed to fetch genre data" }, { status: 500 });
  }
}
