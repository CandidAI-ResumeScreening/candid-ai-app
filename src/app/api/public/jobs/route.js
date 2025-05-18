// src/app/api/public/jobs/route.js
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Job from "@/models/Job";

export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase();

    // Get current date for deadline filtering
    const today = new Date();

    // Get all active jobs with deadline in the future
    const jobs = await Job.find({
      status: "active",
      deadline: { $gt: today },
    }).sort({ deadline: 1 }); // Sort by closest deadline first

    return NextResponse.json({ success: true, jobs }, { status: 200 });
  } catch (error) {
    console.error("Error getting public jobs:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
