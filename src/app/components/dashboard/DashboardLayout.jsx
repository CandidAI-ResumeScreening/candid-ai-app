"use client";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="lg:hidden">
          <div className="flex items-center justify-between bg-white px-4 py-2 border-b border-gray-200">
            <div className="flex items-center">
              <span className="ml-2 text-xl font-bold text-blue-600">
                CandidAI
              </span>
            </div>
          </div>
        </div>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
