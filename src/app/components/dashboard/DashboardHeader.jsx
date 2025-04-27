import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function DashboardHeader({ HRemail }) {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Company name */}
          <Link href="/dashboard" className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-blue-600">CandidAI</span>
          </Link>

          {/* Right side container for the title and profile dropdown */}
          <div className="flex items-center space-x-6">
            {/* Title for the Dashboard */}
            <h1 className="text-xl font-bold text-gray-900">{HRemail}</h1>

            {/* Profile dropdown */}
            <div className="relative">
              <button className="flex items-center space-x-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium">HR</span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
