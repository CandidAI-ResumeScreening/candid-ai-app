"use client";

import { Users, Check, X } from "lucide-react";

export default function CandidatesOverviewCard({ data }) {
  if (!data) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="flex flex-col space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const { totalCandidates, selectedCandidates, rejectedCandidates } = data;

  // Calculate selection and rejection rates
  const selectionRate =
    totalCandidates > 0
      ? Math.round((selectedCandidates / totalCandidates) * 100)
      : 0;

  const rejectionRate =
    totalCandidates > 0
      ? Math.round((rejectedCandidates / totalCandidates) * 100)
      : 0;

  // Determine recruitment status for styling
  let recruitmentStatus = "balanced"; // default

  if (selectionRate > 50) {
    recruitmentStatus = "high-selection";
  } else if (rejectionRate > 70) {
    recruitmentStatus = "high-rejection";
  }

  // Colors based on recruitment status
  const getTitleColor = () => {
    switch (recruitmentStatus) {
      case "high-selection":
        return "text-green-700";
      case "high-rejection":
        return "text-red-700";
      default:
        return "text-purple-700";
    }
  };

  const getBackgroundColor = () => {
    switch (recruitmentStatus) {
      case "high-selection":
        return "bg-green-50";
      case "high-rejection":
        return "bg-red-50";
      default:
        return "bg-purple-50";
    }
  };

  return (
    <div
      className={`shadow-sm rounded-lg overflow-hidden ${getBackgroundColor()}`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Candidates Overview
          </h2>
          <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Total Candidates</span>
            <span className="text-2xl font-bold text-gray-900">
              {totalCandidates}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-gray-500">Selected</span>
            </div>
            <div className="flex items-center">
              <span className="text-xl font-semibold text-green-600">
                {selectedCandidates}
              </span>
              <span className="ml-2 text-sm text-gray-500">
                ({selectionRate}%)
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <X className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-gray-500">Rejected</span>
            </div>
            <div className="flex items-center">
              <span className="text-xl font-semibold text-red-600">
                {rejectedCandidates}
              </span>
              <span className="ml-2 text-sm text-gray-500">
                ({rejectionRate}%)
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center">
            <span className="text-gray-500">Recruitment Status</span>
            <span
              className={`ml-auto text-lg font-semibold ${getTitleColor()}`}
            >
              {recruitmentStatus === "high-selection" && "High Selection Rate"}
              {recruitmentStatus === "high-rejection" && "High Rejection Rate"}
              {recruitmentStatus === "balanced" && "Balanced"}
            </span>
          </div>

          <div className="mt-3">
            <div className="text-sm text-gray-600">
              {recruitmentStatus === "high-selection" &&
                "Your job requirements align well with applicants"}
              {recruitmentStatus === "high-rejection" &&
                "Consider reviewing job requirements or sourcing"}
              {recruitmentStatus === "balanced" &&
                "Your selection process is well balanced"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
