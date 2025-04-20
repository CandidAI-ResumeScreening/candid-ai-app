import React from "react";

const Research = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Research-Backed Approach
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            CandidAI is built on sound academic principles and innovative
            technologies.
          </p>
        </div>

        <div className="mt-12">
          <div className="space-y-12">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Competitive Analysis
                </h3>
                <p className="text-gray-600">
                  We conducted extensive research on existing solutions,
                  identifying gaps and opportunities for innovation in AI-driven
                  recruitment.
                </p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Multi-Stage Decision Models
                </h3>
                <p className="text-gray-600">
                  Our ranking system uses Multi-Criteria Decision Making (MCDM)
                  techniques to evaluate candidates across multiple dimensions.
                </p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Bias Mitigation
                </h3>
                <p className="text-gray-600">
                  We implement algorithms specifically designed to identify and
                  reduce unconscious bias in the screening process.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Technological Innovation
              </h3>
              <p className="text-gray-600 mb-6">
                CandidAI integrates multiple advanced technologies to create a
                comprehensive solution:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>
                  Optical Character Recognition (OCR) for document parsing
                </li>
                <li>
                  Natural Language Processing (NLP) for semantic understanding
                </li>
                <li>Fuzzy Logic for handling uncertainty in decision-making</li>
                <li>
                  Multi-Criteria Decision Making (MCDM) for objective candidate
                  ranking
                </li>
                <li>Conversational AI for the TalentTalk Chatbot assistant</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Research;
