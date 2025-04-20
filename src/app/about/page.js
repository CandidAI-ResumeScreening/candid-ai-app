// src/app/about/page.js
// import Navbar from "../components/about-components/Navbar";
import Navbar from "../components/about-components/NavbarResponsive";
import Header from "../components/about-components/Header";
import Team from "../components/about-components/Team";
import ProjectMotivation from "../components/about-components/ProjectMotivation";
import Research from "../components/about-components/Research";
import Supervision from "../components/about-components/Supervision";
import Achievements from "../components/about-components/Achievements";
import FutureVision from "../components/about-components/FutureVision";
import CTA from "../components/about-components/CTA";
import Footer from "../components/about-components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Page Header */}
      <Header />

      {/* The Team Section */}
      <Team />

      {/* Project Motivation */}
      <ProjectMotivation />

      {/* Research Approach */}
      <Research />

      {/* Project Supervision */}
      <Supervision />

      {/* Achievements */}
      {/* <Achievements /> */}

      {/* Future Vision */}
      <FutureVision />
      {/* CTA Section */}
      <CTA />

      {/* Footer */}
      <Footer />
    </div>
  );
}
