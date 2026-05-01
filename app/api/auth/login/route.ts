import { NextResponse } from "next/server";

import { createSession, getCookieName, validatePasswordStrength, validateUsername } from "@/lib/auth-server";

export async function POST(request: Request) {
  const body = (await request.json()) as { username?: string; password?: string };
  const username = body.username?.trim() ?? "";
  const password = body.password ?? "";

  if (!validateUsername(username) || !validatePasswordStrength(password)) {
    return NextResponse.json(
      { ok: false, error: "Enter a valid username and password to continue." },
      { status: 400 }
    );
  }

  const session = createSession({ username });
  const response = NextResponse.json({ ok: true, user: { username: session.username } });

  response.cookies.set(getCookieName(), session.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(session.expiresAt)
  });

  return response;
}
