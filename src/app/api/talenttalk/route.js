import { NextResponse } from "next/server";

// Ngrok chatbot configuration which changes open everytime the machine server is restarted; behaviour of ngrok
const NGROK_API_URL = "https://e979-34-125-38-55.ngrok-free.app/simple_chat";

export async function POST(request) {
  try {
    const { message, conversation, candidates, contextType, jobDetails } =
      await request.json();

    // Validation
    if (!message || !candidates || candidates.length === 0) {
      return NextResponse.json(
        { success: false, message: "Required data is missing" },
        { status: 400 }
      );
    }

    // Prepare context information for the chatbot
    let contextualMessage = message;

    // Add context-specific information to the message
    if (contextType === "jobSpecific" && jobDetails) {
      const jobContext = `Context: Analyzing candidates for "${
        jobDetails.title
      }" position at ${
        jobDetails.companyName
      }. Required skills: ${jobDetails.skills.join(", ")}. Experience: ${
        jobDetails.experienceLevel
      }, ${jobDetails.yearsOfExperience} years. Education: ${
        jobDetails.educationLevel
      }${
        jobDetails.fieldOfStudy !== "Not specified"
          ? ` in ${jobDetails.fieldOfStudy}`
          : ""
      }. Location: ${jobDetails.location}. `;

      contextualMessage = jobContext + "User query: " + message;
    }

    // Add candidate data context
    const candidateContext = candidates.map((candidate) => ({
      id: candidate._id,
      name: candidate.Name,
      email: candidate.Email,
      jobRole: candidate["Job Role"],
      experienceLevel: candidate["Experience level"],
      skills: candidate.Skills,
      education: candidate["Education Details"],
      experience: candidate["Experience Details"],
      certifications: candidate.Certification,
      score: candidate.score,
      thresholdPass: candidate.thresholdPass,
      status: candidate.status,
    }));

    // Include candidate data in the message context
    const candidateInfo = `Available candidates data: ${JSON.stringify(
      candidateContext
    )}. `;
    contextualMessage = candidateInfo + contextualMessage;

    // Add conversation history context if available
    if (conversation && conversation.length > 0) {
      const conversationHistory = conversation
        .slice(-5) // Limit to last 5 messages to avoid large payloads
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join(" | ");
      contextualMessage = `Previous conversation: ${conversationHistory}. Current query: ${contextualMessage}`;
    }

    try {
      // Calling the ngrok chatbot API
      const response = await fetch(NGROK_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_input: contextualMessage,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Ngrok chatbot response received:", data);

      // Handle successful response
      if (data.reply) {
        return NextResponse.json({
          success: true,
          response: data.reply,
        });
      }

      // Handle Ollama error with fallback
      if (data.ollama_error) {
        console.warn("Ollama error encountered:", data.ollama_error);

        return NextResponse.json({
          success: true,
          response: "Error: No insights found",
        });
      }

      // If no reply or error, use default error message
      return NextResponse.json({
        success: true,
        response: "Error: No insights found",
      });
    } catch (fetchError) {
      console.error("Error calling ngrok chatbot:", fetchError);

      // Fallback response for network/API errors
      return NextResponse.json({
        success: true,
        response: "Error: No insights found",
      });
    }
  } catch (error) {
    console.error("Error with TalentTalk:", error);

    // Return the standard error message for any other errors
    return NextResponse.json(
      {
        success: true,
        response: "Error: No insights found",
      },
      { status: 200 }
    ); // Keep status 200 for backward compatibility
  }
}

// Add a fallback function for generating simple responses
const generateFallbackResponse = (input) => {
  const userInput = input.toLowerCase();

  // Simple response mapping as backup
  if (userInput.includes("hello") || userInput.includes("hi")) {
    return "Hello! I'm here to help with your HR needs. How can I assist you with candidate evaluation today?";
  }

  if (userInput.includes("candidate") || userInput.includes("resume")) {
    return "I can help analyze candidate profiles and resumes. Would you like me to evaluate specific candidates or discuss general recruitment strategies?";
  }

  if (userInput.includes("job") || userInput.includes("position")) {
    return "I can assist with job matching and position requirements analysis. What specific role are you looking to fill?";
  }

  if (userInput.includes("skill") || userInput.includes("experience")) {
    return "Skills and experience evaluation is my specialty. I can identify talent with the right capabilities for your open positions.";
  }

  // Default response
  return "Error: No insights found";
};
