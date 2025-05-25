// src/app/api/hr/recent-applications/route.js
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { getAuthFromRequest } from "@/lib/auth"; // Import centralized auth
import Candidate from "@/models/Candidate";

// Remove the duplicate getUserFromToken and getAuthFromRequest functions that were here before

export async function GET(request) {
  try {
    // Get authenticated user using centralized helper
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

    if (
      error.message === "Not authenticated" ||
      error.message === "Invalid or expired token"
    ) {
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
