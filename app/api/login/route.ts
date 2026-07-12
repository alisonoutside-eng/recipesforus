import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, computeSessionToken } from "@/lib/session";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const passcode = String(formData.get("passcode") ?? "");
  const next = String(formData.get("next") ?? "/");
  const safeNext = next.startsWith("/") ? next : "/";

  if (!process.env.FAMILY_PASSCODE || passcode !== process.env.FAMILY_PASSCODE) {
    const url = new URL("/login", request.url);
    url.searchParams.set("error", "1");
    url.searchParams.set("next", safeNext);
    return NextResponse.redirect(url, { status: 303 });
  }

  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Server is not configured for login" },
      { status: 500 }
    );
  }

  const token = await computeSessionToken(secret);
  const response = NextResponse.redirect(new URL(safeNext, request.url), {
    status: 303,
  });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return response;
}
