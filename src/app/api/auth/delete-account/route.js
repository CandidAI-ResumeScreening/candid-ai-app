// src/app/api/auth/delete-account/route.js
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getAuthFromRequest } from "@/lib/auth"; // Import centralized auth
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Job from "@/models/Job";
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
// const getAuthFromRequest = async () => {
//   // Get token from cookies
//   const headersList = await headers();
//   const cookie = headersList.get("cookie") || "";
//   const tokenMatch = cookie.match(/token=([^;]+)/);

//   if (!tokenMatch) {
//     throw new Error("Not authenticated");
//   }

//   const token = tokenMatch[1];

//   // Get user from token
//   const user = await getUserFromToken(token);
//   return user;
// };

export async function DELETE(request) {
  try {
    // Get authenticated user
    const user = await getAuthFromRequest();

    // Connect to database
    await connectToDatabase();

    // 1. Delete all jobs associated with this user
    const jobs = await Job.find({
      $or: [{ email: user.email }, { createdBy: user._id }],
    });

    // Get job IDs to find and delete related candidates
    const jobIds = jobs.map((job) => job._id);

    // 2. Delete all candidates associated with this user's jobs
    if (jobIds.length > 0) {
      await Candidate.deleteMany({ jobId: { $in: jobIds } });
    }

    // 3. Delete all jobs
    await Job.deleteMany({
      $or: [{ email: user.email }, { createdBy: user._id }],
    });

    // 4. Finally, delete the user
    await User.findByIdAndDelete(user._id);

    // Clear the auth cookie
    const response = NextResponse.json(
      { success: true, message: "Account deleted successfully" },
      { status: 200 }
    );

    // Remove the token cookie
    response.cookies.delete("token");

    return response;
  } catch (error) {
    console.error("Account deletion error:", error);

    if (error.message === "Not authenticated") {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
