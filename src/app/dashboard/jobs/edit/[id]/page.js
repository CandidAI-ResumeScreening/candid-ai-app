// src/app/dashboard/jobs/edit/[id]/page.js
"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Wand2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DashboardHeader from "@/app/components/jobs/dashboard-header";
import useUserStore from "@/store/useUserStore";
import ComboBox from "@/app/components/jobs/ComboBox";
import {
  jobCategories,
  experienceLevels,
  educationLevels,
  educationGrades,
} from "@/lib/constants";

export default function EditJobPage({ params }) {
  const router = useRouter();
  const { user, isLoggedIn } = useUserStore();

  // Unwrap the params using React.use()
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;

  // State for job data
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [scores, setScores] = useState(null);

  // State for form fields
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    deadline: null,
    companyName: "",
    location: "",
    salary: "",
    skills: [],
    experienceLevel: "",
    yearsOfExperience: "",
    educationLevel: "",
    fieldOfStudy: "",
    grade: "",
    jobDescription: "",
    status: "active",
    weights: {
      skills: 25,
      experienceLevel: 25,
      yearsOfExperience: 25,
      education: 25,
    },
  });

  // State for skill input
  const [skillInput, setSkillInput] = useState("");

  // State for generation fields
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [generationError, setGenerationError] = useState(null);
  const [generationSuccess, setGenerationSuccess] = useState(false);

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
    const fetchJob = async () => {
      if (!isClient || !isLoggedIn || !id) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/jobs/${id}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch job details");
        }

        const data = await response.json();
        const jobData = data.job;

        // Format deadline as Date object
        const deadlineDate = jobData.deadline
          ? new Date(jobData.deadline)
          : null;

        // Prepare the formData
        setFormData({
          title: jobData.title || "",
          category: jobData.category || "",
          deadline: deadlineDate,
          companyName: jobData.companyName || "",
          location: jobData.location || "",
          salary: jobData.salary || "",
          skills: jobData.skills || [],
          experienceLevel: jobData.experienceLevel || "",
          yearsOfExperience: jobData.yearsOfExperience?.toString() || "",
          educationLevel: jobData.educationLevel || "",
          fieldOfStudy: jobData.fieldOfStudy || "",
          grade: jobData.grade || "",
          jobDescription: jobData.jobDescription || "",
          status: jobData.status || "active",
          weights: jobData.weights || {
            skills: 25,
            experienceLevel: 25,
            yearsOfExperience: 25,
            education: 25,
          },
        });

        setJob(jobData);
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Failed to load job. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [isClient, isLoggedIn, id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested weight fields
    if (name.startsWith("weight_")) {
      const weightKey = name.replace("weight_", "");
      const weightValue = parseInt(value, 10) || 0;

      setFormData((prev) => ({
        ...prev,
        weights: {
          ...prev.weights,
          [weightKey]: weightValue,
        },
      }));
    } else {
      // Handle normal fields
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle skill input
  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  // Handle date change
  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      deadline: date,
    }));
  };

  // Handle form step navigation
  const nextStep = () => {
    setCurrentStep(2);
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  // Generate job description with AI
  const generateJobDescription = async () => {
    setIsGeneratingDescription(true);
    setGenerationError(null);
    setGenerationSuccess(false);

    // Validate required fields
    if (!formData.title || !formData.companyName) {
      setGenerationError(
        "Job title and company name are required for generation"
      );
      setIsGeneratingDescription(false);
      return;
    }

    try {
      // Format the education info
      const educationInfo = formData.grade ? `Grade: ${formData.grade}` : "";

      // Build prompt for job description
      const prompt = `Write a concise and professional job description for a ${
        formData.title
      } position at ${formData.companyName}. 
      Category: ${formData.category || "Not specified"}
      Location: ${formData.location || "Not specified"}
      Salary: ${formData.salary || "Not specified"}
      Required Skills: ${
        formData.skills.length > 0
          ? formData.skills.join(", ")
          : "Not specified"
      }
      Experience Level: ${formData.experienceLevel || "Not specified"}
      Years of Experience: ${formData.yearsOfExperience || "Not specified"}
      Minimum Education: ${formData.educationLevel || "Not specified"}${
        formData.fieldOfStudy ? ` in ${formData.fieldOfStudy}` : ""
      }
      ${educationInfo ? educationInfo : ""}
      
      The description should be written in full sentences without headings or bullet points. Just number the paragraphs. Include a brief introduction about the company, the key job requirements (education, skills, and experience), the main responsibilities, and the expected salary if provided. Keep the entire description under two paragraphs. Use a formal and professional tone.`;

      // Send request to generate job description
      const response = await fetch("/api/generate-job-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to generate job description"
        );
      }

      const data = await response.json();

      // Update form data with generated description
      setFormData((prev) => ({
        ...prev,
        jobDescription: data.jobDescription,
      }));

      setGenerationSuccess(true);
    } catch (error) {
      console.error("Error generating job description:", error);
      setGenerationError(
        error.message ||
          "Failed to generate job description. Please try again or write your own."
      );
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  // Update job and rescore applicants
  const handleSubmit = async () => {
    // Validate form data
    if (
      !formData.title ||
      !formData.category ||
      !formData.deadline ||
      !formData.companyName ||
      !formData.location ||
      !formData.salary ||
      formData.skills.length === 0 ||
      !formData.experienceLevel ||
      !formData.yearsOfExperience ||
      !formData.educationLevel ||
      !formData.jobDescription
    ) {
      setError("Please fill in all required fields");
      return;
    }

    // Check if weights add up to 100
    const totalWeight = Object.values(formData.weights).reduce(
      (sum, weight) => sum + weight,
      0
    );
    if (totalWeight !== 100) {
      setError("Weights must add up to 100%");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Step 1: Update the job
      const response = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update job");
      }

      const updatedJobData = await response.json();

      // Step 2: Update applicant scores
      const scoreResponse = await fetch(
        `/api/hr/update-applicant-scores/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!scoreResponse.ok) {
        const errorData = await scoreResponse.json();
        throw new Error(
          errorData.message || "Failed to update applicant scores"
        );
      }

      const scoreData = await scoreResponse.json();
      setScores(scoreData);

      // Set success message
      setSuccessMessage(
        `Job "${formData.title}" updated successfully. ${scoreData.updatedCount} candidate scores were updated.`
      );

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Error updating job:", err);
      setError(err.message || "Failed to update job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Common input styles
  const inputStyles = `block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`;

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
          {/* Back button */}
          <div className="mb-6">
            <Link
              href="/dashboard/jobs/view"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to job listings
            </Link>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Edit Job Post
            </h1>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
              </div>
            ) : job ? (
              <div>
                {/* Step indicator */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          currentStep === 1
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        1
                      </div>
                      <div className="h-1 w-16 mx-2 bg-gray-200">
                        <div
                          className={`h-full ${
                            currentStep === 2 ? "bg-blue-600" : "bg-gray-200"
                          }`}
                        ></div>
                      </div>
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          currentStep === 2
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        2
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Step {currentStep} of 2
                    </div>
                  </div>
                </div>

                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Basic Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Job Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Job Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          className={inputStyles}
                          required
                        />
                      </div>

                      {/* Job Category */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Job Category <span className="text-red-500">*</span>
                        </label>
                        <ComboBox
                          options={jobCategories}
                          value={formData.category}
                          onChange={(value) =>
                            setFormData({ ...formData, category: value })
                          }
                          placeholder="Select job category"
                          required
                        />
                      </div>

                      {/* Deadline */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Application Deadline{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <DatePicker
                            selected={formData.deadline}
                            onChange={handleDateChange}
                            minDate={new Date()}
                            className={inputStyles}
                            dateFormat="MMMM d, yyyy"
                          />
                        </div>
                      </div>

                      {/* Company Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          className={inputStyles}
                          required
                        />
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Location <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className={inputStyles}
                          required
                        />
                      </div>

                      {/* Salary */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Salary <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="salary"
                          value={formData.salary}
                          onChange={handleChange}
                          className={inputStyles}
                          required
                        />
                      </div>

                      {/* Job Status */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Job Status <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className={inputStyles}
                          required
                        >
                          <option value="active">Active</option>
                          <option value="closed">Closed</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Required Skills <span className="text-red-500">*</span>
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          className={`${inputStyles} rounded-r-none`}
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
                          className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.skills.map((skill, index) => (
                          <div
                            key={index}
                            className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="ml-1 text-blue-600 hover:text-blue-800"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="mt-8 flex justify-end">
                      <button
                        type="button"
                        onClick={nextStep}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Additional Information and Submit */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Additional Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Experience Level */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Experience Level{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="experienceLevel"
                          value={formData.experienceLevel}
                          onChange={handleChange}
                          className={inputStyles}
                          required
                        >
                          <option value="">Select experience level</option>
                          {experienceLevels.map((level) => (
                            <option key={level} value={level.toLowerCase()}>
                              {level}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Years of Experience */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Years of Experience{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="yearsOfExperience"
                          value={formData.yearsOfExperience}
                          onChange={handleChange}
                          className={inputStyles}
                          min="0"
                          step="0.5"
                          required
                        />
                      </div>

                      {/* Education Level */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Education Level{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="educationLevel"
                          value={formData.educationLevel}
                          onChange={handleChange}
                          className={inputStyles}
                          required
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
                        <label className="block text-sm font-medium text-gray-700">
                          Field of Study
                        </label>
                        <input
                          type="text"
                          name="fieldOfStudy"
                          value={formData.fieldOfStudy}
                          onChange={handleChange}
                          className={inputStyles}
                          placeholder="e.g., Computer Science"
                        />
                      </div>

                      {/* Grade */}
                      {/* Grade */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Grade/GPA
                        </label>
                        <ComboBox
                          options={educationGrades}
                          value={formData.grade}
                          onChange={(value) =>
                            setFormData({ ...formData, grade: value })
                          }
                          placeholder="Select a grade or enter GPA"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Select a grade from the list or type a custom GPA
                          value
                        </p>
                      </div>
                    </div>

                    {/* Weights */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Scoring Weights
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Adjust the importance of each factor for candidate
                        scoring. Total must equal 100%.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Skills Weight
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                              type="number"
                              name="weight_skills"
                              value={formData.weights.skills}
                              onChange={handleChange}
                              min="0"
                              max="100"
                              className={inputStyles}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">
                                %
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Experience Level Weight
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                              type="number"
                              name="weight_experienceLevel"
                              value={formData.weights.experienceLevel}
                              onChange={handleChange}
                              min="0"
                              max="100"
                              className={inputStyles}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">
                                %
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Years of Experience Weight
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                              type="number"
                              name="weight_yearsOfExperience"
                              value={formData.weights.yearsOfExperience}
                              onChange={handleChange}
                              min="0"
                              max="100"
                              className={inputStyles}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">
                                %
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Education Weight
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                              type="number"
                              name="weight_education"
                              value={formData.weights.education}
                              onChange={handleChange}
                              min="0"
                              max="100"
                              className={inputStyles}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">
                                %
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2">
                        <div
                          className={`text-sm ${
                            Object.values(formData.weights).reduce(
                              (sum, w) => sum + w,
                              0
                            ) === 100
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          Total:{" "}
                          {Object.values(formData.weights).reduce(
                            (sum, w) => sum + w,
                            0
                          )}
                          %
                          {Object.values(formData.weights).reduce(
                            (sum, w) => sum + w,
                            0
                          ) !== 100 && " (Must equal 100%)"}
                        </div>
                      </div>
                    </div>

                    {/* Job Description with AI Generation */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Job Description{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={generateJobDescription}
                          disabled={isGeneratingDescription}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                        >
                          {isGeneratingDescription ? (
                            <>
                              <Loader2 className="animate-spin h-4 w-4 mr-2" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Wand2 className="h-4 w-4 mr-2" />
                              Generate with AI
                            </>
                          )}
                        </button>
                      </div>

                      {/* Generation messages */}
                      {generationError && (
                        <div className="mb-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                          {generationError}
                        </div>
                      )}

                      {generationSuccess && (
                        <div className="mb-2 p-2 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
                          Job description generated successfully!
                        </div>
                      )}

                      <textarea
                        name="jobDescription"
                        value={formData.jobDescription}
                        onChange={handleChange}
                        rows="8"
                        className={inputStyles}
                        required
                      ></textarea>
                    </div>

                    {/* Navigation */}
                    <div className="mt-8 flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  Job not found or no longer available.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
