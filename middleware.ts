import { NextResponse, type NextRequest } from "next/server";

import { getCookieName, verifySessionToken } from "@/lib/auth";

const PUBLIC_PATHS = new Set(["/login", "/api/auth/login", "/api/auth/logout"]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public") ||
    PUBLIC_PATHS.has(pathname)
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(getCookieName())?.value;
  const session = await verifySessionToken(token);

  if (pathname === "/login" && session.valid) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!session.valid) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("next", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/api/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"]
};