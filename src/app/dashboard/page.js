// src/app/dashboard/page.js
import DashboardLayout from "../components/dashboard/DashboardLayout.jsx";
import RecentApplicationsCard from "../components/dashboard/RecentApplicationsCard.jsx";
import StatsCard from "../components/dashboard/StatsCard.jsx";
import JobListingsCard from "../components/dashboard/JobListingsCard.jsx";
import ChatbotCard from "../components/dashboard/ChatbotCard.jsx";
import UpcomingInterviewsCard from "../components/dashboard/UpcomingInterviewsCard.jsx";
import CandidateInsightsCard from "../components/dashboard/CandidateInsightsCard.jsx";
import {
  Users,
  Briefcase,
  FileText,
  Clock,
  PieChart,
  CheckCircle,
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Applicants",
      value: "1,284",
      change: "+12%",
      isPositive: true,
      icon: <Users className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Open Positions",
      value: "24",
      change: "+3",
      isPositive: true,
      icon: <Briefcase className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Applications Today",
      value: "38",
      change: "+7%",
      isPositive: true,
      icon: <FileText className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Time to Hire (Avg)",
      value: "12 days",
      change: "-3 days",
      isPositive: true,
      icon: <Clock className="h-6 w-6 text-blue-600" />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="pt-2 pb-6">
        {/* <DashboardHeader HRemail="Hrn2b@example.com" /> */}

        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
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
      </div>
    </DashboardLayout>
  );
}
