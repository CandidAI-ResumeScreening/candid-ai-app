import { ArrowRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-100 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block text-blue-600">Smart, Fast, Fair</span>
              <span className="block">AI-Powered CV Screening</span>
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg md:mt-5 md:text-xl">
              Building a fairer and faster future of hiring with intelligent
              automation.
            </p>
            <div className="mt-8 flex space-x-4">
              <Link href={"/auth/signup"}>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-base font-medium flex items-center cursor-pointer">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </Link>
              <button className="bg-white hover:bg-gray-50 text-blue-600 px-6 py-3 rounded-md text-base font-medium border border-blue-600">
                Learn More
              </button>
            </div>
          </div>

          {/* Illustration/Image */}
          <div className="hidden md:block">
            <div className="relative h-64 w-full rounded-lg overflow-hidden shadow-lg">
              {/* 🔧 Old icon-based block (commented for reference) */}

              {/* <div className="relative h-64 w-full rounded-lg bg-white shadow-lg p-4 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="h-12 w-12 text-blue-600" />
                  </div>
                  <p className="text-gray-600">
                    AI-powered resume screening visualization
                  </p>
                </div>
              </div> */}

              <div className="relative w-full h-120 rounded-lg overflow-hidden shadow-lg bg-white">
                <Image
                  src="/home-images/freepik-resume-person.jpeg"
                  alt="AI-powered resume screening"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 0px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
