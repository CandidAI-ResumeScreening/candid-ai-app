// src/app/components/home-components/Features.jsx
import { ArrowRight } from "lucide-react";
const Features = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Key Modules
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            CandidAI combines powerful technologies to create a seamless
            screening experience.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-600 h-2"></div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Resume Parser
                </h3>
                <p className="text-gray-600 mb-4">
                  Automatically extracts and structures information from CVs
                  using advanced OCR technology.
                </p>
                <div className="flex items-center text-blue-600 font-medium">
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-600 h-2"></div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  NLP Classifier
                </h3>
                <p className="text-gray-600 mb-4">
                  Intelligently analyzes text to identify skills, experience,
                  and qualifications.
                </p>
                <div className="flex items-center text-blue-600 font-medium">
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-600 h-2"></div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Ranking System
                </h3>
                <p className="text-gray-600 mb-4">
                  Uses MCDM and Fuzzy Logic to fairly score and rank candidates
                  based on job requirements.
                </p>
                <div className="flex items-center text-blue-600 font-medium">
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-600 h-2"></div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  HR Dashboard
                </h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive interface for monitoring, comparing, and
                  shortlisting candidates.
                </p>
                <div className="flex items-center text-blue-600 font-medium">
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-600 h-2"></div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  TalentTalk Chatbot
                </h3>
                <p className="text-gray-600 mb-4">
                  Interactive assistant for recruiters to query candidate data
                  and get instant insights.
                </p>
                <div className="flex items-center text-blue-600 font-medium">
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
