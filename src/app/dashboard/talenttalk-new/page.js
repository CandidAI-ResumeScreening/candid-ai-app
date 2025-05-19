"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  MessageSquare,
  UserSearch,
  Users,
  Briefcase,
  GraduationCap,
  Brain,
  CheckCircle,
  Clock,
} from "lucide-react";
import DashboardHeader from "@/app/components/dashboard/TalenttalkNew-header";
import useUserStore from "@/store/useUserStore";
import TalentTalkNew from "@/app/components/dashboard/TalentTalkNew";
import { Button } from "@/components/ui/button";

export default function TalentTalkNewPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useUserStore();
  const [isClient, setIsClient] = useState(false);
  const [showTalentTalk, setShowTalentTalk] = useState(false);

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

  // Function to handle closing the TalentTalk modal
  const handleCloseTalentTalk = () => {
    setShowTalentTalk(false);
  };

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
              href="/dashboard"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to dashboard
            </Link>
          </div>

          {/* Welcome Content */}
          <div className="bg-white shadow-md rounded-lg p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="bg-blue-100 p-4 rounded-full">
                  <MessageSquare className="h-10 w-10 text-blue-600" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
                TalentTalk HR Assistant
              </h1>

              <p className="text-lg text-center text-gray-600 mb-8 max-w-2xl mx-auto">
                Your AI-powered HR assistant for candidate analysis, resume
                screening, and recruitment insights. Get intelligent
                recommendations to help you find the perfect match for your job
                openings.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <UserSearch className="h-8 w-8 text-blue-600 mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Resume Analysis
                  </h3>
                  <p className="text-gray-600">
                    Extract skills, experience, and qualifications from
                    candidate resumes automatically.
                  </p>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <Briefcase className="h-8 w-8 text-blue-600 mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Job Matching
                  </h3>
                  <p className="text-gray-600">
                    Compare candidates against job requirements to identify the
                    best potential fits.
                  </p>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <Users className="h-8 w-8 text-blue-600 mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Candidate Comparison
                  </h3>
                  <p className="text-gray-600">
                    Compare multiple candidates side-by-side with detailed
                    insights on their strengths.
                  </p>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <GraduationCap className="h-8 w-8 text-blue-600 mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Skills Assessment
                  </h3>
                  <p className="text-gray-600">
                    Identify skills gaps and training opportunities for
                    potential candidates.
                  </p>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <Brain className="h-8 w-8 text-blue-600 mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Intelligent Insights
                  </h3>
                  <p className="text-gray-600">
                    Get AI-powered recommendations and analysis on your talent
                    pool.
                  </p>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <Clock className="h-8 w-8 text-blue-600 mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Time Saving
                  </h3>
                  <p className="text-gray-600">
                    Reduce recruitment time by automating candidate screening
                    and analysis.
                  </p>
                </div>
              </div>

              {/* Getting Started Section */}
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Getting Started
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <p className="text-gray-700">
                      <span className="font-medium">Ask about candidates:</span>{" "}
                      TalentTalk can analyze candidate resumes and provide
                      insights on skills, experience, and education.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <p className="text-gray-700">
                      <span className="font-medium">Job matching:</span> Ask
                      TalentTalk to compare candidates against job requirements
                      and recommend the best matches.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <p className="text-gray-700">
                      <span className="font-medium">Recruitment advice:</span>{" "}
                      TalentTalk can suggest interview questions, provide
                      insights on candidate pools, and help with recruitment
                      strategies.
                    </p>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center">
                <Button
                  onClick={() => setShowTalentTalk(true)}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Start Conversation
                </Button>
                <p className="mt-4 text-sm text-gray-500">
                  You can also access TalentTalk directly from the AI Assistants
                  menu in the dashboard header
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* TalentTalk Modal */}
      {showTalentTalk && <TalentTalkNew onClose={handleCloseTalentTalk} />}
    </div>
  );
}
