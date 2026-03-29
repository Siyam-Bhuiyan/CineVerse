import { getAnimeDetail } from "@/lib/api/anilist";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const animeId = parseInt(id, 10);
  if (isNaN(animeId)) {
    return Response.json({ error: "Invalid anime ID" }, { status: 400 });
  }

  try {
    const data = await getAnimeDetail(animeId);
    return Response.json(data);
  } catch (error) {
    console.error("AniList detail error:", error);
    return Response.json({ error: "Failed to fetch anime" }, { status: 500 });
  }
}
