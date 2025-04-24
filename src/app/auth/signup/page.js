import Footer from "@/app/components/home-components/Footer";
import Navbar from "@/app/components/signup-components/navbar";
import SignUp from "@/app/components/signup-components/signup";
import React from "react";

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SignUp />
      <Footer />
    </div>
  );
};

export default SignUpPage;
