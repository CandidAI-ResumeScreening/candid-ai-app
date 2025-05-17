"use client";

import { useState, useEffect } from "react";
import { Wand2, AlertTriangle, CheckCircle } from "lucide-react";
import useJobStore from "@/store/useJobStore";
import FormButtons from "./FormButtons";

export default function StepFive() {
  // Get values and functions from store
  const {
    jobDescription,
    setField,
    title,
    category,
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
  } = useJobStore();

  // Local state
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);
  const [generationSuccess, setGenerationSuccess] = useState(false);

  // Validation function
  const validateFields = () => {
    const newErrors = {};

    if (!jobDescription.trim()) {
      newErrors.jobDescription = "Job description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check validity when job description changes
  useEffect(() => {
    setIsValid(validateFields());
  }, [jobDescription]);

  // Handle text area changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setField(name, value);
    setGenerationSuccess(false);
  };

  // Common styles
  const textareaStyles = `block w-full rounded-md shadow-sm py-2.5 px-3 focus:outline-none sm:text-sm min-h-[12rem]`;
  const inputErrorStyles = (error) =>
    error
      ? "border-red-300 focus:border-red-300 focus:ring-red-500"
      : "border-gray-300 focus:border-blue-300 focus:ring-blue-500";

  // Create formatted education info string
  const getFormattedEducationInfo = () => {
    if (gpa) return `GPA: ${gpa}`;
    if (educationGrade) return `Grade: ${educationGrade}`;
    return "";
  };

  // Build comprehensive job description prompt
  const buildJobDescriptionPrompt = () => {
    const educationInfo = getFormattedEducationInfo();

    return `Create a professional job description for a ${title} position at ${companyName}.
Category: ${category || "Not specified"}
Location: ${location || "Not specified"}
Salary: ${salary || "Not specified"}
Required Skills: ${skills.length > 0 ? skills.join(", ") : "Not specified"}
Experience Level: ${experienceLevel || "Not specified"}
Years of Experience: ${yearsOfExperience || "Not specified"}
Minimum Education: ${educationLevel || "Not specified"}${
      fieldOfStudy ? ` in ${fieldOfStudy}` : ""
    }
${educationInfo ? educationInfo : ""}

Format the description with clear sections for:
1. About the Company (brief, less than 2 lines)
2. Job Responsibilities 
3. Required Qualifications
4. Benefits and Perks

Please use bullet points where appropriate. Keep it concise, professional, and engaging. The job post should be formal, professional, precise and brief.`;
  };

  // Generate job description with AI
  const generateJobDescription = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    setGenerationSuccess(false);

    // Validate required fields
    if (!title || !companyName) {
      setGenerationError(
        "Job title and company name are required for generation"
      );
      setIsGenerating(false);
      return;
    }

    try {
      // Build prompt and make API request
      const prompt = buildJobDescriptionPrompt();

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
      setField("jobDescription", data.jobDescription);
      setGenerationSuccess(true);

      // Scroll to see the generated content
      setTimeout(() => {
        document
          .getElementById("job-description-textarea")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Error generating job description:", error);
      setGenerationError(
        error.message ||
          "Failed to generate job description. Please try again or write your own."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Job Description</h2>

      {/* AI Generation Section */}
      <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
        <div className="flex items-start">
          <div className="bg-blue-100 rounded-full p-2 mr-3">
            <Wand2 className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-md font-medium text-gray-900">
              AI Job Description Generator
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Generate a professional job description based on the information
              you've provided.
            </p>

            {generationError && (
              <div className="mt-2 flex items-start text-sm text-red-600">
                <AlertTriangle className="h-4 w-4 mt-0.5 mr-1.5 flex-shrink-0" />
                <p>{generationError}</p>
              </div>
            )}

            {generationSuccess && (
              <div className="mt-2 flex items-center text-sm text-green-600">
                <CheckCircle className="h-4 w-4 mr-1.5 flex-shrink-0" />
                <p>Job description generated successfully!</p>
              </div>
            )}

            <button
              type="button"
              onClick={generateJobDescription}
              disabled={isGenerating || (!title && !companyName)}
              className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
              aria-label="Generate job description with AI"
            >
              {isGenerating ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
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
        </div>
      </div>

      <div>
        <label
          htmlFor="job-description-textarea"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Job Description <span className="text-red-500">*</span>
        </label>

        <textarea
          id="job-description-textarea"
          name="jobDescription"
          value={jobDescription}
          onChange={handleChange}
          rows={12}
          className={`${textareaStyles} ${inputErrorStyles(
            errors.jobDescription
          )}`}
          placeholder="Enter a detailed job description or use the AI generator above..."
          aria-invalid={!!errors.jobDescription}
          aria-describedby={
            errors.jobDescription ? "job-description-error" : undefined
          }
        ></textarea>

        {errors.jobDescription && (
          <p id="job-description-error" className="mt-1 text-sm text-red-600">
            {errors.jobDescription}
          </p>
        )}

        <p className="mt-1 text-sm text-gray-500">
          Describe the job responsibilities, requirements, and any other
          relevant details.
        </p>
      </div>

      <FormButtons disableNext={!isValid} />
    </div>
  );
}
