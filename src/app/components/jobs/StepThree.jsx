// src/app/components/jobs/StepThree.jsx
"use client";

import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import useJobStore from "@/store/useJobStore";
import ComboBox from "./ComboBox";
import FormButtons from "./FormButtons";
import { allSkills, experienceLevels } from "@/lib/constants";

export default function StepThree() {
  // Get values and functions from store
  const {
    skills,
    experienceLevel,
    yearsOfExperience,
    setField,
    addSkill,
    removeSkill,
  } = useJobStore();

  // Local state
  const [selectedSkill, setSelectedSkill] = useState("");
  const [customSkill, setCustomSkill] = useState("");
  const [showCustomSkillInput, setShowCustomSkillInput] = useState(false);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  // Validation function
  const validateFields = () => {
    const newErrors = {};

    if (skills.length === 0) {
      newErrors.skills = "At least one skill is required";
    }

    if (!experienceLevel) {
      newErrors.experienceLevel = "Experience level is required";
    }

    if (!yearsOfExperience) {
      newErrors.yearsOfExperience = "Years of experience is required";
    } else if (
      isNaN(parseFloat(yearsOfExperience)) ||
      parseFloat(yearsOfExperience) < 0
    ) {
      newErrors.yearsOfExperience = "Please enter a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check validity when fields change
  useEffect(() => {
    setIsValid(validateFields());
  }, [skills, experienceLevel, yearsOfExperience]);

  // Handle adding a skill from combo box
  const handleAddSkill = () => {
    if (selectedSkill && !skills.includes(selectedSkill)) {
      addSkill(selectedSkill);
      setSelectedSkill("");
    }
  };

  // Handle adding a custom skill
  const handleAddCustomSkill = () => {
    if (customSkill.trim() && !skills.includes(customSkill.trim())) {
      addSkill(customSkill.trim());
      setCustomSkill("");
      setShowCustomSkillInput(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "yearsOfExperience") {
      // Allow only numbers with up to 1 decimal place
      const regex = /^\d*\.?\d{0,1}$/;
      if (value === "" || regex.test(value)) {
        setField(name, value);
      }
    } else if (name === "customSkill") {
      setCustomSkill(value);
    } else {
      setField(name, value);
    }
  };

  // Handle keyboard shortcut to add custom skill on Enter
  const handleCustomSkillKeyPress = (e) => {
    if (e.key === "Enter" && customSkill.trim()) {
      e.preventDefault();
      handleAddCustomSkill();
    }
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
        Skills & Experience
      </h2>

      <div className="space-y-6">
        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Required Skills <span className="text-red-500">*</span>
          </label>

          {/* Toggle between ComboBox and Custom Skill input */}
          {!showCustomSkillInput ? (
            <>
              <div className="mt-1 flex">
                <div className="flex-grow">
                  <ComboBox
                    options={allSkills.filter(
                      (skill) => !skills.includes(skill)
                    )}
                    value={selectedSkill}
                    onChange={setSelectedSkill}
                    placeholder="Search for a skill or click 'Add Custom' for your own"
                    error={
                      errors.skills && skills.length === 0
                        ? errors.skills
                        : null
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  disabled={!selectedSkill || skills.includes(selectedSkill)}
                  className="ml-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomSkillInput(true)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <Plus className="h-3 w-3 mr-1" /> Add Custom Skill
              </button>
            </>
          ) : (
            <div className="mt-1 flex">
              <div className="flex-grow">
                <input
                  type="text"
                  name="customSkill"
                  value={customSkill}
                  onChange={handleChange}
                  onKeyPress={handleCustomSkillKeyPress}
                  placeholder="Enter a custom skill"
                  className={`${inputStyles} ${inputErrorStyles(false)}`}
                  autoFocus
                />
              </div>
              <div className="flex ml-2">
                <button
                  type="button"
                  onClick={handleAddCustomSkill}
                  disabled={!customSkill.trim()}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomSkillInput(false);
                    setCustomSkill("");
                  }}
                  className="ml-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Display Selected Skills */}
          {skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-1 p-1 rounded-full hover:bg-blue-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Experience Level <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <select
              name="experienceLevel"
              value={experienceLevel}
              onChange={handleChange}
              className={`${inputStyles} ${inputErrorStyles(
                errors.experienceLevel
              )}`}
            >
              <option value="">Select experience level</option>
              {experienceLevels.map((level) => (
                <option key={level} value={level.toLowerCase()}>
                  {level}
                </option>
              ))}
            </select>
            {errors.experienceLevel && (
              <p className="mt-1 text-sm text-red-600">
                {errors.experienceLevel}
              </p>
            )}
          </div>
        </div>

        {/* Years of Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Years of Experience <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="yearsOfExperience"
              value={yearsOfExperience}
              onChange={handleChange}
              placeholder="e.g., 2.5"
              className={`${inputStyles} ${inputErrorStyles(
                errors.yearsOfExperience
              )}`}
            />
            {errors.yearsOfExperience && (
              <p className="mt-1 text-sm text-red-600">
                {errors.yearsOfExperience}
              </p>
            )}
          </div>
        </div>
      </div>

      <FormButtons disableNext={!isValid} />
    </div>
  );
}
