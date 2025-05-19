"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  Calendar,
  ArrowLeft,
  Upload,
  Check,
  AlertTriangle,
  Loader2,
  MapPin,
  Briefcase,
  DollarSign,
  GraduationCap,
  Clock,
  BarChart,
} from "lucide-react";
import Navbar from "../../components/applyjobs-component/Navbar";
import Footer from "../../components/home-components/Footer";

export default function JobApplyPage({ params }) {
  const router = useRouter();

  // Unwrap the params using React.use() to solve the warning
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id; // Job ID from URL

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [applicationSuccess, setApplicationSuccess] = useState(null);
  const [scoringResult, setScoringResult] = useState(null);

  // Fetch job details on load
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/public/jobs/${id}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch job details");
        }

        const data = await response.json();
        setJob(data.job);
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError(err.message || "Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  // Format deadline date
  const formatDeadline = (deadline) => {
    return format(new Date(deadline), "MMMM dd, yyyy");
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFileError(null);
    setSubmitError(null);
    setApplicationSuccess(null);
    setScoringResult(null);

    // Validate file
    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Check file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "image/png",
      "image/jpeg",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setFileError("Please upload a PDF, DOCX, TXT, PNG, or JPEG file");
      setFile(null);
      return;
    }

    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setFileError("File size must be less than 5MB");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  // Submit application
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !job) {
      setSubmitError("Please select a resume file to upload");
      return;
    }

    try {
      setSubmitLoading(true);
      setSubmitError(null);
      setApplicationSuccess(null);

      // Step 1: Parse the resume with the parse API
      const parseFormData = new FormData();
      parseFormData.append("resume", file);

      const parseResponse = await fetch("/api/parse", {
        method: "POST",
        body: parseFormData,
      });

      if (!parseResponse.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to parse resume");
      }

      const parsedData = await parseResponse.json();

      if (!parsedData) {
        throw new Error("Failed to extract information from resume");
      }

      // Step 2: Submit application with parsed data and job ID
      const applicationFormData = new FormData();
      applicationFormData.append("resume", file);
      applicationFormData.append("jobId", job._id);
      applicationFormData.append("parsedData", JSON.stringify(parsedData));

      const applicationResponse = await fetch("/api/public/apply", {
        method: "POST",
        body: applicationFormData,
      });

      if (!applicationResponse.ok) {
        const errorData = await applicationResponse.json();
        throw new Error(errorData.message || "Failed to submit application");
      }

      const data = await applicationResponse.json();
      setApplicationSuccess(
        data.message || "Application submitted successfully!"
      );
      setScoringResult({
        score: data.score,
        thresholdPass: data.thresholdPass,
        grade: data.grade,
      });

      // Scroll to the top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Error submitting application:", err);
      setSubmitError(
        err.message || "Failed to submit application. Please try again."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 pt-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <Link
            href="/applyjobs"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to all jobs
          </Link>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          ) : !job ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">Job not found</p>
            </div>
          ) : (
            <>
              {/* Application Success */}
              {applicationSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-6">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 mr-2" />
                    <p className="font-medium">
                      Application submitted successfully
                    </p>
                  </div>
                  {scoringResult && (
                    <div className="mt-2">
                      <p className="mt-3 text-sm">
                        Thank you for your application! You'll be notified if
                        you're selected for the next stage.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Job Details */}
              <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                  <h1 className="text-2xl font-bold text-white">{job.title}</h1>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex items-start">
                      <Briefcase className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Company</p>
                        <p className="text-base font-medium">
                          {job.companyName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="text-base font-medium">{job.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <DollarSign className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Salary</p>
                        <p className="text-base font-medium">{job.salary}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Apply By</p>
                        <p className="text-base font-medium">
                          {formatDeadline(job.deadline)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Experience</p>
                        <p className="text-base font-medium">
                          {job.experienceLevel.charAt(0).toUpperCase() +
                            job.experienceLevel.slice(1)}{" "}
                          ({job.yearsOfExperience} years)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <GraduationCap className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Education</p>
                        <p className="text-base font-medium">
                          {job.educationLevel}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Required Skills */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Required Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Job Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Job Description
                    </h3>
                    <div className="prose prose-blue max-w-none">
                      <p className="whitespace-pre-line">
                        {job.jobDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Form */}
              {!applicationSuccess && (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Apply for this Position
                    </h2>
                  </div>
                  <div className="p-6">
                    {submitError && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
                        <div className="flex items-center">
                          <AlertTriangle className="h-5 w-5 mr-2" />
                          <p>{submitError}</p>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      {/* Resume Upload */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Your Resume (PDF, DOCX, TXT, PNG or JPEG)
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="resume"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="resume"
                                  name="resume"
                                  type="file"
                                  className="sr-only"
                                  accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                                  onChange={handleFileChange}
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PDF, DOCX, TXT, PNG or JPEG up to 5MB
                            </p>
                          </div>
                        </div>
                        {fileError && (
                          <p className="mt-2 text-sm text-red-600">
                            {fileError}
                          </p>
                        )}
                        {file && (
                          <p className="mt-2 text-sm text-green-600">
                            Selected file: {file.name}
                          </p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <div>
                        <button
                          type="submit"
                          disabled={!file || submitLoading}
                          className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                        >
                          {submitLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Processing Application...
                            </>
                          ) : (
                            "Submit Application"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
