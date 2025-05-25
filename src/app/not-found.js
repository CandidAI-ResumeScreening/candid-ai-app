"use client";

import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/">
                  <span className="text-xl font-bold text-blue-600">
                    CandidAI
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 404 Content */}
      <div className="flex-grow flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Search className="h-12 w-12 text-blue-600" />
            </div>

            <h1 className="text-6xl font-extrabold text-gray-900 sm:text-7xl">
              <span className="block text-blue-600">404</span>
            </h1>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Page Not Found
            </h2>

            <p className="mt-4 text-xl text-gray-500 max-w-md mx-auto">
              We could not find the page you are looking for. It might have been
              moved or deleted.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleGoBack}
                className="bg-white hover:bg-gray-50 text-blue-600 px-6 py-3 rounded-md text-base font-medium border border-blue-600 flex items-center cursor-pointer"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
              </button>

              <Link
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-base font-medium"
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <span className="text-xl font-bold text-white">CandidAI</span>
            </div>

            <p className="mt-4 md:mt-0 text-gray-400">
              &copy; {new Date().getFullYear()} CandidAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
