import { NextRequest } from "next/server";
import { getTrending } from "@/lib/api/tmdb";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = (searchParams.get("type") ?? "all") as "movie" | "tv" | "all";
  const timeWindow = (searchParams.get("timeWindow") ?? "week") as "day" | "week";

  try {
    const data = await getTrending(type, timeWindow);
    return Response.json(data);
  } catch (error) {
    console.error("TMDB trending error:", error);
    return Response.json({ error: "Failed to fetch trending" }, { status: 500 });
  }
}
