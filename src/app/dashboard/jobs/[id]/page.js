// src/app/dashboard/jobs/[id]/page.js
"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Briefcase,
  DollarSign,
  Users,
  Edit,
  Trash2,
  Clock,
  GraduationCap,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import DashboardHeader from "@/app/components/jobs/dashboard-header";
import useUserStore from "@/store/useUserStore";

export default function JobDetailPage({ params }) {
  const router = useRouter();
  const { user, isLoggedIn } = useUserStore();
  // Unwrap the params using React.use()
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (isClient && !isLoggedIn) {
      router.push("/auth/login");
    }
  }, [isClient, isLoggedIn, router]);

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      if (!isClient || !isLoggedIn || !id) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/jobs/${id}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch job details");
        }

        const data = await response.json();
        setJob(data.job);
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Failed to load job. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [isClient, isLoggedIn, id]);

  // Format date function
  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMMM dd, yyyy");
  };

  // Handle job deletion
  const handleDeleteJob = async () => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete job");
      }

      router.push("/dashboard/jobs/view");
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job. Please try again.");
    }
  };

  if (!isClient) {
    // Initial loading state
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <DashboardHeader />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back button */}
          <div className="mb-6">
            <Link
              href="/dashboard/jobs/view"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to job listings
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <div className="inline-flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          ) : job ? (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              {/* Job Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                      {job.title}
                    </h1>
                    <p className="text-blue-100">{job.companyName}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/dashboard/jobs/${id}/applicants`}>
                      <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-500 bg-opacity-60 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <Users className="h-4 w-4 mr-2" />
                        View Applicants
                      </button>
                    </Link>
                    <Link href={`/dashboard/jobs/edit/${id}`}>
                      <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-500 bg-opacity-60 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={handleDeleteJob}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 bg-opacity-60 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      job.status === "active"
                        ? "bg-green-100 text-green-800"
                        : job.status === "closed"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>

                  <span className="ml-4 inline-flex items-center text-sm text-blue-100">
                    <Users className="h-4 w-4 mr-1" />
                    {job.applications || 0} applications
                  </span>
                </div>
              </div>

              {/* Job Details */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                        <h3 className="text-sm font-medium text-gray-500">
                          Location
                        </h3>
                      </div>
                      <p className="ml-7 text-gray-900">{job.location}</p>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                        <h3 className="text-sm font-medium text-gray-500">
                          Salary
                        </h3>
                      </div>
                      <p className="ml-7 text-gray-900">{job.salary}</p>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <Clock className="h-5 w-5 text-gray-400 mr-2" />
                        <h3 className="text-sm font-medium text-gray-500">
                          Experience
                        </h3>
                      </div>
                      <p className="ml-7 text-gray-900">
                        {job.experienceLevel.charAt(0).toUpperCase() +
                          job.experienceLevel.slice(1)}{" "}
                        - {job.yearsOfExperience} years
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                        <h3 className="text-sm font-medium text-gray-500">
                          Deadline
                        </h3>
                      </div>
                      <p className="ml-7 text-gray-900">
                        {formatDate(job.deadline)}
                      </p>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <GraduationCap className="h-5 w-5 text-gray-400 mr-2" />
                        <h3 className="text-sm font-medium text-gray-500">
                          Education Requirements
                        </h3>
                      </div>
                      <p className="ml-7 text-gray-900">{job.educationLevel}</p>
                      {job.fieldOfStudy &&
                        job.fieldOfStudy !== "Not specified" && (
                          <p className="ml-7 text-gray-600 text-sm">
                            Field: {job.fieldOfStudy}
                          </p>
                        )}
                      {job.grade && job.grade !== "Not specified" && (
                        <p className="ml-7 text-gray-600 text-sm">
                          Grade: {job.grade}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
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

                {/* Weights */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Scoring Weights
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Skills</div>
                      <div className="text-lg font-semibold text-blue-600">
                        {job.weights.skills}%
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">
                        Experience Level
                      </div>
                      <div className="text-lg font-semibold text-blue-600">
                        {job.weights.experienceLevel}%
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">
                        Years of Experience
                      </div>
                      <div className="text-lg font-semibold text-blue-600">
                        {job.weights.yearsOfExperience}%
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">
                        Education
                      </div>
                      <div className="text-lg font-semibold text-blue-600">
                        {job.weights.education}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Job Description
                  </h3>
                  <div className="prose prose-blue max-w-none bg-gray-50 p-4 rounded-lg">
                    <p className="whitespace-pre-line">{job.jobDescription}</p>
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
    </div>
  );
}
