// src/models/Candidate.js
import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema(
  {
    // Resume parsed data (dynamic fields from parsing)
    Name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    Email: {
      type: String,
      required: false, // Changed from required to optional
      trim: true,
      default: "Not specified", // Provide default value
    },
    Phone: {
      type: String,
      trim: true,
    },
    "Job Role": {
      type: String,
      trim: true,
    },
    "Experience level": {
      type: String,
      trim: true,
    },
    Skills: {
      type: [String],
      default: [],
    },
    "Total Estimated Years of Experience": {
      type: String,
      trim: true,
    },
    "Education Details": {
      type: [Object],
      default: [],
    },
    "Experience Details": {
      type: [Object],
      default: [],
    },
    Certification: {
      type: [String],
      default: [],
    },
    // Raw resume text
    rawResumeText: {
      type: String,
      trim: true,
    },
    // Job related fields
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job ID is required"],
    },
    jobTitle: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    hr_email: {
      type: String,
      required: [true, "HR email is required"], // This remains required as it identifies the HR
      trim: true,
    },
    // Application details
    score: {
      type: Number,
      required: [true, "Score is required"],
    },
    thresholdPass: {
      type: Boolean,
      required: [true, "Threshold pass status is required"],
    },
    status: {
      type: String,
      enum: ["applied", "reviewing", "interviewed", "selected", "rejected"],
      default: "applied",
    },
    // Resume file info
    resumeFileName: {
      type: String,
      required: [true, "Resume file name is required"],
      trim: true,
    },
    resumeFileLocation: {
      type: String,
      required: [true, "Resume file location is required"],
      trim: true,
    },
    // Timestamps
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "candidates", db: "candidai" }
);

const Candidate =
  mongoose.models.Candidate || mongoose.model("Candidate", CandidateSchema);

export default Candidate;
