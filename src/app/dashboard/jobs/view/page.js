"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Edit,
  Trash2,
  Eye,
  Clock,
  Users,
  Plus,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import useUserStore from "@/store/useUserStore";
import DashboardHeader from "@/app/components/jobs/dashboard-header";

export default function ViewJobsPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useUserStore();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [filteredJobs, setFilteredJobs] = useState([]);

  // Set isClient to true on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch jobs on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/jobs");

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to fetch jobs");
        }

        const data = await response.json();
        setJobs(data.jobs || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if we have a user
    if (user && isClient) {
      fetchJobs();
    }
  }, [user, isClient]);

  // Filter jobs based on active tab
  useEffect(() => {
    if (!jobs.length) {
      setFilteredJobs([]);
      return;
    }

    const today = new Date();

    switch (activeTab) {
      case "active":
        // Show jobs with "active" status and deadline in the future
        setFilteredJobs(
          jobs.filter(
            (job) => job.status === "active" && new Date(job.deadline) >= today
          )
        );
        break;
      case "cancelled":
        // Show jobs with "closed" status
        setFilteredJobs(jobs.filter((job) => job.status === "closed"));
        break;
      case "expired":
        // Show jobs with deadline in the past
        setFilteredJobs(jobs.filter((job) => new Date(job.deadline) < today));
        break;
      default:
        setFilteredJobs(jobs);
    }
  }, [jobs, activeTab]);

  // Calculate days remaining until deadline
  const getDaysRemaining = (deadline) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  };

  // Format deadline date
  const formatDeadline = (deadline) => {
    return format(new Date(deadline), "MMMM dd, yyyy");
  };

  // Get status badge color
  const getStatusBadgeColor = (status, deadline) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();

    // If the deadline has passed for an active job
    if (status === "active" && deadlineDate < today) {
      return "bg-yellow-100 text-yellow-800"; // Expired
    }

    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status label
  const getStatusLabel = (status, deadline) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();

    // If the deadline has passed for an active job
    if (status === "active" && deadlineDate < today) {
      return "Expired";
    }

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Always render the same initial structure for both server and client
  // Then conditionally render the content based on the client state
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <DashboardHeader />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {!isClient ? (
            // Loading state - shown during initial load
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
          ) : !user ? (
            // Not authenticated
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                You need to be logged in to view this page
              </p>
              <button
                onClick={() => router.push("/auth/login")}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Go to Login
              </button>
            </div>
          ) : (
            // Authenticated - show content
            <div className="bg-white shadow-sm rounded-lg p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  View Job Posts
                </h1>

                <Link href="/dashboard/jobs/create">
                  <button className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Job
                  </button>
                </Link>
              </div>

              {/* Tab Navigation */}
              <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab("active")}
                    className={`${
                      activeTab === "active"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setActiveTab("cancelled")}
                    className={`${
                      activeTab === "cancelled"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Cancelled
                  </button>
                  <button
                    onClick={() => setActiveTab("expired")}
                    className={`${
                      activeTab === "expired"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Expired
                  </button>
                </nav>
              </div>

              {isLoading ? (
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
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                  {error}
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    {activeTab === "active"
                      ? "No active job posts found"
                      : activeTab === "cancelled"
                      ? "No cancelled job posts found"
                      : "No expired job posts found"}
                  </p>
                  <Link href="/dashboard/jobs/create">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Job
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Job Title
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Location
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Deadline
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Applications
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredJobs.map((job) => (
                        <tr key={job._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {job.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {job.companyName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {job.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-gray-400 mr-1" />
                              <div className="text-sm text-gray-900">
                                {formatDeadline(job.deadline)}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500">
                              {getDaysRemaining(job.deadline) > 0
                                ? `${getDaysRemaining(
                                    job.deadline
                                  )} days remaining`
                                : "Deadline passed"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-900">
                                {job.applications || 0}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                                job.status,
                                job.deadline
                              )}`}
                            >
                              {getStatusLabel(job.status, job.deadline)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              {/* View Job Details */}
                              <Link href={`/dashboard/jobs/${job._id}`}>
                                <button
                                  title="View Details"
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Eye className="h-5 w-5" />
                                </button>
                              </Link>

                              {/* View Applicants - New Button */}
                              <Link
                                href={`/dashboard/jobs/${job._id}/applicants`}
                              >
                                <button
                                  title="View Applicants"
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Users className="h-5 w-5" />
                                </button>
                              </Link>

                              {/* Edit Job */}
                              <Link href={`/dashboard/jobs/edit/${job._id}`}>
                                <button
                                  title="Edit Job"
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  <Edit className="h-5 w-5" />
                                </button>
                              </Link>

                              {/* Status Change Buttons */}
                              {job.status === "active" && (
                                <button
                                  title="Cancel Job"
                                  className="text-yellow-600 hover:text-yellow-900"
                                  onClick={async () => {
                                    if (
                                      window.confirm(
                                        "Are you sure you want to cancel this job?"
                                      )
                                    ) {
                                      try {
                                        const response = await fetch(
                                          `/api/jobs/${job._id}/status`,
                                          {
                                            method: "PATCH",
                                            headers: {
                                              "Content-Type":
                                                "application/json",
                                            },
                                            body: JSON.stringify({
                                              status: "closed",
                                            }),
                                          }
                                        );

                                        if (!response.ok) {
                                          throw new Error(
                                            "Failed to cancel job"
                                          );
                                        }

                                        // Update the job in the state
                                        setJobs(
                                          jobs.map((j) =>
                                            j._id === job._id
                                              ? { ...j, status: "closed" }
                                              : j
                                          )
                                        );
                                      } catch (err) {
                                        console.error(
                                          "Error cancelling job:",
                                          err
                                        );
                                        alert(
                                          "Failed to cancel job. Please try again."
                                        );
                                      }
                                    }
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5"
                                  >
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="8" y1="12" x2="16" y2="12"></line>
                                  </svg>
                                </button>
                              )}
                              {job.status === "closed" && (
                                <button
                                  title="Activate Job"
                                  className="text-green-600 hover:text-green-900"
                                  onClick={async () => {
                                    if (
                                      window.confirm(
                                        "Are you sure you want to activate this job?"
                                      )
                                    ) {
                                      try {
                                        const response = await fetch(
                                          `/api/jobs/${job._id}/status`,
                                          {
                                            method: "PATCH",
                                            headers: {
                                              "Content-Type":
                                                "application/json",
                                            },
                                            body: JSON.stringify({
                                              status: "active",
                                            }),
                                          }
                                        );

                                        if (!response.ok) {
                                          throw new Error(
                                            "Failed to activate job"
                                          );
                                        }

                                        // Update the job in the state
                                        setJobs(
                                          jobs.map((j) =>
                                            j._id === job._id
                                              ? { ...j, status: "active" }
                                              : j
                                          )
                                        );
                                      } catch (err) {
                                        console.error(
                                          "Error activating job:",
                                          err
                                        );
                                        alert(
                                          "Failed to activate job. Please try again."
                                        );
                                      }
                                    }
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5"
                                  >
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="16"></line>
                                    <line x1="8" y1="12" x2="16" y2="12"></line>
                                  </svg>
                                </button>
                              )}

                              {/* Delete Job */}
                              <button
                                title="Delete Job"
                                className="text-red-600 hover:text-red-900"
                                onClick={async () => {
                                  if (
                                    window.confirm(
                                      "Are you sure you want to delete this job?"
                                    )
                                  ) {
                                    try {
                                      const response = await fetch(
                                        `/api/jobs/${job._id}`,
                                        {
                                          method: "DELETE",
                                        }
                                      );

                                      if (!response.ok) {
                                        throw new Error("Failed to delete job");
                                      }

                                      // Remove the job from the state
                                      setJobs(
                                        jobs.filter((j) => j._id !== job._id)
                                      );
                                    } catch (err) {
                                      console.error("Error deleting job:", err);
                                      alert(
                                        "Failed to delete job. Please try again."
                                      );
                                    }
                                  }
                                }}
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
