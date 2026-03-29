import { NextRequest } from "next/server";
import { searchMulti, searchMovies, searchTV } from "@/lib/api/tmdb";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const type = searchParams.get("type"); // "movie" | "tv" | null (multi)

  if (!query) {
    return Response.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  try {
    if (type === "movie") {
      const data = await searchMovies(query, page);
      return Response.json(data);
    }
    if (type === "tv") {
      const data = await searchTV(query, page);
      return Response.json(data);
    }
    const data = await searchMulti(query, page);
    return Response.json(data);
  } catch (error) {
    console.error("TMDB search error:", error);
    return Response.json({ error: "Failed to search" }, { status: 500 });
  }
}
