// src/app/components/home-components/ProblemStatement.jsx
import { Shield, Clock, ChartBar } from "lucide-react";
const ProblemStatement = () => {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            The Hiring Challenge
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Modern recruitment teams face overwhelming problems that traditional
            methods can't solve.
          </p>
        </div>

        <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
          <div className="bg-blue-50 rounded-lg p-8 flex flex-col items-center text-center">
            <div className="bg-blue-100 rounded-full p-3 mb-4">
              <ChartBar className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Volume Overload
            </h3>
            <p className="text-gray-600">
              HR teams struggle to efficiently process hundreds of applications
              per position.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-8 flex flex-col items-center text-center">
            <div className="bg-blue-100 rounded-full p-3 mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Evaluation Inconsistency
            </h3>
            <p className="text-gray-600">
              Manual screening leads to inconsistent evaluation criteria and
              standards.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-8 flex flex-col items-center text-center">
            <div className="bg-blue-100 rounded-full p-3 mb-4">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Bias in Hiring
            </h3>
            <p className="text-gray-600">
              Unconscious bias affects hiring decisions, creating unfair
              outcomes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemStatement;
