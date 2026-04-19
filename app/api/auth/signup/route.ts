import { NextResponse } from "next/server";

import { createSession, createUser, getCookieName } from "@/lib/auth-server";

export async function POST(request: Request) {
  const body = (await request.json()) as { username?: string; password?: string };
  const username = body.username?.trim() ?? "";
  const password = body.password ?? "";

  const creation = createUser(username, password);
  if (!creation.ok) {
    return NextResponse.json({ ok: false, error: creation.error }, { status: 400 });
  }

  const session = createSession(creation.user);
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
