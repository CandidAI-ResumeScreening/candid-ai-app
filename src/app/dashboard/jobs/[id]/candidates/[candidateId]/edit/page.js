// src/app/dashboard/jobs/[id]/candidates/[candidateId]/edit/page.js
"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertTriangle,
  CheckCircle,
  X,
  Plus,
} from "lucide-react";
import DashboardHeader from "@/app/components/jobs/dashboard-header";
import useUserStore from "@/store/useUserStore";

export default function EditCandidatePage({ params }) {
  const router = useRouter();
  const { user, isLoggedIn } = useUserStore();
  const unwrappedParams = React.use(params);
  const { id: jobId, candidateId } = unwrappedParams;

  // States
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Phone: "",
    "Experience level": "",
    "Total Estimated Years of Experience": "",
    Skills: [],
    score: 0,
    "Education Details": [],
  });

  // New skill input
  const [newSkill, setNewSkill] = useState("");

  // Education form state
  const [newEducation, setNewEducation] = useState({
    "education level": "",
    "field of study": "",
    institution: "",
    "date completed": "",
    "grade level": "",
  });

  // Experience levels for dropdown
  const experienceLevels = ["Entry", "Intermediate", "Expert"];
  // Education levels for dropdown
  const educationLevels = [
    "Post-Doctoral",
    "PhD",
    "Master's Degree",
    "Bachelor's Degree",
    "Associate Degree",
    "Diploma",
    "Certificate",
    "Vocational Training",
    "Secondary Education",
    "None",
  ];

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

  // Fetch candidate data
  useEffect(() => {
    const fetchCandidate = async () => {
      if (!isClient || !isLoggedIn || !candidateId) return;

      try {
        setLoading(true);
        // First fetch all applications for the job
        const response = await fetch(`/api/hr/all-applications?jobId=${jobId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch candidates");
        }

        const data = await response.json();
        const applications = data.applications || [];

        // Find the specific candidate by ID
        const foundCandidate = applications.find(
          (app) => app._id === candidateId
        );

        if (!foundCandidate) {
          throw new Error("Candidate not found");
        }

        setCandidate(foundCandidate);

        // Initialize form data with candidate's data
        setFormData({
          Name: foundCandidate.Name || "",
          Email: foundCandidate.Email || "",
          Phone: foundCandidate.Phone || "",
          "Experience level": foundCandidate["Experience level"] || "",
          "Total Estimated Years of Experience":
            foundCandidate["Total Estimated Years of Experience"] || "",
          Skills: foundCandidate.Skills || [],
          score: foundCandidate.score || 0,
          "Education Details": foundCandidate["Education Details"] || [],
        });
      } catch (err) {
        console.error("Error fetching candidate:", err);
        setError("Failed to load candidate details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [isClient, isLoggedIn, jobId, candidateId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // For score, ensure it's a number between 0-100
    if (name === "score") {
      const numValue = Math.min(Math.max(parseInt(value) || 0, 0), 100);
      setFormData((prev) => ({
        ...prev,
        [name]: numValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle skill management
  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.Skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        Skills: [...prev.Skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      Skills: prev.Skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  // Handle education field changes
  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setNewEducation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add new education entry
  const handleAddEducation = () => {
    // Check if essential fields are filled
    if (newEducation["education level"] && newEducation["field of study"]) {
      setFormData((prev) => ({
        ...prev,
        "Education Details": [
          ...prev["Education Details"],
          { ...newEducation },
        ],
      }));

      // Reset form
      setNewEducation({
        "education level": "",
        "field of study": "",
        institution: "",
        "date completed": "",
        "grade level": "",
      });
    }
  };

  // Remove education entry
  const handleRemoveEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      "Education Details": prev["Education Details"].filter(
        (_, i) => i !== index
      ),
    }));
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const response = await fetch(`/api/hr/update-candidate/${candidateId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update candidate");
      }

      setSuccess("Candidate updated successfully!");

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Error updating candidate:", err);
      setError(err.message || "Failed to update candidate. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Common input styles
  const inputStyles =
    "block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back button */}
          <div className="mb-6">
            <Link
              href={`/dashboard/jobs/${jobId}/applicants`}
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to applicants
            </Link>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-blue-600">
              <h1 className="text-xl font-bold text-white">Edit Candidate</h1>
            </div>

            {/* Success Message */}
            {success && (
              <div className="m-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>{success}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="m-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
              </div>
            ) : !candidate ? (
              <div className="p-6 text-center">
                <p className="text-gray-600">
                  Candidate not found or inaccessible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <h2 className="text-lg font-medium text-gray-900 border-b pb-2">
                  Basic Information
                </h2>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="Name"
                      value={formData.Name}
                      onChange={handleChange}
                      className={inputStyles}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="Email"
                      value={formData.Email}
                      onChange={handleChange}
                      className={inputStyles}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="Phone"
                      value={formData.Phone}
                      onChange={handleChange}
                      className={inputStyles}
                    />
                  </div>

                  {/* Score */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Score (0-100) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="score"
                      value={formData.score}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className={inputStyles}
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      The candidate will{" "}
                      {formData.score >= 50 ? "pass" : "not pass"} the threshold
                    </p>
                  </div>
                </div>

                {/* Experience */}
                <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mt-8">
                  Experience
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Experience Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience Level
                    </label>
                    <select
                      name="Experience level"
                      value={formData["Experience level"]}
                      onChange={handleChange}
                      className={inputStyles}
                    >
                      <option value="">Select experience level</option>
                      {experienceLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Years of Experience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      name="Total Estimated Years of Experience"
                      value={formData["Total Estimated Years of Experience"]}
                      onChange={handleChange}
                      min="0"
                      step="0.1"
                      className={inputStyles}
                    />
                  </div>
                </div>

                {/* Skills */}
                <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mt-8">
                  Skills
                </h2>
                <div>
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className={`${inputStyles} flex-grow`}
                      placeholder="Add a skill"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.Skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-1 p-1 rounded-full hover:bg-blue-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {formData.Skills.length === 0 && (
                      <p className="text-gray-500 text-sm">No skills added</p>
                    )}
                  </div>
                </div>

                {/* Education */}
                <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mt-8">
                  Education
                </h2>

                {/* Current Education Entries */}
                <div className="space-y-4">
                  {formData["Education Details"].map((edu, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-md relative"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveEducation(index)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">
                            {edu["education level"] || "Degree"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {edu["field of study"]
                              ? `in ${edu["field of study"]}`
                              : ""}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            {edu["institution"] || "Institution not specified"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {edu["date completed"]
                              ? `Completed: ${edu["date completed"]}`
                              : ""}
                            {edu["grade level"]
                              ? ` • Grade: ${edu["grade level"]}`
                              : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Education Entry */}
                <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-md">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Add Education
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Education Level */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Education Level <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="education level"
                        value={newEducation["education level"]}
                        onChange={handleEducationChange}
                        className={inputStyles}
                      >
                        <option value="">Select education level</option>
                        {educationLevels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Field of Study */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Field of Study <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="field of study"
                        value={newEducation["field of study"]}
                        onChange={handleEducationChange}
                        className={inputStyles}
                        placeholder="e.g., Computer Science"
                      />
                    </div>

                    {/* Institution */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Institution
                      </label>
                      <input
                        type="text"
                        name="institution"
                        value={newEducation["institution"]}
                        onChange={handleEducationChange}
                        className={inputStyles}
                        placeholder="e.g., University Name"
                      />
                    </div>

                    {/* Date Completed */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Date Completed
                      </label>
                      <input
                        type="text"
                        name="date completed"
                        value={newEducation["date completed"]}
                        onChange={handleEducationChange}
                        className={inputStyles}
                        placeholder="e.g., May 2022"
                      />
                    </div>

                    {/* Grade Level */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Grade
                      </label>
                      <input
                        type="text"
                        name="grade level"
                        value={newEducation["grade level"]}
                        onChange={handleEducationChange}
                        className={inputStyles}
                        placeholder="e.g., 3.8 GPA, First Class"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddEducation}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education Entry
                  </button>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
