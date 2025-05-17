/**
 * CandidAI Fuzzy Logic Scoring Module
 * This module evaluates job candidates against job requirements using fuzzy logic
 * and returns a weighted score.
 */

// Global constants
const MIN_THRESHOLD = 0.15; // Minimum threshold for all scoring

/**
 * Triangular Membership Function for fuzzy logic scoring
 * @param {number} x - The value to evaluate
 * @param {number} a - The left edge of the triangle (start of membership)
 * @param {number} b - The peak of the triangle (full membership)
 * @param {number} c - The right edge of the triangle (end of membership)
 * @returns {number} - Membership degree (0 to 1)
 */
const triangularMF = (x, a, b, c) => {
  if (x <= a) return 0;
  if (x > a && x <= b) return (x - a) / (b - a);
  if (x > b && x <= c) return (c - x) / (c - b);
  return 0;
};

/**
 * Calculate string similarity using Levenshtein distance algorithm
 * @param {string} str1 - First string to compare
 * @param {string} str2 - Second string to compare
 * @returns {number} - Similarity score (0 to 1)
 */
const calculateStringSimilarity = (str1, str2) => {
  // Normalize strings for better comparison
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  // Quick equality check
  if (s1 === s2) return 1;

  // Handle empty strings
  if (s1.length === 0) return s2.length === 0 ? 1 : 0;
  if (s2.length === 0) return 0;

  // Create matrix for Levenshtein distance calculation
  const matrix = Array(s1.length + 1)
    .fill()
    .map(() => Array(s2.length + 1).fill(0));

  // Initialize first row and column
  for (let i = 0; i <= s1.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= s2.length; j++) matrix[0][j] = j;

  // Fill the matrix
  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  // Calculate similarity as 1 minus normalized distance
  const maxLength = Math.max(s1.length, s2.length);
  return 1 - matrix[s1.length][s2.length] / maxLength;
};

/**
 * Map experience level to numeric value
 * @param {string} level - Experience level as text
 * @returns {number} - Numeric value (0-2)
 */
const mapExperienceLevel = (level) => {
  if (!level) return 0;

  // Only using the three specified levels as instructed
  const levelMap = {
    entry: 0,
    intermediate: 1,
    expert: 2,
    // Map senior to expert as specified
    senior: 2,
  };

  // Try direct mapping
  const normalizedLevel = level.toLowerCase().trim();
  if (levelMap[normalizedLevel] !== undefined) {
    return levelMap[normalizedLevel];
  }

  // Try fuzzy matching if no direct match
  let bestMatch = 0;
  let bestScore = 0.6; // Minimum similarity threshold

  for (const [key, value] of Object.entries(levelMap)) {
    const similarity = calculateStringSimilarity(normalizedLevel, key);
    if (similarity > bestScore) {
      bestScore = similarity;
      bestMatch = value;
    }
  }

  return bestMatch;
};

/**
 * Map education level to numeric value
 * @param {string} level - Education level as text
 * @returns {number} - Numeric value (0-9)
 */
