/**
 * Simple Test Module for CandidAI Scoring
 * Run with: node simple-scoring-test.js
 *
 * This test will clearly show how the scoring and weighting works
 * with detailed output for each step of the process.
 */

// Import the scoring module
const { scoreCandidate } = require("./src/lib/scoringModule");

// Sample job data for a Data Scientist position
const dataScientistJob = {
  _id: "6827e428fc431d0614224f41",
  title: "Data Scientist",
  category: "Data Science",
  companyName: "AI Insights Ltd",
  location: "Nairobi, Kenya",
  salary: "kshs. 250,000 per month",
  skills: [
    "Python",
    "SQL",
    "Machine Learning",
    "Statistics",
    "Data Visualization",
    "Tensorflow",
    "Pandas",
    "NumPy",
  ],
  experienceLevel: "intermediate",
  yearsOfExperience: 3,
  educationLevel: "Bachelor's Degree",
  fieldOfStudy: "Data Science, Computer Science, or Statistics",
  grade: "None",
  weights: {
    skills: 35,
    experienceLevel: 20,
    yearsOfExperience: 25,
    education: 20,
  },
};

// Sample candidate data
const dataScientistCandidate = {
  Certification: [
    "Machine Learning Specialization – Stanford Online",
    "Data Analysis with Python – FreeCodeCamp",
    "Deep Learning – Coursera",
    "SQL for Data Science – DataCamp",
  ],
  "Education Details": [
    {
      "date completed": "2022",
      "education level": "Bachelor's Degree",
      "field of study": "Computer Science",
      "grade level": "First Class Honours",
      institution: "University of Nairobi",
    },
  ],
  Email: "sarah.kamau@example.com",
  "Experience Details": [
    {
      "Industry Name": "Data Analytics Co.",
      Roles: "Junior Data Analyst",
    },
    {
      "Industry Name": "Tech Startup",
      Roles: "Data Science Intern",
    },
  ],
  "Experience level": "Intermediate",
  "Job Role": "Data Analyst seeking Data Scientist role",
  Name: "Sarah Kamau",
  Phone: "+254700123456",
  Skills: [
    "Python",
    "SQL",
    "Pandas",
    "NumPy",
    "Scikit-learn",
    "Data Visualization",
    "Matplotlib",
    "Seaborn",
    "Statistical Analysis",
    "A/B Testing",
    "Dashboard Creation",
    "Git",
    "Excel",
    "Power BI",
    "Communication",
    "Problem-Solving",
  ],
  "Total Estimated Years of Experience": "2.5",
};
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

// Run the scoring
console.log("===== DETAILED CANDIDATE SCORING BREAKDOWN =====");
console.log("\nJob: Data Scientist at AI Insights Ltd");
console.log("Candidate: Sarah Kamau");
console.log("-----------------------------------------------\n");

// Get the full scoring result
const result = scoreCandidate(candidateData1, dataScientistJob);

// ========== DETAILED OUTPUT OF SCORING PROCESS ==========

// 1. SKILLS EVALUATION
console.log("1. SKILLS EVALUATION");
console.log("-------------------");
console.log("Required Skills:", dataScientistJob.skills.join(", "));
console.log(
  "Candidate Skills:",
  candidateData1.Skills.slice(0, 10).join(", ") + "..."
);
console.log("\nMatched Skills:");
result.details.skills.matchedSkills.forEach((skill) => {
  console.log(`- ${skill}`);
});
console.log("\nMissing Skills:");
result.details.skills.missingSkills.forEach((skill) => {
  console.log(`- ${skill}`);
});
console.log(
  `\nSkills Score: ${(result.criteriaScores.skills * 100).toFixed(2)}%`
);
console.log(
  `Calculation: ${result.details.skills.matchedSkills.length} matched out of ${dataScientistJob.skills.length} required`
);
console.log(
  `Raw Score: ${result.details.skills.matchedSkills.length}/${
    dataScientistJob.skills.length
  } = ${(
    result.details.skills.matchedSkills.length / dataScientistJob.skills.length
  ).toFixed(2)}`
);
console.log(`Weight: ${dataScientistJob.weights.skills}%`);
console.log(
  `Weighted Contribution: ${result.criteriaScores.skills} × ${
    dataScientistJob.weights.skills
  } = ${(
    result.criteriaScores.skills * dataScientistJob.weights.skills
  ).toFixed(2)}`
);

// 2. EXPERIENCE LEVEL EVALUATION
console.log("\n2. EXPERIENCE LEVEL EVALUATION");
console.log("-----------------------------");
console.log(`Required Experience Level: ${dataScientistJob.experienceLevel}`);
console.log(
  `Candidate Experience Level: ${candidateData1["Experience level"]}`
);
console.log(
  `Experience Level Score: ${(
    result.criteriaScores.experienceLevel * 100
  ).toFixed(2)}%`
);
console.log(`Raw Score: ${result.criteriaScores.experienceLevel.toFixed(2)}`);
console.log(`Weight: ${dataScientistJob.weights.experienceLevel}%`);
console.log(
  `Weighted Contribution: ${result.criteriaScores.experienceLevel} × ${
    dataScientistJob.weights.experienceLevel
  } = ${(
    result.criteriaScores.experienceLevel *
    dataScientistJob.weights.experienceLevel
  ).toFixed(2)}`
);

