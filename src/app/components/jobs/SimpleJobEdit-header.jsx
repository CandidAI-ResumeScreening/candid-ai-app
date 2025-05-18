import React from "react";

const SimpleJobEditHeader = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
            CandidAI
          </Link>
          <Link href="/dashboard" className="text-blue-600">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
};

export default SimpleJobEditHeader;
