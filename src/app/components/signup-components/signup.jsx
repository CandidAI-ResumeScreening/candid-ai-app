"use client";
import Link from "next/link";
import { ArrowRight, Mail, Lock, User } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/useUserStore";
import axios from "axios";

export default function SignUp() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password" || name === "confirmPassword") {
      if (name === "password") {
        setPasswordMatch(value === formData.confirmPassword && value !== "");
      } else {
        setPasswordMatch(formData.password === value && value !== "");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form data
    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.email ||
      !formData.password
    ) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      setLoading(true);

      // Make API request to register user
      const response = await axios.post("/api/auth/signup", {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        // Update user store with the user data
        setUser(response.data.user);

        // Redirect to dashboard
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError(
        error.response?.data?.message ||
          "An error occurred during registration. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Signup Form Section */}
      <div className="pt-12 md:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="max-w-md lg:max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-600 h-2"></div>
              <div className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-extrabold text-gray-900">
                    Create Your Account
                  </h2>
                  <p className="mt-2 text-gray-600">
                    Join CandidAI to streamline your hiring process
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    {error}
                  </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-800">
                        First Name
                      </label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="firstname"
                          value={formData.firstname}
                          onChange={handleChange}
                          required
                          className="appearance-none block w-full pl-10 pr-3 py-2 border text-gray-800 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="First Name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-800">
                        Last Name
                      </label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="lastname"
                          value={formData.lastname}
                          onChange={handleChange}
                          required
                          className="appearance-none block w-full pl-10 pr-3 py-2 text-gray-800 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Last Name"
                        />
                      </div>
                    </div>
                  </div>

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

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                          placeholder="Create a password"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Password must be at least 8 characters long
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-800">
                        Confirm Password
                      </label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          className="appearance-none block w-full pl-10 pr-3 py-2 text-gray-800 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Confirm your password"
                        />
                      </div>
                      {passwordMatch === true && (
                        <div className="text-green-500 flex items-center mt-1 text-sm">
                          <img
                            src="/signup-images/tick-1.svg"
                            className="h-4 w-4 mr-1"
                            alt="Tick"
                          />
                          Passwords match
                        </div>
                      )}
                      {passwordMatch === false && (
                        <div className="text-red-500 flex items-center mt-1 text-sm">
                          <img
                            src="/signup-images/wrong.svg"
                            className="h-4 w-4 mr-1"
                            alt="X"
                          />
                          Passwords do not match
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      required
                    />
                    <label
                      htmlFor="terms"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      I agree to the{" "}
                      <Link
                        href="/termsAndPolicies"
                        className="text-blue-600 hover:text-blue-500"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/termsAndPolicies"
                        className="text-blue-600 hover:text-blue-500"
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                      {loading ? "Loading..." : "Create Account"}
                      {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </button>
                  </div>
                </form>
              </div>
              <div className="mb-4 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign in
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
