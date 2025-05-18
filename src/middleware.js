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

  // Public paths that don't need the auth check
  const publicPaths = ["/applyjobs", "/api/public", "/api/parse"];
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // Skip middleware for API routes except auth-related ones
  // This allows /api/public paths to work without auth
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/hr/")) {
    return NextResponse.next();
  }

  // Allow public paths without authentication
  if (isPublicPath) {
    return NextResponse.next();
  }

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
  matcher: [
    "/dashboard/:path*",
    "/auth/login",
    "/auth/signup",
    "/applyjobs/:path*",
    "/api/:path*",
  ],
};
