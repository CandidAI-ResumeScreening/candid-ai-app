"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Bell, User } from "lucide-react";
import useUserStore from "@/store/useUserStore";
import LogoutButton from "../logout-components/logout-button";

export default function DashboardHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = useUserStore((state) => state.user);

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-4 flex items-center justify-between border-b border-gray-200 lg:border-none">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">CandidAI</span>
            </Link>
            {/* <div className="hidden ml-10 space-x-8 lg:block">
              <Link
                href="/dashboard"
                className="border-blue-500 border-b-2 pt-3 text-base text-gray-900 font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/jobs"
                className="text-base font-medium text-gray-700 hover:text-gray-900"
              >
                Jobs
              </Link>
              <Link
                href="/dashboard/candidates"
                className="text-base font-medium text-gray-700 hover:text-gray-900"
              >
                Candidates
              </Link>
              <Link
                href="/dashboard/analytics"
                className="text-base font-medium text-gray-700 hover:text-gray-900"
              >
                Analytics
              </Link>
              <Link
                href="/dashboard/settings"
                className="text-base font-medium text-gray-700 hover:text-gray-900"
              >
                Settings
              </Link>
            </div> */}
            <div className="hidden ml-10 space-x-8 lg:flex">
              <Link
                href="/dashboard"
                className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-base font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/jobs"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-base font-medium"
              >
                Jobs
              </Link>
              <Link
                href="/dashboard/candidates"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-base font-medium"
              >
                Candidates
              </Link>
              <Link
                href="/dashboard/analytics"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-base font-medium"
              >
                Analytics
              </Link>
              <Link
                href="/dashboard/settings"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-base font-medium"
              >
                Settings
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            {/* <button className="p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none">
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
            </button> */}

            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium">HR</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium pb-2 text-gray-800 group-hover:text-gray-900">
                  {user?.email || "HR User"}
                </p>
                <LogoutButton />
              </div>
            </div>
          </div>

          <div className="lg:hidden">
            <button
              type="button"
              className="p-2 rounded-md inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="py-4 flex flex-wrap justify-center space-y-2 lg:hidden">
            <Link
              href="/dashboard"
              className="w-full px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/jobs"
              className="w-full px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
            >
              Jobs
            </Link>
            <Link
              href="/dashboard/candidates"
              className="w-full px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
            >
              Candidates
            </Link>
            <Link
              href="/dashboard/settings"
              className="w-full px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
            >
              Settings
            </Link>
            <div className="w-full px-4 py-2 flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <User className="h-5 w-5" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {user?.email || "HR User"}
                </p>
                <LogoutButton />
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
