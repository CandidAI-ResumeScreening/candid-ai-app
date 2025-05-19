"use client";

import { Briefcase, Clock } from "lucide-react";

export default function JobsOverviewCard({ data }) {
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

  const { totalJobs, activeJobs, closedJobs, avgDaysToDeadline } = data;

  // Determine schedule status for styling
  let scheduleStatus = "balanced"; // default

  if (activeJobs > 5 && avgDaysToDeadline < 7) {
    scheduleStatus = "tight";
  } else if (activeJobs > 0 && avgDaysToDeadline > 30) {
    scheduleStatus = "relaxed";
  }

  // Colors based on schedule status
  const getTitleColor = () => {
    switch (scheduleStatus) {
      case "tight":
        return "text-amber-700";
      case "relaxed":
        return "text-green-700";
      default:
        return "text-blue-700";
    }
  };

  const getBackgroundColor = () => {
    switch (scheduleStatus) {
      case "tight":
        return "bg-amber-50";
      case "relaxed":
        return "bg-green-50";
      default:
        return "bg-blue-50";
    }
  };

  return (
    <div
      className={`shadow-sm rounded-lg overflow-hidden ${getBackgroundColor()}`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Jobs Overview</h2>
          <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-blue-600" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Total Jobs</span>
            <span className="text-2xl font-bold text-gray-900">
              {totalJobs}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500">Active Jobs</span>
            <span className="text-xl font-semibold text-blue-600">
              {activeJobs}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500">Closed Jobs</span>
            <span className="text-xl font-semibold text-gray-600">
              {closedJobs}
            </span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-500">Avg. Days to Deadline</span>
            <span className={`ml-auto text-xl font-bold ${getTitleColor()}`}>
              {avgDaysToDeadline}
            </span>
          </div>

          <div className="mt-3">
            <div className="text-sm text-gray-600">
              {scheduleStatus === "tight" &&
                "You have a tight schedule for active jobs"}
              {scheduleStatus === "balanced" &&
                "Your job schedule is well balanced"}
              {scheduleStatus === "relaxed" &&
                "Your job deadlines are comfortably distanced"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
