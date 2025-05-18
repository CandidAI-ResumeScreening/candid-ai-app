// src/app/api/hr/all-applications/route.js
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import Candidate from "@/models/Candidate";
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

export async function GET(request) {
  try {
    // Get authenticated user
    const user = await getAuthFromRequest();

    // Connect to the database
    await connectToDatabase();

    // Get search params
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId"); // Optional job ID filter
    const sort = searchParams.get("sort") || "newest"; // Sort order

    // Base query - all applications for HR's email
    const query = { hr_email: user.email };

    // Add job filter if provided
    if (jobId) {
      query.jobId = jobId;
    }

    // Determine sort order
    const sortOptions = {};
    if (sort === "newest") {
      sortOptions.appliedAt = -1;
    } else if (sort === "oldest") {
      sortOptions.appliedAt = 1;
    } else if (sort === "highest-score") {
      sortOptions.score = -1;
    } else if (sort === "lowest-score") {
      sortOptions.score = 1;
    }

    // Get all applications matching the query
    const applications = await Candidate.find(query).sort(sortOptions);

    // Get all job IDs from the applications
    const jobIds = [...new Set(applications.map((app) => app.jobId))];

    // Fetch jobs in one query for efficiency
    const jobs = await Job.find({ _id: { $in: jobIds } });

    // Create a map of job IDs to job titles for easy lookup
    const jobTitlesMap = {};
    jobs.forEach((job) => {
      jobTitlesMap[job._id.toString()] = job.title;
    });

    return NextResponse.json(
      {
        success: true,
        applications,
        jobTitlesMap,
        total: applications.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting applications:", error);

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
