// src/app/dashboard/candidai-assistant/page.js
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Send, ArrowLeft, Loader2 } from "lucide-react";
import useChatStore from "@/store/useChatStore";
import { format } from "date-fns";
import DashboardHeader from "@/app/components/dashboard/dashboard-header";
import useUserStore from "@/store/useUserStore";

export default function CandidAIAssistantPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useUserStore();
  const { messages, addMessage, isLoading, setLoading } = useChatStore();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true on component mount
  useEffect(() => {
    setIsClient(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (isClient && !isLoggedIn) {
      router.push("/auth/login");
    }
  }, [isClient, isLoggedIn, router]);

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
        messages[0].content.includes("Hello! I'm your AI assistant") ? 1 : 0
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
      setLoading(false);
    }
  };

  // Return to dashboard
  const goBackToDashboard = () => {
    router.push("/dashboard");
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <DashboardHeader />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
          {/* Back Button */}
          <div className="mb-4">
            <button
              onClick={goBackToDashboard}
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to dashboard
            </button>
          </div>

          {/* Chat Container */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h2 className="text-lg font-medium text-gray-900">
                    CandidAI Assistant
                  </h2>
                  <p className="text-sm text-gray-500">
                    Ask me about CandidAI features and capabilities
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="flex flex-col space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-4 ${
                        message.role === "user"
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : "bg-white border border-gray-200 shadow-sm text-gray-800 rounded-tl-none"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">
                        {message.content}
                      </p>
                      <p
                        className={`text-xs mt-2 ${
                          message.role === "user"
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {message.role === "user" ? "You" : "CandidAI"} •{" "}
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[70%] rounded-lg p-4 bg-white border border-gray-200 shadow-sm text-gray-800 rounded-tl-none">
                      <div className="flex space-x-2">
                        <div
                          className="h-2.5 w-2.5 bg-gray-300 rounded-full animate-bounce"
                          style={{ animationDelay: "0s" }}
                        ></div>
                        <div
                          className="h-2.5 w-2.5 bg-gray-300 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="h-2.5 w-2.5 bg-gray-300 rounded-full animate-bounce"
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
            <div className="bg-white border-t border-gray-200 px-6 py-4">
              <form onSubmit={handleSendMessage} className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="block w-full pr-14 py-3 pl-4 border border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className={`absolute inset-y-0 right-4 flex items-center ${
                    input.trim() && !isLoading
                      ? "text-blue-600 hover:text-blue-700"
                      : "text-gray-400"
                  } disabled:opacity-50`}
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
