/**
 * Test file for the CandidAI Fuzzy Logic Scoring Module
 * Run with: node test-scoring-module.js
 */

// Import the scoring module functions
const {
  scoreCandidate,
  scoreSkills,
  scoreExperienceLevel,
  scoreYearsOfExperience,
  scoreEducation,
  mapExperienceLevel,
  mapEducationLevel,
  mapEducationGrade,
} = require("./src/lib/scoringModule2");

// Sample job data (similar to the example provided)
const jobData = {
  _id: "6827e428fc431d0614224f40",
  title: "Senior Developer",
  category: "Information Technology",
  deadline: "2025-06-18T00:00:00.000+00:00",
  companyName: "Tecno Enterprises",
  location: "Remote",
  salary: "kshs. 300,000 per month",
  skills: ["Java", "JavaScript", "Node.js", "Angular", "SQL", "Kubernetes"],
  experienceLevel: "expert",
  yearsOfExperience: 7,
  educationLevel: "Bachelor's Degree",
  fieldOfStudy: "Computer Science",
  grade: "Second Class Honours (Upper Division)",
  jobDescription:
    "**Senior Developer – Tecno Enterprises**  \n**Category:** Information T…",
  weights: {
    skills: 25,
    experienceLevel: 35,
    yearsOfExperience: 25,
    education: 15,
  },
  status: "active",
  email: "example@example.com",
  createdAt: "2025-05-17T01:19:34.372+00:00",
  applications: 0,
};

// Sample candidate data (based on the example resume you provided)
const candidateData1 = {
  Certification: [
    "Data Analysis in Python – FreeCodeCamp",
    "Introduction To Machine Learning - Kaggle",
    "Intermediate Machine Learning – Kaggle",
    "Introduction to Prompt Engineering for Generative AI – LinkedIn",
    "Backend Web development - devtown",
  ],
  "Education Details": [
    {
      "date completed": "Expected graduation: 2025",
      "education level": "Bachelor of Science",
      "field of study": "Computer Science",
      "grade level": "n/a",
      institution: "Jomo Kenyatta University of Technology and Agriculture",
    },
    {
      "date completed": "2024",
      "education level": "Diploma",
      "field of study": "Data Science",
      "grade level": "n/a",
      institution: "GoMyCode",
    },
  ],
  Email: "abdiyunusmohamed@gmail.com",
  "Experience Details": [
    {
      "Industry Name": "GoMyCode LTD",
      Roles: "Junior Instructor",
    },
    {
      "Industry Name": "JKUAT",
      Roles: "Student Intern",
    },
    {
      "Industry Name": "Bloomex Limited",
      Roles: "Data Analyst Intern",
    },
  ],
  "Experience level": "Entry",
  "Job Role": "Aspiring Data Scientist | Data Analyst",
  Name: "Yunus Mohamed Abdi",
  Phone: "+254746294429",
  Skills: [
    "Python",
    "SQL",
    "JavaScript",
    "Regression",
    "Classification",
    "Feature Engineering",
    "Model Evaluation",
    "Large Language Model",
    "Power BI",
    "Tableau",
    "Matplotlib",
    "Seaborn",
    "Kaggle",
    "Alteryx",
    "Microsoft Azure",
    "Git",
    "Streamlit",
    "Cloud Computing",
    "AWS",
    "Snowflake",
    "Teamwork",
    "Communication",
    "Problem-Solving",
    "Leadership",
    "English",
    "Arabic",
    "Swahili",
    "Somali",
  ],
  "Social Media": ["n/a"],
  "Total Estimated Years of Experience": "2.0",
};

