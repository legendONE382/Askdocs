import { NextResponse } from "next/server";

import { getCookieName, revokeSession } from "@/lib/auth-server";

export async function POST(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const sessionToken = cookieHeader
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${getCookieName()}=`))
    ?.split("=")[1];

  revokeSession(sessionToken);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(getCookieName(), "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0)
  });

  return response;
}
