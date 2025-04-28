// src/store/useUserStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,

      // Update user data
      setUser: (userData) =>
        set({
          user: userData,
          isLoggedIn: !!userData,
        }),

      // Clear user data (for logout)
      clearUser: () =>
        set({
          user: null,
          isLoggedIn: false,
        }),
    }),
    {
      name: "user-storage", // unique name
      getStorage: () => localStorage, // Use localStorage for persistence
    }
  )
);

export default useUserStore;
