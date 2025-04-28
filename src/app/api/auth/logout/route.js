// src/app/api/auth/logout/route.js
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Clear the cookie
    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );

    // Remove the token cookie
    response.cookies.delete("token");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
