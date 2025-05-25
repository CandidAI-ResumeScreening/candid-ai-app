// src/app/dashboard/jobs/[id]/applicants/page.js - Updated with edit candidate functionality
"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  X,
  Upload,
  Users,
  CheckCircle,
  Edit,
} from "lucide-react";
import DashboardHeader from "@/app/components/jobs/dashboard-header";
import useUserStore from "@/store/useUserStore";
import TalentTalk from "@/app/components/dashboard/TalentTalk";

export default function JobApplicantsPage({ params }) {
  const router = useRouter();
  const { user, isLoggedIn } = useUserStore();

  // State variables
  // Unwrap the params using React.use()
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;

  const [loading, setLoading] = useState(true);
  const [jobLoading, setJobLoading] = useState(true);
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("applied");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [uploadingResumes, setUploadingResumes] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  // Add this state variable inside your component
  const [showTalentTalk, setShowTalentTalk] = useState(false);

  // Modify the openTalentTalk function
  const openTalentTalk = () => {
    setShowTalentTalk(true);
  };

  // Navigate to edit candidate page
  const navigateToEditCandidate = (candidateId) => {
    router.push(`/dashboard/jobs/${id}/candidates/${candidateId}/edit`);
  };

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (isClient && !isLoggedIn) {
      router.push("/auth/login");
    }
  }, [isClient, isLoggedIn, router]);

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!isClient || !isLoggedIn || !id) return;

      try {
        setJobLoading(true);
        const response = await fetch(`/api/jobs/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch job details");
        }

        const data = await response.json();
        setJob(data.job);
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Failed to load job details");
      } finally {
        setJobLoading(false);
      }
    };

    fetchJobDetails();
  }, [isClient, isLoggedIn, id]);

  // Fetch all applications for this job
  useEffect(() => {
    const fetchApplications = async () => {
      if (!isClient || !isLoggedIn || !id) return;

      try {
        setLoading(true);
        // Get applications for this specific job
        const response = await fetch(`/api/hr/all-applications?jobId=${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }

        const data = await response.json();
        setApplications(data.applications || []);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [isClient, isLoggedIn, id]);

  // Filter applications based on active tab and search term
  useEffect(() => {
    if (applications.length === 0) {
      setFilteredApplications([]);
      return;
    }

    // Filter by status based on active tab
    let filteredByStatus = applications;

    if (activeTab === "applied") {
      filteredByStatus = applications.filter((app) => app.status === "applied");
    } else if (activeTab === "interviewing") {
      filteredByStatus = applications.filter(
        (app) => app.status === "reviewing"
      );
    } else if (activeTab === "hired") {
      filteredByStatus = applications.filter(
        (app) => app.status === "selected"
      );
    } else if (activeTab === "rejected") {
      filteredByStatus = applications.filter(
        (app) => app.status === "rejected"
      );
    }

    // Apply search filter if search term exists
    if (searchTerm.trim() === "") {
      setFilteredApplications(filteredByStatus);
    } else {
      const searchFilter = filteredByStatus.filter((app) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const nameMatch =
          app.Name && app.Name.toLowerCase().includes(lowerSearchTerm);
        const emailMatch =
          app.Email && app.Email.toLowerCase().includes(lowerSearchTerm);
        const phoneMatch =
          app.Phone && app.Phone.toLowerCase().includes(lowerSearchTerm);
        const skillsMatch =
          app.Skills &&
          app.Skills.some((skill) =>
            skill.toLowerCase().includes(lowerSearchTerm)
          );

        return nameMatch || emailMatch || phoneMatch || skillsMatch;
      });

      setFilteredApplications(searchFilter);
    }
  }, [applications, activeTab, searchTerm]);

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

  // Get score text color
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

  // Update application status
  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const response = await fetch(
        `/api/hr/application-status/${applicationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update application status");
      }

      // Update the application status in the state
      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      // If the selected application is being updated, update it as well
      if (selectedApplication && selectedApplication._id === applicationId) {
        setSelectedApplication({ ...selectedApplication, status: newStatus });
      }

      // Show success message
      setUploadSuccess(`Application status updated to ${newStatus}`);
      setTimeout(() => setUploadSuccess(null), 3000);
    } catch (error) {
      console.error("Error updating application status:", error);
      setUploadError("Failed to update application status. Please try again.");
      setTimeout(() => setUploadError(null), 3000);
    }
  };

  // Handle bulk resume upload
  const handleBulkUpload = async (e) => {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    setUploadingResumes(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      // Track success and failures
      let successCount = 0;
      let failureCount = 0;

      // Process each file sequentially
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Create form data for parsing
        const parseFormData = new FormData();
        parseFormData.append("resume", file);

        // Step 1: Parse the resume
        const parseResponse = await fetch("/api/parse", {
          method: "POST",
          body: parseFormData,
        });

        if (!parseResponse.ok) {
          failureCount++;
          continue;
        }

        const parsedData = await parseResponse.json();

        // Step 2: Submit the application
        const applicationFormData = new FormData();
        applicationFormData.append("resume", file);
        applicationFormData.append("jobId", id);
        applicationFormData.append("parsedData", JSON.stringify(parsedData));

        const applicationResponse = await fetch("/api/public/apply", {
          method: "POST",
          body: applicationFormData,
        });

        if (applicationResponse.ok) {
          successCount++;
        } else {
          failureCount++;
        }
      }

      // Refresh applications list
      if (successCount > 0) {
        // Fetch updated applications
        const response = await fetch(`/api/hr/all-applications?jobId=${id}`);
        if (response.ok) {
          const data = await response.json();
          setApplications(data.applications || []);
        }

        setUploadSuccess(
          `Successfully processed ${successCount} out of ${files.length} resumes`
        );
      }

      if (failureCount > 0) {
        setUploadError(`Failed to process ${failureCount} resumes`);
      }
    } catch (error) {
      console.error("Error uploading resumes:", error);
      setUploadError("An error occurred during bulk upload");
    } finally {
      setUploadingResumes(false);
      // Clear the file input
      e.target.value = "";
    }
  };

  if (!isClient) {
    // Initial loading state
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
          </div>
        </main>
      </div>
    );
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
                href="/dashboard/jobs/view"
                className="mr-4 text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                {jobLoading ? "Loading..." : job ? job.title : "Applications"}
              </h1>
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              {/* Upload Resumes Button */}
              <div className="relative">
                <input
                  type="file"
                  id="bulk-resume-upload"
                  multiple
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleBulkUpload}
                  className="hidden"
                  disabled={uploadingResumes}
                />
                <label
                  htmlFor="bulk-resume-upload"
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    uploadingResumes
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                  }`}
                >
                  {uploadingResumes ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Resumes
                    </>
                  )}
                </label>
              </div>

              {/* TalentTalk Button */}
              <button
                onClick={openTalentTalk}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                TalentTalk
              </button>
            </div>
          </div>

          {/* Upload status messages */}
          {uploadSuccess && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          {uploadError && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Job Details Card */}
          {job && (
            <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Company</span>
                  <p className="font-medium">{job.companyName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Location</span>
                  <p className="font-medium">{job.location}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Deadline</span>
                  <p className="font-medium">
                    {format(new Date(job.deadline), "MMMM dd, yyyy")}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">
                    Total Applicants
                  </span>
                  <p className="font-medium">{job.applications || 0}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab("applied")}
                  className={`${
                    activeTab === "applied"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                >
                  Applied
                </button>
                <button
                  onClick={() => setActiveTab("interviewing")}
                  className={`${
                    activeTab === "interviewing"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                >
                  Interviewing
                </button>
                <button
                  onClick={() => setActiveTab("hired")}
                  className={`${
                    activeTab === "hired"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                >
                  Hired
                </button>
                <button
                  onClick={() => setActiveTab("rejected")}
                  className={`${
                    activeTab === "rejected"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                >
                  Rejected
                </button>
              </nav>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
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
                    : `No applicants in the "${activeTab}" status category`}
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
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                              <div
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                                onClick={() =>
                                  navigateToEditCandidate(application._id)
                                }
                              >
                                {application.Name || "Unnamed Candidate"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {application.Email || "No email"}
                              </div>
                            </div>
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
                          <div className="flex space-x-2 justify-end">
                            <button
                              onClick={() => viewCandidateDetails(application)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              View
                            </button>
                            <button
                              onClick={() =>
                                navigateToEditCandidate(application._id)
                              }
                              className="text-emerald-600 hover:text-emerald-900"
                              title="Edit Candidate"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
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

      {/* Candidate Details Modal */}
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

                      {/* Score Card */}
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

                      {/* Current Status & Actions */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                          Current Status
                        </h4>
                        <div className="flex items-center justify-between border rounded-md p-3">
                          <span
                            className={`px-2 inline-flex text-xs// src/app/dashboard/jobs/[id]/applicants/page.js - Continuation
                            leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                              selectedApplication.status
                            )}`}
                          >
                            {selectedApplication.status
                              .charAt(0)
                              .toUpperCase() +
                              selectedApplication.status.slice(1)}
                          </span>

                          <div className="flex space-x-2">
                            {selectedApplication.status !== "reviewing" && (
                              <button
                                onClick={() =>
                                  updateApplicationStatus(
                                    selectedApplication._id,
                                    "reviewing"
                                  )
                                }
                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                              >
                                Set to Interviewing
                              </button>
                            )}

                            {selectedApplication.status !== "selected" && (
                              <button
                                onClick={() =>
                                  updateApplicationStatus(
                                    selectedApplication._id,
                                    "selected"
                                  )
                                }
                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                Set to Hired
                              </button>
                            )}

                            {selectedApplication.status !== "rejected" && (
                              <button
                                onClick={() =>
                                  updateApplicationStatus(
                                    selectedApplication._id,
                                    "rejected"
                                  )
                                }
                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                Set to Rejected
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-gray-700">
                            {selectedApplication.Email || "No email provided"}
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
                          <Clock className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-gray-700">
                            Experience Level:{" "}
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

                    {/* Edit Candidate Button */}
                    <div>
                      <button
                        onClick={() => {
                          setShowDetails(false); // Close details modal
                          navigateToEditCandidate(selectedApplication._id);
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 w-full justify-center"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Candidate
                      </button>
                    </div>

                    {/* TalentTalk Button */}
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
          jobDetails={job}
          onClose={() => setShowTalentTalk(false)}
          context="jobSpecific"
        />
      )}
    </div>
  );
}
