// src/lib/projectInfo.js

const projectInfo = {
  // Company Information
  company: {
    name: "CandidAI",
    email: "candidAI2025@gmail.com",
    founded: "December 2024",
    location: "JKUAT, Juja, Kenya",
    founders: [
      "Ashraf Hassan Anil - NLP & ML Specialist (Resume Parser and NLP Extraction Modules)",
      "Yusin Adan Ali - LLM & Fuzzy Logic Expert (Scoring System and TalentTalk Chatbot)",
    ],
  },

  // Project Description
  description: {
    short:
      "CandidAI is an intelligent resume screening and candidate management platform powered by AI that makes hiring faster, fairer, and more efficient.",
    detailed: `CandidAI transforms the traditional hiring process by automating resume screening with advanced AI technology. The platform parses and analyzes resumes, ranks candidates based on job requirements using fuzzy logic, and provides HR professionals with actionable insights through an intuitive dashboard and AI assistant. By eliminating unconscious bias and significantly reducing screening time, CandidAI helps organizations make better hiring decisions while improving the candidate experience.`,
  },

  // Key Benefits
  benefits: [
    {
      title: "Efficiency",
      description:
        "Reduces resume screening time by up to 80%, allowing HR teams to focus on engaging with top candidates rather than manually reviewing hundreds of applications.",
    },
    {
      title: "Fairness",
      description:
        "Eliminates unconscious bias through objective evaluation based on skill matching, experience analysis, and education assessment, ensuring a diverse candidate pool.",
    },
    {
      title: "Customizable",
      description:
        "Offers flexible ranking criteria that can be tailored to specific job requirements, with adjustable weights for different factors such as skills, experience level, and education.",
    },
    {
      title: "AI-Powered Insights",
      description:
        "Provides comprehensive analytics and candidate insights through TalentTalk, an intelligent assistant that helps recruiters make data-driven decisions.",
    },
    {
      title: "Time to Value",
      description:
        "Start seeing results immediately with our intuitive interface that requires minimal setup and training to use effectively.",
    },
  ],

  // Key Features
  features: [
    {
      name: "Resume Parser",
      description:
        "Automatically extracts structured information from resumes using advanced OCR and NLP technology.",
    },
    {
      name: "NLP Classifier",
      description:
        "Intelligently analyzes text to accurately identify skills, experience, and qualifications from resume content.",
    },
    {
      name: "Ranking System",
      description:
        "Uses Multi-Criteria Decision Making (MCDM) and Fuzzy Logic to fairly score and rank candidates based on customizable job requirements.",
    },
    {
      name: "HR Dashboard",
      description:
        "Comprehensive interface for monitoring, comparing, and shortlisting candidates with visual analytics and filtering options.",
    },
    {
      name: "TalentTalk Chatbot",
      description:
        "Interactive AI assistant that helps recruiters query candidate data and get instant insights about applicants and job postings.",
    },
    {
      name: "Applicant Tracking",
      description:
        "Complete system for tracking applicants through the hiring pipeline, from application to interview and final decision.",
    },
  ],

  // Navigation Structure
  navigation: {
    mainSections: [
      {
        title: "Home",
        path: "/",
        description: "Landing page with an introduction to CandidAI",
      },
      {
        title: "About Us",
        path: "/about",
        description:
          "Information about the CandidAI team, project motivation, and vision",
      },
      {
        title: "Apply Jobs",
        path: "/applyjobs",
        description:
          "Public job board where candidates can view and apply for open positions",
      },
      {
        title: "Contact",
        path: "/contact",
        description:
          "Contact form and information for getting in touch with the CandidAI team",
      },
    ],

    authenticatedSections: [
      {
        title: "Dashboard",
        path: "/dashboard",
        description:
          "Main dashboard with overview of jobs, applications, and analytics",
        subSections: [
          {
            title: "Recent Applications",
            description: "Latest applications across all job postings",
            path: "/dashboard/applications",
          },
          {
            title: "Job Statistics",
            description:
              "Active jobs, total candidates, and pending interviews",
          },
          {
            title: "Candidate Insights",
            description: "Analysis of applicant skills and experience levels",
          },
          {
            title: "TalentTalk Quick Access",
            description: "AI assistant for getting insights on candidates",
          },
        ],
      },
      {
        title: "Jobs",
        description: "Job posting management",
        subSections: [
          {
            title: "Create Job Post",
            path: "/dashboard/jobs/create",
            description:
              "Create new job listings with detailed requirements and scoring weights",
          },
          {
            title: "View Job Posts",
            path: "/dashboard/jobs/view",
            description:
              "Manage existing job listings, filter by status (active, cancelled, expired)",
          },
          {
            title: "Job Details",
            path: "/dashboard/jobs/[id]",
            description:
              "View detailed information about a specific job, including metrics and settings",
          },
          {
            title: "View Applicants",
            path: "/dashboard/jobs/[id]/applicants",
            description:
              "Review candidates who applied to a specific job position",
          },
          {
            title: "Edit Job",
            path: "/dashboard/jobs/edit/[id]",
            description:
              "Modify job details, requirements, and evaluation criteria",
          },
        ],
      },
      {
        title: "Candidates",
        description: "Candidate management and insights",
        subSections: [
          {
            title: "All Applications",
            path: "/dashboard/applications",
            description:
              "Comprehensive list of all applications with detailed analysis",
          },
          {
            title: "TalentTalk",
            path: "/dashboard/talenttalk",
            description:
              "AI assistant for candidate insights and job posting analysis",
          },
        ],
      },
    ],

    authSections: [
      {
        title: "Sign In",
        path: "/auth/login",
        description: "Login page for HR professionals",
      },
      {
        title: "Sign Up",
        path: "/auth/signup",
        description: "Registration page for new HR users",
      },
    ],
  },

  // Usage Guides
  usageGuides: {
    talentTalk: {
      title: "Using TalentTalk AI Assistant",
      description:
        "TalentTalk is our AI chatbot designed to help you get insights about your candidates and job postings.",
      howToAccess: [
        "Option 1: From the dashboard, click on the TalentTalk quick chat panel.",
        "Option 2: Navigate to Jobs > View Jobs > View Applicants, then click the 'TalentTalk' button in the top right.",
        "Option 3: Go to the main TalentTalk interface by clicking 'TalentTalk' in the main navigation.",
      ],
      suggestedQueries: [
        "Who are the best candidates for the Frontend Developer position?",
        "What skills do my candidates have?",
        "Compare the top 3 candidates for the Data Scientist role",
        "What are the educational backgrounds of our applicants?",
        "Suggest interview questions for React developers",
      ],
    },
    candidateInsights: {
      title: "Accessing Candidate Insights",
      description: "Get detailed analytics about your candidate pool.",
      steps: [
        "From the dashboard, look for the 'Candidate Insights' card",
        "Click 'Details' or 'View all' for more comprehensive analysis",
        "For job-specific insights, navigate to Jobs > View Jobs > View Applicants",
      ],
    },
    jobPosting: {
      title: "Creating Effective Job Postings",
      tips: [
        "Be specific about required skills to improve candidate matching",
        "Adjust scoring weights to prioritize what matters most for the role",
        "Use the AI-powered job description generator for professional listings",
        "Set realistic experience and education requirements to attract qualified candidates",
      ],
    },
  },

  // Terms and Policies
  termsAndPolicies: {
    terms: {
      title: "Terms of Service",
      lastUpdated: "May 2025",
      sections: [
        {
          title: "Service Usage",
          content:
            "CandidAI provides an AI-powered recruitment platform intended for legitimate hiring purposes only. Users agree to use the service responsibly and in compliance with all applicable laws and regulations regarding hiring practices and data protection.",
        },
        {
          title: "User Accounts",
          content:
            "Users are responsible for maintaining the confidentiality of their account credentials and for all activities occurring under their account. CandidAI accounts are for individual use and may not be shared.",
        },
        {
          title: "Job Postings",
          content:
            "Users may only post legitimate job opportunities and must ensure all posted job information is accurate and complies with employment laws. CandidAI reserves the right to remove job postings that violate our policies or applicable laws.",
        },
        {
          title: "Resume Data",
          content:
            "Users uploading resumes affirm they have obtained appropriate consent from candidates to process their information through our platform. Users are responsible for removing candidate data when no longer needed.",
        },
        {
          title: "AI Recommendations",
          content:
            "CandidAI uses AI algorithms to analyze and rank candidates. While we strive for accuracy, users acknowledge that AI recommendations should complement, not replace, human judgment in hiring decisions.",
        },
        {
          title: "Service Modifications",
          content:
            "CandidAI reserves the right to modify, suspend, or discontinue any aspect of the service at any time, with or without notice.",
        },
      ],
    },

    privacy: {
      title: "Privacy Policy",
      lastUpdated: "May 2025",
      sections: [
        {
          title: "Data Collection",
          content:
            "CandidAI collects information provided during account registration, job posting, and resume uploading processes. This includes personal information such as names, email addresses, and resume content.",
        },
        {
          title: "Data Usage",
          content:
            "Collected data is used to provide and improve our services, including resume parsing, candidate ranking, and generating insights. We do not sell user data to third parties.",
        },
        {
          title: "Candidate Data",
          content:
            "Resume data is processed and stored securely to facilitate the hiring process. Users (employers) have control over candidate data and are responsible for its appropriate handling and deletion when no longer needed.",
        },
        {
          title: "Data Security",
          content:
            "CandidAI implements appropriate security measures to protect all stored data. However, no internet transmission is completely secure, and we cannot guarantee absolute security.",
        },
        {
          title: "Cookies",
          content:
            "CandidAI uses cookies and similar technologies to enhance user experience, analyze usage patterns, and manage authentication sessions.",
        },
        {
          title: "Data Retention",
          content:
            "User account data is retained while accounts remain active. Job posting and candidate data retention periods can be configured by users through the dashboard.",
        },
      ],
    },
  },

  // Contact Information
  contact: {
    primary: "candidAI2025@gmail.com",
    support:
      "For general inquiries and support, please email us at candidAI2025@gmail.com",
    talentTalk:
      "For specific questions about applicants or job postings, please use the TalentTalk assistant within the dashboard.",
    response: "We aim to respond to all inquiries within 24-48 hours.",
  },

  // FAQ
  faq: [
    {
      question: "How does CandidAI rank candidates?",
      answer:
        "CandidAI uses a sophisticated ranking algorithm based on fuzzy logic and multi-criteria decision making. It analyzes skills, experience level, years of experience, and education against job requirements, with customizable weights for each factor.",
    },
    {
      question: "Is CandidAI biased in candidate selection?",
      answer:
        "CandidAI is designed to reduce bias in the hiring process by focusing on objective qualifications rather than demographic factors. The system evaluates candidates solely on their skills, experience, and education relevant to job requirements.",
    },
    {
      question: "How secure is candidate data on the platform?",
      answer:
        "We take data security seriously. All data is encrypted in transit and at rest, and we implement industry-standard security practices. Access to candidate information is restricted to authorized users only.",
    },
    {
      question: "Can I integrate CandidAI with other HR systems?",
      answer:
        "We are currently developing API integrations with popular HR management systems. Please contact us at candidAI2025@gmail.com for more information about integration options.",
    },
    {
      question: "How accurate is the resume parsing?",
      answer:
        "Our resume parser uses advanced OCR and NLP technologies to achieve high accuracy. However, some complex formatting or unusual resume structures may occasionally require manual review.",
    },
  ],

  // Getting Help
  gettingHelp: {
    title: "Getting Help with CandidAI",
    options: [
      {
        title: "Contact Support",
        description:
          "Email us at candidAI2025@gmail.com for general inquiries and support.",
      },
      {
        title: "TalentTalk Assistant",
        description:
          "For questions about specific candidates or job postings, use the TalentTalk assistant within the dashboard.",
        access:
          "Navigate to Jobs > View Jobs > View Applicants and click on the TalentTalk button.",
      },
      {
        title: "Candidate Insights",
        description:
          "For aggregate statistics and trends about your applicant pool, check the Candidate Insights section.",
        access:
          "From the dashboard, click 'View all' on the Recent Applications card to access detailed insights.",
      },
    ],
  },
};

export default projectInfo;
