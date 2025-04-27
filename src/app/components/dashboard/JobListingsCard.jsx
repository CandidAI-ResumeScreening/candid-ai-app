// src/components/dashboard/JobListingsCard.js
import Link from "next/link";
import { Plus, ArrowRight, Users } from "lucide-react";

export default function JobListingsCard() {
  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote",
      applicants: 24,
      daysLeft: 5,
    },
    {
      id: 2,
      title: "UX/UI Designer",
      department: "Design",
      location: "Nairobi",
      applicants: 18,
      daysLeft: 7,
    },
    {
      id: 3,
      title: "Product Manager",
      department: "Product",
      location: "Remote",
      applicants: 12,
      daysLeft: 9,
    },
  ];

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          Active Job Listings
        </h2>
        <button className="flex items-center text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded">
          <Plus className="mr-1 h-4 w-4" />
          Post Job
        </button>
      </div>
      <div className="px-6 py-4">
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border border-gray-200 rounded-md p-4 hover:bg-gray-50"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {job.title}
                  </h3>
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    <span>{job.department}</span>
                    <span className="mx-2">•</span>
                    <span>{job.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 text-gray-400 mr-1" />
                    <span>{job.applicants} applicants</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {job.daysLeft} days left
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link
            href="/dashboard/jobs"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all positions
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
