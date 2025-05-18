"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, MapPin, Briefcase, ArrowRight } from "lucide-react";
// import Navbar from "../components/home-components/Navbar";
import Navbar from "../components/applyjobs-component/Navbar";
import Footer from "../components/home-components/Footer";
import { jobCategories } from "@/lib/constants";

export default function ApplyJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryGroups, setCategoryGroups] = useState({});

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/public/jobs");

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await response.json();
        setJobs(data.jobs || []);

        // Group jobs by category
        const groups = {};
        data.jobs.forEach((job) => {
          if (!groups[job.category]) {
            groups[job.category] = [];
          }
          groups[job.category].push(job);
        });

        setCategoryGroups(groups);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Format deadline date
  const formatDeadline = (deadline) => {
    return format(new Date(deadline), "MMMM dd, yyyy");
  };

  // Truncate description for card view
  const truncateDescription = (description, maxLength = 150) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Available Jobs
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Browse our open positions and find your perfect match
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <svg
                className="animate-spin h-10 w-10 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md inline-block">
                {error}
              </div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">
                No open positions available at the moment. Please check back
                later.
              </p>
            </div>
          ) : (
            // Display jobs grouped by category
            Object.entries(categoryGroups).map(([category, categoryJobs]) => (
              <div key={category} className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryJobs.map((job) => (
                    <div
                      key={job._id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {job.title}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <Briefcase className="h-4 w-4 mr-2" />
                          <span>{job.companyName}</span>
                        </div>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600 mb-4">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Apply by: {formatDeadline(job.deadline)}</span>
                        </div>
                        <div className="text-gray-700 mb-6 h-24 overflow-hidden">
                          {truncateDescription(job.jobDescription)}
                        </div>
                        <Link href={`/applyjobs/${job._id}`}>
                          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center">
                            Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
