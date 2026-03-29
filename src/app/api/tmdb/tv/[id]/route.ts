import { getTVDetail } from "@/lib/api/tmdb";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const tvId = parseInt(id, 10);
  if (isNaN(tvId)) {
    return Response.json({ error: "Invalid TV ID" }, { status: 400 });
  }

  try {
    const data = await getTVDetail(tvId);
    return Response.json(data);
  } catch (error) {
    console.error("TMDB TV detail error:", error);
    return Response.json({ error: "Failed to fetch TV show" }, { status: 500 });
  }
}
