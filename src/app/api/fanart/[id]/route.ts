import { NextRequest } from "next/server";
import { getMovieImages, getTVImages } from "@/lib/api/fanart";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  const type = request.nextUrl.searchParams.get("type") ?? "movie";

  try {
    const images =
      type === "tv" ? await getTVImages(numId) : await getMovieImages(numId);
    return Response.json(images);
  } catch (error) {
    console.error("Fanart error:", error);
    return Response.json({ error: "Failed to fetch fanart" }, { status: 500 });
  }
}
