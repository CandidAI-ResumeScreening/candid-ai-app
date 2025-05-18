// src/components/dashboard/ChatbotCard.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Send, X } from "lucide-react";
import useChatStore from "@/store/useChatStore";
import { format } from "date-fns";

export default function ChatbotCard() {
  const router = useRouter();
  const { messages, addMessage, isLoading, setLoading } = useChatStore();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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

  // Open full interface
  const openFullInterface = () => {
    router.push("/dashboard/candidai-assistant");
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="ml-3 text-lg font-medium text-gray-900">
            CandidAI Assistant
          </h2>
        </div>
      </div>
      <div className="px-6 py-4">
        <div className="flex flex-col space-y-3 h-[300px] overflow-y-auto mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-gray-100 text-gray-800 rounded-tl-none"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.role === "user" ? "text-blue-100" : "text-gray-500"
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
              <div className="bg-gray-100 rounded-lg p-3 rounded-tl-none flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div
                    className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0s" }}
                  ></div>
                  <div
                    className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="mt-4 relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about CandidAI features..."
            className="block w-full pr-10 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500 disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={openFullInterface}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Open full CandidAI interface
          </button>
        </div>
      </div>
    </div>
  );
}
