// src/app/components/dashboard/Stats.jsx
"use client";

import { useState, useEffect } from "react";
import { Briefcase, Users, Clock, Loader2 } from "lucide-react";
import useUserStore from "@/store/useUserStore";

const Stats = () => {
  const { user } = useUserStore();
  const [stats, setStats] = useState({
    activeJobs: null,
    totalCandidates: null,
    pendingInterviews: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.email) return;

      try {
        setLoading(true);

        // Fetch jobs count
        const jobsResponse = await fetch("/api/jobs");
        if (!jobsResponse.ok) throw new Error("Failed to fetch jobs");
        const jobsData = await jobsResponse.json();
        const activeJobs = jobsData.jobs.filter(
          (job) => job.status === "active"
        ).length;

        // Fetch all applications to count candidates and interviews
        const applicationsResponse = await fetch("/api/hr/all-applications");
        if (!applicationsResponse.ok)
          throw new Error("Failed to fetch applications");
        const applicationsData = await applicationsResponse.json();

        const totalCandidates = applicationsData.applications.length;
        const pendingInterviews = applicationsData.applications.filter(
          (app) => app.status === "reviewing"
        ).length;

        setStats({
          activeJobs,
          totalCandidates,
          pendingInterviews,
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  // Helper function to determine subtitle text
  const getSubtitleText = (value, type) => {
    if (value === 0) {
      switch (type) {
        case "jobs":
          return "Start posting jobs to see them here";
        case "candidates":
          return "No candidates yet";
        case "interviews":
          return "No pending interviews";
        default:
          return "";
      }
    }

    switch (type) {
      case "jobs":
        return value === 1 ? "Active job" : "Active jobs";
      case "candidates":
        return value === 1 ? "Candidate" : "Candidates";
      case "interviews":
        return value === 1
          ? "Candidate awaiting interview"
          : "Candidates awaiting interviews";
      default:
        return "";
    }
  };

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* Active Jobs */}
      <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <Briefcase className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-blue-800">Active Jobs</h3>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-12 mt-2">
            <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
          </div>
        ) : (
          <>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {stats.activeJobs !== null ? stats.activeJobs : "-"}
            </p>
            <p className="mt-1 text-sm text-blue-500">
              {getSubtitleText(stats.activeJobs, "jobs")}
            </p>
          </>
        )}
      </div>

      {/* Total Candidates */}
      <div className="bg-green-50 p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <Users className="h-6 w-6 text-green-600 mr-2" />
          <h3 className="text-lg font-medium text-green-800">
            Total Candidates
          </h3>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-12 mt-2">
            <Loader2 className="h-5 w-5 text-green-600 animate-spin" />
          </div>
        ) : (
          <>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {stats.totalCandidates !== null ? stats.totalCandidates : "-"}
            </p>
            <p className="mt-1 text-sm text-green-500">
              {getSubtitleText(stats.totalCandidates, "candidates")}
            </p>
          </>
        )}
      </div>

      {/* Pending Interviews */}
      <div className="bg-purple-50 p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <Clock className="h-6 w-6 text-purple-600 mr-2" />
          <h3 className="text-lg font-medium text-purple-800">
            Pending Interviews
          </h3>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-12 mt-2">
            <Loader2 className="h-5 w-5 text-purple-600 animate-spin" />
          </div>
        ) : (
          <>
            <p className="mt-2 text-3xl font-bold text-purple-600">
              {stats.pendingInterviews !== null ? stats.pendingInterviews : "-"}
            </p>
            <p className="mt-1 text-sm text-purple-500">
              {getSubtitleText(stats.pendingInterviews, "interviews")}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Stats;
