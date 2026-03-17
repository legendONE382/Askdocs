import { NextResponse } from "next/server";

import { createSessionToken, getCookieName, getCredentials, getSessionTtl } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`login:${ip}`, 10, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: `Too many attempts. Retry in ${rate.retryAfterSeconds}s.` }, { status: 429 });
  }

  let body: { username?: string; password?: string };
  try {
    body = (await request.json()) as { username?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  try {
    const username = body.username?.trim() || "";
    const password = body.password || "";

    const valid = getCredentials();
    if (username !== valid.username || password !== valid.password) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: getCookieName(),
      value: await createSessionToken(username),
      maxAge: getSessionTtl(),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/"
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Server authentication configuration is invalid." }, { status: 500 });
  }
}
