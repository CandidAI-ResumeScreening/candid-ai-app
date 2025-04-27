// src/components/dashboard/ChatbotCard.js
import { MessageSquare, Send } from "lucide-react";

export default function ChatbotCard() {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="ml-3 text-lg font-medium text-gray-900">
            TalentTalk Assistant
          </h2>
        </div>
      </div>
      <div className="px-6 py-4">
        <div className="flex flex-col space-y-3">
          <div className="bg-blue-50 rounded-lg p-3 max-w-xs">
            <p className="text-sm text-gray-800">
              Hello! I'm your AI recruitment assistant. How can I help you
              today?
            </p>
            <p className="text-xs text-gray-500 mt-1">TalentTalk • Just now</p>
          </div>

          <div className="bg-gray-100 rounded-lg p-3 max-w-xs self-end">
            <p className="text-sm text-gray-800">
              Can you summarize today's applicants?
            </p>
            <p className="text-xs text-gray-500 mt-1">You • Just now</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-3 max-w-xs">
            <p className="text-sm text-gray-800">
              Today you've received 14 new applications across 5 open positions.
              The Frontend Developer role has the most activity with 6 new
              candidates, and 3 candidates match your requirements with 85%+
              scores.
            </p>
            <p className="text-xs text-gray-500 mt-1">TalentTalk • Just now</p>
          </div>
        </div>

        <div className="mt-4 relative">
          <input
            type="text"
            className="block w-full pr-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Ask me anything about your candidates..."
          />
          <button className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500">
            <Send className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 text-center">
          <button className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500">
            Open full TalentTalk interface
          </button>
        </div>
      </div>
    </div>
  );
}
