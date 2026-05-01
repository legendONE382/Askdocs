import { NextResponse } from "next/server";

import { createSession, getCookieName, validatePasswordStrength, validateUsername } from "@/lib/auth-server";

export async function POST(request: Request) {
  const body = (await request.json()) as { username?: string; password?: string };
  const username = body.username?.trim() ?? "";
  const password = body.password ?? "";

  if (!validateUsername(username)) {
    return NextResponse.json({ ok: false, error: "Username must be at least 3 characters." }, { status: 400 });
  }

  if (!validatePasswordStrength(password)) {
    return NextResponse.json(
      { ok: false, error: "Password must be at least 8 characters and include letters and numbers." },
      { status: 400 }
    );
  }

  const session = createSession({ username });
  const response = NextResponse.json({ ok: true, user: { username: session.username } }, { status: 201 });

  response.cookies.set(getCookieName(), session.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(session.expiresAt)
  });

  return response;
}
