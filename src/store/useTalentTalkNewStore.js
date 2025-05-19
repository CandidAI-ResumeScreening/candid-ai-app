// src/store/useTalentTalkNewStore.js
import { create } from "zustand";

// Initial message that appears when the chat starts
const initialMessage = {
  sender: "bot",
  content:
    "Hello! I'm TalentTalk, your HR assistant. I can help you analyze candidate resumes, compare qualifications, and find the best match for your positions. How can I help you today?",
  timestamp: new Date(),
};

// Store for TalentTalkNew component
const useTalentTalkNewStore = create((set) => ({
  // Initial state
  messages: [initialMessage],
  candidates: [],
  jobDetails: null,
  isLoading: false,

  // Add message to the chat
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, { ...message, timestamp: new Date() }],
    })),

  // Set loading state
  setLoading: (isLoading) => set({ isLoading }),

  // Set candidates data
  setCandidates: (candidates) => set({ candidates }),

  // Set job details
  setJobDetails: (jobDetails) => set({ jobDetails }),

  // Reset messages to initial state - using the constant instead of recreating the object
  resetMessages: () =>
    set({
      messages: [initialMessage],
    }),
}));

export default useTalentTalkNewStore;
