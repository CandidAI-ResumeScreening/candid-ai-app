// src/app/components/jobs/JobFormStepper.jsx
"use client";

import { useCallback } from "react";
import useJobStore from "@/store/useJobStore";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

const steps = [
  { number: 1, title: "Basic Info" },
  { number: 2, title: "Location & Salary" },
  { number: 3, title: "Skills & Experience" },
  { number: 4, title: "Education" },
  { number: 5, title: "Job Description" },
  { number: 6, title: "Set Weights" },
  { number: 7, title: "Review & Submit" },
];

export default function JobFormStepper() {
  const { currentStep, goToStep } = useJobStore();

  const getStepStatus = useCallback(
    (stepNumber) => {
      if (stepNumber < currentStep) return "completed";
      if (stepNumber === currentStep) return "current";
      return "upcoming";
    },
    [currentStep]
  );

  const handleStepClick = (stepNumber) => {
    if (stepNumber < currentStep) {
      goToStep(stepNumber);
    }
  };

  return (
    <div className="hidden md:block">
      <nav aria-label="Progress">
        <ol
          role="list"
          className="flex space-x-2 md:space-x-4 lg:space-x-8 justify-between"
        >
          {steps.map((step) => {
            const status = getStepStatus(step.number);
            return (
              <li key={step.number} className="flex-1">
                <div
                  className={cn(
                    "group flex flex-col border-t-4 pt-4 pb-2",
                    status === "completed"
                      ? "border-blue-600"
                      : status === "current"
                      ? "border-blue-400"
                      : "border-gray-200"
                  )}
                >
                  <span className="text-sm font-medium">
                    <button
                      onClick={() => handleStepClick(step.number)}
                      className={cn(
                        "flex items-center",
                        status === "completed"
                          ? "text-blue-600 cursor-pointer"
                          : status === "current"
                          ? "text-blue-600"
                          : "text-gray-500 cursor-default"
                      )}
                    >
                      <span className="shrink-0 h-5 w-5 flex items-center justify-center mr-2 border rounded-full">
                        {status === "completed" ? (
                          <CheckIcon className="h-3 w-3" />
                        ) : (
                          <span>{step.number}</span>
                        )}
                      </span>
                      <span className="hidden lg:inline truncate">
                        {step.title}
                      </span>
                    </button>
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
