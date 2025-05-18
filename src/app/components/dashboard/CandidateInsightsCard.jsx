"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PieChart, ArrowRight, Loader2, AlertTriangle } from "lucide-react";
import useUserStore from "@/store/useUserStore";

export default function CandidateInsightsCard() {
  const { user } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skillsData, setSkillsData] = useState([]);
  const [experienceData, setExperienceData] = useState({
    Entry: 0,
    Intermediate: 0,
    Expert: 0,
    Total: 0,
  });

  useEffect(() => {
    const fetchCandidateInsights = async () => {
      if (!user?.email) return;

      try {
        setLoading(true);
        // Fetch all applications to analyze
        const response = await fetch("/api/hr/all-applications");

        if (!response.ok) {
          throw new Error("Failed to fetch candidate data");
        }

        const data = await response.json();
        const applications = data.applications || [];

        // Process experience levels
        const experienceCounts = {
          Entry: 0,
          Intermediate: 0,
          Expert: 0,
          Total: applications.length,
        };

        // Count skills occurrences
        const skillsCounter = {};

        applications.forEach((application) => {
          // Count experience levels
          const expLevel = application["Experience level"];
          if (expLevel) {
            const normalizedLevel = expLevel.toLowerCase().trim();

            if (
              normalizedLevel.includes("entry") ||
              normalizedLevel.includes("junior")
            ) {
              experienceCounts.Entry++;
            } else if (
              normalizedLevel.includes("intermediate") ||
              normalizedLevel.includes("mid")
            ) {
              experienceCounts.Intermediate++;
            } else if (
              normalizedLevel.includes("expert") ||
              normalizedLevel.includes("senior")
            ) {
              experienceCounts.Expert++;
            }
          }

          // Count skills
          if (application.Skills && Array.isArray(application.Skills)) {
            application.Skills.forEach((skill) => {
              const normalizedSkill = skill.trim();
              if (normalizedSkill) {
                skillsCounter[normalizedSkill] =
                  (skillsCounter[normalizedSkill] || 0) + 1;
              }
            });
          }
        });

        // Convert experience counts to percentages
        const totalCandidates = applications.length;
        if (totalCandidates > 0) {
          experienceCounts.Entry = Math.round(
            (experienceCounts.Entry / totalCandidates) * 100
          );
          experienceCounts.Intermediate = Math.round(
            (experienceCounts.Intermediate / totalCandidates) * 100
          );
          experienceCounts.Expert = Math.round(
            (experienceCounts.Expert / totalCandidates) * 100
          );
        }

        // Get top skills
        const topSkills = Object.entries(skillsCounter)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([skill, count]) => ({
            name: skill,
            percentage: Math.round((count / totalCandidates) * 100),
          }));

        setSkillsData(topSkills);
        setExperienceData(experienceCounts);
      } catch (err) {
        console.error("Error fetching candidate insights:", err);
        setError(err.message || "Failed to load candidate insights");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateInsights();
  }, [user]);

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <PieChart className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">
              Candidate Insights
            </h2>
          </div>
        </div>
        <div className="px-6 py-12 flex justify-center">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <PieChart className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">
              Candidate Insights
            </h2>
          </div>
        </div>
        <div className="px-6 py-6 text-center">
          <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
          <p className="text-gray-600">Error loading insights: {error}</p>
        </div>
      </div>
    );
  }

  // No data case
  if (experienceData.Total === 0) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <PieChart className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">
              Candidate Insights
            </h2>
          </div>
        </div>
        <div className="px-6 py-8 text-center">
          <p className="text-gray-500">No candidate data available yet.</p>
          <p className="text-sm text-gray-400 mt-1">
            Insights will appear as candidates apply to your jobs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <PieChart className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">
            Candidate Insights
          </h2>
        </div>
        <Link href="/dashboard/insights">
          <button className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500">
            Details
            <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </Link>
      </div>
      <div className="px-6 py-4">
        <div className="space-y-4">
          {/* Skills Distribution */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Top Skills in Applicant Pool
            </h3>
            <div className="space-y-2">
              {skillsData.length > 0 ? (
                skillsData.map((skill, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{skill.name}</span>
                      <span className="text-gray-900 font-medium">
                        {skill.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${skill.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No skill data available yet.
                </p>
              )}
            </div>
          </div>

          {/* Experience Distribution */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Experience Level
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-blue-50 rounded p-2">
                <div className="text-xs text-gray-500">Entry</div>
                <div className="text-lg font-semibold text-blue-600">
                  {experienceData.Entry}%
                </div>
              </div>
              <div className="bg-blue-50 rounded p-2">
                <div className="text-xs text-gray-500">Mid</div>
                <div className="text-lg font-semibold text-blue-600">
                  {experienceData.Intermediate}%
                </div>
              </div>
              <div className="bg-blue-50 rounded p-2">
                <div className="text-xs text-gray-500">Expert</div>
                <div className="text-lg font-semibold text-blue-600">
                  {experienceData.Expert}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
