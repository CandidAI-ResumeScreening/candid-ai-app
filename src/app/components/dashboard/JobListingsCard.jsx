// src/components/dashboard/JobListingsCard.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, ArrowRight, Users, Loader2, AlertTriangle } from "lucide-react";
import { differenceInDays } from "date-fns";
import useUserStore from "@/store/useUserStore";

export default function JobListingsCard() {
  const { user } = useUserStore();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user?.email) return;

      try {
        setLoading(true);
        const response = await fetch("/api/jobs");

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await response.json();

        // Filter for active jobs only
        const activeJobs = data.jobs
          .filter((job) => job.status === "active")
          // Sort by deadline (earliest first)
          .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
          // Limit to 3 jobs for the card
          .slice(0, 3)
          // Transform to the required format with calculated values
          .map((job) => {
            const deadline = new Date(job.deadline);
            const today = new Date();
            const daysLeft = Math.max(0, differenceInDays(deadline, today));

            return {
              id: job._id,
              title: job.title,
              department: job.category,
              location: job.location,
              applicants: job.applications || 0,
              daysLeft: daysLeft,
              deadline: deadline,
              // Add any other fields needed
            };
          });

        setJobs(activeJobs);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user]);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          Active Job Listings
        </h2>
        <Link href="/dashboard/jobs/create">
          <button className="flex items-center text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded">
            <Plus className="mr-1 h-4 w-4" />
            Post Job
          </button>
        </Link>
      </div>
      <div className="px-6 py-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-500">{error}</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">No active job listings</p>
            <p className="text-sm text-gray-400">
              Create your first job posting to see it here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/dashboard/jobs/${job.id}`}
                className="block"
              >
                <div className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {job.title}
                      </h3>
                      <div className="mt-1 flex items-center text-xs text-gray-500">
                        <span>{job.department}</span>
                        <span className="mx-2">•</span>
                        <span>{job.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 text-gray-400 mr-1" />
                        <span>
                          {job.applicants}{" "}
                          {job.applicants === 1 ? "applicant" : "applicants"}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {job.daysLeft === 0 ? (
                          <span className="text-red-500">Deadline today</span>
                        ) : (
                          <span>
                            {job.daysLeft} {job.daysLeft === 1 ? "day" : "days"}{" "}
                            left
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="mt-4 text-center">
          <Link
            href="/dashboard/jobs/view"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all positions
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
