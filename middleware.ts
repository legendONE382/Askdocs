import { NextResponse, type NextRequest } from "next/server";

import { getCookieName, verifySessionToken } from "@/lib/auth-server";

function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get(getCookieName())?.value;
  const session = verifySessionToken(token);
  return session.valid;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const loggedIn = isAuthenticated(request);

  if (pathname.startsWith("/workspace") && !loggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("reason", "session-expired");
    return NextResponse.redirect(loginUrl);
  }

  if ((pathname.startsWith("/login") || pathname.startsWith("/signup")) && loggedIn) {
    return NextResponse.redirect(new URL("/workspace", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/workspace/:path*", "/login", "/signup"]
};
