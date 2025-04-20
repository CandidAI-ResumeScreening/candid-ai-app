import React from "react";
import { HardHat, Clock } from "lucide-react";

const UnderConstruction = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-xl text-center bg-white p-10 rounded-xl shadow-md">
        <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
          <HardHat className="h-10 w-10 text-blue-600" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
          Page Under Construction
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          We're currently working hard to bring this page to life. It will be
          available in the near future.
        </p>
        <div className="flex items-center justify-center text-blue-600 font-medium space-x-2">
          <Clock className="h-5 w-5" />
          <span>Stay tuned for updates!</span>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;
