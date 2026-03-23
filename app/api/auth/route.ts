import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { crewName, password } = await req.json();

  const validName = process.env.CREW_NAME;
  const validPassword = process.env.CREW_PASSWORD;

  if (!validName || !validPassword) {
    return NextResponse.json(
      { error: "크루 인증이 설정되지 않았습니다" },
      { status: 500 }
    );
  }

  if (crewName.trim() === validName && password.trim() === validPassword) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json(
    { error: "크루명 또는 비밀번호가 올바르지 않습니다" },
    { status: 401 }
  );
}
