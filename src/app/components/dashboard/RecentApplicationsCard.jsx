// src/components/dashboard/RecentApplicationsCard.js
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function RecentApplicationsCard() {
  const applications = [
    {
      id: 1,
      name: "Michael Johnson",
      position: "Senior Frontend Developer",
      dateApplied: "2 hours ago",
      status: "New",
      statusColor: "bg-blue-100 text-blue-800",
      matchScore: 92,
    },
    {
      id: 2,
      name: "Sarah Lee",
      position: "UX/UI Designer",
      dateApplied: "5 hours ago",
      status: "Reviewed",
      statusColor: "bg-green-100 text-green-800",
      matchScore: 87,
    },
    {
      id: 3,
      name: "David Kim",
      position: "Product Manager",
      dateApplied: "1 day ago",
      status: "Interview",
      statusColor: "bg-purple-100 text-purple-800",
      matchScore: 84,
    },
    {
      id: 4,
      name: "Emily Wilson",
      position: "Data Scientist",
      dateApplied: "1 day ago",
      status: "New",
      statusColor: "bg-blue-100 text-blue-800",
      matchScore: 78,
    },
    {
      id: 5,
      name: "James Rodriguez",
      position: "Backend Developer",
      dateApplied: "2 days ago",
      status: "Reviewed",
      statusColor: "bg-green-100 text-green-800",
      matchScore: 76,
    },
  ];

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          Recent Applications
        </h2>
        <Link
          href="/dashboard/applications"
          className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          View all
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Candidate
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Position
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date Applied
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Match Score
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((application) => (
              <tr key={application.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {application.name.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {application.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {application.position}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {application.dateApplied}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${application.statusColor}`}
                  >
                    {application.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">
                      {application.matchScore}%
                    </div>
                    <div className="ml-2 flex-1 w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          application.matchScore >= 90
                            ? "bg-green-500"
                            : application.matchScore >= 80
                            ? "bg-blue-500"
                            : application.matchScore >= 70
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${application.matchScore}%` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
