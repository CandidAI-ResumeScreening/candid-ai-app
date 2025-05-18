// src/app/api/hr/application-status/[id]/route.js
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

// Update application status
export async function PATCH(request, context) {
  try {
    // Get ID from params
    const { id } = await context.params;

    // Get authenticated user
    const user = await getAuthFromRequest();

    // Get data from request
    const { status } = await request.json();

    if (
      !status ||
      !["applied", "reviewing", "interviewed", "selected", "rejected"].includes(
        status
      )
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Find the application
    const application = await Candidate.findById(id);

    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }

    // Check if the application belongs to the HR
    if (application.hr_email !== user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    // Update the application status
    application.status = status;
    await application.save();

    return NextResponse.json(
      {
        success: true,
        message: "Application status updated successfully",
        application,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating application status:", error);

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
