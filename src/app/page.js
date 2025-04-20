// src/app/page.js

import Navbar from "./components/home-components/Navbar";
import Hero from "./components/home-components/Hero";
import ProblemStatement from "./components/home-components/ProblemStatement";
import Features from "./components/home-components/Features";
import Benefits from "./components/home-components/Benefits";
import Testimonial from "./components/home-components/Testimonial";
import CTA from "./components/home-components/CTA";
import Footer from "./components/home-components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Problem Statement */}
      <ProblemStatement />

      {/* Features Section */}
      <Features />
      {/* Benefits Section */}

      <Benefits />

      {/* Testimonial/Stats Section */}
      <Testimonial />

      {/* CTA Section */}
      <CTA />

      {/* Footer */}
      <Footer />
    </div>
  );
}
