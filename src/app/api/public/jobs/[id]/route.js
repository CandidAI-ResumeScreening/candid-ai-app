// src/app/api/public/jobs/[id]/route.js
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Job from "@/models/Job";

export async function GET(request, context) {
  try {
    // Get ID from params - await the context.params
    const params = await context.params;
    const id = params.id;

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

    // Check if job is active and deadline hasn't passed
    const today = new Date();
    const deadline = new Date(job.deadline);

    if (job.status !== "active" || deadline < today) {
      return NextResponse.json(
        {
          success: false,
          message: "This job is no longer accepting applications",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, job }, { status: 200 });
  } catch (error) {
    console.error("Error getting job:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
