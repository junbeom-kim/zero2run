import { NextResponse } from "next/server";
import { getMonthlyStats } from "@/lib/supabase";

export async function GET() {
  try {
    const stats = await getMonthlyStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
