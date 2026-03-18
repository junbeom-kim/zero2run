import { NextRequest, NextResponse } from "next/server";
import { getMembers, addMember } from "@/lib/supabase";

export async function GET() {
  try {
    const members = await getMembers();
    return NextResponse.json(members);
  } catch (error) {
    console.error("Failed to fetch members:", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, password } = await request.json();

    if (!password || password.trim() !== process.env.ADMIN_PASSWORD?.trim()) {
      return NextResponse.json(
        { error: "비밀번호가 올바르지 않습니다" },
        { status: 401 }
      );
    }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "이름을 입력해주세요" },
        { status: 400 }
      );
    }

    const existing = await getMembers();
    if (existing.some((m) => m.name === name.trim())) {
      return NextResponse.json(
        { error: "이미 등록된 이름입니다" },
        { status: 409 }
      );
    }

    const member = await addMember(name.trim());
    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error("Failed to add member:", error);
    return NextResponse.json(
      { error: "Failed to add member" },
      { status: 500 }
    );
  }
}
