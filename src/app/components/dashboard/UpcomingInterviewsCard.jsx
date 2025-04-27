// src/components/dashboard/UpcomingInterviewsCard.js
import Link from "next/link";
import { Calendar, ArrowRight, Clock } from "lucide-react";

export default function UpcomingInterviewsCard() {
  const interviews = [
    {
      id: 1,
      candidate: "Alex Morgan",
      position: "UX Designer",
      time: "Today, 2:00 PM",
      type: "Video Call",
    },
    {
      id: 2,
      candidate: "Jessica Chen",
      position: "Product Manager",
      time: "Tomorrow, 10:00 AM",
      type: "In Person",
    },
    {
      id: 3,
      candidate: "Robert Smith",
      position: "Backend Developer",
      time: "May 2, 3:30 PM",
      type: "Video Call",
    },
  ];

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">
            Upcoming Interviews
          </h2>
        </div>
        <Link
          href="/dashboard/interviews"
          className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          View all
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      <div className="px-6 py-4">
        <div className="space-y-3">
          {interviews.map((interview) => (
            <div
              key={interview.id}
              className="flex items-start p-3 hover:bg-gray-50 rounded-md"
            >
              <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-3">
                <div className="flex items-center">
                  <h3 className="text-sm font-medium text-gray-900">
                    {interview.candidate}
                  </h3>
                  <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {interview.type}
                  </span>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  <p>{interview.position}</p>
                  <p className="mt-1">{interview.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
