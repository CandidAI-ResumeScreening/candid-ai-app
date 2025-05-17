// src/app/components/jobs/StepFour.jsx
"use client";

import { useState, useEffect } from "react";
import useJobStore from "@/store/useJobStore";
import ComboBox from "./ComboBox";
import FormButtons from "./FormButtons";
import { educationLevels, educationGrades } from "@/lib/constants";

export default function StepFour() {
  // Get values and functions from store
  const { educationLevel, fieldOfStudy, educationGrade, gpa, setField } =
    useJobStore();

  // Local validation state
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [gradeType, setGradeType] = useState("grade"); // "grade" or "gpa"

  // Validation function
  const validateFields = () => {
    const newErrors = {};

    if (!educationLevel) {
      newErrors.educationLevel = "Education level is required";
    }

    // Either educationGrade or gpa is required
    if (gradeType === "grade" && !educationGrade) {
      newErrors.educationGrade = "Grade is required";
    } else if (gradeType === "gpa" && !gpa) {
      newErrors.gpa = "GPA is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check validity when fields change
  useEffect(() => {
    setIsValid(validateFields());
  }, [educationLevel, fieldOfStudy, educationGrade, gpa, gradeType]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setField(name, value);
  };

  // Handle grade type switch
  const handleGradeTypeChange = (type) => {
    setGradeType(type);

    // Clear the other grade type
    if (type === "grade") {
      setField("gpa", "");
    } else {
      setField("educationGrade", "");
    }
  };

  // Common input styles including increased height
  const inputStyles = `block w-full border border-gray-100 rounded-md shadow-md py-2.5 px-3 focus:outline-none sm:text-sm`;
  const inputErrorStyles = (error) =>
    error
      ? "border-red-300 focus:border-red-300 focus:ring-red-500"
      : "border-gray-300 focus:border-blue-300 focus:ring-blue-500";

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        Education Requirements
      </h2>

      <div className="space-y-6">
        {/* Education Level */}
        <div>
          <ComboBox
            options={educationLevels}
            value={educationLevel}
            onChange={(value) => setField("educationLevel", value)}
            placeholder="Select education level"
            label="Minimum Education Level"
            required={true}
            error={errors.educationLevel}
          />
        </div>

        {/* Field of Study */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Field of Study
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="fieldOfStudy"
              value={fieldOfStudy}
              onChange={handleChange}
              placeholder="e.g., Computer Science, Business, etc."
              className={`${inputStyles} ${inputErrorStyles(false)}`}
            />
            <p className="mt-1 text-sm text-gray-500">
              Optional - Leave blank if any field of study is acceptable
            </p>
          </div>
        </div>

        {/* Grade Type Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grade Requirement <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4 mb-4">
            <div className="flex items-center">
              <input
                id="grade-type"
                name="grade-type"
                type="radio"
                checked={gradeType === "grade"}
                onChange={() => handleGradeTypeChange("grade")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label
                htmlFor="grade-type"
                className="ml-2 block text-sm text-gray-700"
              >
                Specify Grade
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="gpa-type"
                name="grade-type"
                type="radio"
                checked={gradeType === "gpa"}
                onChange={() => handleGradeTypeChange("gpa")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label
                htmlFor="gpa-type"
                className="ml-2 block text-sm text-gray-700"
              >
                Specify GPA
              </label>
            </div>
          </div>

          {/* Education Grade (if grade type selected) */}
          {gradeType === "grade" && (
            <div>
              <ComboBox
                options={educationGrades}
                value={educationGrade}
                onChange={(value) => setField("educationGrade", value)}
                placeholder="Select minimum grade"
                error={errors.educationGrade}
              />
            </div>
          )}

          {/* GPA (if gpa type selected) */}
          {gradeType === "gpa" && (
            <div>
              <input
                type="text"
                name="gpa"
                value={gpa}
                onChange={handleChange}
                placeholder="e.g., 3.0 or above"
                className={`${inputStyles} ${inputErrorStyles(errors.gpa)}`}
              />
              {errors.gpa && (
                <p className="mt-1 text-sm text-red-600">{errors.gpa}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <FormButtons disableNext={!isValid} />
    </div>
  );
}
