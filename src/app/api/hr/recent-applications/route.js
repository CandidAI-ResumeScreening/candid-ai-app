// src/app/api/hr/recent-applications/route.js
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import Candidate from "@/models/Candidate";

// Get user from JWT token
const getUserFromToken = async (token) => {
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error getting user from token:", error);
    throw new Error("Invalid or expired token");
  }
};

// Helper to get authentication from request
const getAuthFromRequest = async () => {
  // Get token from cookies - make it awaitable
  const headersList = await headers();
  const cookie = headersList.get("cookie") || "";
  const tokenMatch = cookie.match(/token=([^;]+)/);

  if (!tokenMatch) {
    throw new Error("Not authenticated");
  }

  const token = tokenMatch[1];

  // Get user from token
  const user = await getUserFromToken(token);
  return user;
};

export async function GET(request) {
  try {
    // Get authenticated user
    const user = await getAuthFromRequest();

    // Connect to the database
    await connectToDatabase();

    // Get search params for limit
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "5");

    // Get recent applications
    const recentApplications = await Candidate.find({
      hr_email: user.email,
    })
      .sort({ appliedAt: -1 })
      .limit(limit);

    return NextResponse.json(
      {
        success: true,
        applications: recentApplications,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting recent applications:", error);

    if (error.message === "Not authenticated") {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
