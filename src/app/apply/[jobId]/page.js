"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  CheckCircle,
  AlertTriangle,
  Briefcase,
  Building,
  Clock,
  MapPin,
} from "lucide-react";
import Navbar from "../../components/home-components/Navbar";
import Footer from "../../components/home-components/Footer";

export default function ApplyJobPage({ params }) {
  const router = useRouter();
  const { id } = params;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [candidateScores, setCandidateScores] = useState(null);

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/public/jobs/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch job details");
        }

        const data = await response.json();

        // Check if job is active and not expired
        const jobData = data.job;
        const isActive = jobData.status === "active";
        const isExpired = new Date(jobData.deadline) < new Date();

        if (!isActive || isExpired) {
          throw new Error("This job is no longer accepting applications");
        }

        setJob(jobData);
      } catch (err) {
        console.error("Error fetching job:", err);
        setError(
          err.message || "Failed to load job details. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

  // Handle file change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    // Clear any previous errors or successes when a new file is selected
    setSubmissionError(null);
    setSubmissionSuccess(null);
    setCandidateScores(null);
  };

  // Format deadline date
  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get skill badges
  const getSkillBadges = (skills, limit = skills.length) => {
    return skills.slice(0, limit).map((skill, index) => (
      <span
        key={index}
        className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs font-semibold mr-2 mb-2"
      >
        {skill}
      </span>
    ));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!file) {
      setSubmissionError("Please upload your resume");
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);
    setSubmissionSuccess(null);

    try {
      // Step 1: Create form data with resume
      const formData = new FormData();
      formData.append("resume", file);

      // Step 2: Parse the resume with the parse API
      const parseResponse = await fetch("/api/parse", {
        method: "POST",
        body: formData,
      });

      if (!parseResponse.ok) {
        const errorData = await parseResponse.json();
        throw new Error(errorData.error || "Failed to parse resume");
      }

      const parsedData = await parseResponse.json();

      if (!parsedData) {
        throw new Error("Failed to extract information from resume");
      }

      // Step 3: Submit application with parsed data and job ID
      const applicationResponse = await fetch("/api/public/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: id,
          jobTitle: job.title,
          hrEmail: job.email,
          candidateData: parsedData,
          fileName: file.name,
        }),
      });

      if (!applicationResponse.ok) {
        const errorData = await applicationResponse.json();
        throw new Error(errorData.message || "Failed to submit application");
      }

      const applicationResult = await applicationResponse.json();

      // Set scores and success message
      setCandidateScores(applicationResult.scores);
      setSubmissionSuccess("Your application has been submitted successfully!");

      // Scroll to the success message
      setTimeout(() => {
        document.getElementById("result-section")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    } catch (err) {
      console.error("Application error:", err);
      setSubmissionError(
        err.message ||
          "There was an error submitting your application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back button */}
          <div className="mb-6">
            <Link
              href="/applyjobs"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to job listings
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <svg
                className="animate-spin h-8 w-8 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <p>{error}</p>
              </div>
            </div>
          ) : job ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Job Details Column */}
              <div className="lg:col-span-2">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="px-6 py-8">
                    <div className="flex items-center mb-4">
                      <Briefcase className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-600">
                        {job.category}
                      </span>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                      {job.title}
                    </h1>

                    <div className="flex flex-wrap gap-y-2 mb-6">
                      <div className="w-full sm:w-1/2 flex items-center text-gray-600">
                        <Building className="h-4 w-4 mr-2" />
                        <span>{job.companyName}</span>
                      </div>
                      <div className="w-full sm:w-1/2 flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{job.location}</span>
                      </div>
                      <div className="w-full sm:w-1/2 flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Deadline: {formatDeadline(job.deadline)}</span>
                      </div>
                      <div className="w-full sm:w-1/2 flex items-center text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{job.salary}</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h2 className="text-lg font-medium text-gray-900 mb-2">
                        Required Skills:
                      </h2>
                      <div className="flex flex-wrap">
                        {getSkillBadges(job.skills)}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h2 className="text-lg font-medium text-gray-900 mb-2">
                        Requirements:
                      </h2>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        <li>
                          Experience Level:{" "}
                          {job.experienceLevel.charAt(0).toUpperCase() +
                            job.experienceLevel.slice(1)}
                        </li>
                        <li>Years of Experience: {job.yearsOfExperience}</li>
                        <li>Education: {job.educationLevel}</li>
                        {job.fieldOfStudy &&
                          job.fieldOfStudy !== "Not specified" && (
                            <li>Field of Study: {job.fieldOfStudy}</li>
                          )}
                        {job.grade && job.grade !== "Not specified" && (
                          <li>Grade: {job.grade}</li>
                        )}
                      </ul>
                    </div>

                    <div>
                      <h2 className="text-lg font-medium text-gray-900 mb-2">
                        Job Description:
                      </h2>
                      <div className="text-gray-700 whitespace-pre-line">
                        {job.jobDescription}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Form Column */}
              <div className="lg:col-span-1">
                <div className="bg-white shadow-md rounded-lg overflow-hidden sticky top-20">
                  <div className="px-6 py-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Apply for this position
                    </h2>

                    <form onSubmit={handleSubmit}>
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload your resume (PDF, Word or TXT)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-md px-6 py-8 text-center">
                          <input
                            type="file"
                            id="resume"
                            accept=".pdf,.docx,.doc,.txt"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <label
                            htmlFor="resume"
                            className="cursor-pointer flex flex-col items-center"
                          >
                            <Upload className="h-10 w-10 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">
                              {file
                                ? file.name
                                : "Click to browse or drag and drop"}
                            </span>
                            <span className="mt-1 text-xs text-gray-400">
                              PDF, Word or TXT files up to 5MB
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <button
                          type="submit"
                          disabled={isSubmitting || !file}
                          className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <span className="flex items-center justify-center">
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Processing...
                            </span>
                          ) : (
                            "Submit Application"
                          )}
                        </button>
                      </div>
                    </form>

                    {submissionError && (
                      <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <div className="flex items-center">
                          <AlertTriangle className="h-5 w-5 mr-2" />
                          <p>{submissionError}</p>
                        </div>
                      </div>
                    )}

                    {submissionSuccess && (
                      <div
                        id="result-section"
                        className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                      >
                        <div className="flex items-center mb-2">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          <p className="font-medium">{submissionSuccess}</p>
                        </div>

                        {candidateScores && (
                          <div className="mt-2 text-sm">
                            <p className="font-medium mb-1">
                              Match Score: {candidateScores.overallScore}%
                            </p>
                            <p className="font-medium mb-2">
                              {candidateScores.grade}
                            </p>

                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                              <div
                                className={`h-2.5 rounded-full ${
                                  candidateScores.overallScore >= 80
                                    ? "bg-green-600"
                                    : candidateScores.overallScore >= 60
                                    ? "bg-blue-600"
                                    : candidateScores.overallScore >= 40
                                    ? "bg-yellow-500"
                                    : "bg-red-600"
                                }`}
                                style={{
                                  width: `${candidateScores.overallScore}%`,
                                }}
                              ></div>
                            </div>

                            <p className="mt-3">
                              We will notify you if your application progresses
                              to the next stage.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">
                Job not found or no longer available.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
