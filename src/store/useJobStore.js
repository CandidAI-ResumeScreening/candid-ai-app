// src/store/useJobStore.js
import { create } from "zustand";

const useJobStore = create((set) => ({
  // Step 1 fields
  title: "",
  category: "",
  deadline: null,
  companyName: "",

  // Step 2 fields
  location: "",
  salary: "",

  // Step 3 fields
  skills: [],
  experienceLevel: "entry",
  yearsOfExperience: "",

  // Step 4 fields
  educationLevel: "",
  fieldOfStudy: "",
  educationGrade: "",
  gpa: "",

  // Step 5 fields
  jobDescription: "",

  // Step 6 fields
  weights: {
    skills: 25,
    experienceLevel: 25,
    yearsOfExperience: 25,
    education: 25,
  },

  // Current step
  currentStep: 1,
  totalSteps: 7,
  isSubmitting: false,
  submitError: null,
  submitSuccess: false,

  // Actions
  setField: (field, value) => set((state) => ({ [field]: value })),

  setSkills: (skills) => set({ skills }),

  addSkill: (skill) =>
    set((state) => ({
      skills: [...state.skills, skill],
    })),

  removeSkill: (skillToRemove) =>
    set((state) => ({
      skills: state.skills.filter((skill) => skill !== skillToRemove),
    })),

  setWeight: (field, value) =>
    set((state) => ({
      weights: {
        ...state.weights,
        [field]: value,
      },
    })),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, state.totalSteps),
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    })),

  goToStep: (step) =>
    set({
      currentStep: step,
    }),

  setSubmitting: (isSubmitting) =>
    set({
      isSubmitting,
    }),

  setSubmitError: (error) =>
    set({
      submitError: error,
      isSubmitting: false,
    }),

  setSubmitSuccess: (success) =>
    set({
      submitSuccess: success,
      isSubmitting: false,
    }),

  reset: () =>
    set({
      title: "",
      category: "",
      deadline: null,
      companyName: "",
      location: "",
      salary: "",
      skills: [],
      experienceLevel: "entry",
      yearsOfExperience: "",
      educationLevel: "",
      fieldOfStudy: "",
      educationGrade: "",
      gpa: "",
      jobDescription: "",
      weights: {
        skills: 25,
        experienceLevel: 25,
        yearsOfExperience: 25,
        education: 25,
      },
      currentStep: 1,
      isSubmitting: false,
      submitError: null,
      submitSuccess: false,
    }),
}));

export default useJobStore;
