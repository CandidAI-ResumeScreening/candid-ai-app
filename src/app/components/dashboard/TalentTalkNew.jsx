"use client";

import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { Mic, MicOff, SendHorizonal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import useTalentTalkNewStore from "@/store/useTalentTalkNewStore";

const TalentTalkNew = ({ onClose, candidates = [], jobDetails = null }) => {
  // Get state from the store
  const {
    messages,
    isLoading,
    addMessage,
    setLoading,
    setCandidates,
    setJobDetails,
    resetMessages,
  } = useTalentTalkNewStore();

  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showConvai, setShowConvai] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Reset messages and set candidates data on mount
  useEffect(() => {
    // Only reset on initial mount
    resetMessages();
    // Set data if provided
    if (candidates.length > 0) setCandidates(candidates);
    if (jobDetails) setJobDetails(jobDetails);

    // Focus the input when component mounts
    const input = document.querySelector("input");
    if (input) input.focus();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this only runs on mount

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize ElevenLabs Convai widget when component mounts
  useEffect(() => {
    // Create script element
    const script = document.createElement("script");
    script.src = "https://elevenlabs.io/convai-widget/index.js";
    script.async = true;
    script.type = "text/javascript";

    // Append script to document
    document.body.appendChild(script);

    // Clean up on unmount
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Format time helper function
  const formatTime = (date) => {
    return format(new Date(date), "h:mm a");
  };

  const API_URL = "https://902a-34-143-215-137.ngrok-free.app/simple_chat";

  // Add a fallback response function for when Ollama API fails
  const generateFallbackResponse = (input) => {
    const userInput = input.toLowerCase();

    // Simple response mapping
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
    return (
      "I understand you're asking about \"" +
      input +
      "\". While I'm experiencing some connection issues with my knowledge base, I'd be happy to discuss this further once the connection is restored."
    );
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage = { sender: "user", content: input };
    addMessage(userMessage);
    setInput("");

    // Set loading state
    setLoading(true);

    try {
      // Call the external API
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_input: input,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response received:", data);

      // Show bot response
      if (data.reply) {
        addMessage({
          sender: "bot",
          content: data.reply,
        });
      }
      // Handle Ollama error with a fallback response
      else if (data.ollama_error) {
        console.warn(
          "API warning - using fallback response:",
          data.ollama_error
        );

        // If API error involves Ollama, use our fallback response generator
        const fallbackResponse = generateFallbackResponse(input);
        addMessage({
          sender: "bot",
          content: fallbackResponse,
        });

        // Also add a notification that we're using a fallback
        addMessage({
          sender: "feedback",
          content: `Note: Using simplified responses due to a temporary issue with the advanced AI service.`,
        });
      }

      // Show function call feedback if present
      if (data.function_call_feedback) {
        addMessage({
          sender: "feedback",
          content: `Action Result: ${data.function_call_feedback}`,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      addMessage({
        sender: "error",
        content: `Failed to get response: ${error.message || "Unknown error"}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    setShowConvai(!showConvai);

    // If turning off, remove the widget from display
    if (isListening) {
      const widgetElement = document.querySelector("elevenlabs-convai");
      if (widgetElement) {
        widgetElement.style.display = "none";
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl h-[90vh] flex flex-col rounded-lg overflow-hidden shadow-lg bg-white">
        <div className="bg-[#2c3e50] text-white p-4 flex justify-between items-center">
          <div className="text-center text-lg font-medium">
            TalentTalk HR Assistant
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-[#1a252f]"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "p-3 rounded-[18px] max-w-[80%] break-words",
                message.sender === "user"
                  ? "self-end bg-[#3498db] text-white rounded-br-[5px]"
                  : message.sender === "bot"
                  ? "self-start bg-[#e9e9eb] text-[#333] rounded-bl-[5px]"
                  : message.sender === "error"
                  ? "self-start bg-[#e74c3c] text-white rounded-bl-[5px]"
                  : "self-start bg-[#2ecc71] text-white rounded-bl-[5px]"
              )}
            >
              <div>{message.content}</div>
              {message.timestamp && (
                <div
                  className={cn(
                    "text-xs mt-1",
                    message.sender === "user"
                      ? "text-blue-100"
                      : "text-gray-500"
                  )}
                >
                  {message.sender === "user" ? "You" : "TalentTalk"} •{" "}
                  {formatTime(message.timestamp)}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="self-start bg-[#e9e9eb] p-2 rounded-[18px] rounded-bl-[5px]">
              <div className="flex space-x-1">
                <span className="inline-block w-2 h-2 bg-[#666] rounded-full animate-bounce"></span>
                <span
                  className="inline-block w-2 h-2 bg-[#666] rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></span>
                <span
                  className="inline-block w-2 h-2 bg-[#666] rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex p-3 border-t border-[#e9e9eb]">
          <Button
            className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center",
              isListening
                ? "bg-[#e74c3c] text-white hover:bg-[#c0392b]"
                : "bg-[#ecf0f1] text-[#7f8c8d] hover:bg-[#bdc3c7]"
            )}
            onClick={toggleListening}
          >
            {isListening ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>

          <Input
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2 mx-2 border border-[#ddd] rounded-full focus:outline-none focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
            disabled={isLoading}
          />

          <Button
            className={cn(
              "bg-[#2c3e50] text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#1a252f]",
              (isLoading || !input.trim()) &&
                "bg-[#95a5a6] cursor-not-allowed hover:bg-[#95a5a6]"
            )}
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
          >
            <SendHorizonal className="h-5 w-5" />
          </Button>
        </div>

        {showConvai && (
          <div className="absolute bottom-20 left-0 right-0 flex justify-center">
            <div className="p-4 bg-white rounded-lg shadow-lg">
              <elevenlabs-convai agent-id="huqI2oX34TEk8vBTQvKh"></elevenlabs-convai>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TalentTalkNew;
