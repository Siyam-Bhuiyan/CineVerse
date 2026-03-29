import { NextRequest } from "next/server";
import { getAISuggestions } from "@/lib/api/gemini";
import type { WatchHistoryItem } from "@/types/storage";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { history: WatchHistoryItem[] };

    if (!body.history || !Array.isArray(body.history) || body.history.length === 0) {
      return Response.json(
        { error: "Watch history is required" },
        { status: 400 }
      );
    }

    const suggestions = await getAISuggestions(body.history);
    return Response.json({ suggestions });
  } catch (error) {
    console.error("AI suggestions error:", error);
    return Response.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
