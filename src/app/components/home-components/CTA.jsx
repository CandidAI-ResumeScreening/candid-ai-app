//src/app/components/home-components/CTA.jsx
import React from "react";

const CTA = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-12 md:px-12 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Ready to transform your hiring process?
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Get in touch to learn how CandidAI can help your organization make
              better hiring decisions.
            </p>
            <div className="mt-8">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-base font-medium">
                Request Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;
