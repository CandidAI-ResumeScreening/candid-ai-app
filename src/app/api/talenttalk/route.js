import { NextResponse } from "next/server";
import { AzureOpenAI } from "openai";

// Azure OpenAI configuration - reuse same configuration from assistant
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const modelName = "gpt-4o";
const deployment = "gpt-4o";
const apiVersion = "2024-04-01-preview";

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

    // Get API key from environment variables
    const apiKey = process.env.AZURE_OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error("Azure OpenAI API key is not configured");
    }

    // Initialize Azure OpenAI client
    const options = { endpoint, apiKey, deployment, apiVersion };
    const client = new AzureOpenAI(options);

    // Create system prompt for the TalentTalk assistant
    let systemPrompt = `You are TalentTalk, an AI-powered recruitment assistant for CandidAI.

Your role is to analyze candidate data and provide concise insights about applicants to help HR professionals make better hiring decisions.

Guidelines:
1. Be concise, formal, and straight to the point in your responses.
2. Keep responses brief - less than 3 lines whenever possible.
3. Only provide insights based on the candidate data provided. If a question is outside this scope, respond with "Insight Not Found".
4. Do not use numbering, markdown, headers, bullet points, bold text, or italics in your responses. 
5. Just Use only plain text in block paragraphs.
6. Focus on providing data-driven insights about candidates' skills, experience, education, and other relevant qualifications.
7. When comparing candidates, be objective and highlight strengths and potential areas for improvement.
8. If no candidate data matches the query or if the information is insufficient, respond with "Insight Not Found".
9. Avoid asterisks, double quotes, or any other special characters in your responses.
10. You are allowed to respond to greetings or salutations.
`;

    // Add context-specific instructions
    if (contextType === "jobSpecific" && jobDetails) {
      systemPrompt += `\n\nYou are currently analyzing candidates specifically for the "${
        jobDetails.title
      }" position at ${jobDetails.companyName}. 
      The job requires: ${jobDetails.skills.join(", ")}. 
      Experience level: ${jobDetails.experienceLevel}, ${
        jobDetails.yearsOfExperience
      } years. 
      Education: ${jobDetails.educationLevel}${
        jobDetails.fieldOfStudy !== "Not specified"
          ? ` in ${jobDetails.fieldOfStudy}`
          : ""
      }.
      Location: ${jobDetails.location}.`;
    } else {
      systemPrompt +=
        "\n\nYou are currently analyzing all candidates across different job positions.";
    }

    // Add all candidates data (but limit size)
    const candidateData = candidates.map((candidate) => {
      // Extract essential fields to avoid too large contexts
      return {
        id: candidate._id,
        name: candidate.Name,
        email: candidate.Email,
        phone: candidate.Phone,
        jobRole: candidate["Job Role"],
        experienceLevel: candidate["Experience level"],
        skills: candidate.Skills,
        rawText: candidate.rawResumeText,
        education: candidate["Education Details"],
        experience: candidate["Experience Details"],
        certifications: candidate.Certification,
        jobTitle: candidate.jobTitle,
        score: candidate.score,
        thresholdPass: candidate.thresholdPass,
        status: candidate.status,
      };
    });

    systemPrompt += `\n\nHere is the candidate data you can reference:\n${JSON.stringify(
      candidateData,
      null,
      2
    )}`;

    // Format conversation history for the API
    const formattedConversation = conversation.map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    }));

    // Send request to Azure OpenAI
    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...formattedConversation,
        { role: "user", content: message },
      ],
      max_tokens: 300,
      temperature: 0.5,
      top_p: 1,
      model: modelName,
    });

    // Extract the generated response
    if (response && response.choices && response.choices.length > 0) {
      const assistantResponse = response.choices[0].message.content.trim();

      return NextResponse.json({
        success: true,
        response: assistantResponse,
      });
    } else {
      throw new Error("Failed to generate response");
    }
  } catch (error) {
    console.error("Error with TalentTalk:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process your request: " + error.message,
      },
      { status: 500 }
    );
  }
}
