"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/useUserStore";
import useJobStore from "@/store/useJobStore";
import DashboardHeader from "@/app/components/dashboard/dashboard-header";
import JobFormStepper from "@/app/components/jobs/JobFormStepper";
import StepOne from "@/app/components/jobs/StepOne";
import StepTwo from "@/app/components/jobs/StepTwo";
import StepThree from "@/app/components/jobs/StepThree";
import StepFour from "@/app/components/jobs/StepFour";
import StepFive from "@/app/components/jobs/StepFive";
import StepSix from "@/app/components/jobs/StepSix";
import StepSeven from "@/app/components/jobs/StepSeven";
import SuccessDialog from "@/app/components/jobs/SuccessDialog";

export default function CreateJobPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useUserStore();
  const { currentStep, submitSuccess, reset } = useJobStore();
  // Add a state to track if we're on the client
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true on the client side
    setIsClient(true);
    // Reset form on initial load
    reset();
  }, [reset]);

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
            <div className="bg-white shadow-sm rounded-lg p-6 md:p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Create New Job Post
              </h1>

              {/* Stepper */}
              <JobFormStepper />

              {/* Form Steps */}
              <div className="mt-8">
                {currentStep === 1 && <StepOne />}
                {currentStep === 2 && <StepTwo />}
                {currentStep === 3 && <StepThree />}
                {currentStep === 4 && <StepFour />}
                {currentStep === 5 && <StepFive />}
                {currentStep === 6 && <StepSix />}
                {currentStep === 7 && <StepSeven />}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Success Dialog */}
      {submitSuccess && <SuccessDialog />}
    </div>
  );
}
