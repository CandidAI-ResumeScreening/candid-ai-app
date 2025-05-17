// src/app/components/jobs/SuccessDialog.jsx
"use client";

import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import useJobStore from "@/store/useJobStore";

export default function SuccessDialog() {
  const router = useRouter();
  const { reset } = useJobStore();

  // Handle creating another job
  const handleCreateAnother = () => {
    reset();
  };

  // Handle navigating back to dashboard
  const handleBackToDashboard = () => {
    reset();
    router.push("/dashboard");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Job Created Successfully!
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Your job has been posted successfully. Candidates can now apply for
            this position.
          </p>

          <div className="mt-6 flex justify-center space-x-4">
            <button
              type="button"
              onClick={handleCreateAnother}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Another Job
            </button>

            <button
              type="button"
              onClick={handleBackToDashboard}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
