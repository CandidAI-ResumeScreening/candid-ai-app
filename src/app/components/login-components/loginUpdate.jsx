"use client";

import Link from "next/link";
import { ArrowRight, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/useUserStore";
import axios from "axios";

export default function Login() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form data
    if (!formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      // Make API request to login
      const response = await axios.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        // Update user store with the user data
        setUser(response.data.user);

        // Save token to localStorage
        localStorage.setItem("token", response.data.token);

        // Redirect to dashboard
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.message ||
          "Invalid credentials. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="pt-12 md:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-600 h-2"></div>
              <div className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-extrabold text-gray-900">
                    Welcome Back
                  </h2>
                  <p className="mt-2 text-gray-600">
                    Sign in to your CandidAI account
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    {error}
                  </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-800">
                      Email Address
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="appearance-none block w-full pl-10 pr-3 py-2 text-gray-800 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-800">
                      Password
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="appearance-none block w-full pl-10 pr-3 py-2 text-gray-800 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your password"
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-end">
                      <Link
                        href="/auth/forgot-password"
                        className="text-sm text-blue-600 hover:text-blue-500"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                      {loading ? "Loading..." : "Sign In"}
                      {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </button>
                  </div>
                </form>
              </div>
              <div className="mb-4 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    href="/auth/signup"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
