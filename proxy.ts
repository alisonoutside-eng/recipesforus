import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, computeSessionToken } from "@/lib/session";

const PUBLIC_PATHS = ["/login", "/manifest.webmanifest"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith("/api/login") ||
    pathname.startsWith("/icons")
  ) {
    return NextResponse.next();
  }

  const secret = process.env.SESSION_SECRET;
  const expectedToken = secret ? await computeSessionToken(secret) : null;
  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (expectedToken && cookie === expectedToken) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
