"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/app/components/insights/insights-header";
import useUserStore from "@/store/useUserStore";
import JobsOverviewCard from "@/app/components/insights/JobsOverviewCard";
import CandidatesOverviewCard from "@/app/components/insights/CandidatesOverviewCard";
import ApplicationPipeline from "@/app/components/insights/ApplicationPipeline";
import ApplicationTrendsChart from "@/app/components/insights/ApplicationTrendsChart";
import JobStatusChart from "@/app/components/insights/JobStatusChart";
import ExperienceLevelChart from "@/app/components/insights/ExperienceLevelChart";
import CandidateSkillsPool from "@/app/components/insights/CandidateSkillsPool";
import RecommendationAlert from "@/app/components/insights/RecommendationAlert";
import { Loader2 } from "lucide-react";

export default function InsightsPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useUserStore();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobsData, setJobsData] = useState(null);
  const [candidatesData, setCandidatesData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [activeView, setActiveView] = useState("daily"); // daily, monthly, yearly

  // Set isClient to true on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (isClient && !isLoggedIn) {
      router.push("/auth/login");
    }
  }, [isClient, isLoggedIn, router]);

  // Fetch jobs and calculate stats
  useEffect(() => {
    const fetchJobsData = async () => {
      if (!isClient || !isLoggedIn || !user?.email) return;

      try {
        const response = await fetch("/api/jobs");
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await response.json();
        const jobs = data.jobs || [];

        // Calculate metrics
        const totalJobs = jobs.length;
        const activeJobs = jobs.filter((job) => job.status === "active").length;
        const closedJobs = jobs.filter((job) => job.status === "closed").length;

        // Calculate average time to deadline for active jobs
        const today = new Date();
        let totalDaysToDeadline = 0;
        let jobsWithFutureDeadlines = 0;

        jobs
          .filter((job) => job.status === "active")
          .forEach((job) => {
            const deadline = new Date(job.deadline);
            if (deadline > today) {
              const daysToDeadline = Math.ceil(
                (deadline - today) / (1000 * 60 * 60 * 24)
              );
              totalDaysToDeadline += daysToDeadline;
              jobsWithFutureDeadlines++;
            }
          });

        const avgDaysToDeadline =
          jobsWithFutureDeadlines > 0
            ? Math.round(totalDaysToDeadline / jobsWithFutureDeadlines)
            : 0;

        setJobsData({
          totalJobs,
          activeJobs,
          closedJobs,
          avgDaysToDeadline,
          jobs, // Keep the raw jobs data for other components
        });

        // Generate jobs-related recommendations
        if (totalJobs > 0) {
          if (activeJobs > 5 && avgDaysToDeadline < 7) {
            setRecommendations((prev) => [
              ...prev,
              {
                id: "tight-schedule",
                type: "warning",
                message:
                  "You have a tight schedule with multiple active jobs and close deadlines. Consider extending deadlines or staggering your job postings.",
              },
            ]);
          } else if (activeJobs > 0 && avgDaysToDeadline > 30) {
            setRecommendations((prev) => [
              ...prev,
              {
                id: "extended-deadlines",
                type: "info",
                message:
                  "Your job postings have extended deadlines. This gives candidates more time to apply but may delay your hiring process.",
              },
            ]);
          }

          if (closedJobs > activeJobs * 2) {
            setRecommendations((prev) => [
              ...prev,
              {
                id: "more-active-jobs",
                type: "suggestion",
                message:
                  "Most of your jobs are closed. Consider posting new positions to maintain a steady flow of candidates.",
              },
            ]);
          }
        } else {
          setRecommendations((prev) => [
            ...prev,
            {
              id: "no-jobs",
              type: "suggestion",
              message:
                "You haven't posted any jobs yet. Start recruiting by creating your first job posting.",
            },
          ]);
        }
      } catch (err) {
        console.error("Error fetching jobs data:", err);
        setError(err.message || "Failed to load jobs data");
      }
    };

    fetchJobsData();
  }, [isClient, isLoggedIn, user]);

  // Fetch candidates and calculate stats
  useEffect(() => {
    const fetchCandidatesData = async () => {
      if (!isClient || !isLoggedIn || !user?.email) return;

      try {
        const response = await fetch("/api/hr/all-applications");
        if (!response.ok) {
          throw new Error("Failed to fetch candidates");
        }

        const data = await response.json();
        const candidates = data.applications || [];

        // Calculate metrics
        const totalCandidates = candidates.length;
        const appliedCandidates = candidates.filter(
          (c) => c.status === "applied"
        ).length;
        const reviewingCandidates = candidates.filter(
          (c) => c.status === "reviewing"
        ).length;
        const selectedCandidates = candidates.filter(
          (c) => c.status === "selected"
        ).length;
        const rejectedCandidates = candidates.filter(
          (c) => c.status === "rejected"
        ).length;

        // Calculate experience level distribution
        const entryCandidates = candidates.filter(
          (c) =>
            c["Experience level"] &&
            c["Experience level"].toLowerCase().includes("entry")
        ).length;
        const intermediateCandidates = candidates.filter(
          (c) =>
            c["Experience level"] &&
            c["Experience level"].toLowerCase().includes("intermediate")
        ).length;
        const expertCandidates = candidates.filter(
          (c) =>
            c["Experience level"] &&
            c["Experience level"].toLowerCase().includes("expert")
        ).length;

        // Get top skills from candidates
        const skillsMap = {};
        candidates.forEach((candidate) => {
          if (candidate.Skills && Array.isArray(candidate.Skills)) {
            candidate.Skills.forEach((skill) => {
              if (skill) {
                skillsMap[skill] = (skillsMap[skill] || 0) + 1;
              }
            });
          }
        });

        // Sort skills by frequency and get top 5
        const topSkills = Object.entries(skillsMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([skill, count]) => ({ name: skill, count }));

        // Calculate application trends by date
        const applicationsByDate = {};
        const applicationsByMonth = {};
        const applicationsByYear = {};

        candidates.forEach((candidate) => {
          const appliedDate = new Date(candidate.appliedAt);

          // For daily view
          const dayOfWeek = appliedDate.toLocaleDateString("en-US", {
            weekday: "short",
          });
          applicationsByDate[dayOfWeek] =
            (applicationsByDate[dayOfWeek] || 0) + 1;

          // For monthly view
          const month = appliedDate.toLocaleDateString("en-US", {
            month: "short",
          });
          applicationsByMonth[month] = (applicationsByMonth[month] || 0) + 1;

          // For yearly view
          const year = appliedDate.getFullYear();
          applicationsByYear[year] = (applicationsByYear[year] || 0) + 1;
        });

        setCandidatesData({
          totalCandidates,
          appliedCandidates,
          reviewingCandidates,
          selectedCandidates,
          rejectedCandidates,
          entryCandidates,
          intermediateCandidates,
          expertCandidates,
          topSkills,
          applicationsByDate,
          applicationsByMonth,
          applicationsByYear,
          candidates, // Keep the raw candidates data for other components
        });

        // Generate candidates-related recommendations
        if (totalCandidates === 0) {
          setRecommendations((prev) => [
            ...prev,
            {
              id: "no-candidates",
              type: "suggestion",
              message:
                "You don't have any candidates yet. Consider promoting your job listings more widely to attract applicants.",
            },
          ]);
        } else {
          if (selectedCandidates > totalCandidates / 2) {
            setRecommendations((prev) => [
              ...prev,
              {
                id: "high-selection-rate",
                type: "success",
                message:
                  "You have a high candidate selection rate. Your job requirements align well with the applicant pool.",
              },
            ]);
          }

          if (rejectedCandidates > totalCandidates * 0.7) {
            setRecommendations((prev) => [
              ...prev,
              {
                id: "high-rejection-rate",
                type: "warning",
                message:
                  "Your rejection rate is high. Consider reviewing your job requirements or expanding your candidate sourcing strategies.",
              },
            ]);
          }
        }
      } catch (err) {
        console.error("Error fetching candidates data:", err);
        setError(err.message || "Failed to load candidates data");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidatesData();
  }, [isClient, isLoggedIn, user]);

  // Handle removing a recommendation
  const removeRecommendation = (id) => {
    setRecommendations((prevRecommendations) =>
      prevRecommendations.filter((rec) => rec.id !== id)
    );
  };

  // Toggle between daily, monthly, and yearly views
  const handleViewChange = (view) => {
    setActiveView(view);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <DashboardHeader />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {!isClient ? (
            // Loading state
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
          ) : !isLoggedIn ? (
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
          ) : loading ? (
            // Data loading state
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading insights data...</p>
            </div>
          ) : error ? (
            // Error state
            <div className="text-center py-12">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                <strong className="font-bold">Error! </strong>
                <span className="block sm:inline">{error}</span>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : (
            // Main dashboard content
            <div className="space-y-6">
              <div className="bg-white shadow-sm rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Recruitment Insights
                </h1>
                <p className="mt-2 text-gray-600">
                  Analyze your recruitment process and get actionable insights.
                </p>
              </div>

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div className="space-y-3">
                  {recommendations.map((recommendation) => (
                    <RecommendationAlert
                      key={recommendation.id}
                      id={recommendation.id}
                      type={recommendation.type}
                      message={recommendation.message}
                      onClose={() => removeRecommendation(recommendation.id)}
                    />
                  ))}
                </div>
              )}

              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <JobsOverviewCard data={jobsData} />
                <CandidatesOverviewCard data={candidatesData} />
              </div>

              {/* Application Pipeline */}
              <div className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Application Pipeline
                </h2>
                <ApplicationPipeline data={candidatesData} />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white shadow-sm rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Job Status Distribution
                  </h2>
                  <JobStatusChart data={jobsData} />
                </div>
                <div className="bg-white shadow-sm rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Experience Level Distribution
                  </h2>
                  <ExperienceLevelChart data={candidatesData} />
                </div>
              </div>

              {/* Application Trends */}
              <div className="bg-white shadow-sm rounded-lg p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Application Trends
                  </h2>
                  <div className="mt-2 sm:mt-0 flex rounded-md">
                    <button
                      onClick={() => handleViewChange("daily")}
                      className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                        activeView === "daily"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Daily
                    </button>
                    <button
                      onClick={() => handleViewChange("monthly")}
                      className={`px-4 py-2 text-sm font-medium ${
                        activeView === "monthly"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => handleViewChange("yearly")}
                      className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                        activeView === "yearly"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Yearly
                    </button>
                  </div>
                </div>
                <ApplicationTrendsChart
                  data={candidatesData}
                  activeView={activeView}
                />
              </div>

              {/* Candidate Skills Pool */}
              <div className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Top Candidate Skills
                </h2>
                <CandidateSkillsPool data={candidatesData?.topSkills || []} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
