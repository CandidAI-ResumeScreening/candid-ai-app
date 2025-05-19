// src/app/components/account/AccountSettingsPage.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, AlertTriangle, CheckCircle, X } from "lucide-react";
import DashboardHeader from "@/app/components/account/dashboard-header";
import useUserStore from "@/store/useUserStore";
import axios from "axios";

export default function AccountSettingsPage() {
  const router = useRouter();
  const { user, clearUser, isLoggedIn } = useUserStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstname: "",
    lastname: "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Password match state
  const [passwordsMatch, setPasswordsMatch] = useState(null);

  // Set isClient to true on component mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (isClient && !isLoggedIn) {
      router.push("/auth/login");
    }
  }, [isClient, isLoggedIn, router]);

  // Initialize form with user data once available
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
      });
    }
  }, [user]);

  // Check if passwords match
  useEffect(() => {
    if (passwordForm.newPassword && passwordForm.confirmPassword) {
      setPasswordsMatch(
        passwordForm.newPassword === passwordForm.confirmPassword
      );
    } else {
      setPasswordsMatch(null);
    }
  }, [passwordForm.newPassword, passwordForm.confirmPassword]);

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm({ ...profileForm, [name]: value });
  };

  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
  };

  // Update profile information
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.patch(
        "/api/auth/update-profile",
        profileForm
      );

      if (response.data.success) {
        setSuccess("Profile updated successfully!");
        // Update the user store with new profile information
        useUserStore.getState().setUser({
          ...user,
          firstname: profileForm.firstname,
          lastname: profileForm.lastname,
        });
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Check if passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Check password minimum length
    if (passwordForm.newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.patch("/api/auth/update-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (response.data.success) {
        setSuccess("Password updated successfully!");
        // Reset password form
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      console.error("Error updating password:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.delete("/api/auth/delete-account");

      if (response.data.success) {
        // Clear user from store
        clearUser();
        // Remove token from localStorage
        localStorage.removeItem("token");
        // Redirect to login page
        router.push("/auth/login");
      }
    } catch (err) {
      console.error("Error deleting account:", err);
      setError(
        err.response?.data?.message ||
          "Failed to delete account. Please try again."
      );
      setLoading(false);
    }
  };

  // If not client-side yet, show loading
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />

      <main className="flex-1 overflow-auto py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Account Settings
          </h1>

          {/* Settings Tabs */}
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`${
                    activeTab === "profile"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                >
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab("password")}
                  className={`${
                    activeTab === "password"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                >
                  Change Password
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Success Message */}
              {success && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>{success}</span>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <span>{error}</span>
                </div>
              )}

              {/* Profile Information Tab */}
              {activeTab === "profile" && (
                <div>
                  <form onSubmit={handleUpdateProfile}>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          First Name
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="firstname"
                            value={profileForm.firstname}
                            onChange={handleProfileChange}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Last Name
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="lastname"
                            value={profileForm.lastname}
                            onChange={handleProfileChange}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email (Cannot be changed)
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                          </div>
                          <input
                            type="email"
                            value={user?.email || ""}
                            className="block w-full pl-10 pr-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-500 cursor-not-allowed"
                            disabled
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Your email address is used for authentication and
                          cannot be changed.
                        </p>
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                        >
                          {loading ? "Updating..." : "Update Profile"}
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Delete Account Section */}
                  <div className="mt-10 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Delete Account
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Permanently delete your account and all associated data.
                      This action cannot be undone.
                    </p>

                    {showDeleteConfirm ? (
                      <div className="bg-red-50 border border-red-300 rounded-md p-4 mb-4">
                        <div className="flex">
                          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                          <div>
                            <h3 className="text-sm font-medium text-red-800">
                              Warning
                            </h3>
                            <p className="text-sm text-red-700 mt-1">
                              This will permanently delete your account, all
                              your job postings, and candidate data. You will
                              not be able to recover this information.
                            </p>
                            <div className="mt-3 flex space-x-3">
                              <button
                                type="button"
                                onClick={handleDeleteAccount}
                                disabled={loading}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300"
                              >
                                {loading
                                  ? "Deleting..."
                                  : "Yes, Delete My Account"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(false)}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Delete Account
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Change Password Tab */}
              {activeTab === "password" && (
                <div>
                  <form onSubmit={handleUpdatePassword}>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Current Password
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="password"
                            name="currentPassword"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordChange}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          New Password
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="password"
                            name="newPassword"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                            minLength={8}
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Must be at least 8 characters long
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Confirm New Password
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                            minLength={8}
                          />
                        </div>
                        {passwordsMatch === true && (
                          <p className="mt-1 text-xs text-green-500 flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" /> Passwords
                            match
                          </p>
                        )}
                        {passwordsMatch === false && (
                          <p className="mt-1 text-xs text-red-500 flex items-center">
                            <X className="h-3 w-3 mr-1" /> Passwords do not
                            match
                          </p>
                        )}
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={loading || passwordsMatch === false}
                          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                        >
                          {loading ? "Updating..." : "Update Password"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
