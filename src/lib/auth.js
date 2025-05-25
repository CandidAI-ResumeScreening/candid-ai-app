// src/lib/auth.js
import jwt from "jsonwebtoken";
import { headers } from "next/headers";
import User from "@/models/User";

// Get user from JWT token
export const getUserFromToken = async (token) => {
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
export const getAuthFromRequest = async () => {
  try {
    // Get token from cookies
    const headersList = await headers();
    const cookie = headersList.get("cookie") || "";

    // More robust token extraction
    let token = null;

    // Try different patterns for token extraction
    const tokenMatch = cookie.match(/token=([^;]+)/);
    if (tokenMatch) {
      token = tokenMatch[1];
    }

    // Also check for Authorization header as fallback
    if (!token) {
      const authHeader = headersList.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      throw new Error("Not authenticated");
    }

    // Decode the token if it's URL encoded
    token = decodeURIComponent(token);

    // Get user from token
    const user = await getUserFromToken(token);
    return user;
  } catch (error) {
    console.error("Authentication error:", error);
    throw new Error("Not authenticated");
  }
};
