// src/app/api/hr/update-applicant-scores/[id]/route.js
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import Job from "@/models/Job";
import Candidate from "@/models/Candidate";
import { scoreCandidate } from "@/lib/scoringModule";

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

// Update candidate scores for a job
export async function POST(request, context) {
  try {
    // Get job ID from params - await it to access properties
    const { id } = await context.params;

    // Get authenticated user
    const user = await getAuthFromRequest();

    // Connect to the database
    await connectToDatabase();

    // Find the job
    const job = await Job.findById(id);

    if (!job) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    // Check if the job belongs to the HR
    if (job.email !== user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    // Find all candidates for this job
    const candidates = await Candidate.find({ jobId: id });

    // If no candidates, return early
    if (candidates.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "No candidates to update",
          updatedCount: 0,
        },
        { status: 200 }
      );
    }

    // Keep track of updated candidates
    let updatedCount = 0;

    // Process each candidate
    for (const candidate of candidates) {
      // Calculate new score using scoring module
      const scoringResult = scoreCandidate(candidate, job);

      // Update candidate with new score and threshold
      candidate.score = scoringResult.overallScore;
      candidate.thresholdPass = scoringResult.thresholdPassed;

      // Save the updated candidate
      await candidate.save();
      updatedCount++;
    }

    return NextResponse.json(
      {
        success: true,
        message: `Updated scores for ${updatedCount} candidates.`,
        updatedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating candidate scores:", error);

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
