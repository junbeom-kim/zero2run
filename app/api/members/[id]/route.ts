import { NextRequest, NextResponse } from "next/server";
import { getMemberById } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const member = await getMemberById(id);
    if (!member) {
      return NextResponse.json(
        { error: "회원을 찾을 수 없습니다" },
        { status: 404 }
      );
    }
    return NextResponse.json(member);
  } catch (error) {
    console.error("Failed to fetch member:", error);
    return NextResponse.json(
      { error: "Failed to fetch member" },
      { status: 500 }
    );
  }
}
