// src/app/components/jobs/StepTwo.jsx
"use client";

import { useState, useEffect } from "react";
import useJobStore from "@/store/useJobStore";
import FormButtons from "./FormButtons";

export default function StepTwo() {
  // Get values and functions from store
  const { location, salary, setField } = useJobStore();

  // Local validation state
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  // Validation function
  const validateFields = () => {
    const newErrors = {};

    if (!location.trim()) {
      newErrors.location = "Job location is required";
    }

    if (!salary.trim()) {
      newErrors.salary = "Salary is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check validity when fields change
  useEffect(() => {
    setIsValid(validateFields());
  }, [location, salary]);

  // Update field values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setField(name, value);
  };

  // Common input styles including increased height
  const inputStyles = `block w-full border border-gray-100 rounded-md shadow-sm py-2.5 px-3 focus:outline-none sm:text-sm`;
  const inputErrorStyles = (error) =>
    error
      ? "border-red-300 focus:border-red-300 focus:ring-red-500"
      : "border-gray-300 focus:border-blue-300 focus:ring-blue-500";

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Location & Salary</h2>

      <div className="space-y-4">
        {/* Job Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Job Location <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="location"
              value={location}
              onChange={handleChange}
              placeholder="City, Country or Remote"
              className={`${inputStyles} ${inputErrorStyles(errors.location)}`}
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location}</p>
            )}
          </div>
        </div>

        {/* Salary */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Salary <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="salary"
              value={salary}
              onChange={handleChange}
              placeholder="e.g., $50,000 - $70,000 per year"
              className={`${inputStyles} ${inputErrorStyles(errors.salary)}`}
            />
            {errors.salary && (
              <p className="mt-1 text-sm text-red-600">{errors.salary}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              You can specify a range or a fixed amount
            </p>
          </div>
        </div>
      </div>

      <FormButtons disableNext={!isValid} />
    </div>
  );
}
