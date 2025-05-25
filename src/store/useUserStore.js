// src/store/useUserStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,

      // Update user data
      setUser: (userData) =>
        set({
          user: userData,
          isLoggedIn: !!userData,
        }),

      // Check if user is logged in
      checkAuth: () => {
        const state = get();
        return !!state.user && state.isLoggedIn;
      },

      // Clear user data (for logout)
      clearUser: () =>
        set({
          user: null,
          isLoggedIn: false,
        }),
    }),
    {
      name: "user-storage", // unique name
      storage: createJSONStorage(() => {
        // Use localStorage only on client side
        if (typeof window !== "undefined") {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      // Ensure hydration is proper
      skipHydration: true,
    }
  )
);

// Hydrate the store on client-side
if (typeof window !== "undefined") {
  const storedState = localStorage.getItem("user-storage");
  if (storedState) {
    try {
      const { state } = JSON.parse(storedState);
      if (state?.user) {
        useUserStore.setState({
          user: state.user,
          isLoggedIn: true,
        });
      }
    } catch (error) {
      console.error("Error hydrating state:", error);
    }
  }
}

export default useUserStore;
