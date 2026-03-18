import { NextRequest, NextResponse } from "next/server";
import { getRecords, addRecords } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId") || undefined;
    const month = searchParams.get("month") || undefined;

    const records = await getRecords(memberId, month);
    return NextResponse.json(records);
  } catch (error) {
    console.error("Failed to fetch records:", error);
    return NextResponse.json(
      { error: "Failed to fetch records" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { records: entries } = await request.json();

    if (!Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json(
        { error: "기록을 입력해주세요" },
        { status: 400 }
      );
    }

    for (const entry of entries) {
      if (!entry.member_id || !entry.date || !entry.distance_km) {
        return NextResponse.json(
          { error: "날짜와 거리는 필수입니다" },
          { status: 400 }
        );
      }
      if (typeof entry.distance_km !== "number" || entry.distance_km <= 0) {
        return NextResponse.json(
          { error: "거리는 0보다 커야 합니다" },
          { status: 400 }
        );
      }
    }

    const records = await addRecords(entries);
    return NextResponse.json(records, { status: 201 });
  } catch (error) {
    console.error("Failed to add records:", error);
    return NextResponse.json(
      { error: "Failed to add records" },
      { status: 500 }
    );
  }
}
