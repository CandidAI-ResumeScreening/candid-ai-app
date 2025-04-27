// src/components/dashboard/CandidateInsightsCard.js
import { PieChart, ArrowRight } from "lucide-react";

export default function CandidateInsightsCard() {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <PieChart className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">
            Candidate Insights
          </h2>
        </div>
        <button className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500">
          Details
          <ArrowRight className="ml-1 h-4 w-4" />
        </button>
      </div>
      <div className="px-6 py-4">
        <div className="space-y-4">
          {/* Skills Distribution */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Top Skills in Applicant Pool
            </h3>
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">JavaScript</span>
                  <span className="text-gray-900 font-medium">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "78%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">React</span>
                  <span className="text-gray-900 font-medium">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "65%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Node.js</span>
                  <span className="text-gray-900 font-medium">42%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "42%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Experience Distribution */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Experience Level
            </h3>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-blue-50 rounded p-2">
                <div className="text-xs text-gray-500">Junior</div>
                <div className="text-lg font-semibold text-blue-600">35%</div>
              </div>
              <div className="bg-blue-50 rounded p-2">
                <div className="text-xs text-gray-500">Mid</div>
                <div className="text-lg font-semibold text-blue-600">42%</div>
              </div>
              <div className="bg-blue-50 rounded p-2">
                <div className="text-xs text-gray-500">Senior</div>
                <div className="text-lg font-semibold text-blue-600">18%</div>
              </div>
              <div className="bg-blue-50 rounded p-2">
                <div className="text-xs text-gray-500">Lead</div>
                <div className="text-lg font-semibold text-blue-600">5%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
