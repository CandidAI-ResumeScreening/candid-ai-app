// src/app/api/generate-job-description/route.js
import { AzureOpenAI } from "openai";
import { NextResponse } from "next/server";

// Azure OpenAI configuration
// const endpoint = "https://moham-m9sirgg0-eastus2.cognitiveservices.azure.com/";
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const modelName = "gpt-4o";
const deployment = "gpt-4o";
const apiVersion = "2024-04-01-preview";

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    // Validation
    if (!prompt) {
      return NextResponse.json(
        { success: false, message: "Prompt is required" },
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

    // Create system prompt for job description generation
    const systemPrompt = `You are an expert HR consultant specializing in creating professional job descriptions.
Your task is to create a detailed, well-structured job description based on the information provided.
Format your response with clear sections for:
1. About the Company
2. Job Responsibilities
3. Required Qualifications
4. Benefits and Perks

Use bullet points where appropriate to improve readability.
Keep the description concise, professional, and engaging.
Do not include any information not provided in the user's request.
Do not add any explanatory notes or annotations - just provide the job description.`;

    // Send request to Azure OpenAI
    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      max_tokens: 2000,
      temperature: 0.7,
      top_p: 1,
      model: modelName,
    });

    // Extract the generated job description
    if (response && response.choices && response.choices.length > 0) {
      const jobDescription = response.choices[0].message.content.trim();

      return NextResponse.json({
        success: true,
        jobDescription,
      });
    } else {
      throw new Error("Failed to generate job description");
    }
  } catch (error) {
    console.error("Error generating job description:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate job description: " + error.message,
      },
      { status: 500 }
    );
  }
}
