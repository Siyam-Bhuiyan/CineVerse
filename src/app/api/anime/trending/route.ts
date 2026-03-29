import { NextRequest } from "next/server";
import { getTrendingAnime } from "@/lib/api/anilist";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const perPage = parseInt(searchParams.get("perPage") ?? "20", 10);

  try {
    const data = await getTrendingAnime(page, perPage);
    return Response.json(data);
  } catch (error) {
    console.error("AniList trending error:", error);
    return Response.json({ error: "Failed to fetch trending anime" }, { status: 500 });
  }
}
