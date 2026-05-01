import { NextResponse } from "next/server";

import { getCookieName, verifySessionToken } from "@/lib/auth-server";

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const sessionToken = cookieHeader
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${getCookieName()}=`))
    ?.split("=")[1];

  const session = verifySessionToken(sessionToken);
  if (!session.valid) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json({ ok: true, user: session.session });
}
