// src/store/useChatStore.js
import { create } from "zustand";

const useChatStore = create((set) => ({
  messages: [
    {
      role: "bot",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ],
  isLoading: false,

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setLoading: (isLoading) => set({ isLoading }),

  clearMessages: () =>
    set({
      messages: [
        {
          role: "bot",
          content: "Hello! I'm your AI assistant. How can I help you today?",
          timestamp: new Date(),
        },
      ],
    }),
}));

export default useChatStore;
