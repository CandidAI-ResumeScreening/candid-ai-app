// src/app/api/auth/signup/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  try {
    const { firstname, lastname, email, password } = await request.json();

    // Connect to the database
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already in use" },
        { status: 400 }
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Return the user without password
    const userWithoutPassword = {
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      { success: true, user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
