// src/app/components/jobs/StepSix.jsx
"use client";

import { useState, useEffect } from "react";
import useJobStore from "@/store/useJobStore";
import FormButtons from "./FormButtons";

export default function StepSix() {
  // Get values and functions from store
  const { weights, setWeight } = useJobStore();

  // Local state
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [totalWeight, setTotalWeight] = useState(100);

  // List of criteria
  const criteria = [
    { key: "skills", label: "Skills" },
    { key: "experienceLevel", label: "Experience Level" },
    { key: "yearsOfExperience", label: "Years of Experience" },
    { key: "education", label: "Education" },
  ];

  // Validation function
  const validateWeights = () => {
    const newErrors = {};

    // Calculate total
    const total = Object.values(weights).reduce(
      (sum, weight) => sum + weight,
      0
    );
    setTotalWeight(total);

    if (total !== 100) {
      newErrors.total = "Weights must add up to 100%";
    }

    // Check individual weights
    for (const key of Object.keys(weights)) {
      if (weights[key] < 0) {
        newErrors[key] = "Weight cannot be negative";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check validity when weights change
  useEffect(() => {
    setIsValid(validateWeights());
  }, [weights]);

  // Handle weight change
  const handleWeightChange = (key, value) => {
    // Ensure value is a number
    let numValue = value === "" ? 0 : parseInt(value, 10);

    // Don't allow negative values
    if (numValue < 0) numValue = 0;
    if (numValue > 100) numValue = 100;

    setWeight(key, numValue);
  };

  // Manual balance button instead of auto-adjustment
  const handleBalanceWeights = () => {
    // Get the total and missing amount
    const total = Object.values(weights).reduce(
      (sum, weight) => sum + weight,
      0
    );

    if (total === 100) return; // Already balanced

    const remaining = 100 - total;

    if (remaining === 0) return; // Nothing to adjust

    // Distribute the remaining evenly
    const keysToAdjust = Object.keys(weights);
    const adjustment = Math.floor(remaining / keysToAdjust.length);
    let leftover = remaining % keysToAdjust.length;

    // Update weights
    keysToAdjust.forEach((key) => {
      let newValue = weights[key] + adjustment;

      // Add leftover one by one until depleted
      if (leftover > 0) {
        newValue += 1;
        leftover -= 1;
      }

      // Ensure values stay within bounds
      if (newValue < 0) newValue = 0;
      if (newValue > 100) newValue = 100;

      setWeight(key, newValue);
    });
  };

  // Common input styles including increased height
  const inputStyles = `block w-full border border-gray-100 rounded-md shadow-sm py-2.5 px-3 focus:outline-none sm:text-sm`;
  const inputErrorStyles = (error) =>
    error
      ? "border-red-300 focus:border-red-300 focus:ring-red-500"
      : "border-gray-300 focus:border-blue-300 focus:ring-blue-500";

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        Candidate Ranking Weights
      </h2>

      <div>
        <p className="text-sm text-gray-600 mb-4">
          Assign weights to different criteria to determine how candidates will
          be ranked. The total weight must add up to 100%.
        </p>

        {errors.total && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {errors.total}
          </div>
        )}

        <div className="space-y-4">
          {criteria.map(({ key, label }) => (
            <div key={key} className="flex items-center">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
              </div>
              <div className="w-1/4">
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    type="number"
                    value={weights[key]}
                    onChange={(e) => handleWeightChange(key, e.target.value)}
                    min="0"
                    max="100"
                    className={`${inputStyles} ${inputErrorStyles(
                      errors[key]
                    )} pr-12`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
                {errors[key] && (
                  <p className="mt-1 text-sm text-red-600">{errors[key]}</p>
                )}
              </div>
              <div className="w-1/4 pl-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600"
                    style={{ width: `${weights[key]}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={handleBalanceWeights}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
            type="button"
          >
            Auto-Balance Weights
          </button>
          <span
            className={`text-sm font-medium ${
              totalWeight === 100 ? "text-green-600" : "text-red-600"
            }`}
          >
            Total: {totalWeight}%
          </span>
        </div>
      </div>

      <FormButtons disableNext={!isValid} />
    </div>
  );
}
