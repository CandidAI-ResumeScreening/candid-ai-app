//src/app/components/home-components/Footer.jsx
import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <span className="text-xl font-bold text-white">CandidAI</span>
            </div>
            <p className="mt-2 text-gray-400">
              Building a fairer and faster future of hiring with intelligent
              automation.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="text-gray-400 hover:text-white"
                >
                  Features
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
              Contact
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="text-gray-400">JKUAT, Juja</li>
              <li className="text-gray-400">info@candidai.edu</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-8">
          <p className="text-center text-gray-400">
            &copy; {new Date().getFullYear()} CandidAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
