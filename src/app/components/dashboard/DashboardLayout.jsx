"use client";
import { useState } from "react";
import DashboardHeader from "./DashboardHeader"; // Import the header component

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sticky header outside the overflow context */}
      <DashboardHeader HRemail="Hrn2b@example.com" />

      {/* Main content container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