// Let's create a second candidate with more matching skills and experience
const candidateData2 = {
  Certification: [
    "Full-Stack Developer Certification – Coursera",
    "Advanced Java Programming – Oracle",
    "Angular Developer – Google",
    "AWS Certified Developer – Amazon",
  ],
  "Education Details": [
    {
      "date completed": "2020",
      "education level": "Master's Degree",
      "field of study": "Computer Science",
      "grade level": "Distinction",
      institution: "University of Nairobi",
    },
    {
      "date completed": "2018",
      "education level": "Bachelor's Degree",
      "field of study": "Software Engineering",
      "grade level": "First Class Honours",
      institution: "Strathmore University",
    },
  ],
  Email: "johndoe@example.com",
  "Experience Details": [
    {
      "Industry Name": "Microsoft",
      Roles: "Senior Software Engineer",
    },
    {
      "Industry Name": "Oracle",
      Roles: "Java Developer",
    },
    {
      "Industry Name": "IBM",
      Roles: "Software Developer",
    },
  ],
  "Experience level": "Senior",
  "Job Role": "Senior Software Engineer",
  Name: "John Doe",
  Phone: "+254700000000",
  Skills: [
    "Java",
    "JavaScript",
    "Node.js",
    "Angular",
    "React",
    "SQL",
    "MongoDB",
    "Kubernetes",
    "Docker",
    "AWS",
    "GCP",
    "Azure",
    "CI/CD",
    "Git",
    "Microservices",
    "RESTful API",
    "Agile",
    "Scrum",
    "Python",
    "Leadership",
    "Communication",
    "Problem-Solving",
  ],
  "Social Media": ["linkedin.com/in/johndoe"],
  "Total Estimated Years of Experience": "8.5",
};

// Let's create a candidate who is below the threshold
const candidateData3 = {
  Certification: [
    "HTML/CSS Basics – Codecademy",
    "Introduction to Web Development – FreeCodeCamp",
  ],
  "Education Details": [
    {
      "date completed": "2023",
      "education level": "Diploma",
      "field of study": "Information Technology",
      "grade level": "Pass",
      institution: "Kenya Technical Institute",
    },
  ],
  Email: "janedoe@example.com",
  "Experience Details": [
    {
      "Industry Name": "Local Web Design Company",
      Roles: "Intern",
    },
  ],
  "Experience level": "Entry",
  "Job Role": "Web Developer",
  Name: "Jane Doe",
  Phone: "+254700000001",
  Skills: [
    "HTML",
    "CSS",
    "Basic JavaScript",
    "WordPress",
    "Photoshop",
    "Communication",
    "Time Management",
  ],
  "Social Media": ["twitter.com/janedoe"],
  "Total Estimated Years of Experience": "0.8",
};

// Run tests
console.log("===== CANDIDATE SCORING TESTS =====");
console.log("\n");

// Test 1: Score Candidate 1 (Yunus Mohamed Abdi) against the job
console.log("Test 1: Scoring Entry Level Candidate");
console.log("---------------------------------");
const result1 = scoreCandidate(candidateData1, jobData);
console.log(`Candidate: ${result1.candidateName}`);
console.log(`Job: ${result1.jobTitle}`);
console.log(`Overall Score: ${result1.overallScore}%`);
console.log(`Grade: ${result1.grade}`);
console.log(`Threshold Passed: ${result1.thresholdPassed}`);

console.log("\nCriteria Scores:");
console.log(`Skills: ${Math.round(result1.criteriaScores.skills * 100)}%`);
console.log(
  `Experience Level: ${Math.round(
    result1.criteriaScores.experienceLevel * 100
  )}%`
);
console.log(
  `Years of Experience: ${Math.round(
    result1.criteriaScores.yearsOfExperience * 100
  )}%`
);
console.log(
  `Education: ${Math.round(result1.criteriaScores.education * 100)}%`
);

console.log("\nSkills Analysis:");
console.log("Matched Skills:", result1.details.skills.matchedSkills);
console.log("Missing Skills:", result1.details.skills.missingSkills);
console.log(
  "Additional Skills:",
  result1.details.skills.additionalSkills.slice(0, 5),
  "..."
);

