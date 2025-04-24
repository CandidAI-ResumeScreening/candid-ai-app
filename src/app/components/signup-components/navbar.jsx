"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left: Logo + Links */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">CandidAI</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                About Us
              </Link>
              <Link
                href="/applyjobs"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Apply Jobs
              </Link>
              <Link
                href="/contact"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Right: Button on Desktop */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link href="/auth/login">
              <button className="bg-white hover:bg-gray-50 text-blue-600 px-4 py-2 rounded-md text-sm font-medium border border-blue-600 mr-2">
                Sign In
              </button>
            </Link>
          </div>

          {/* Hamburger Menu on Mobile */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200 shadow">
          <div className="px-4 pt-4 pb-2 space-y-2">
            <Link
              href="/"
              className="block text-gray-700 hover:text-blue-600 text-sm font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block text-gray-700 hover:text-blue-600 text-sm font-medium"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/applyjobs"
              className="block text-gray-700 hover:text-blue-600 text-sm font-medium"
              onClick={() => setIsOpen(false)}
            >
              Apply Jobs
            </Link>
            <Link
              href="/contact"
              className="block text-gray-700 hover:text-blue-600 text-sm font-medium"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Link href={"/auth/login"}>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full mt-2 bg-white hover:bg-gray-50 text-blue-600 px-4 py-2 rounded-md text-sm font-medium border border-blue-600 cursor-pointer"
              >
                Sign In
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
