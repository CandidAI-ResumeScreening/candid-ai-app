// src/app/components/talenttalk/TalentTalkComponent.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, Loader2, ArrowLeft } from "lucide-react";
import { format } from "date-fns";

export default function TalentTalkComponent({
  candidateData,
  jobDetails = null,
  onClose,
}) {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content:
        "Hello! I'm TalentTalk, your AI recruitment assistant. How can I help you with candidate insights today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Format time helper function
  const formatTime = (date) => {
    return format(new Date(date), "h:mm a");
  };

  // Process candidate data for the chatbot prompt
  const prepareCandidateContext = () => {
    let context = "Candidate Information:";

    candidateData.forEach((candidate, index) => {
      context += `\nCandidate ${index + 1}:`;
      context += `\nName: ${candidate.Name || "Unknown"}`;
      context += `\nEmail: ${candidate.Email || "Unknown"}`;

      if (jobDetails === null) {
        // For insights page - include job title
        context += `\nApplied For: ${candidate.jobTitle || "Unknown Position"}`;
      }

      context += `\nSkills: ${
        candidate.Skills ? candidate.Skills.join(", ") : "None specified"
      }`;
      context += `\nExperience Level: ${
        candidate["Experience level"] || "Unknown"
      }`;
      context += `\nYears of Experience: ${
        candidate["Total Estimated Years of Experience"] || "Unknown"
      }`;

      if (
        candidate["Education Details"] &&
        candidate["Education Details"].length > 0
      ) {
        context += `\nEducation: ${candidate["Education Details"]
          .map(
            (edu) =>
              `${edu["education level"] || ""} in ${
                edu["field of study"] || ""
              } from ${edu.institution || ""}`
          )
          .join(", ")}`;
      }

      if (candidate.rawResumeText) {
        context += `\nResume Text Summary: ${candidate.rawResumeText.substring(
          0,
          500
        )}...`;
      }

      context += "\n";
    });

    // Add job details if available
    if (jobDetails) {
      context += "\nJob Information:";
      context += `\nTitle: ${jobDetails.title || "Unknown"}`;
      context += `\nCategory: ${jobDetails.category || "Unknown"}`;
      context += `\nRequired Skills: ${
        jobDetails.skills ? jobDetails.skills.join(", ") : "None specified"
      }`;
      context += `\nExperience Level: ${
        jobDetails.experienceLevel || "Unknown"
      }`;
      context += `\nRequired Years of Experience: ${
        jobDetails.yearsOfExperience || "Unknown"
      }`;
      context += `\nEducation: ${jobDetails.educationLevel || "Unknown"}`;
    }

    return context;
  };

  // Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message to the state
    const userMessage = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Prepare the context with candidate data
      const candidateContext = prepareCandidateContext();

      // Prepare system instruction for the assistant
      const systemInstruction = `You are TalentTalk, an AI-powered HR assistant specializing in analyzing candidate data and providing insights for recruiters. 
      You must follow these strict guidelines:

      1. Only provide insights based on the candidate data provided. If asked about information not in the data, respond with "Insight Not Found".
      2. Keep responses brief and concise - no more than 3 lines.
      3. Do not use markdown, bullet points, bold text, or italics.
      4. Be formal but helpful, focusing on delivering actionable recruitment insights.
      5. If asked about general recruitment advice not specific to the candidates, respond with "Insight Not Found".
      6. Do not mention the limitations of your access to data or explain your reasoning process.

      Here is the candidate data you can reference:
      ${candidateContext}`;

      // Get conversation history (excluding the welcome message)
      const conversationHistory = messages.slice(
        messages[0].content.includes("Hello! I'm TalentTalk") ? 1 : 0
      );

      // Call the API
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input.trim(),
          conversation: [...conversationHistory, userMessage],
          systemInstruction,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      // Add bot response to the state
      if (data.success) {
        addMessage({
          role: "bot",
          content: data.response,
          timestamp: new Date(),
        });
      } else {
        addMessage({
          role: "bot",
          content: "I'm sorry, I encountered an error. Please try again later.",
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      addMessage({
        role: "bot",
        content: "I'm sorry, I encountered an error. Please try again later.",
        timestamp: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add a message to the chat
  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white rounded-full p-2 mr-3">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              TalentTalk Assistant
            </h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-blue-100">
            <ArrowLeft className="h-6 w-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 shadow-sm"
                  }`}
                >
                  <p className="text-sm mb-1">{message.content}</p>
                  <p
                    className={`text-xs ${
                      message.role === "user"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {message.role === "user" ? "You" : "TalentTalk"} •{" "}
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 max-w-[80%]">
                  <div className="flex space-x-2">
                    <div
                      className="h-2 w-2 bg-gray-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0s" }}
                    ></div>
                    <div
                      className="h-2 w-2 bg-gray-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="h-2 w-2 bg-gray-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about candidate insights..."
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