console.log("\n");

// Test 2: Score Candidate 2 (John Doe) against the job
console.log("Test 2: Scoring Senior Level Candidate");
console.log("---------------------------------");
const result2 = scoreCandidate(candidateData2, jobData);
console.log(`Candidate: ${result2.candidateName}`);
console.log(`Job: ${result2.jobTitle}`);
console.log(`Overall Score: ${result2.overallScore}%`);
console.log(`Grade: ${result2.grade}`);
console.log(`Threshold Passed: ${result2.thresholdPassed}`);

console.log("\nCriteria Scores:");
console.log(`Skills: ${Math.round(result2.criteriaScores.skills * 100)}%`);
console.log(
  `Experience Level: ${Math.round(
    result2.criteriaScores.experienceLevel * 100
  )}%`
);
console.log(
  `Years of Experience: ${Math.round(
    result2.criteriaScores.yearsOfExperience * 100
  )}%`
);
console.log(
  `Education: ${Math.round(result2.criteriaScores.education * 100)}%`
);

console.log("\nSkills Analysis:");
console.log("Matched Skills:", result2.details.skills.matchedSkills);
console.log("Missing Skills:", result2.details.skills.missingSkills);
console.log(
  "Additional Skills:",
  result2.details.skills.additionalSkills.slice(0, 5),
  "..."
);

console.log("\nEducation Analysis:");
console.log(
  "Level Score:",
  Math.round(result2.details.education.levelScore * 100) + "%"
);
console.log(
  "Field Score:",
  Math.round(result2.details.education.fieldScore * 100) + "%"
);
console.log(
  "Grade Score:",
  Math.round(result2.details.education.gradeScore * 100) + "%"
);

console.log("\n");

// Test 3: Score Candidate 3 (Jane Doe) against the job
console.log("Test 3: Scoring Under-qualified Candidate");
console.log("---------------------------------");
const result3 = scoreCandidate(candidateData3, jobData);
console.log(`Candidate: ${result3.candidateName}`);
console.log(`Job: ${result3.jobTitle}`);
console.log(`Overall Score: ${result3.overallScore}%`);
console.log(`Grade: ${result3.grade}`);
console.log(`Threshold Passed: ${result3.thresholdPassed}`);

console.log("\nCriteria Scores:");
console.log(`Skills: ${Math.round(result3.criteriaScores.skills * 100)}%`);
console.log(
  `Experience Level: ${Math.round(
    result3.criteriaScores.experienceLevel * 100
  )}%`
);
console.log(
  `Years of Experience: ${Math.round(
    result3.criteriaScores.yearsOfExperience * 100
  )}%`
);
console.log(
  `Education: ${Math.round(result3.criteriaScores.education * 100)}%`
);

console.log("\nSkills Analysis:");
console.log("Matched Skills:", result3.details.skills.matchedSkills);
console.log("Missing Skills:", result3.details.skills.missingSkills);
console.log("Additional Skills:", result3.details.skills.additionalSkills);

console.log("\n");

// Test 4: Test with different weights (increasing education importance)
console.log("Test 4: Testing with Modified Weights");
console.log("---------------------------------");

const modifiedJobData = {
  ...jobData,
  weights: {
    skills: 30,
    experienceLevel: 20,
    yearsOfExperience: 20,
    education: 30,
  },
};

const result4 = scoreCandidate(candidateData1, modifiedJobData);
console.log(`Candidate: ${result4.candidateName}`);
console.log(`Overall Score: ${result4.overallScore}%`);
console.log(`Grade: ${result4.grade}`);
console.log(`Threshold Passed: ${result4.thresholdPassed}`);

console.log("\nWeights:");
Object.entries(result4.details.weights).forEach(([key, value]) => {
  console.log(`${key}: ${value}%`);
});

// Test individual scoring functions
console.log("\n===== INDIVIDUAL SCORING FUNCTION TESTS =====");

