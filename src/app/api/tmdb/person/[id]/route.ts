import { getPersonDetail, getPersonCredits } from "@/lib/api/tmdb";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const personId = parseInt(id, 10);
  if (isNaN(personId)) {
    return Response.json({ error: "Invalid person ID" }, { status: 400 });
  }

  try {
    const [detail, credits] = await Promise.all([
      getPersonDetail(personId),
      getPersonCredits(personId),
    ]);
    return Response.json({ ...detail, credits });
  } catch (error) {
    console.error("TMDB person error:", error);
    return Response.json({ error: "Failed to fetch person" }, { status: 500 });
  }
}