const mapEducationLevel = (level) => {
  if (!level) return 0;

  // Updated with all education levels from highest to lowest as instructed
  const levelMap = {
    // Post-Doctoral variants
    "post-doctoral": 9,
    postdoctoral: 9,
    "post doctoral": 9,
    "post-doc": 9,
    postdoc: 9,
    "post doc": 9,
    "post doctoral fellow": 9,
    "postdoctoral fellowship": 9,

    // PhD variants
    phd: 8,
    "ph.d": 8,
    "ph.d.": 8,
    "doctor of philosophy": 8,
    doctorate: 8,
    doctoral: 8,
    "doctoral degree": 8,
    "d.phil": 8,
    dphil: 8,
    doctor: 8,

    // Master's variants
    master: 7,
    "master's": 7,
    masters: 7,
    "master's degree": 7,
    "masters degree": 7,
    "master degree": 7,
    "master of science": 7,
    "master of arts": 7,
    "master of engineering": 7,
    "master of business": 7,
    "master of business administration": 7,
    "master of technology": 7,
    "master of computer science": 7,
    "master of information technology": 7,
    "master of education": 7,
    "master of fine arts": 7,
    "master of architecture": 7,
    "master of public health": 7,
    "master of public policy": 7,
    "master of laws": 7,
    "master of social work": 7,
    msc: 7,
    "m.sc": 7,
    "m.sc.": 7,
    ms: 7,
    "m.s": 7,
    "m.s.": 7,
    ma: 7,
    "m.a": 7,
    "m.a.": 7,
    meng: 7,
    "m.eng": 7,
    "m.eng.": 7,
    mba: 7,
    "m.b.a": 7,
    "m.b.a.": 7,
    mtech: 7,
    "m.tech": 7,
    "m.tech.": 7,
    mcs: 7,
    "m.c.s": 7,
    "m.c.s.": 7,
    med: 7,
    "m.ed": 7,
    "m.ed.": 7,
    mfa: 7,
    "m.f.a": 7,
    "m.f.a.": 7,
    march: 7,
    "m.arch": 7,
    "m.arch.": 7,
    mph: 7,
    "m.p.h": 7,
    "m.p.h.": 7,
    mpp: 7,
    "m.p.p": 7,
    "m.p.p.": 7,
    llm: 7,
    "ll.m": 7,
    "ll.m.": 7,
    msw: 7,
    "m.s.w": 7,
    "m.s.w.": 7,

    // Bachelor's variants
    bachelor: 6,
    "bachelor's": 6,
    bachelors: 6,
    "bachelor's degree": 6,
    "bachelors degree": 6,
    "bachelor degree": 6,
    "bachelor of science": 6,
    "bachelor of arts": 6,
    "bachelor of engineering": 6,
    "bachelor of technology": 6,
    "bachelor of business": 6,
    "bachelor of business administration": 6,
    "bachelor of commerce": 6,
    "bachelor of computer science": 6,
    "bachelor of information technology": 6,
    "bachelor of education": 6,
    "bachelor of fine arts": 6,
    "bachelor of architecture": 6,
    "bachelor of laws": 6,
    "bachelor of medicine": 6,
    "bachelor of nursing": 6,
    bsc: 6,
    "b.sc": 6,
    "b.sc.": 6,
    bs: 6,
    "b.s": 6,
    "b.s.": 6,
    ba: 6,
    "b.a": 6,
    "b.a.": 6,
    beng: 6,
    "b.eng": 6,
    "b.eng.": 6,
    btech: 6,
    "b.tech": 6,
    "b.tech.": 6,
    bba: 6,
    "b.b.a": 6,
    "b.b.a.": 6,
    bcom: 6,
    "b.com": 6,
    "b.com.": 6,
    bcs: 6,
    "b.c.s": 6,
    "b.c.s.": 6,
    bit: 6,
    "b.i.t": 6,
    "b.i.t.": 6,
    bed: 6,
    "b.ed": 6,
    "b.ed.": 6,
    bfa: 6,
    "b.f.a": 6,
    "b.f.a.": 6,
    barch: 6,
    "b.arch": 6,
    "b.arch.": 6,
    llb: 6,
    "ll.b": 6,
    "ll.b.": 6,
    mbbs: 6,
    "m.b.b.s": 6,
    "m.b.b.s.": 6,
    "bsc nursing": 6,
    "b.sc nursing": 6,
    "b.sc. nursing": 6,
    bn: 6,
    "b.n": 6,
    "b.n.": 6,
    undergraduate: 6,
    undergrad: 6,
    ug: 6,

    // Associate variants
    associate: 5,
    "associate's": 5,
    associates: 5,
    "associate degree": 5,
    "associate's degree": 5,
    "associates degree": 5,
    "associate of science": 5,
    "associate of arts": 5,
    "associate of applied science": 5,
    "associate of applied arts": 5,
    "associate of business": 5,
    "associate of engineering": 5,
    "associate of technology": 5,
    asc: 5,
    "a.sc": 5,
    "a.sc.": 5,
    as: 5,
    "a.s": 5,
    "a.s.": 5,
    aa: 5,
    "a.a": 5,
    "a.a.": 5,
    aas: 5,
    "a.a.s": 5,
    "a.a.s.": 5,
    aaa: 5,
    "a.a.a": 5,
    "a.a.a.": 5,
    abus: 5,
    "a.bus": 5,
    "a.bus.": 5,
    aeng: 5,
    "a.eng": 5,
    "a.eng.": 5,
    atech: 5,
    "a.tech": 5,
    "a.tech.": 5,
    "foundation degree": 5,

    // Diploma variants
    diploma: 4,
    "advanced diploma": 4,
    "higher diploma": 4,
    "national diploma": 4,
    "professional diploma": 4,
    "technical diploma": 4,
    "postgraduate diploma": 4,
    pgd: 4,
    "p.g.d": 4,
    "p.g.d.": 4,
    "graduate diploma": 4,

    // Certificate variants
    certificate: 3,
    certification: 3,
    "professional certificate": 3,
    "technical certificate": 3,
    "advanced certificate": 3,
    "graduate certificate": 3,
    "postgraduate certificate": 3,
    pgc: 3,
    "p.g.c": 3,
    "p.g.c.": 3,

    // Vocational variants
    vocational: 2,
    "vocational training": 2,
    "vocational education": 2,
    "vocational qualification": 2,
    "trade school": 2,
    apprenticeship: 2,
    "craft certificate": 2,
    tvet: 2,

    // Secondary education variants
    secondary: 1,
    "secondary education": 1,
    "secondary school": 1,
    "high school": 1,
    "high school diploma": 1,
    "high school certificate": 1,
    "high school degree": 1,
    hsc: 1,
    "h.s.c": 1,
    "h.s.c.": 1,
    gcse: 1,
    "g.c.s.e": 1,
    "g.c.s.e.": 1,
    "a level": 1,
    "a-level": 1,
    "a levels": 1,
    "a-levels": 1,
    "advanced level": 1,
    "o level": 1,
    "o-level": 1,
    "o levels": 1,
    "o-levels": 1,
    "ordinary level": 1,
    ib: 1,
    "international baccalaureate": 1,
    "ib diploma": 1,
    ssc: 1,
    "s.s.c": 1,
    "s.s.c.": 1,
    "secondary school certificate": 1,
    matric: 1,
    matriculation: 1,

    // No education variants
    none: 0,
    "no formal education": 0,
    "no education": 0,
    "no degree": 0,
    "not applicable": 0,
    na: 0,
    "n/a": 0,
    nil: 0,
  };

  // Try direct mapping
  const normalizedLevel = level.toLowerCase().trim();
  if (levelMap[normalizedLevel] !== undefined) {
    return levelMap[normalizedLevel];
  }

  // If not found directly, check if it starts with a key term
  // This handles cases like "Bachelor of Computer Science" by matching the "Bachelor" part
  const educationPrefixes = [
    "bachelor",
    "bachelors",
    "bachelor's",
    "bs",
    "ba",
    "bsc",
    "beng",
    "btech",
    "master",
    "masters",
    "master's",
    "ms",
    "ma",
    "msc",
    "meng",
    "mtech",
    "mba",
    "phd",
    "ph.d",
    "doctorate",
    "doctoral",
    "doctor",
    "associate",
    "associates",
    "associate's",
    "as",
    "aa",
    "aas",
    "diploma",
    "certificate",
    "certification",
  ];

  for (const prefix of educationPrefixes) {
    if (normalizedLevel.startsWith(prefix)) {
      // Get the value for the prefix
      const baseValue = levelMap[prefix];
      if (baseValue !== undefined) {
        return baseValue;
      }
    }
  }

  // Try fuzzy matching if no direct match or prefix match
  let bestMatch = 0;
  let bestScore = 0.6; // Minimum similarity threshold

  for (const [key, value] of Object.entries(levelMap)) {
    const similarity = calculateStringSimilarity(normalizedLevel, key);
    if (similarity > bestScore) {
      bestScore = similarity;
      bestMatch = value;
    }
  }

  return bestMatch;
};

