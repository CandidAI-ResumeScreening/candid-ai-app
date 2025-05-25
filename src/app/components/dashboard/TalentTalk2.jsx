"use client";

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Send, MessageSquare, ArrowLeft, X } from "lucide-react";
import useTalentTalkStore from "@/store/useTalentTalkStore";

export default function TalentTalk({
  candidates = [],
  jobDetails = null,
  onClose,
  context = "general", // 'general' or 'jobSpecific'
}) {
  const {
    messages,
    isLoading,
    addMessage,
    setLoading,
    setCandidates,
    setJobDetails,
    resetMessages,
  } = useTalentTalkStore();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Set candidates and job details in store
  useEffect(() => {
    resetMessages();
    setCandidates(candidates);
    setJobDetails(jobDetails);

    // Focus input on load
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [candidates, jobDetails, setCandidates, setJobDetails, resetMessages]);

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

    addMessage(userMessage);
    setInput("");
    setLoading(true);

    try {
      // Get conversation history (excluding the welcome message)
      const conversationHistory = messages.slice(
        messages[0].content.includes("Hello! I'm TalentTalk") ? 1 : 0
      );

      // Prepare request data
      const requestData = {
        message: input.trim(),
        conversation: [...conversationHistory, userMessage],
        candidates: candidates,
        contextType: context,
      };

      // Add job details if in job-specific context
      if (context === "jobSpecific" && jobDetails) {
        requestData.jobDetails = jobDetails;
      }

      // Call the API
      const response = await fetch("/api/talenttalk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
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
          content: "Insight Not Found",
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      addMessage({
        role: "bot",
        content: "Insight Not Found",
        timestamp: new Date(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-700 bg-opacity-75">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden flex flex-col h-[90vh]">
        {/* Header */}
        <div className="bg-blue-600 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white rounded-full p-2 mr-3">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-white">TalentTalk</h2>
              <p className="text-sm text-blue-100">
                {context === "jobSpecific" && jobDetails
                  ? `Analyzing candidates for ${jobDetails.title}`
                  : "Analyzing all your candidates"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:text-blue-100">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-300 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
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

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-300 rounded-lg p-3 max-w-[80%]">
                  <div className="flex space-x-2">
                    <div
                      className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0s" }}
                    ></div>
                    <div
                      className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about candidates, skills, or experience..."
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>

          <div className="mt-2 text-xs text-gray-500 text-center">
            Ask questions about candidate skills, experience, or qualifications
            to get insights
          </div>
        </div>
      </div>
    </div>
  );
}
