"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/useUserStore";
import axios from "axios";

export default function LogoutButton() {
  const router = useRouter();
  const clearUser = useUserStore((state) => state.clearUser);

  const handleLogout = async () => {
    try {
      // Call the logout API
      await axios.get("/api/auth/logout");

      // Clear user state
      clearUser();

      // Remove token from localStorage
      localStorage.removeItem("token");

      // Redirect to login
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center text-red-500 hover:text-red-700 transition-colors cursor-pointer"
    >
      <LogOut className="h-5 w-5 mr-2" />
      <span>Logout</span>
    </button>
  );
}
