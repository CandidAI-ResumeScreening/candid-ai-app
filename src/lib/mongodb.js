// src/lib/mongodb.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 60000,
      connectTimeoutMS: 60000,
      socketTimeoutMS: 60000,
      family: 4,
    };

    console.log("Attempting to connect to MongoDB...");
    console.log(
      "Using URI format:",
      MONGODB_URI.startsWith("mongodb://") ? "Direct" : "SRV"
    );

    try {
      cached.promise = mongoose
        .connect(MONGODB_URI, opts)
        .then((mongoose) => {
          console.log("MongoDB connection successful!");
          return mongoose;
        })
        .catch((err) => {
          console.error("MongoDB connection error:", err.message);

          // Log more detailed error information
          if (err.name === "MongooseServerSelectionError") {
            console.error("Error details:", {
              name: err.name,
              message: err.message,
            });

            if (err.message.includes("IP that isn't whitelisted")) {
              console.error(
                "\nIP WHITELIST ISSUE: You need to add your current IP to MongoDB Atlas whitelist"
              );
              console.error("1. Go to MongoDB Atlas dashboard");
              console.error("2. Navigate to Network Access");
              console.error("3. Click 'ADD IP ADDRESS'");
              console.error(
                "4. Add your current IP or use 'ALLOW ACCESS FROM ANYWHERE'"
              );
            }
          }

          cached.promise = null;
          throw err;
        });
    } catch (error) {
      console.error("Error setting up connection:", error);
      cached.promise = null;
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("Error establishing MongoDB connection:", error);
    cached.promise = null;
    throw error;
  }
}

export default connectToDatabase;
