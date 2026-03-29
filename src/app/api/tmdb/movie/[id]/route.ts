import { getMovieDetail } from "@/lib/api/tmdb";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  if (isNaN(movieId)) {
    return Response.json({ error: "Invalid movie ID" }, { status: 400 });
  }

  try {
    const data = await getMovieDetail(movieId);
    return Response.json(data);
  } catch (error) {
    console.error("TMDB movie detail error:", error);
    return Response.json({ error: "Failed to fetch movie" }, { status: 500 });
  }
}