/**
 * Map education grade to numeric value
 * @param {string} grade - Education grade as text
 * @returns {number|null} - Numeric value (0-17) or null if not recognized
 */
const mapEducationGrade = (grade) => {
  if (!grade) return null;

  // Map grades from highest to lowest as instructed
  const gradeMap = {
    "first class honours": 17,
    distinction: 16,
    "second class honours (upper division)": 15,
    merit: 14,
    a: 13,
    "a-": 12,
    "b+": 11,
    "second class honours (lower division)": 10,
    credit: 9,
    b: 8,
    "b-": 7,
    "c+": 6,
    "third class honours": 5,
    c: 4,
    "c-": 3,
    "d+": 2,
    pass: 1,
    none: 0,
  };

  // Try direct mapping
  const normalizedGrade = grade.toLowerCase().trim();
  if (gradeMap[normalizedGrade] !== undefined) {
    return gradeMap[normalizedGrade];
  }

  // Check if it's a numeric GPA
  const numericGrade = parseFloat(normalizedGrade);
  if (!isNaN(numericGrade)) {
    return numericGrade;
  }

  // Try fuzzy matching if no direct match
  let bestMatch = null;
  let bestScore = 0.7; // Higher threshold for grades to avoid false matches

  for (const [key, value] of Object.entries(gradeMap)) {
    const similarity = calculateStringSimilarity(normalizedGrade, key);
    if (similarity > bestScore) {
      bestScore = similarity;
      bestMatch = value;
    }
  }

  return bestMatch;
};

/**
 * Score years of experience based on job requirements
 * @param {number|string} candidateYears - Candidate's years of experience
 * @param {number|string} requiredYears - Required years of experience
 * @param {Object} options - Additional options
 * @returns {number} - Score (0.15 to 1)
 */
const scoreYearsOfExperience = (
  candidateYears,
  requiredYears,
  options = {}
) => {
  const { allowOverqualified = true } = options;

  // Parse values to ensure they are numbers
  const reqYears = parseFloat(requiredYears) || 0;

  // If requirement is "None" or zero, return full score
  if (
    reqYears === 0 ||
    requiredYears === "None" ||
    requiredYears === "n/a" ||
    requiredYears === "Not specified" ||
    !requiredYears
  ) {
    return 1.0;
  }

  // Handle non-numeric or missing candidate years
  if (
    candidateYears === "Not specified" ||
    candidateYears === "n/a" ||
    candidateYears === "None" ||
    !candidateYears
  ) {
    return MIN_THRESHOLD;
  }

  // Parse candidate years
  const candYears = parseFloat(candidateYears) || 0;

  // Calculate score as ratio of candidate years to required years
  let score;
  if (allowOverqualified && candYears >= reqYears) {
    // Full score for meeting or exceeding requirements
    score = 1.0;
  } else {
    // Simple ratio calculation as specified
    score = candYears / reqYears;
  }

  // Apply minimum threshold
  return Math.max(MIN_THRESHOLD, score);
};

/**
 * Score skills based on job requirements
 * @param {Array} candidateSkills - Candidate's skills
 * @param {Array} requiredSkills - Required skills for the job
 * @param {Object} options - Additional options
 * @returns {Object} - Score and detailed breakdown
 */
