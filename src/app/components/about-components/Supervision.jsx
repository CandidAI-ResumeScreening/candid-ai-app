import React from "react";
import { Mail, Phone } from "lucide-react";

const Supervision = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-12 md:p-12">
            {/* Intro Section - always on top */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-gray-900">
                Project Supervision:
              </h3>
              <p className="mt-3 text-lg text-gray-500">
                CandidAI was developed under the guidance of our academic
                supervisors.
              </p>
            </div>

            {/* Supervisor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Supervisor 1 */}
              <div>
                <div className="text-lg font-medium text-gray-900">
                  Dr. R. Rimiru
                </div>
                <p className="text-gray-500">
                  Lecturer, Department of Computer Science, JKUAT
                </p>
                <div className="mt-4 flex flex-col space-y-2">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">rimiru@jkuat.ac.ke</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">+254 729 110 513</span>
                  </div>
                </div>
              </div>

              {/* Supervisor 2 */}
              <div>
                <div className="text-lg font-medium text-gray-900">
                  Dr. Kungu
                </div>
                <p className="text-gray-500">
                  Lecturer, Department of Computer Science, JKUAT
                </p>
                <div className="mt-4 flex flex-col space-y-2">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">k.kungu@jkuat.ac.ke</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">+254 720 612 994</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Supervision;
