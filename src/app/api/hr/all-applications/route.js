// src/app/api/hr/all-applications/route.js
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { getAuthFromRequest } from "@/lib/auth"; // Import centralized auth
import Candidate from "@/models/Candidate";
import Job from "@/models/Job";

// Remove these - they're now in /lib/auth.js:
// - getUserFromToken function
// - getAuthFromRequest function
// - jwt import
// - User import
// - headers import

export async function GET(request) {
  try {
    // Get authenticated user using centralized helper
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
