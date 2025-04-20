//src/app/components/about-components/Header.jsx
import React from "react";

const Header = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
        <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
          About CandidAI
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-blue-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Meet the team behind the AI-based resume screening innovation.
        </p>
      </div>
    </div>
  );
};

export default Header;
