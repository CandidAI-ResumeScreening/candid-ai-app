import React from "react";

const Stats = () => {
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-blue-800">Active Jobs</h3>
        <p className="mt-2 text-3xl font-bold text-blue-600">0</p>
        <p className="mt-1 text-sm text-blue-500">
          Start posting jobs to see them here
        </p>
      </div>

      <div className="bg-green-50 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-green-800">Total Candidates</h3>
        <p className="mt-2 text-3xl font-bold text-green-600">0</p>
        <p className="mt-1 text-sm text-green-500">No candidates yet</p>
      </div>

      <div className="bg-purple-50 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-purple-800">
          Interviews Scheduled
        </h3>
        <p className="mt-2 text-3xl font-bold text-purple-600">0</p>
        <p className="mt-1 text-sm text-purple-500">No interviews scheduled</p>
      </div>
    </div>
  );
};

export default Stats;
