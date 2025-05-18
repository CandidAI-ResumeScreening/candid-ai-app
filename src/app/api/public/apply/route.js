// src/app/api/public/apply/route.js
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { scoreCandidate } from "@/lib/scoringModule";
import Job from "@/models/Job";
import Candidate from "@/models/Candidate";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const jobId = formData.get("jobId");
    const resume = formData.get("resume");
    const parsedData = JSON.parse(formData.get("parsedData"));

    if (!jobId || !resume || !parsedData) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Get job details
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    // Check if job is still active and deadline hasn't passed
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

    // Score the candidate
    const scoringResult = scoreCandidate(parsedData, job);

    // Save the resume file
    const bytes = await resume.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Create unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}-${resume.name.replace(/\s+/g, "_")}`;
    const filePath = path.join(uploadsDir, fileName);

    // Write file
    await writeFile(filePath, buffer);
    const fileLocation = `/uploads/${fileName}`;

    // Create candidate in database
    const candidate = new Candidate({
      // Add all parsed resume data fields
      ...parsedData,
      // Job related fields
      jobId: job._id,
      jobTitle: job.title,
      hr_email: job.email,
      // Application details
      score: scoringResult.overallScore,
      thresholdPass: scoringResult.thresholdPassed,
      status: "applied",
      // Resume file info
      resumeFileName: resume.name,
      resumeFileLocation: fileLocation,
    });

    await candidate.save();

    // Increment the applications count for the job
    job.applications = (job.applications || 0) + 1;
    await job.save();

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        score: scoringResult.overallScore,
        thresholdPass: scoringResult.thresholdPassed,
        grade: scoringResult.grade,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
