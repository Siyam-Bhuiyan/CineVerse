import { searchTrailer } from "@/lib/api/youtube";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const trailer = await searchTrailer(id);
    return Response.json({ trailer });
  } catch (error) {
    console.error("Trailer search error:", error);
    return Response.json({ error: "Failed to find trailer" }, { status: 500 });
  }
}
