// src/store/useTalentTalkStore.js
import { create } from "zustand";

const useTalentTalkStore = create((set) => ({
  // Chat messages
  messages: [
    {
      role: "bot",
      content:
        "Hello! I'm TalentTalk, your AI recruitment assistant. How can I help you analyze your candidates today?",
      timestamp: new Date(),
    },
  ],
  isLoading: false,
  candidates: [],
  jobDetails: null,

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setCandidates: (candidates) => set({ candidates }),
  setJobDetails: (jobDetails) => set({ jobDetails }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  resetMessages: () =>
    set({
      messages: [
        {
          role: "bot",
          content:
            "Hello! I'm TalentTalk, your AI recruitment assistant. How can I help you analyze your candidates today?",
          timestamp: new Date(),
        },
      ],
    }),
  reset: () =>
    set({
      messages: [
        {
          role: "bot",
          content:
            "Hello! I'm TalentTalk, your AI recruitment assistant. How can I help you analyze your candidates today?",
          timestamp: new Date(),
        },
      ],
      isLoading: false,
      candidates: [],
      jobDetails: null,
    }),
}));

export default useTalentTalkStore;
