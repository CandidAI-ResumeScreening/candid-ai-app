// src/middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedPaths = ["/dashboard"];
  const isProtectedPath = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // Auth routes (login, signup)
  const authPaths = ["/auth/login", "/auth/signup"];
  const isAuthPath = authPaths.some((path) => pathname === path);

  // If trying to access protected route without token, redirect to login
  if (isProtectedPath && !token) {
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // If trying to access auth routes with token, redirect to dashboard
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/login", "/auth/signup"],
};
