"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "./dashboard-header";
import useUserStore from "@/store/useUserStore";
import Stats from "./Stats";

// Import other dashboard components
import RecentApplicationsCard from "./RecentApplicationsCard";
import JobListingsCard from "./JobListingsCard";
import ChatbotCard from "./ChatbotCard";
import UpcomingInterviewsCard from "./UpcomingInterviewsCard";
import CandidateInsightsCard from "./CandidateInsightsCard";

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoggedIn } = useUserStore();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-blue-600">Loading...</p>
        </div>
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
          {/* Welcome Message and Stats */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {user?.firstname || "HR User"}!
            </h1>
            <p className="mt-2 text-gray-600">
              This is your CandidAI dashboard where you can manage your hiring
              process.
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
        </div>
      </main>
    </div>
  );
}
