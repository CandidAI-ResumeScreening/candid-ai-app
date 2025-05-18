// src/store/useJobStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useJobStore = create(
  persist(
    (set, get) => ({
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

      // Edit mode
      isEditMode: false,
      editJobId: null,

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

      // New methods for edit mode
      setEditMode: (isEditMode, jobId = null) =>
        set({
          isEditMode,
          editJobId: jobId,
        }),

      loadJobForEditing: (job) => {
        // Convert string date to Date object
        let deadlineDate = null;
        if (job.deadline) {
          deadlineDate = new Date(job.deadline);
        }

        // Convert string years of experience to string
        const yearsExp =
          job.yearsOfExperience !== undefined
            ? job.yearsOfExperience.toString()
            : "";

        // Handle grade field
        let educationGrade = "";
        let gpa = "";

        if (job.grade && job.grade.includes("GPA")) {
          gpa = job.grade.replace("GPA: ", "");
        } else if (job.grade && job.grade !== "Not specified") {
          educationGrade = job.grade;
        }

        set({
          isEditMode: true,
          editJobId: job._id,
          title: job.title || "",
          category: job.category || "",
          deadline: deadlineDate,
          companyName: job.companyName || "",
          location: job.location || "",
          salary: job.salary || "",
          skills: job.skills || [],
          experienceLevel: job.experienceLevel || "entry",
          yearsOfExperience: yearsExp,
          educationLevel: job.educationLevel || "",
          fieldOfStudy: job.fieldOfStudy || "",
          educationGrade,
          gpa,
          jobDescription: job.jobDescription || "",
          weights: job.weights || {
            skills: 25,
            experienceLevel: 25,
            yearsOfExperience: 25,
            education: 25,
          },
        });
      },

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
          isEditMode: false,
          editJobId: null,
        }),
    }),
    {
      name: "job-store", // Name for localStorage
      partialize: (state) => ({
        // Only persist these fields to localStorage
        title: state.title,
        category: state.category,
        deadline: state.deadline ? state.deadline.toISOString() : null,
        companyName: state.companyName,
        location: state.location,
        salary: state.salary,
        skills: state.skills,
        experienceLevel: state.experienceLevel,
        yearsOfExperience: state.yearsOfExperience,
        educationLevel: state.educationLevel,
        fieldOfStudy: state.fieldOfStudy,
        educationGrade: state.educationGrade,
        gpa: state.gpa,
        jobDescription: state.jobDescription,
        weights: state.weights,
        currentStep: state.currentStep,
        isEditMode: state.isEditMode,
        editJobId: state.editJobId,
      }),
    }
  )
);

export default useJobStore;
