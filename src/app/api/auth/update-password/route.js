// src/app/api/auth/update-password/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { getAuthFromRequest } from "@/lib/auth"; // Import centralized auth
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

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

export async function PATCH(request) {
  try {
    // Get authenticated user
    const user = await getAuthFromRequest();

    // Get password data from request
    const { currentPassword, newPassword } = await request.json();

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Current password and new password are required",
        },
        { status: 400 }
      );
    }

    // Check if new password is at least 8 characters
    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "New password must be at least 8 characters long",
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json(
      { success: true, message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password update error:", error);

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
