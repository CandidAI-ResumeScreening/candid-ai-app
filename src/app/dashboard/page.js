"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "../components/dashboard/dashboard-header";
import useUserStore from "@/store/useUserStore";
import Stats from "../components/dashboard/Stats";

// Import other dashboard components
import RecentApplicationsCard from "../components/dashboard/RecentApplicationsCard";
import JobListingsCard from "../components/dashboard/JobListingsCard";
import ChatbotCard from "../components/dashboard/ChatbotCard";
import UpcomingInterviewsCard from "../components/dashboard/UpcomingInterviewsCard";
import CandidateInsightsCard from "../components/dashboard/CandidateInsightsCard";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useUserStore();
  // Add a state to track if we're on the client
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true on the client side
    setIsClient(true);
  }, []);

  // Always render the same basic structure
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
            <>
              {/* Welcome Message and Stats */}
              <div className="bg-white shadow-sm rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome, {user?.firstname || "HR User"}!
                </h1>
                <p className="mt-2 text-gray-600">
                  This is your CandidAI dashboard where you can manage your
                  hiring process.
                </p>

                {/* Stats Section */}
                <div className="mt-6">
                  <Stats />
                </div>
              </div>

              {/* Main Dashboard Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  <RecentApplicationsCard />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CandidateInsightsCard />
                    <UpcomingInterviewsCard />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <ChatbotCard />
                  <JobListingsCard />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
