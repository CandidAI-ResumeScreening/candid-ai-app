"use client";
import { useState } from "react";

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [parsedData, setParsedData] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch("/api/parse", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to parse resume");
      }

      const data = await response.json();
      setParsedData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Resume Parser</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="resume">
            Upload Resume (PDF or DOCX)
          </label>
          <input
            type="file"
            id="resume"
            accept=".pdf,.docx,.txt,.png,.jpeg,.jpg "
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isLoading ? "Processing..." : "Parse Resume"}
        </button>
      </form>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {parsedData && (
        <div className="bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Parsed Resume Data</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Personal Information</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-gray-800 divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-2 font-medium">Name</td>
                    <td className="px-4 py-2">{parsedData.Name || "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium">Job Role</td>
                    <td className="px-4 py-2">
                      {parsedData["Job Role"] || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium">Email</td>
                    <td className="px-4 py-2">{parsedData.Email || "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium">Phone</td>
                    <td className="px-4 py-2">{parsedData.Phone || "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium">Experience Level</td>
                    <td className="px-4 py-2">
                      {parsedData["Experience level"] || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Skills</h3>
              {parsedData.Skills && parsedData.Skills.length > 0 ? (
                <ul className="list-disc pl-5">
                  {parsedData.Skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              ) : (
                <p>N/A</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Education</h3>
            {parsedData["Education Details"] &&
            parsedData["Education Details"].length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Level
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Field
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Institution
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Grade
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-700 divide-y divide-gray-200">
                    {parsedData["Education Details"].map((edu, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2">
                          {edu["education level"] || "N/A"}
                        </td>
                        <td className="px-4 py-2">
                          {edu["field of study"] || "N/A"}
                        </td>
                        <td className="px-4 py-2">
                          {edu.institution || "N/A"}
                        </td>
                        <td className="px-4 py-2">
                          {edu["grade level"] || "N/A"}
                        </td>
                        <td className="px-4 py-2">
                          {edu["date completed"] || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No education information found</p>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Experience</h3>
            {parsedData["Experience Details"] &&
            parsedData["Experience Details"].length > 0 ? (
              <div className="space-y-4">
                {parsedData["Experience Details"].map((exp, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-blue-500 pl-4 py-2"
                  >
                    <h4 className="font-medium">
                      {exp["Industry Name"] || "Unknown Company"}
                    </h4>
                    <p className="text-gray-600">{exp.Roles || "N/A"}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No experience information found</p>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Certifications</h3>
            {parsedData.Certification && parsedData.Certification.length > 0 ? (
              <ul className="list-disc pl-5">
                {parsedData.Certification.map((cert, index) => (
                  <li key={index}>{cert}</li>
                ))}
              </ul>
            ) : (
              <p>No certifications found</p>
            )}
          </div>
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-gray-300 text-black p-6 rounded-lg shadow-md">
              <h1 className="text-xl font-bold mb-4">Raw Resume Text</h1>
              <p>
                {parsedData && parsedData.rawResumeText
                  ? parsedData.rawResumeText
                  : "Text extracted not found"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
