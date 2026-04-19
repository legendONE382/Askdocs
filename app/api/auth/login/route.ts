import { NextResponse } from "next/server";

import { createSession, getCookieName, verifyCredentials } from "@/lib/auth-server";

export async function POST(request: Request) {
  const body = (await request.json()) as { username?: string; password?: string };
  const username = body.username?.trim() ?? "";
  const password = body.password ?? "";

  const user = verifyCredentials(username, password);
  if (!user) {
    return NextResponse.json({ ok: false, error: "Invalid username or password." }, { status: 401 });
  }

  const session = createSession(user);
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
