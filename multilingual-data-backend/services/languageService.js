
const detectLanguage = (text) => {
  // 1. Empty response
  if (!text || typeof text !== "string" || !text.trim()) {
    return {
      language: "Empty Response",
      script: "Unknown",
      confidence: "Low",
      needsReview: false
    };
  }

  const value = text.trim();
  const lower = value.toLowerCase();


    // 2. Non-informative response detection
  const nonInformativeResponses = [
    "ntg",
    "nothing",
    "no issue",
    "no issues",
    "no problem",
    "no problems",
    "none",
    "n/a",
    "na"
  ];

  if (nonInformativeResponses.includes(lower)) {
    return {
      language: "Non-informative Response",
      script: "Latin",
      confidence: "Low",
      needsReview: true
    };
  }
  
  // 2. Script detection
  const hasArabic = /[\u0600-\u06FF]/.test(value);
  const hasLatin = /[a-z]/i.test(value);

  // Sindhi-specific characters
  const hasSindhiScript = /[ٺٽپڄڃڌڊڙڪگڳڱڻھڇڦڏٻ]/.test(value);

  if (hasArabic && hasLatin) {
    return {
      language: "Mixed Language",
      script: "Mixed",
      confidence: "Medium",
      needsReview: true
    };
  }

  if (hasArabic && hasSindhiScript) {
    return {
      language: "Sindhi",
      script: "Arabic-based",
      confidence: "Medium",
      needsReview: true
    };
  }

  if (hasArabic) {
    return {
      language: "Urdu / Arabic",
      script: "Arabic-based",
      confidence: "Low",
      needsReview: true
    };
  }

  if (!hasLatin) {
    return {
      language: "Unknown",
      script: "Unknown",
      confidence: "Low",
      needsReview: true
    };
  }

  // 3. Word matching
  const words = lower.match(/[a-z]+/g) || [];
  const wordSet = new Set(words);

  const urduWords = [
    "mujhe", "mujh", "mera", "meri", "mere",
    "apka", "aapka", "aap", "hum", "hain",
    "hai", "nahi", "nahin", "kya", "kyun",
    "kaise", "kaisa", "kaisi", "chahiye",
    "karna", "karo", "karun", "raha", "rahi",
    "tha", "thi", "bohat", "bahut", "acha",
    "achha", "mujhse", "tumhara", "tumhari",
    "isko", "usko", "wala", "wali", "liye",
    "madad", "apni", "aapki", "aapke",
    "hai", "hain", "koi", "aur", "ke", "ki",
    "ka", "ko", "mein", "se", "par"
  ];

  const sindhiWords = [
    "aahe", "aahin", "aahiyan", "aahyo",
    "maan", "tawhan", "tawhanjo", "tawhanji",
    "munhjo", "munhinji", "munhanjo",
    "chha", "khe", "san", "hinji", "hun",
    "naahin", "kando", "kandi", "karyan",
    "karyo", "tho", "aahen", "tokhe",
    "munkhe", "asani"
  ];

 
const englishWords = [
  "the", "is", "are", "was", "were",
  "have", "has", "had", "do", "does",
  "did", "need", "want", "can", "will",
  "would", "should", "could", "this",
  "that", "these", "those", "from",
  "with", "for", "because", "but", "if",
  "my", "your", "their", "students",
  "university", "education", "issue",
  "system", "important", "and", "or",
  "in", "on", "to", "of", "we", "they",
  "he", "she", "it", "i", "you", "our",
  "them", "who",

  // University and education vocabulary
  "shortage", "points", "teaching", "quality",
  "course", "outline", "syllabus", "problems",
  "class", "scheduling", "attendance",
  "admission", "delays", "eligibility",
  "merit", "list", "enrollment", "department",
  "allocation", "bus", "availability", "routes",
  "transport", "charges", "hostel",
  "accommodation", "semester", "fees",
  "challan", "scholarship", "installments",
  "financial", "assistance", "program",
  "complaints", "administrative", "staff",
  "behavior", "handling", "notifications",
  "missing", "announcements", "information",
  "communication", "gaps", "examination",
  "schedule", "result", "rechecking",
  "unfair", "assessment", "online",
  "difficulties", "login", "connectivity",
  "assignment", "submission", "platform",
  "errors", "safety", "harassment",
  "discrimination", "support", "internship",
  "opportunities", "career", "counseling",
  "placement", "skill", "development",
  "recognition", "college", "government",
  "degree", "lack", "facilities", "student"
];


  const countMatches = (list) =>
    list.filter(word => wordSet.has(word)).length;

  const urduMatches = countMatches(urduWords);
  const sindhiMatches = countMatches(sindhiWords);
  const englishMatches = countMatches(englishWords);

  // 4. Roman Urdu / Roman Sindhi detection
  if (urduMatches >= 2 && sindhiMatches >= 2) {
    return {
      language: "Possible Mixed Language",
      script: "Latin",
      confidence: "Low",
      needsReview: true
    };
  }

  if (sindhiMatches >= 2 && sindhiMatches > urduMatches) {
    return {
      language: "Roman Sindhi",
      script: "Latin",
      confidence: "Medium",
      needsReview: true
    };
  }

  if (urduMatches >= 2 && urduMatches > sindhiMatches) {
    return {
      language: "Roman Urdu",
      script: "Latin",
      confidence: "Medium",
      needsReview: true
    };
  }

  // 5. English detection
  if (englishMatches >= 3 && urduMatches === 0 && sindhiMatches === 0) {
    return {
      language: "English (Provisional)",
      script: "Latin",
      confidence: "Medium",
      needsReview: true
    };
  }

  // 6. Uncertain language
  return {
    language: "Unknown / Needs Review",
    script: "Latin",
    confidence: "Low",
    needsReview: true
  };
};

const detectLanguages = (records) => {
  return records.map(record => {
    const text = record["Describe Your Issue"] || "";

    return {
      ...record,
      languageDetection: detectLanguage(text)
    };
  });
};

module.exports = {
  detectLanguage,
  detectLanguages
};
