// src/app/api/auth/login/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Connect to the database
    await connectToDatabase();

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 400 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 400 }
      );
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Return user data without password
    const userWithoutPassword = {
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    };

    return NextResponse.json(
      {
        success: true,
        user: userWithoutPassword,
        token,
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": `token=${token}; Path=/; HttpOnly; Max-Age=${
            7 * 24 * 60 * 60
          }; SameSite=Lax`,
        },
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
