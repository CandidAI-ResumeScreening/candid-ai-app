"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Send,
  Loader2,
  Bot,
  User,
  Search,
  ArrowLeft,
  Plus,
} from "lucide-react";
import DashboardHeader from "@/app/components/dashboard/dashboard-header";
import useUserStore from "@/store/useUserStore";

export default function TalentTalkPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useUserStore();
  const [isClient, setIsClient] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content:
        "Hello! I'm TalentTalk, your AI recruitment assistant. How can I help you with your candidates today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Set isClient to true once component mounts
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

  // Scroll to bottom of chat when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Example responses for different candidate-related questions
  const getAIResponse = (query) => {
    const lowerQuery = query.toLowerCase();

    // Sample response patterns
    if (
      lowerQuery.includes("best candidate") ||
      lowerQuery.includes("top candidate")
    ) {
      return "Based on my analysis, the candidates with the highest match scores are John Smith (95%), Maria Garcia (92%), and David Johnson (89%). Would you like me to provide more details about any of these candidates?";
    } else if (
      lowerQuery.includes("skills") ||
      lowerQuery.includes("skill gap")
    ) {
      return "I've analyzed the skills across all candidates. The most common skills are: JavaScript (78%), React (65%), and Node.js (42%). However, I've noticed a skill gap in candidates with DevOps experience - only 15% have listed Docker or Kubernetes skills.";
    } else if (
      lowerQuery.includes("education") ||
      lowerQuery.includes("degree")
    ) {
      return "Among your candidates, 45% have a Bachelor's degree, 30% have a Master's degree, and 5% have a PhD. The most common fields of study are Computer Science (52%), Information Technology (18%), and Business Administration (12%).";
    } else if (
      lowerQuery.includes("experience") ||
      lowerQuery.includes("background")
    ) {
      return "The average years of experience across all candidates is 4.3 years. 35% are junior level, 42% are mid-level, 18% are senior, and 5% are in leadership positions. Would you like me to filter candidates by experience level?";
    } else if (
      lowerQuery.includes("compare") ||
      lowerQuery.includes("comparison")
    ) {
      return "When comparing the top candidates for the Frontend Developer position, Maria Garcia has stronger React experience (4+ years) while John Smith has more experience with Vue.js. Maria scored higher on technical skills (95%) while John scored higher on communication skills based on language analysis from their resume.";
    } else if (
      lowerQuery.includes("interview") ||
      lowerQuery.includes("questions")
    ) {
      return "Based on the skill requirements and the candidate profile, I recommend asking these technical questions:\n1. Describe your experience with React hooks and context API\n2. How would you optimize the performance of a React application?\n3. How do you handle state management in large applications?";
    } else {
      return "I understand you're interested in candidate insights. Would you like me to analyze candidate skills, education backgrounds, experience levels, or provide interview question suggestions? You can also ask me to compare specific candidates or identify the best matches for a position.";
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setIsLoading(true);
    setTimeout(() => {
      const botResponse = {
        role: "bot",
        content: getAIResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isClient) {
    // Initial loading state
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
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
          {/* Back Button */}
          <div className="mb-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
          </div>

          {/* Chat Header */}
          <div className="bg-white shadow-sm rounded-t-lg p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  TalentTalk Assistant
                </h2>
                <p className="text-sm text-gray-500">
                  AI-powered recruitment assistant
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 bg-gray-50 p-4 overflow-y-auto"
          >
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-3/4 rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <div
                        className={`flex-shrink-0 h-8 w-8 rounded-full ${
                          message.role === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-blue-100 text-blue-600"
                        } flex items-center justify-center mr-2`}
                      >
                        {message.role === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            message.role === "user"
                              ? "text-white"
                              : "text-gray-900"
                          }`}
                        >
                          {message.role === "user" ? "You" : "TalentTalk"}
                        </p>
                        <p
                          className={`text-xs ${
                            message.role === "user"
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`text-sm ${
                        message.role === "user" ? "text-white" : "text-gray-800"
                      } whitespace-pre-line`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-3/4 rounded-lg p-4 bg-white border border-gray-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">
                        <Bot className="h-4 w-4" />
                      </div>
                      <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat Input */}
          <div className="bg-white shadow-sm rounded-b-lg p-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about candidates, skills, or interviews..."
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
          </div>

          {/* Suggested Questions */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Suggested Questions
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() =>
                  setInput(
                    "Who are the best candidates for the Frontend Developer position?"
                  )
                }
                className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100"
              >
                Best candidates for Frontend Developer
              </button>
              <button
                onClick={() => setInput("What skills do our candidates have?")}
                className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100"
              >
                Candidate skills analysis
              </button>
              <button
                onClick={() =>
                  setInput("Suggest interview questions for React developers")
                }
                className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100"
              >
                Interview questions
              </button>
              <button
                onClick={() =>
                  setInput(
                    "What are the educational backgrounds of our candidates?"
                  )
                }
                className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100"
              >
                Education backgrounds
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
