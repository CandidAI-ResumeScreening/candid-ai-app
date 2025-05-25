// src/app/api/hr/update-candidate/[id]/route.js
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
  // Get token from cookies
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

// Update candidate details
export async function PATCH(request, context) {
  try {
    // Get ID from params
    const { id } = await context.params;

    // Get authenticated user
    const user = await getAuthFromRequest();

    // Get updated candidate data from request
    const updatedData = await request.json();

    // Connect to the database
    await connectToDatabase();

    // Find the candidate
    const candidate = await Candidate.findById(id);

    if (!candidate) {
      return NextResponse.json(
        { success: false, message: "Candidate not found" },
        { status: 404 }
      );
    }

    // Check if the candidate belongs to the HR's email
    if (candidate.hr_email !== user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    // Fields that can be updated
    const editableFields = [
      "Name",
      "Email",
      "Phone",
      "Experience level",
      "Total Estimated Years of Experience",
      "Education Details",
      "Skills",
      "score",
    ];

    // Update allowed fields only
    editableFields.forEach((field) => {
      if (updatedData[field] !== undefined) {
        candidate[field] = updatedData[field];
      }
    });

    // Update thresholdPass based on score
    candidate.thresholdPass = candidate.score >= 50;

    // Save updated candidate
    await candidate.save();

    return NextResponse.json(
      {
        success: true,
        message: "Candidate updated successfully",
        candidate,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating candidate:", error);

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
