"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  FileText,
  MessageSquare,
  Search,
  Filter,
  ChevronDown,
  Loader2,
  AlertTriangle,
  Phone,
  Mail,
  CalendarDays,
  MapPin,
  Briefcase,
  Download,
  UserCircle,
  Clock,
  BarChart,
  GraduationCap,
  BookOpen,
  Award,
  LifeBuoy,
  X,
  Edit,
} from "lucide-react";

import DashboardHeader from "@/app/components/candidates-components/dashboard-header";
import useUserStore from "@/store/useUserStore";
import TalentTalk from "@/app/components/dashboard/TalentTalk"; // Import the TalentTalk component

export default function AllApplications() {
  const router = useRouter();
  const { user, isLoggedIn } = useUserStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);
  const [jobTitles, setJobTitles] = useState({});
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filterJobId, setFilterJobId] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [showTalentTalk, setShowTalentTalk] = useState(false); // State for showing TalentTalk

  // Check for authentication
  useEffect(() => {
    if (!isLoggedIn && typeof window !== "undefined") {
      router.push("/auth/login");
    }
  }, [isLoggedIn, router]);

  // Fetch all jobs for filter dropdown
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoadingJobs(true);
        const response = await fetch("/api/jobs");

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await response.json();
        setJobs(data.jobs || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchJobs();
  }, []);

  // Fetch applications with filters
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);

        let url = "/api/hr/all-applications?sort=" + sortBy;
        if (filterJobId) {
          url += `&jobId=${filterJobId}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }

        const data = await response.json();
        setApplications(data.applications || []);
        setJobTitles(data.jobTitlesMap || {});
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError(err.message || "Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchApplications();
    }
  }, [isLoggedIn, filterJobId, sortBy]);

  // Filter applications by search term
  const filteredApplications = useMemo(() => {
    if (!searchTerm.trim()) return applications;

    return applications.filter((app) => {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch =
        app.Name && app.Name.toLowerCase().includes(searchLower);
      const emailMatch =
        app.Email &&
        app.Email !== "Not specified" &&
        app.Email.toLowerCase().includes(searchLower);
      const phoneMatch =
        app.Phone && app.Phone.toLowerCase().includes(searchLower);
      const jobMatch =
        jobTitles[app.jobId] &&
        jobTitles[app.jobId].toLowerCase().includes(searchLower);
      const skillsMatch =
        app.Skills &&
        app.Skills.some((skill) => skill.toLowerCase().includes(searchLower));

      return nameMatch || emailMatch || phoneMatch || jobMatch || skillsMatch;
    });
  }, [applications, searchTerm, jobTitles]);

  // Format application date
  const formatDate = (date) => {
    return format(new Date(date), "MMM dd, yyyy h:mm a");
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "reviewing":
        return "bg-yellow-100 text-yellow-800";
      case "interviewed":
        return "bg-purple-100 text-purple-800";
      case "selected":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get score badge color
  const getScoreBadgeColor = (score) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-blue-500";
    if (score >= 70) return "bg-teal-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Get score class
  const getScoreClass = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-teal-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  // Show candidate details sidebar
  const viewCandidateDetails = (application) => {
    setSelectedApplication(application);
    setShowDetails(true);
  };
  // Navigate to edit candidate page
  const navigateToEditCandidate = (candidateId, jobId) => {
    router.push(`/dashboard/jobs/${jobId}/candidates/${candidateId}/edit`);
  };

  // Open TalentTalk chatbot
  const openTalentTalk = () => {
    setShowTalentTalk(true);
  };

  if (!isLoggedIn) {
    return null; // Will redirect due to useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <DashboardHeader />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <Link
                href="/dashboard"
                className="mr-4 text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                All Applications
              </h1>
            </div>

            <button
              onClick={openTalentTalk}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Consult TalentTalk
            </button>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                {/* Search */}
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search candidates by name, email, skills..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Job Filter */}
                <div className="relative w-full md:w-1/4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
                    value={filterJobId}
                    onChange={(e) => setFilterJobId(e.target.value)}
                  >
                    <option value="">All Jobs</option>
                    {jobs.map((job) => (
                      <option key={job._id} value={job._id}>
                        {job.title}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* Sort */}
                <div className="relative w-full md:w-1/4">
                  <select
                    className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest-score">Highest Score</option>
                    <option value="lowest-score">Lowest Score</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Applications Table */}
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <div className="inline-flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <span>{error}</span>
                </div>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500 text-lg">No applications found</p>
                <p className="text-gray-400 mt-2">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Applications will appear here once candidates apply to your job posts"}
                </p>
              </div>
            ) : (
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
                        Job
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
                        Score
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Resume
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApplications.map((application) => (
                      <tr key={application._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-600 font-medium">
                                {application.Name
                                  ? application.Name.charAt(0)
                                  : "?"}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {application.Name || "Unnamed Candidate"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {application.Email &&
                                application.Email !== "Not specified"
                                  ? application.Email
                                  : "No email provided"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {jobTitles[application.jobId] ||
                              application.jobTitle}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(application.appliedAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                              application.status
                            )}`}
                          >
                            {application.status.charAt(0).toUpperCase() +
                              application.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className={`text-sm font-medium ${getScoreClass(
                                application.score
                              )}`}
                            >
                              {application.score}%
                            </div>
                            <div className="ml-2 flex-1 w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getScoreBadgeColor(
                                  application.score
                                )}`}
                                style={{ width: `${application.score}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a
                            href={application.resumeFileLocation}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900"
                            title="Download Resume"
                          >
                            <FileText className="h-5 w-5" />
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => viewCandidateDetails(application)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Candidate Details Modal - Centered */}
      {showDetails && selectedApplication && (
        <div className="fixed inset-0 overflow-hidden z-20">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowDetails(false)}
            ></div>
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <div className="relative max-w-md w-full bg-white shadow-xl overflow-y-auto rounded-lg max-h-[90vh]">
                {/* Header */}
                <div className="px-4 py-6 bg-blue-600 sm:px-6 sticky top-0 z-10">
                  <div className="flex items-start justify-between">
                    <h2
                      className="text-lg font-medium text-white"
                      id="slide-over-heading"
                    >
                      Candidate Details
                    </h2>
                    <div className="ml-3 h-7 flex items-center">
                      <button
                        onClick={() => setShowDetails(false)}
                        className="bg-blue-600 rounded-md text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                      >
                        <span className="sr-only">Close panel</span>
                        <X className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Candidate Info */}
                <div className="relative flex-1 px-4 py-6 sm:px-6">
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div>
                      <div className="flex flex-col items-center mb-4">
                        <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                          <UserCircle className="h-12 w-12 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {selectedApplication.Name || "Unnamed Candidate"}
                        </h3>
                        <p className="text-gray-500">
                          {selectedApplication["Job Role"] || "Applicant"}
                        </p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-md mb-6">
                        <div className="text-lg font-medium text-blue-800 mb-2">
                          Match Score: {selectedApplication.score}%
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                          <div
                            className={`${getScoreBadgeColor(
                              selectedApplication.score
                            )} h-2.5 rounded-full`}
                            style={{ width: `${selectedApplication.score}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-blue-600 mt-1">
                          {selectedApplication.thresholdPass
                            ? "Passed threshold"
                            : "Below threshold"}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-gray-700">
                            {selectedApplication.Email &&
                            selectedApplication.Email !== "Not specified"
                              ? selectedApplication.Email
                              : "No email provided"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-gray-700">
                            {selectedApplication.Phone || "No phone provided"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <CalendarDays className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-gray-700">
                            Applied on{" "}
                            {formatDate(selectedApplication.appliedAt)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-gray-700">
                            Applied for:{" "}
                            {jobTitles[selectedApplication.jobId] ||
                              selectedApplication.jobTitle}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-gray-700">
                            Experience:{" "}
                            {selectedApplication["Experience level"] ||
                              "Not specified"}{" "}
                            (
                            {selectedApplication[
                              "Total Estimated Years of Experience"
                            ] || "0"}{" "}
                            years)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                        <Award className="h-4 w-4 mr-1" /> Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedApplication.Skills &&
                        selectedApplication.Skills.length > 0 ? (
                          selectedApplication.Skills.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">No skills listed</p>
                        )}
                      </div>
                    </div>

                    {/* Education */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                        <GraduationCap className="h-4 w-4 mr-1" /> Education
                      </h4>
                      {selectedApplication["Education Details"] &&
                      selectedApplication["Education Details"].length > 0 ? (
                        <div className="space-y-4">
                          {selectedApplication["Education Details"].map(
                            (edu, index) => (
                              <div
                                key={index}
                                className="border-l-2 border-blue-500 pl-4 py-2"
                              >
                                <div className="font-medium">
                                  {edu["education level"] || "Degree"} in{" "}
                                  {edu["field of study"] || "Not specified"}
                                </div>
                                <div className="text-gray-600 text-sm">
                                  {edu.institution || "Unknown Institution"}
                                </div>
                                <div className="text-gray-500 text-sm flex justify-between">
                                  <span>
                                    {edu["date completed"] ||
                                      "Date not specified"}
                                  </span>
                                  <span>
                                    {edu["grade level"] ||
                                      "Grade not specified"}
                                  </span>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500">
                          No education details provided
                        </p>
                      )}
                    </div>

                    {/* Experience */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                        <Briefcase className="h-4 w-4 mr-1" /> Experience
                      </h4>
                      {selectedApplication["Experience Details"] &&
                      selectedApplication["Experience Details"].length > 0 ? (
                        <div className="space-y-4">
                          {selectedApplication["Experience Details"].map(
                            (exp, index) => (
                              <div
                                key={index}
                                className="border-l-2 border-blue-500 pl-4 py-2"
                              >
                                <div className="font-medium">
                                  {exp.Roles || "Role not specified"}
                                </div>
                                <div className="text-gray-600 text-sm">
                                  {exp["Industry Name"] ||
                                    "Company not specified"}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500">
                          No experience details provided
                        </p>
                      )}
                    </div>

                    {/* Certifications */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" /> Certifications
                      </h4>
                      {selectedApplication.Certification &&
                      selectedApplication.Certification.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1">
                          {selectedApplication.Certification.map(
                            (cert, index) => (
                              <li key={index} className="text-gray-700">
                                {cert}
                              </li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p className="text-gray-500">
                          No certifications listed
                        </p>
                      )}
                    </div>

                    {/* Resume Download */}
                    <div>
                      <a
                        href={selectedApplication.resumeFileLocation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full justify-center"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Resume
                      </a>
                    </div>

                    {/* Talent Talk Button */}
                    <div>
                      <button
                        onClick={openTalentTalk}
                        className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md shadow-sm text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full justify-center"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Ask TalentTalk About This Candidate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TalentTalk Modal */}
      {showTalentTalk && (
        <TalentTalk
          candidates={applications}
          onClose={() => setShowTalentTalk(false)}
          context="general"
        />
      )}
    </div>
  );
}