const scoreSkills = (candidateSkills, requiredSkills, options = {}) => {
  const { similarityThreshold = 0.7 } = options; // Threshold for similar skills (80% by default)

  // Handle empty arrays
  if (!requiredSkills || requiredSkills.length === 0) {
    return {
      score: 1.0,
      matchedSkills: [],
      missingSkills: [],
      additionalSkills: candidateSkills || [],
    };
  }

  if (!candidateSkills || candidateSkills.length === 0) {
    return {
      score: MIN_THRESHOLD,
      matchedSkills: [],
      missingSkills: [...requiredSkills],
      additionalSkills: [],
    };
  }

  // Normalize arrays to lowercase for case-insensitive comparison
  const normalizedCandidateSkills = candidateSkills.map((skill) =>
    skill.toLowerCase().trim()
  );
  const normalizedRequiredSkills = requiredSkills.map((skill) =>
    skill.toLowerCase().trim()
  );

  // Find matched skills with enhanced matching
  const matchedSkills = [];
  const matchedIndices = new Set();
  const matchDetails = []; // Store details about each match for debugging

  // Common abbreviations lookup table
  const abbreviations = {
    ml: "machine learning",
    ai: "artificial intelligence",
    js: "javascript",
    ts: "typescript",
    py: "python",
    react: "reactjs",
    ui: "user interface",
    ux: "user experience",
    db: "database",
    sql: "structured query language",
    oop: "object oriented programming",
    dsa: "data structures and algorithms",
    ds: "data science",
    da: "data analysis",
    nlp: "natural language processing",
    cv: "computer vision",
    dl: "deep learning",
    api: "application programming interface",
    aws: "amazon web services",
    gcp: "google cloud platform",
    azure: "microsoft azure",
    "ui/ux": "user interface and user experience",
    css: "cascading style sheets",
    html: "hypertext markup language",
    iot: "internet of things",
    devops: "development and operations",
    cicd: "continuous integration and continuous deployment",
    os: "operating system",
    qa: "quality assurance",
    vr: "virtual reality",
    ar: "augmented reality",
  };

  // Simple lemmatization/stemming function
  // This is a very basic implementation inspired by NLP techniques
  const basicLemmatize = (word) => {
    word = word.toLowerCase();

    // Handle common suffix forms
    if (word.endsWith("ing")) return word.slice(0, -3);
    if (word.endsWith("ed")) return word.slice(0, -2);
    if (word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
    if (word.endsWith("ion")) return word.slice(0, -3) + "e";
    if (word.endsWith("ly")) return word.slice(0, -2);
    if (word.endsWith("ment")) return word.slice(0, -4);

    return word;
  };

  // Basic semantic similarity - checks if words share common root
  const basicSemanticSimilarity = (word1, word2) => {
    const lem1 = basicLemmatize(word1);
    const lem2 = basicLemmatize(word2);

    // If lemmatized forms are similar
    if (calculateStringSimilarity(lem1, lem2) > 0.8) return true;

    // Check if one is a substring of the other after lemmatization
    if (lem1.length > 3 && lem2.length > 3) {
      if (lem1.includes(lem2) || lem2.includes(lem1)) return true;
    }

    // Check for common root (at least 4 characters)
    const minLength = Math.min(lem1.length, lem2.length);
    if (minLength >= 4) {
      const commonPrefix = lem1.substring(0, Math.floor(minLength * 0.75));
      if (lem2.startsWith(commonPrefix)) return true;
    }

    return false;
  };

  normalizedRequiredSkills.forEach((requiredSkill, reqIndex) => {
    let found = false;
    let bestMatchIndex = -1;
    let bestMatchScore = 0;
    let matchType = "";

    // Try different matching strategies for each candidate skill
    normalizedCandidateSkills.forEach((candidateSkill, candIndex) => {
      // Skip already matched candidate skills
      if (matchedIndices.has(candIndex)) return;

      // Strategy 1: Direct match
      if (requiredSkill === candidateSkill) {
        found = true;
        bestMatchIndex = candIndex;
        bestMatchScore = 1.0;
        matchType = "direct";
        return; // Exit the loop early for efficiency
      }

      // Strategy 2: Abbreviation handling
      // Check for known abbreviations in both directions
      if (
        abbreviations[requiredSkill] &&
        abbreviations[requiredSkill] === candidateSkill
      ) {
        found = true;
        bestMatchIndex = candIndex;
        bestMatchScore = 1.0;
        matchType = "abbreviation";
        return; // Exit early
      }
      if (
        abbreviations[candidateSkill] &&
        abbreviations[candidateSkill] === requiredSkill
      ) {
        found = true;
        bestMatchIndex = candIndex;
        bestMatchScore = 1.0;
        matchType = "abbreviation";
        return; // Exit early
      }

      // Advanced abbreviation detection (e.g., "ML" for "Machine Learning")
      // Check if one string is all caps and potentially an abbreviation of the other
      if (
        candidateSkill.length <= 5 &&
        candidateSkill === candidateSkill.toUpperCase()
      ) {
        // Candidate might be an abbreviation - check if it matches initials of required skill
        const initials = requiredSkill
          .split(/\s+/)
          .map((word) => word[0] || "")
          .join("")
          .toLowerCase();
        if (initials === candidateSkill.toLowerCase()) {
          found = true;
          bestMatchIndex = candIndex;
          bestMatchScore = 0.95;
          matchType = "detected-abbreviation";
          return; // Exit early
        }
      }

      if (
        requiredSkill.length <= 5 &&
        requiredSkill === requiredSkill.toUpperCase()
      ) {
        // Required might be an abbreviation - check if it matches initials of candidate skill
        const initials = candidateSkill
          .split(/\s+/)
          .map((word) => word[0] || "")
          .join("")
          .toLowerCase();
        if (initials === requiredSkill.toLowerCase()) {
          found = true;
          bestMatchIndex = candIndex;
          bestMatchScore = 0.95;
          matchType = "detected-abbreviation";
          return; // Exit early
        }
      }

      // Strategy 3: Substring match (handles python vs python3 cases)
      // Check if either is substring of the other
      if (
        requiredSkill.includes(candidateSkill) ||
        candidateSkill.includes(requiredSkill)
      ) {
        // Calculate the ratio of the shorter length to the longer length
        // This ensures that very short substrings don't match against much longer strings
        const shorterLength = Math.min(
          requiredSkill.length,
          candidateSkill.length
        );
        const longerLength = Math.max(
          requiredSkill.length,
          candidateSkill.length
        );
        const lengthRatio = shorterLength / longerLength;

        // Only consider as substring match if the length ratio is decent
        if (lengthRatio >= 0.7) {
          const similarity = 0.9; // High but not perfect
          if (similarity > bestMatchScore) {
            found = true;
            bestMatchIndex = candIndex;
            bestMatchScore = similarity;
            matchType = "substring";
          }
        }
      }

      // Strategy 4: Remove special characters and compare
      // Next.js vs NextJS case
      const cleanReqSkill = requiredSkill.replace(/[^a-z0-9]/gi, "");
      const cleanCandSkill = candidateSkill.replace(/[^a-z0-9]/gi, "");

      if (cleanReqSkill === cleanCandSkill) {
        found = true;
        bestMatchIndex = candIndex;
        bestMatchScore = 0.95; // Very high but not perfect
        matchType = "cleaned";
        return; // Exit early
      }

      // Strategy 5: String similarity for everything else
      const similarity = calculateStringSimilarity(
        requiredSkill,
        candidateSkill
      );
      if (similarity >= similarityThreshold && similarity > bestMatchScore) {
        found = true;
        bestMatchIndex = candIndex;
        bestMatchScore = similarity;
        matchType = "fuzzy";
      }

      // Strategy 6: NLP-inspired fallback for low scores
      // Only try this if we haven't found a good match yet
      if (!found || bestMatchScore < 0.5) {
        // Try basic lemmatization/stemming approach
        if (basicSemanticSimilarity(requiredSkill, candidateSkill)) {
          found = true;
          bestMatchIndex = candIndex;
          bestMatchScore = 0.85; // Good but not perfect
          matchType = "semantic";
        }

        // Multi-word skill comparison
        // Split skills into words and check for significant word overlap
        const reqWords = requiredSkill.split(/\s+/);
        const candWords = candidateSkill.split(/\s+/);

        if (reqWords.length > 1 || candWords.length > 1) {
          let matchingWords = 0;

          // Count how many words match between the two skills
          for (const reqWord of reqWords) {
            if (reqWord.length < 3) continue; // Skip very short words

            for (const candWord of candWords) {
              if (candWord.length < 3) continue;

              if (
                reqWord === candWord ||
                calculateStringSimilarity(reqWord, candWord) > 0.8 ||
                basicSemanticSimilarity(reqWord, candWord)
              ) {
                matchingWords++;
                break;
              }
            }
          }

          // Calculate a score based on word overlap
          const overlapScore =
            reqWords.length > 0 ? matchingWords / reqWords.length : 0;

          if (overlapScore > 0.5 && overlapScore > bestMatchScore) {
            found = true;
            bestMatchIndex = candIndex;
            bestMatchScore = Math.min(0.9, overlapScore); // Cap at 0.9
            matchType = "word-overlap";
          }
        }
      }
    });

    // If we found a match, record it
    if (found && bestMatchIndex !== -1) {
      matchedSkills.push(requiredSkills[reqIndex]);
      matchedIndices.add(bestMatchIndex);
      matchDetails.push({
        required: requiredSkills[reqIndex],
        candidate: candidateSkills[bestMatchIndex],
        score: bestMatchScore,
        type: matchType,
      });
    }
  });

  // Find missing skills - skills required but not matched
  const missingSkills = requiredSkills.filter(
    (skill) => !matchedSkills.includes(skill)
  );

  // Find additional skills - skills candidate has beyond requirements
  const additionalSkills = candidateSkills.filter(
    (_, index) => !matchedIndices.has(index)
  );

  // Calculate score as ratio of matched skills to required skills
  const score =
    requiredSkills.length > 0
      ? Math.max(MIN_THRESHOLD, matchedSkills.length / requiredSkills.length)
      : 1.0;

  return {
    score,
    matchedSkills,
    missingSkills,
    additionalSkills,
    matchDetails, // Optional: could be removed in production
  };
};

/**
 * Score experience level based on job requirements using fuzzy sets
 * @param {string} candidateLevel - Candidate's experience level
 * @param {string} requiredLevel - Required experience level
 * @param {Object} options - Additional options
 * @returns {Object} - Score and detailed breakdown
 */
const scoreExperienceLevel = (candidateLevel, requiredLevel, options = {}) => {
  // If requirement is "None" or not specified, return full score
  if (
    !requiredLevel ||
    requiredLevel === "None" ||
    requiredLevel === "Not specified"
  ) {
    return {
      score: 1.0,
      candidateValue: mapExperienceLevel(candidateLevel),
      requiredValue: 0,
      difference: 0,
    };
  }

  // If candidate level is not specified, return minimum threshold
  if (
    !candidateLevel ||
    candidateLevel === "None" ||
    candidateLevel === "Not specified"
  ) {
    return {
      score: MIN_THRESHOLD,
      candidateValue: 0,
      requiredValue: mapExperienceLevel(requiredLevel),
      difference: -mapExperienceLevel(requiredLevel),
    };
  }

  // Map experience levels to numeric values (0-2 scale)
  // 0 = entry, 1 = intermediate, 2 = expert
  const candidateValue = mapExperienceLevel(candidateLevel);
  const requiredValue = mapExperienceLevel(requiredLevel);

  // Calculate score using fuzzy sets approach
  let score;

  // Normalize required level for comparison (case-insensitive)
  const normalizedRequiredLevel = requiredLevel.toLowerCase().trim();

  if (
    normalizedRequiredLevel === "expert" ||
    normalizedRequiredLevel === "senior"
  ) {
    // Job requires expert level
    if (candidateValue === 2) {
      // Candidate is expert - full score
      score = 1.0;
    } else if (candidateValue === 1) {
      // Candidate is intermediate - partial score (0.65)
      score = 0.65;
    } else {
      // Candidate is entry - minimum threshold
      score = MIN_THRESHOLD;
    }
  } else if (normalizedRequiredLevel === "intermediate") {
    // Job requires intermediate level
    if (candidateValue >= 1) {
      // Candidate is intermediate or expert - full score
      score = 1.0;
    } else {
      // Candidate is entry - partial score (0.5)
      score = 0.5;
    }
  } else if (normalizedRequiredLevel === "entry") {
    // Job requires entry level
    // Any experience level is acceptable for entry level positions
    score = 1.0;
  } else {
    // Handle unexpected values by falling back to standard comparison
    if (candidateValue >= requiredValue) {
      score = 1.0;
    } else {
      score = MIN_THRESHOLD;
    }
  }

  return {
    score,
    candidateValue,
    requiredValue,
    difference: candidateValue - requiredValue,
  };
};

/**
 * Score education level based on job requirements
 * @param {string} candidateEducation - Candidate's education level
 * @param {string} requiredEducation - Required education level
 * @param {string} candidateField - Candidate's field of study
 * @param {string} requiredField - Required field of study
 * @param {string} candidateGrade - Candidate's grade
 * @param {string} requiredGrade - Required grade
 * @param {Object} options - Additional options
 * @returns {Object} - Score and detailed breakdown
 */
const scoreEducation = (
  candidateEducation,
  requiredEducation,
  candidateField,
  requiredField,
  candidateGrade,
  requiredGrade,
  options = {}
) => {
  const {
    fieldWeight = 0.33,
    levelWeight = 0.34,
    gradeWeight = 0.33,
  } = options;

  // 1. Score Education Level
  let levelScore = MIN_THRESHOLD;

  // If requirement is "None" or not specified, return full score
  if (
    !requiredEducation ||
    requiredEducation === "None" ||
    requiredEducation === "Not specified"
  ) {
    levelScore = 1.0;
  }
  // If candidate education is not provided, use minimum threshold
  else if (
    !candidateEducation ||
    candidateEducation === "None" ||
    candidateEducation === "Not specified"
  ) {
    levelScore = MIN_THRESHOLD;
  } else {
    // Map education levels to numeric values
    const candidateLevel = mapEducationLevel(candidateEducation);
    const requiredLevel = mapEducationLevel(requiredEducation);

    // Calculate level score
    if (candidateLevel >= requiredLevel) {
      levelScore = 1.0; // Full score for meeting or exceeding requirements
    } else {
      // Use a ratio with minimum threshold
      levelScore = Math.max(MIN_THRESHOLD, candidateLevel / requiredLevel);
    }
  }

  // 2. Score Field of Study
  let fieldScore = MIN_THRESHOLD;

  // If requirement is "None" or not specified, return full score
  if (
    !requiredField ||
    requiredField === "None" ||
    requiredField === "Not specified" ||
    requiredField.toLowerCase() === "not specified"
  ) {
    fieldScore = 1.0;
  }
  // If candidate field is not provided, use minimum threshold
  else if (
    !candidateField ||
    candidateField === "None" ||
    candidateField === "Not specified"
  ) {
    fieldScore = MIN_THRESHOLD;
  } else {
    // Normalize candidate field
    const normalizedCandidateField = candidateField.toLowerCase().trim();

    // Check if required field contains comma (multiple alternatives)
    if (requiredField.includes(",")) {
      // Split the required field by comma and trim each value
      const requiredFields = requiredField
        .split(",")
        .map((field) => field.trim());

      // Calculate similarity score for each field and find the highest
      let bestScore = MIN_THRESHOLD;

      for (const field of requiredFields) {
        // Compare whole fields first
        let similarity = calculateStringSimilarity(
          normalizedCandidateField,
          field.toLowerCase()
        );

        // If the similarity is low, try word-by-word comparison
        if (similarity < 0.8) {
          // Split candidate field into words
          const candidateWords = normalizedCandidateField.split(/\s+/);

          // For each word in candidate field, calculate similarity with required field
          for (const word of candidateWords) {
            if (word.length < 3) continue; // Skip very short words

            const wordSimilarity = calculateStringSimilarity(
              word,
              field.toLowerCase()
            );

            // Update best score if this word has higher similarity
            if (wordSimilarity > similarity) {
              similarity = wordSimilarity;
            }

            // If we find a near-perfect match with any word, stop comparing
            if (wordSimilarity >= 0.95) {
              similarity = 1.0;
              break;
            }
          }
        }

        if (similarity > bestScore) {
          bestScore = similarity;
        }

        // If we find a near-perfect match, no need to continue
        if (similarity >= 0.95) {
          bestScore = 1.0;
          break;
        }
      }

      fieldScore = bestScore;
    } else {
      // For a single required field, do both whole field and word-by-word comparison
      const normalizedRequiredField = requiredField.toLowerCase().trim();

      // Compare whole fields first
      let similarity = calculateStringSimilarity(
        normalizedCandidateField,
        normalizedRequiredField
      );

      // If the similarity is low, try word-by-word comparison
      if (similarity < 0.8) {
        // Split candidate field into words
        const candidateWords = normalizedCandidateField.split(/\s+/);

        // For each word in candidate field, calculate similarity with required field
        for (const word of candidateWords) {
          if (word.length < 3) continue; // Skip very short words

          const wordSimilarity = calculateStringSimilarity(
            word,
            normalizedRequiredField
          );

          // Update best score if this word has higher similarity
          if (wordSimilarity > similarity) {
            similarity = wordSimilarity;
          }

          // If we find a near-perfect match with any word, stop comparing
          if (wordSimilarity >= 0.95) {
            similarity = 1.0;
            break;
          }
        }
      }

      fieldScore = Math.max(MIN_THRESHOLD, similarity);
    }
  }

  // 3. Score Grade
  let gradeScore = MIN_THRESHOLD;

  // If requirement is "None" or not specified, return full score
  if (
    !requiredGrade ||
    requiredGrade === "None" ||
    requiredGrade === "Not specified" ||
    requiredGrade.toLowerCase() === "not specified"
  ) {
    gradeScore = 1.0;
  }
  // If candidate grade is not provided, use minimum threshold
  else if (
    !candidateGrade ||
    candidateGrade === "None" ||
    candidateGrade === "Not specified" ||
    candidateGrade === "n/a"
  ) {
    gradeScore = MIN_THRESHOLD;
  } else {
    // Check if both are numeric (GPA)
    const candidateNumGrade = parseFloat(candidateGrade);
    const requiredNumGrade = parseFloat(requiredGrade);

    if (
      !isNaN(candidateNumGrade) &&
      !isNaN(requiredNumGrade) &&
      requiredNumGrade > 0
    ) {
      // For GPA, higher is better, so divide candidate by required if candidate is lower
      if (candidateNumGrade >= requiredNumGrade) {
        gradeScore = 1.0;
      } else {
        gradeScore = Math.max(
          MIN_THRESHOLD,
          candidateNumGrade / requiredNumGrade
        );
      }
    } else {
      // Use the education grade mapping for non-numeric grades
      const candidateGradeValue = mapEducationGrade(candidateGrade);
      const requiredGradeValue = mapEducationGrade(requiredGrade);

      if (candidateGradeValue !== null && requiredGradeValue !== null) {
        if (candidateGradeValue >= requiredGradeValue) {
          gradeScore = 1.0;
        } else {
          // Scale based on the highest possible grade (17 in our mapping)
          gradeScore = Math.max(
            MIN_THRESHOLD,
            candidateGradeValue / requiredGradeValue
          );
        }
      } else {
        // If mapping failed, use string similarity
        const similarity = calculateStringSimilarity(
          candidateGrade,
          requiredGrade
        );
        gradeScore = Math.max(MIN_THRESHOLD, similarity);
      }
    }
  }

  // Combine scores using weights
  const overallScore =
    levelScore * levelWeight +
    fieldScore * fieldWeight +
    gradeScore * gradeWeight;

  return {
    score: overallScore,
    levelScore,
    fieldScore,
    gradeScore,
  };
};

/**
 * Main function to score a candidate against job requirements
 * @param {Object} candidateData - Data extracted from the candidate's resume
 * @param {Object} jobData - Job requirements data
 * @param {Object} options - Additional scoring options
 * @returns {Object} - Comprehensive scoring results
 */
const scoreCandidate = (candidateData, jobData, options = {}) => {
  const { detailedBreakdown = true } = options;

  // Extract candidate data
  const candidateSkills = candidateData.Skills || [];
  const candidateExpLevel = candidateData["Experience level"] || "";
  const candidateYearsExp =
    candidateData["Total Estimated Years of Experience"] || "Not specified";

  // Extract education details
  let candidateEducation = "";
  let candidateField = "";
  let candidateGrade = "";

  if (
    candidateData["Education Details"] &&
    candidateData["Education Details"].length > 0
  ) {
    const primaryEducation = candidateData["Education Details"][0];
    candidateEducation = primaryEducation["education level"] || "";
    candidateField = primaryEducation["field of study"] || "";
    candidateGrade = primaryEducation["grade level"] || "";
  }

  // Extract job requirements
  const requiredSkills = jobData.skills || [];
  const requiredExpLevel = jobData.experienceLevel || "";
  const requiredYearsExp = jobData.yearsOfExperience || "Not specified";
  const requiredEducation = jobData.educationLevel || "";
  const requiredField = jobData.fieldOfStudy || "";
  const requiredGrade = jobData.grade || "";

  // Extract weights
  const weights = jobData.weights || {
    skills: 25,
    experienceLevel: 25,
    yearsOfExperience: 25,
    education: 25,
  };

  // Score each criterion
  const skillsResult = scoreSkills(candidateSkills, requiredSkills);
  const experienceLevelResult = scoreExperienceLevel(
    candidateExpLevel,
    requiredExpLevel
  );
  const yearsExpResult = scoreYearsOfExperience(
    candidateYearsExp,
    requiredYearsExp
  );
  const educationResult = scoreEducation(
    candidateEducation,
    requiredEducation,
    candidateField,
    requiredField,
    candidateGrade,
    requiredGrade
  );

  // Collect scores
  const scores = {
    skills: skillsResult.score,
    experienceLevel: experienceLevelResult.score,
    yearsOfExperience: yearsExpResult,
    education: educationResult.score,
  };

  // Apply weighted sum model exactly as specified
  // Calculate sum of (score * weight) for each criterion
  const weightedSum =
    scores.skills * weights.skills +
    scores.experienceLevel * weights.experienceLevel +
    scores.yearsOfExperience * weights.yearsOfExperience +
    scores.education * weights.education;

  // Calculate total weight
  const totalWeight =
    weights.skills +
    weights.experienceLevel +
    weights.yearsOfExperience +
    weights.education;

  // Calculate percentage score (0-100)
  let percentageScore = Math.round((weightedSum / totalWeight) * 100);

  // Cap the score at 99 as requested
  percentageScore = Math.min(99, percentageScore);

  // Determine if threshold is passed (50% or above)
  const thresholdPassed = percentageScore >= 50;

  // Determine grade
  let grade;
  if (percentageScore >= 90) {
    grade = "Excellent Match";
  } else if (percentageScore >= 80) {
    grade = "Very Good Match";
  } else if (percentageScore >= 70) {
    grade = "Good Match";
  } else if (percentageScore >= 50) {
    grade = "Fair Match";
  } else {
    grade = "Poor Match";
  }

  // Prepare result
  const result = {
    candidateName: candidateData.Name || "Unknown Candidate",
    jobTitle: jobData.title || "Unknown Position",
    overallScore: percentageScore,
    grade: grade,
    thresholdPassed: thresholdPassed,
    criteriaScores: {
      skills: skillsResult.score,
      experienceLevel: experienceLevelResult.score,
      yearsOfExperience: yearsExpResult,
      education: educationResult.score,
    },
  };

  // Add detailed breakdown if requested
  if (detailedBreakdown) {
    result.details = {
      skills: {
        score: skillsResult.score,
        matchedSkills: skillsResult.matchedSkills,
        missingSkills: skillsResult.missingSkills,
        additionalSkills: skillsResult.additionalSkills,
        matchDetails: skillsResult.matchDetails, // New field with detailed matching info
      },
      experienceLevel: {
        score: experienceLevelResult.score,
        candidate: candidateExpLevel,
        required: requiredExpLevel,
        difference: experienceLevelResult.difference,
      },
      yearsOfExperience: {
        score: yearsExpResult,
        candidate: candidateYearsExp,
        required: requiredYearsExp,
      },
      education: {
        score: educationResult.score,
        levelScore: educationResult.levelScore,
        fieldScore: educationResult.fieldScore,
        gradeScore: educationResult.gradeScore,
        candidate: {
          level: candidateEducation,
          field: candidateField,
          grade: candidateGrade,
        },
        required: {
          level: requiredEducation,
          field: requiredField,
          grade: requiredGrade,
        },
      },
      weights: weights,
    };
  }

  return result;
};

module.exports = {
  scoreCandidate,
  scoreSkills,
  scoreExperienceLevel,
  scoreYearsOfExperience,
  scoreEducation,
  calculateStringSimilarity,
  mapExperienceLevel,
  mapEducationLevel,
  mapEducationGrade,
  triangularMF,
};
