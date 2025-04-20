//src/app/components/home-components/Benefits.jsx
import { Shield, Clock, ChartBar, MessageSquare } from "lucide-react";
const Benefits = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Core Benefits
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            CandidAI transforms the hiring process with measurable improvements.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Efficiency</h3>
              <p className="mt-2 text-gray-500">
                Reduces hiring time by 80% with automated screening.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Fairness</h3>
              <p className="mt-2 text-gray-500">
                Eliminates unconscious bias with objective evaluation.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                <ChartBar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Customizable
              </h3>
              <p className="mt-2 text-gray-500">
                Adapts ranking criteria to specific job requirements.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Support</h3>
              <p className="mt-2 text-gray-500">
                AI assistant helps recruiters make informed decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Benefits;
