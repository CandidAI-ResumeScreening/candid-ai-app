import React from "react";

const Achievements = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Project Recognition
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            CandidAI has been recognized for its innovative approach to
            recruitment technology.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <div className="text-5xl font-bold text-blue-600 mb-2">A+</div>
            <p className="text-gray-700 font-medium">Academic Evaluation</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <div className="text-5xl font-bold text-blue-600 mb-2">3</div>
            <p className="text-gray-700 font-medium">
              Industry Partnership Inquiries
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <div className="text-5xl font-bold text-blue-600 mb-2">1st</div>
            <p className="text-gray-700 font-medium">
              Place in University Tech Showcase
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
