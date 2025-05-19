"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ApplicationPipeline({ data }) {
  const [showDetails, setShowDetails] = useState(false);

  if (!data) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
        <div className="h-16 bg-gray-200 rounded mb-4"></div>
      </div>
    );
  }

  const {
    totalCandidates,
    appliedCandidates,
    reviewingCandidates,
    selectedCandidates,
    rejectedCandidates,
  } = data;

  // Calculate percentages for the pipeline
  const getPercentage = (count) => {
    return totalCandidates > 0
      ? Math.round((count / totalCandidates) * 100)
      : 0;
  };

  const appliedPercentage = getPercentage(appliedCandidates);
  const reviewingPercentage = getPercentage(reviewingCandidates);
  const selectedPercentage = getPercentage(selectedCandidates);
  const rejectedPercentage = getPercentage(rejectedCandidates);

  return (
    <div>
      {/* Main Pipeline Visualization */}
      <div className="relative h-20 flex items-center mb-6">
        {totalCandidates > 0 ? (
          <>
            {/* Applied Stage */}
            <div
              className="h-full bg-blue-500 relative rounded-l-md"
              style={{
                width: `${appliedPercentage}%`,
                minWidth: appliedCandidates > 0 ? "40px" : "0",
              }}
            >
              {appliedPercentage >= 10 && (
                <div className="absolute inset-0 flex items-center justify-center text-white font-medium">
                  Applied
                </div>
              )}
            </div>

            {/* Reviewing Stage */}
            <div
              className="h-full bg-yellow-500 relative"
              style={{
                width: `${reviewingPercentage}%`,
                minWidth: reviewingCandidates > 0 ? "40px" : "0",
              }}
            >
              {reviewingPercentage >= 10 && (
                <div className="absolute inset-0 flex items-center justify-center text-white font-medium">
                  Reviewing
                </div>
              )}
            </div>

            {/* Selected Stage */}
            <div
              className="h-full bg-green-500 relative"
              style={{
                width: `${selectedPercentage}%`,
                minWidth: selectedCandidates > 0 ? "40px" : "0",
              }}
            >
              {selectedPercentage >= 10 && (
                <div className="absolute inset-0 flex items-center justify-center text-white font-medium">
                  Selected
                </div>
              )}
            </div>

            {/* Rejected Stage */}
            <div
              className="h-full bg-red-500 relative rounded-r-md"
              style={{
                width: `${rejectedPercentage}%`,
                minWidth: rejectedCandidates > 0 ? "40px" : "0",
              }}
            >
              {rejectedPercentage >= 10 && (
                <div className="absolute inset-0 flex items-center justify-center text-white font-medium">
                  Rejected
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
            No candidates in pipeline
          </div>
        )}
      </div>

      {/* Toggle button for details */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center text-sm text-blue-600 hover:text-blue-800 mb-3"
      >
        {showDetails ? (
          <>
            <ChevronUp className="h-4 w-4 mr-1" />
            Hide details
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4 mr-1" />
            Show details
          </>
        )}
      </button>

      {/* Detailed breakdown */}
      {showDetails && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          <div className="bg-blue-50 p-4 rounded-md">
            <div className="text-sm text-blue-800 mb-1">Applied</div>
            <div className="text-2xl font-bold text-blue-600">
              {appliedCandidates}
            </div>
            <div className="text-xs text-blue-500 mt-1">
              {appliedPercentage}% of total
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-md">
            <div className="text-sm text-yellow-800 mb-1">Reviewing</div>
            <div className="text-2xl font-bold text-yellow-600">
              {reviewingCandidates}
            </div>
            <div className="text-xs text-yellow-500 mt-1">
              {reviewingPercentage}% of total
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-md">
            <div className="text-sm text-green-800 mb-1">Selected</div>
            <div className="text-2xl font-bold text-green-600">
              {selectedCandidates}
            </div>
            <div className="text-xs text-green-500 mt-1">
              {selectedPercentage}% of total
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-md">
            <div className="text-sm text-red-800 mb-1">Rejected</div>
            <div className="text-2xl font-bold text-red-600">
              {rejectedCandidates}
            </div>
            <div className="text-xs text-red-500 mt-1">
              {rejectedPercentage}% of total
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
