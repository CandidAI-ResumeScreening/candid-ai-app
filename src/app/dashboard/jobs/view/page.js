"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Edit, Trash2, Eye, Clock, Users, Plus } from "lucide-react";
import Link from "next/link";
import useUserStore from "@/store/useUserStore";
import DashboardHeader from "@/app/components/dashboard/dashboard-header";

export default function ViewJobsPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useUserStore();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Add a state to track if we're on the client
  const [isClient, setIsClient] = useState(false);

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
  const getStatusBadgeColor = (status) => {
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
              ) : jobs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No job posts found</p>
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
                      {jobs.map((job) => (
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
                              {getDaysRemaining(job.deadline)} days remaining
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-900">
                                {job.applications}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                                job.status
                              )}`}
                            >
                              {job.status.charAt(0).toUpperCase() +
                                job.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                title="View Applications"
                                className="text-blue-600 hover:text-blue-900"
                                onClick={() =>
                                  router.push(`/dashboard/jobs/${job._id}`)
                                }
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                              <button
                                title="Edit Job"
                                className="text-indigo-600 hover:text-indigo-900"
                                onClick={() =>
                                  router.push(`/dashboard/jobs/edit/${job._id}`)
                                }
                              >
                                <Edit className="h-5 w-5" />
                              </button>
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
