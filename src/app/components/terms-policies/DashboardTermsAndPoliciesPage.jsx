// src/app/components/terms-policies/DashboardTermsAndPoliciesPage.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/app/components/account/dashboard-header";
import useUserStore from "@/store/useUserStore";
import {
  Shield,
  UserCheck,
  Globe,
  AlertTriangle,
  FileText,
  Lock,
} from "lucide-react";

export default function DashboardTermsAndPoliciesPage() {
  const router = useRouter();
  const { isLoggedIn } = useUserStore();
  const [activeTab, setActiveTab] = useState("terms");
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true on component mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (isClient && !isLoggedIn) {
      router.push("/auth/login");
    }
  }, [isClient, isLoggedIn, router]);

  // If not client-side yet, show loading
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />

      <main className="flex-1 overflow-auto py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Terms and Policies
          </h1>

          {/* Tab Navigation */}
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab("terms")}
                  className={`${
                    activeTab === "terms"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                >
                  Terms of Service
                </button>
                <button
                  onClick={() => setActiveTab("privacy")}
                  className={`${
                    activeTab === "privacy"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                >
                  Privacy Policy
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Terms of Service Tab */}
              {activeTab === "terms" && (
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Service Usage
                      </h3>
                      <p className="mt-2 text-gray-600">
                        CandidAI provides an AI-powered recruitment platform
                        intended for legitimate hiring purposes only. Users
                        agree to use the service responsibly and in compliance
                        with all applicable laws and regulations regarding
                        hiring practices and data protection.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <UserCheck className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        User Accounts
                      </h3>
                      <p className="mt-2 text-gray-600">
                        Users are responsible for maintaining the
                        confidentiality of their account credentials and for all
                        activities occurring under their account. CandidAI
                        accounts are for individual use and may not be shared.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Job Postings
                      </h3>
                      <p className="mt-2 text-gray-600">
                        Users may only post legitimate job opportunities and
                        must ensure all posted job information is accurate and
                        complies with employment laws. CandidAI reserves the
                        right to remove job postings that violate our policies
                        or applicable laws.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Resume Data
                      </h3>
                      <p className="mt-2 text-gray-600">
                        Users uploading resumes affirm they have obtained
                        appropriate consent from candidates to process their
                        information through our platform. Users are responsible
                        for removing candidate data when no longer needed.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Globe className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        AI Recommendations
                      </h3>
                      <p className="mt-2 text-gray-600">
                        CandidAI uses AI algorithms to analyze and rank
                        candidates. While we strive for accuracy, users
                        acknowledge that AI recommendations should complement,
                        not replace, human judgment in hiring decisions.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <AlertTriangle className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Service Modifications
                      </h3>
                      <p className="mt-2 text-gray-600">
                        CandidAI reserves the right to modify, suspend, or
                        discontinue any aspect of the service at any time, with
                        or without notice.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 text-sm text-gray-500">
                    <p>Last updated: May 2025</p>
                  </div>
                </div>
              )}

              {/* Privacy Policy Tab */}
              {activeTab === "privacy" && (
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Data Collection
                      </h3>
                      <p className="mt-2 text-gray-600">
                        CandidAI collects information provided during account
                        registration, job posting, and resume uploading
                        processes. This includes personal information such as
                        names, email addresses, and resume content.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Data Usage
                      </h3>
                      <p className="mt-2 text-gray-600">
                        Collected data is used to provide and improve our
                        services, including resume parsing, candidate ranking,
                        and generating insights. We do not sell user data to
                        third parties.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <UserCheck className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Candidate Data
                      </h3>
                      <p className="mt-2 text-gray-600">
                        Resume data is processed and stored securely to
                        facilitate the hiring process. Users (employers) have
                        control over candidate data and are responsible for its
                        appropriate handling and deletion when no longer needed.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Lock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Data Security
                      </h3>
                      <p className="mt-2 text-gray-600">
                        CandidAI implements appropriate security measures to
                        protect all stored data. However, no internet
                        transmission is completely secure, and we cannot
                        guarantee absolute security.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Globe className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Cookies
                      </h3>
                      <p className="mt-2 text-gray-600">
                        CandidAI uses cookies and similar technologies to
                        enhance user experience, analyze usage patterns, and
                        manage authentication sessions.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Data Retention
                      </h3>
                      <p className="mt-2 text-gray-600">
                        User account data is retained while accounts remain
                        active. Job posting and candidate data retention periods
                        can be configured by users through the dashboard.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 text-sm text-gray-500">
                    <p>Last updated: May 2025</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
