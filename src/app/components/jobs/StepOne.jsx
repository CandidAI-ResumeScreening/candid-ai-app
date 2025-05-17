// src/app/components/jobs/StepOne.jsx
"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import useJobStore from "@/store/useJobStore";
import ComboBox from "./ComboBox";
import FormButtons from "./FormButtons";
import { jobCategories } from "@/lib/constants";

export default function StepOne() {
  // Get values and functions from store
  const { title, category, deadline, companyName, setField } = useJobStore();

  // Local validation state
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  // Validation function
  const validateFields = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Job title is required";
    }

    if (!category) {
      newErrors.category = "Category is required";
    }

    if (!deadline) {
      newErrors.deadline = "Application deadline is required";
    }

    if (!companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check validity when fields change
  useEffect(() => {
    setIsValid(validateFields());
  }, [title, category, deadline, companyName]);

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
      <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>

      <div className="space-y-4">
        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Job Title <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="title"
              value={title}
              onChange={handleChange}
              className={`${inputStyles} ${inputErrorStyles(errors.title)}`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>
        </div>

        {/* Job Category */}
        <div>
          <ComboBox
            options={jobCategories}
            value={category}
            onChange={(value) => setField("category", value)}
            placeholder="Select job category"
            label="Job Category"
            required={true}
            error={errors.category}
          />
        </div>

        {/* Application Deadline */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Application Deadline <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative">
            <DatePicker
              selected={deadline}
              onChange={(date) => setField("deadline", date)}
              minDate={new Date()}
              className={`${inputStyles} ${inputErrorStyles(errors.deadline)}`}
              placeholderText="Select deadline date"
            />
            <span className="absolute right-3 top-3 text-gray-400">
              <Calendar className="h-5 w-5" />
            </span>
            {errors.deadline && (
              <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
            )}
          </div>
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Company Name <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="companyName"
              value={companyName}
              onChange={handleChange}
              className={`${inputStyles} ${inputErrorStyles(
                errors.companyName
              )}`}
            />
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
            )}
          </div>
        </div>
      </div>

      <FormButtons showPrevious={false} disableNext={!isValid} />
    </div>
  );
}
