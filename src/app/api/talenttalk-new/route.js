// src/app/api/talenttalk-new/route.js

import { NextResponse } from "next/server";

// Helper function to generate responses based on user input
function generateResponse(
  userInput,
  candidates = [],
  contextType = "general",
  jobDetails = null
) {
  const input = userInput.toLowerCase();

  // Job-related queries
  if (
    input.includes("job") ||
    input.includes("position") ||
    input.includes("role")
  ) {
    if (jobDetails && contextType === "jobSpecific") {
      return `Based on the job details for ${
        jobDetails.title
      }, I'm looking for candidates with strong ${
        jobDetails.skills?.join(", ") || "relevant"
      } skills and ${
        jobDetails.experienceLevel || "appropriate"
      } experience level. I've analyzed the candidates and can provide insights on their match to this position.`;
    }
    return "I can help you review job requirements, analyze candidate-job fit, and provide recommendations for your open positions. To get more specific insights, please provide details about the position you're hiring for.";
  }

  // Candidate-related queries
  if (
    input.includes("candidate") ||
    input.includes("applicant") ||
    input.includes("resume")
  ) {
    if (candidates.length > 0) {
      return `I've analyzed ${candidates.length} candidates in your database. The top skills I've identified across candidates are programming languages, project management, and communication. Would you like me to evaluate specific candidates or provide aggregate insights?`;
    }
    return "I can analyze candidate resumes, extract skills and experience, and compare qualifications against job requirements. Would you like me to evaluate a specific candidate or compare multiple candidates?";
  }

  // Skills assessment
  if (
    input.includes("skill") ||
    input.includes("qualification") ||
    input.includes("experience")
  ) {
    if (candidates.length > 0) {
      return "Based on the candidate data, I've identified varying levels of technical and soft skills. The most common technical skills include programming languages and data analysis, while common soft skills include teamwork and communication. For more specific insights, let me know which skills you'd like to focus on.";
    }
    return "Skills assessment is one of my core capabilities. I can identify both technical and soft skills from resumes, validate them against job requirements, and highlight skill gaps or matches. For more accurate analysis, I'll need specific candidate information and job requirements.";
  }

  // Help or capabilities
  if (
    input.includes("help") ||
    input.includes("can you") ||
    (input.includes("what") && input.includes("do"))
  ) {
    return "As your HR assistant, I can help with tasks like: analyzing resumes, comparing candidates to job requirements, suggesting interview questions, identifying skill gaps, and providing recruitment insights. What specific HR task can I help you with today?";
  }

  // General greeting
  if (
    input.includes("hello") ||
    input.includes("hi") ||
    input.includes("hey") ||
    input.includes("morning") ||
    input.includes("afternoon")
  ) {
    return "Hello! I'm here to assist with your HR and recruitment needs. How can I help you today?";
  }

  // Default response
  return (
    "I understand you're asking about \"" +
    userInput +
    "\". To provide the most helpful insights, I'd need more specific information about your recruitment needs. Could you please share more details about the candidates or positions you're working with?"
  );
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { message, conversation, candidates, contextType, jobDetails } = data;

    // Generate a response to the user's message
    const response = generateResponse(
      message,
      candidates,
      contextType,
      jobDetails
    );

    // Simulate a processing delay for more natural interaction
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      response,
      message_processed: message,
    });
  } catch (error) {
    console.error("TalentTalk API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process request",
      },
      { status: 500 }
    );
  }
}
