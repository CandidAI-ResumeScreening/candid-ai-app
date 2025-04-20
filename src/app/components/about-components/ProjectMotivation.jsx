import React from "react";

const ProjectMotivation = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Project Motivation
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Academic Foundation
            </h3>
            <p className="text-gray-600">
              As final-year Computer Science students, we aimed to create a
              project that applies cutting-edge AI technologies to solve
              real-world problems. CandidAI represents the culmination of our
              studies in machine learning, natural language processing, and
              decision-making systems.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Real-World Impact
            </h3>
            <p className="text-gray-600">
              Through our research, we discovered that HR professionals spend an
              average of 23 hours screening resumes for a single hire. We were
              inspired to create a solution that not only saves time but also
              promotes fairness and objectivity in the hiring process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectMotivation;
