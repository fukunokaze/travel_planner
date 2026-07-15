import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE } from "./lib/auth-constants";
import { isJwtExpired } from "./lib/jwt";

const PUBLIC_PATHS = ["/login"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const hasValidToken = Boolean(token) && !isJwtExpired(token!);
  const isGoogleCallback = pathname === "/" && (searchParams.has("code") || searchParams.has("error"));

  if (!hasValidToken && !isPublicPath(pathname) && !isGoogleCallback) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    if (token) {
      response.cookies.delete(ACCESS_TOKEN_COOKIE);
    }
    return response;
  }

  if (hasValidToken && isPublicPath(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
