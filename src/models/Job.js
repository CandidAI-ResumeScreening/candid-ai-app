// src/models/Job.js
import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Job category is required"],
      trim: true,
    },
    deadline: {
      type: Date,
      required: [true, "Application deadline is required"],
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Job location is required"],
      trim: true,
    },
    salary: {
      type: String,
      required: [true, "Salary information is required"],
      trim: true,
    },
    skills: {
      type: [String],
      required: [true, "At least one skill is required"],
    },
    experienceLevel: {
      type: String,
      required: [true, "Experience level is required"],
      enum: ["entry", "intermediate", "expert"],
    },
    yearsOfExperience: {
      type: Number,
      required: [true, "Years of experience is required"],
    },
    educationLevel: {
      type: String,
      required: [true, "Education level is required"],
    },
    fieldOfStudy: {
      type: String,
      default: "Not specified",
    },
    grade: {
      type: String,
      default: "Not specified",
    },
    jobDescription: {
      type: String,
      required: [true, "Job description is required"],
    },
    weights: {
      skills: {
        type: Number,
        required: true,
      },
      experienceLevel: {
        type: Number,
        required: true,
      },
      yearsOfExperience: {
        type: Number,
        required: true,
      },
      education: {
        type: Number,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["active", "closed", "draft"],
      default: "active",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    applications: {
      type: Number,
      default: 0,
    },
  },
  { collection: "jobs", db: "candidai" }
);

export default mongoose.models.Job || mongoose.model("Job", JobSchema);
