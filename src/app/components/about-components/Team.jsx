import React from "react";
import Image from "next/image";

const Team = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Team
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Final year BSc Computer Science students at JKUAT passionate about
            AI and recruitment technology.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 relative rounded-full overflow-hidden mb-4">
                <Image
                  src="/team-members/ashraf.jpeg"
                  alt="Ashraf Hassan Anil"
                  fill
                  className="object-cover rounded-full"
                />
              </div>

              <h3 className="text-xl font-bold text-gray-900">
                Ashraf Hassan Anil
              </h3>
              <p className="text-blue-600">BSc Computer Science, JKUAT</p>
              <p className="mt-4 text-center text-gray-500 max-w-md">
                Specialized in NLP and ML, thus created the Resume Parser and
                NLP extraction Modules
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-40 h-40 relative rounded-full overflow-hidden mb-4">
                <Image
                  src="/team-members/nelson.jpeg"
                  alt="Yusin Adan Ali"
                  fill
                  className="object-cover rounded-full"
                />
              </div>

              <h3 className="text-xl font-bold text-gray-900">
                Yusin Adan Ali
              </h3>
              <p className="text-blue-600">BSc Computer Science, JKUAT</p>
              <p className="mt-4 text-center text-gray-500 max-w-md">
                Expert in LLM and Fuzzy logic thus created the Scoring and
                Talenttalk chatbot
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