// Test Skills Scoring
console.log("\nSkills Scoring Test:");
const testCandidateSkills = ["JavaScript", "Python", "SQL", "Git"];
const testRequiredSkills = ["JavaScript", "TypeScript", "React", "Node.js"];
const skillsScore = scoreSkills(testCandidateSkills, testRequiredSkills);
console.log(`Score: ${Math.round(skillsScore.score * 100)}%`);
console.log("Matched Skills:", skillsScore.matchedSkills);
console.log("Missing Skills:", skillsScore.missingSkills);
console.log("Additional Skills:", skillsScore.additionalSkills);

// Test Experience Level Scoring
console.log("\nExperience Level Scoring Test:");
console.log("Entry vs Expert:", scoreExperienceLevel("Entry", "Expert").score);
console.log(
  "Intermediate vs Expert:",
  scoreExperienceLevel("Intermediate", "Expert").score
);
console.log(
  "Expert vs Expert:",
  scoreExperienceLevel("Expert", "Expert").score
);
console.log(
  "Senior vs Expert:",
  scoreExperienceLevel("Senior", "Expert").score
);

// Test Years of Experience Scoring
console.log("\nYears of Experience Scoring Test:");
console.log("2 years vs 5 years requirement:", scoreYearsOfExperience(2, 5));
console.log("4 years vs 5 years requirement:", scoreYearsOfExperience(4, 5));
console.log("5 years vs 5 years requirement:", scoreYearsOfExperience(5, 5));
console.log("7 years vs 5 years requirement:", scoreYearsOfExperience(7, 5));
console.log(
  "Not specified vs 5 years requirement:",
  scoreYearsOfExperience("Not specified", 5)
);

// Test Education Level Mapping
console.log("\nEducation Level Mapping Test:");
console.log("Bachelor of Science:", mapEducationLevel("Bachelor of Science"));
console.log("Master's Degree:", mapEducationLevel("Master's Degree"));
console.log("Ph.D.:", mapEducationLevel("Ph.D."));
console.log("Doctorate:", mapEducationLevel("Doctorate"));
console.log("Diploma:", mapEducationLevel("Diploma"));

// Test Education Grade Mapping
console.log("\nEducation Grade Mapping Test:");
console.log("First Class Honours:", mapEducationGrade("First Class Honours"));
console.log(
  "Second Class Honours (Upper Division):",
  mapEducationGrade("Second Class Honours (Upper Division)")
);
console.log("Distinction:", mapEducationGrade("Distinction"));
console.log("Pass:", mapEducationGrade("Pass"));
console.log("3.5 GPA:", mapEducationGrade("3.5"));

// Test Education Scoring
console.log("\nEducation Scoring Test:");
console.log(
  "Diploma vs Bachelor's (same field):",
  scoreEducation(
    "Diploma",
    "Bachelor's Degree",
    "Computer Science",
    "Computer Science",
    "Pass",
    "Second Class Honours (Upper Division)"
  ).score
);
console.log(
  "Bachelor's vs Bachelor's (same field):",
  scoreEducation(
    "Bachelor's Degree",
    "Bachelor's Degree",
    "Computer Science",
    "Computer Science",
    "Second Class Honours (Upper Division)",
    "Second Class Honours (Upper Division)"
  ).score
);
console.log(
  "Master's vs Bachelor's (same field):",
  scoreEducation(
    "Master's Degree",
    "Bachelor's Degree",
    "Computer Science",
    "Computer Science",
    "Distinction",
    "Second Class Honours (Upper Division)"
  ).score
);
console.log(
  "Bachelor's vs Bachelor's (different field):",
  scoreEducation(
    "Bachelor's Degree",
    "Bachelor's Degree",
    "Business",
    "Computer Science",
    "First Class Honours",
    "Second Class Honours (Upper Division)"
  ).score
);

console.log("\n===== TEST COMPLETE =====");