// 3. YEARS OF EXPERIENCE EVALUATION
console.log("\n3. YEARS OF EXPERIENCE EVALUATION");
console.log("--------------------------------");
console.log(`Required Years: ${dataScientistJob.yearsOfExperience}`);
console.log(
  `Candidate Years: ${candidateData1["Total Estimated Years of Experience"]}`
);
console.log(
  `Years of Experience Score: ${(
    result.criteriaScores.yearsOfExperience * 100
  ).toFixed(2)}%`
);
console.log(`Raw Score: ${result.criteriaScores.yearsOfExperience.toFixed(2)}`);
console.log(`Weight: ${dataScientistJob.weights.yearsOfExperience}%`);
console.log(
  `Weighted Contribution: ${result.criteriaScores.yearsOfExperience} × ${
    dataScientistJob.weights.yearsOfExperience
  } = ${(
    result.criteriaScores.yearsOfExperience *
    dataScientistJob.weights.yearsOfExperience
  ).toFixed(2)}`
);

// 4. EDUCATION EVALUATION
console.log("\n4. EDUCATION EVALUATION");
console.log("----------------------");
const candidateEducation = candidateData1["Education Details"][0];
console.log(`Required Education Level: ${dataScientistJob.educationLevel}`);
console.log(
  `Candidate Education Level: ${candidateEducation["education level"]}`
);
console.log(`Required Field of Study: ${dataScientistJob.fieldOfStudy}`);
console.log(
  `Candidate Field of Study: ${candidateEducation["field of study"]}`
);
console.log(`Required Grade: ${dataScientistJob.grade}`);
console.log(`Candidate Grade: ${candidateEducation["grade level"]}`);

console.log(
  `\nEducation Level Score: ${(
    result.details.education.levelScore * 100
  ).toFixed(2)}%`
);
console.log(
  `Field of Study Score: ${(result.details.education.fieldScore * 100).toFixed(
    2
  )}%`
);
console.log(
  `Grade Score: ${(result.details.education.gradeScore * 100).toFixed(2)}%`
);
console.log(
  `Overall Education Score: ${(result.criteriaScores.education * 100).toFixed(
    2
  )}%`
);
console.log(`Raw Score: ${result.criteriaScores.education.toFixed(2)}`);
console.log(`Weight: ${dataScientistJob.weights.education}%`);
console.log(
  `Weighted Contribution: ${result.criteriaScores.education} × ${
    dataScientistJob.weights.education
  } = ${(
    result.criteriaScores.education * dataScientistJob.weights.education
  ).toFixed(2)}`
);

// 5. OVERALL SCORING SUMMARY
console.log("\n5. OVERALL SCORING SUMMARY");
console.log("-------------------------");
console.log("Individual Criteria Scores:");
console.log(
  `Skills: ${(result.criteriaScores.skills * 100).toFixed(2)}% × ${
    dataScientistJob.weights.skills
  }% = ${(
    result.criteriaScores.skills * dataScientistJob.weights.skills
  ).toFixed(2)}`
);
console.log(
  `Experience Level: ${(result.criteriaScores.experienceLevel * 100).toFixed(
    2
  )}% × ${dataScientistJob.weights.experienceLevel}% = ${(
    result.criteriaScores.experienceLevel *
    dataScientistJob.weights.experienceLevel
  ).toFixed(2)}`
);
console.log(
  `Years of Experience: ${(
    result.criteriaScores.yearsOfExperience * 100
  ).toFixed(2)}% × ${dataScientistJob.weights.yearsOfExperience}% = ${(
    result.criteriaScores.yearsOfExperience *
    dataScientistJob.weights.yearsOfExperience
  ).toFixed(2)}`
);
console.log(
  `Education: ${(result.criteriaScores.education * 100).toFixed(2)}% × ${
    dataScientistJob.weights.education
  }% = ${(
    result.criteriaScores.education * dataScientistJob.weights.education
  ).toFixed(2)}`
);

// Calculate the total weighted sum manually to show the work
const totalWeightedSum =
  result.criteriaScores.skills * dataScientistJob.weights.skills +
  result.criteriaScores.experienceLevel *
    dataScientistJob.weights.experienceLevel +
  result.criteriaScores.yearsOfExperience *
    dataScientistJob.weights.yearsOfExperience +
  result.criteriaScores.education * dataScientistJob.weights.education;

// Calculate the total weights
const totalWeights =
  dataScientistJob.weights.skills +
  dataScientistJob.weights.experienceLevel +
  dataScientistJob.weights.yearsOfExperience +
  dataScientistJob.weights.education;

console.log(`\nWeighted Sum: ${totalWeightedSum.toFixed(2)}`);
console.log(`Total Weights: ${totalWeights}`);
console.log(
  `Percentage Score: ${totalWeightedSum.toFixed(
    2
  )} / ${totalWeights} × 100 = ${(
    (totalWeightedSum / totalWeights) *
    100
  ).toFixed(0)}%`
);

console.log(`\nFinal Score: ${result.overallScore}%`);
console.log(`Grade: ${result.grade}`);
console.log(`Threshold Passed: ${result.thresholdPassed ? "YES" : "NO"}`);

console.log("\n===== TEST COMPLETE =====");
