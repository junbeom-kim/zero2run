import { NextRequest, NextResponse } from "next/server";
import { getMonthlyStats } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const month = request.nextUrl.searchParams.get("month") || undefined;
    const stats = await getMonthlyStats(month);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
