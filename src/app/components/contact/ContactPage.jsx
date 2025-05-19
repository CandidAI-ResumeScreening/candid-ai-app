// src/app/components/contact/ContactPage.jsx
import React from "react";
import Link from "next/link";
import Navbar from "@/app/components/terms-policies/navbar";
import Footer from "@/app/components/home-components/Footer";
import {
  Mail,
  MapPin,
  Phone,
  Linkedin,
  MessageSquare,
  Facebook,
} from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Contact Us
            </h1>
            <p className="mt-4 text-xl text-gray-500">
              We'd love to hear from you
            </p>
          </div>

          <div className="flex justify-center mt-12">
            {/* Contact Information */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-lg w-full">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8">
                <h2 className="text-xl font-semibold text-white">
                  Get in Touch
                </h2>
                <p className="text-blue-100 mt-2">
                  Reach out to us for questions, support, or feedback
                </p>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Location
                    </h3>
                    <p className="mt-1 text-gray-600">JKUAT, Juja, Kenya</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Email</h3>
                    <a
                      href="mailto:candidAI2025@gmail.com"
                      className="mt-1 text-blue-600 hover:text-blue-800"
                    >
                      candidAI2025@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Phone/WhatsApp
                    </h3>
                    <a href="tel:+254712345678" className="mt-1 text-gray-600">
                      +254 741 674466
                    </a>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Connect With Us
                  </h3>

                  <div className="flex space-x-4">
                    <a
                      href="https://www.linkedin.com/company/candidai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Linkedin className="h-6 w-6" />
                    </a>
                    <a
                      href="https://www.facebook.com/candidai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Facebook className="h-6 w-6" />
                    </a>
                    <a
                      href="https://wa.me/254712345678"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <MessageSquare className="h-6 w-6" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-16 bg-gray-50 rounded-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Support Hours
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4">
                  <h3 className="font-medium text-gray-900">Weekdays</h3>
                  <p className="text-gray-600">9:00 AM - 5:00 PM EAT</p>
                </div>
                <div className="text-center p-4">
                  <h3 className="font-medium text-gray-900">Weekends</h3>
                  <p className="text-gray-600">10:00 AM - 2:00 PM EAT</p>
                </div>
              </div>
              <p className="mt-4 text-center text-gray-600">
                We aim to respond to all inquiries within 24-48 hours.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
