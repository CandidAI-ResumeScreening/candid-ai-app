// src/app/components/jobs/StepSeven.jsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import useJobStore from "@/store/useJobStore";
import FormButtons from "./FormButtons";
import { educationLevels, experienceLevels } from "@/lib/constants";

export default function StepSeven() {
  // Get values and functions from store
  const {
    title,
    category,
    deadline,
    companyName,
    location,
    salary,
    skills,
    experienceLevel,
    yearsOfExperience,
    educationLevel,
    fieldOfStudy,
    educationGrade,
    gpa,
    jobDescription,
    weights,
    setSubmitting,
    setSubmitError,
    setSubmitSuccess,
  } = useJobStore();

  // Local state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle job submission
  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setSubmitting(true);

    try {
      // Format deadline date
      const formattedDeadline = deadline
        ? format(deadline, "yyyy-MM-dd")
        : null;

      // Prepare job data
      const jobData = {
        title,
        category,
        deadline: formattedDeadline,
        companyName,
        location,
        salary,
        skills,
        experienceLevel,
        yearsOfExperience: parseFloat(yearsOfExperience).toFixed(1),
        educationLevel,
        fieldOfStudy: fieldOfStudy || "Not specified",
        grade: educationGrade || gpa || "Not specified",
        jobDescription,
        weights,
        status: "active", // Explicitly set status to active
        createdAt: new Date().toISOString(),
      };

      // Send job data to API
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create job");
      }

      // Job created successfully
      setSubmitSuccess(true);
    } catch (err) {
      console.error("Error creating job:", err);
      setError(err.message || "An error occurred while creating the job");
      setSubmitError(err.message || "An error occurred while creating the job");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Review & Submit</h2>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Job Details</h3>

        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="border-t border-gray-200">
            <dl>
              {/* Basic Information */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Job Title</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {title}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {category}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Company</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {companyName}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Application Deadline
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {deadline
                    ? format(deadline, "MMMM dd, yyyy")
                    : "Not specified"}
                </dd>
              </div>

              {/* Location & Salary */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {location}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Salary</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {salary}
                </dd>
              </div>

              {/* Skills & Experience */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Required Skills
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Experience Level
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {experienceLevels.find(
                    (level) => level.toLowerCase() === experienceLevel
                  ) || experienceLevel}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Years of Experience
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {yearsOfExperience}
                </dd>
              </div>

              {/* Education */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Education Level
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {educationLevel}
                </dd>
              </div>
              {fieldOfStudy && (
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Field of Study
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {fieldOfStudy}
                  </dd>
                </div>
              )}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Minimum Grade
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {educationGrade || gpa || "Not specified"}
                </dd>
              </div>

              {/* Ranking Weights */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Ranking Weights
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <ul className="space-y-1">
                    <li>Skills: {weights.skills}%</li>
                    <li>Experience Level: {weights.experienceLevel}%</li>
                    <li>Years of Experience: {weights.yearsOfExperience}%</li>
                    <li>Education: {weights.education}%</li>
                  </ul>
                </dd>
              </div>

              {/* Job Description */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Job Description
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 whitespace-pre-line">
                  {jobDescription}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <FormButtons
        showSubmit={true}
        showReset={true}
        showNext={false}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
