"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, ArrowRight, Clock, User, Briefcase } from "lucide-react";
import useUserStore from "@/store/useUserStore";

export default function UpcomingInterviewsCard() {
  const { user } = useUserStore();
  const [pendingInterviews, setPendingInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobDetails, setJobDetails] = useState({});

  useEffect(() => {
    const fetchPendingInterviews = async () => {
      if (!user?.email) return;

      try {
        setLoading(true);

        // Fetch all applications with 'reviewing' status
        const response = await fetch("/api/hr/all-applications?sort=newest");

        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }

        const data = await response.json();

        // Filter for applications with 'reviewing' status
        const reviewingApplications = data.applications
          .filter((app) => app.status === "reviewing")
          .slice(0, 5); // Limit to 5 candidates

        setPendingInterviews(reviewingApplications);

        // Store job titles map
        setJobDetails(data.jobTitlesMap || {});

        // Fetch job details for deadlines if not included in the above response
        if (reviewingApplications.length > 0) {
          const jobIds = [
            ...new Set(reviewingApplications.map((app) => app.jobId)),
          ];

          // Fetch job details to get deadlines
          const jobsPromises = jobIds.map((jobId) =>
            fetch(`/api/jobs/${jobId}`)
              .then((res) => (res.ok ? res.json() : null))
              .then((data) => (data?.job ? { [jobId]: data.job } : null))
              .catch(() => null)
          );

          const jobsResults = await Promise.all(jobsPromises);

          // Create a map of jobId to job details
          const jobsMap = jobsResults.reduce((acc, job) => {
            if (job) {
              const jobId = Object.keys(job)[0];
              acc[jobId] = job[jobId];
            }
            return acc;
          }, {});

          setJobDetails((prev) => ({ ...prev, ...jobsMap }));
        }
      } catch (err) {
        console.error("Error fetching pending interviews:", err);
        setError(err.message || "Failed to load pending interviews");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingInterviews();
  }, [user]);

  // Format deadline date
  const formatDeadline = (deadline) => {
    if (!deadline) return "No deadline";
    return format(new Date(deadline), "MMM dd, yyyy");
  };

  // Handle empty state
  if (!loading && pendingInterviews.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">
              Pending Interviews
            </h2>
          </div>
          <Link
            href="/dashboard/applications"
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="px-6 py-8 text-center">
          <p className="text-gray-500">No pending interviews</p>
          <p className="text-sm text-gray-400 mt-1">
            Candidates in the "Interviewing" stage will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">
            Pending Interviews
          </h2>
        </div>
        <Link
          href="/dashboard/applications"
          className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          View all
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      <div className="px-6 py-4">
        {loading ? (
          <div className="flex justify-center py-4">
            <svg
              className="animate-spin h-6 w-6 text-blue-600"
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
          <div className="py-4 text-center text-red-500">{error}</div>
        ) : (
          <div className="space-y-3">
            {pendingInterviews.map((interview) => {
              // Get job details if available
              const jobDetail = jobDetails[interview.jobId];

              return (
                <div
                  key={interview._id}
                  className="flex items-start p-3 hover:bg-gray-50 rounded-md"
                >
                  <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <div className="flex items-center">
                      <h3 className="text-sm font-medium text-gray-900">
                        {interview.Name || "Unnamed Candidate"}
                      </h3>
                      <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {interview["Experience level"] || "Not specified"}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      <p>
                        {interview.jobTitle ||
                          jobDetails[interview.jobId] ||
                          "Unknown Position"}
                      </p>
                      <div className="flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <p>
                          Deadline:{" "}
                          {jobDetail?.deadline
                            ? formatDeadline(jobDetail.deadline)
                            : "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
