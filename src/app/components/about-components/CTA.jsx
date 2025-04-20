import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Want to learn more about CandidAI?
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            We'd love to discuss our project and explore potential
            collaborations.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/contact"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-base font-medium inline-flex items-center"
            >
              Contact Us <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;
