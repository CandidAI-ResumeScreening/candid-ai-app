import React from "react";

const FutureVision = () => {
  return (
    <div className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Our Vision for the Future
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-blue-100 mx-auto">
            CandidAI is just the beginning of our journey to transform
            recruitment.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="bg-white bg-opacity-10 p-8 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Market Expansion
            </h3>
            <p className="text-gray-700">
              We aim to develop CandidAI beyond its academic roots into a
              commercial solution that can help organizations of all sizes
              improve their hiring processes.
            </p>
          </div>

          <div className="bg-white bg-opacity-10 p-8 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Technology Advancement
            </h3>
            <p className="text-gray-700">
              Our roadmap includes enhancing our AI models with deeper learning
              capabilities, expanding language support, and integrating video
              interview analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FutureVision;
