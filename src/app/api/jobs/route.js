// src/app/api/jobs/route.js
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import Job from "@/models/Job";

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

// Create a new job
export async function POST(request) {
  try {
    // Get authenticated user
    const user = await getAuthFromRequest();

    // Get job data from request
    const jobData = await request.json();

    // Connect to the database
    await connectToDatabase();

    // Create the job
    const job = new Job({
      ...jobData,
      createdBy: user._id,
      email: user.email,
      status: "active", // Ensure status is set to active by default
    });

    await job.save();

    return NextResponse.json({ success: true, job }, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);

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

// Get all jobs
export async function GET() {
  try {
    // Get authenticated user
    const user = await getAuthFromRequest();

    // Connect to the database
    await connectToDatabase();

    // Get all jobs created by the user's email
    // If email field doesn't exist, fall back to createdBy for backward compatibility
    const jobs = await Job.find({
      $or: [{ email: user.email }, { createdBy: user._id }],
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, jobs }, { status: 200 });
  } catch (error) {
    console.error("Error getting jobs:", error);

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
