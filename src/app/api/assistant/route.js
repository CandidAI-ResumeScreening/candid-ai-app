// src/app/api/assistant/route.js - Updated to handle optional system instruction
import { NextResponse } from "next/server";
import { AzureOpenAI } from "openai";
import projectInfo from "@/lib/projectInfo";

// Azure OpenAI configuration (similar to your job description API)
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const modelName = "gpt-4o";
const deployment = "gpt-4o";
const apiVersion = "2024-04-01-preview";

export async function POST(request) {
  try {
    const requestData = await request.json();
    const { message, conversation } = requestData;
    // Only add systemInstruction to the request object if it exists
    const systemInstruction = requestData.systemInstruction || null;

    // Validation
    if (!message) {
      return NextResponse.json(
        { success: false, message: "Message is required" },
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

    // Create system prompt for the CandidAI assistant - use default unless systemInstruction is provided
    const systemPrompt =
      systemInstruction ||
      `You are CandidAI Assistant, an AI-powered helper for the CandidAI resume screening platform.

Your role is to help users with questions about the CandidAI platform, its features, and how to use it effectively.

Use the following information about CandidAI to respond to user queries:
${JSON.stringify(projectInfo, null, 2)}

Guidelines:
1. Be concise, professional, and helpful in your responses.
2. Focus only on information relevant to CandidAI's resume screening and candidate management features.
3. If a user asks about specific candidates or job postings, suggest they use TalentTalk within the dashboard for those details.
4. If you cannot answer a question or if it's outside the scope of CandidAI, politely suggest contacting support at candidAI2025@gmail.com.
5. Maintain a friendly but professional tone throughout the conversation.
6. For technical questions about usage, refer to the relevant sections in the provided information.
7. Do not make up information that isn't included in the provided data.
8. Do not mention that you are powered by OpenAI or any third-party provider. Present yourself as a tool developed by students for the CandidAI project.
9. Do not use markdown, headers, bullet points, or italics in your responses. Use only plain text.
10. If structure or organization is needed, use plain block paragraphs with one line of spacing between them.
11. Keep responses brief and straight to the point. Avoid lengthy explanations or offering additional help unless the user explicitly asks for it. Stick only to what is asked.
12. Anything out of context of our project should be answered by "Unable to answer. Please contact support at candidAI2025@gmail.com."`;

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
      max_tokens: 800,
      temperature: 0.7,
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
    console.error("Error with assistant:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process your request: " + error.message,
      },
      { status: 500 }
    );
  }
}
