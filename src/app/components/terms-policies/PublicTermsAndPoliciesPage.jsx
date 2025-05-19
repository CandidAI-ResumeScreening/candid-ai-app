// src/app/components/terms-policies/PublicTermsAndPoliciesPage.jsx
import React from "react";
import Link from "next/link";
import Navbar from "@/app/components/terms-policies/navbar";
import Footer from "@/app/components/home-components/Footer";
import {
  Shield,
  UserCheck,
  Globe,
  AlertTriangle,
  FileText,
  Lock,
} from "lucide-react";

export default function PublicTermsAndPoliciesPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Terms and Policies
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              CandidAI is committed to transparency in how we operate and handle
              data.
            </p>
          </div>

          {/* Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-16">
            {/* Terms of Service */}
            <div>
              <div className="bg-blue-50 p-6 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-blue-800 flex items-center">
                  <Shield className="h-6 w-6 mr-2" />
                  Terms of Service
                </h2>
                <p className="mt-2 text-gray-600">Last updated: May 2025</p>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    Service Usage
                  </h3>
                  <p className="mt-3 text-gray-600">
                    CandidAI provides an AI-powered recruitment platform
                    intended for legitimate hiring purposes only. Users agree to
                    use the service responsibly and in compliance with all
                    applicable laws and regulations regarding hiring practices
                    and data protection.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    User Accounts
                  </h3>
                  <p className="mt-3 text-gray-600">
                    Users are responsible for maintaining the confidentiality of
                    their account credentials and for all activities occurring
                    under their account. CandidAI accounts are for individual
                    use and may not be shared.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    Job Postings
                  </h3>
                  <p className="mt-3 text-gray-600">
                    Users may only post legitimate job opportunities and must
                    ensure all posted job information is accurate and complies
                    with employment laws. CandidAI reserves the right to remove
                    job postings that violate our policies or applicable laws.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    Resume Data
                  </h3>
                  <p className="mt-3 text-gray-600">
                    Users uploading resumes affirm they have obtained
                    appropriate consent from candidates to process their
                    information through our platform. Users are responsible for
                    removing candidate data when no longer needed.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    AI Recommendations
                  </h3>
                  <p className="mt-3 text-gray-600">
                    CandidAI uses AI algorithms to analyze and rank candidates.
                    While we strive for accuracy, users acknowledge that AI
                    recommendations should complement, not replace, human
                    judgment in hiring decisions.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    Service Modifications
                  </h3>
                  <p className="mt-3 text-gray-600">
                    CandidAI reserves the right to modify, suspend, or
                    discontinue any aspect of the service at any time, with or
                    without notice.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy Policy */}
            <div>
              <div className="bg-blue-50 p-6 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-blue-800 flex items-center">
                  <Lock className="h-6 w-6 mr-2" />
                  Privacy Policy
                </h2>
                <p className="mt-2 text-gray-600">Last updated: May 2025</p>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    Data Collection
                  </h3>
                  <p className="mt-3 text-gray-600">
                    CandidAI collects information provided during account
                    registration, job posting, and resume uploading processes.
                    This includes personal information such as names, email
                    addresses, and resume content.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    Data Usage
                  </h3>
                  <p className="mt-3 text-gray-600">
                    Collected data is used to provide and improve our services,
                    including resume parsing, candidate ranking, and generating
                    insights. We do not sell user data to third parties.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    Candidate Data
                  </h3>
                  <p className="mt-3 text-gray-600">
                    Resume data is processed and stored securely to facilitate
                    the hiring process. Users (employers) have control over
                    candidate data and are responsible for its appropriate
                    handling and deletion when no longer needed.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    Data Security
                  </h3>
                  <p className="mt-3 text-gray-600">
                    CandidAI implements appropriate security measures to protect
                    all stored data. However, no internet transmission is
                    completely secure, and we cannot guarantee absolute
                    security.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    Cookies
                  </h3>
                  <p className="mt-3 text-gray-600">
                    CandidAI uses cookies and similar technologies to enhance
                    user experience, analyze usage patterns, and manage
                    authentication sessions.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    Data Retention
                  </h3>
                  <p className="mt-3 text-gray-600">
                    User account data is retained while accounts remain active.
                    Job posting and candidate data retention periods can be
                    configured by users through the dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-16 text-center">
            <p className="text-gray-600">
              If you have any questions about our Terms of Service or Privacy
              Policy, please{" "}
              <Link
                href="/contact"
                className="text-blue-600 hover:text-blue-800"
              >
                contact us
              </Link>
              .
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
