
const detectLanguageWithAI = async (text) => {
  const unknownResult = {
    language: "Unknown",
    confidence: "Low",
    needsReview: true,
    analysisMethod: "Rule-Based",
  };

  if (!text || typeof text !== "string" || !text.trim()) {
    return unknownResult;
  }

  const cleanText = text.trim();
  const lowerText = cleanText.toLowerCase();

  // 1. Sindhi script detection
  const sindhiScriptPattern = /[ٻڄڏڊڙڳڪڱڇٺٽڦڻ]/;

  if (sindhiScriptPattern.test(cleanText)) {
    return {
      language: "Sindhi",
      confidence: "High",
      needsReview: false,
      analysisMethod: "Unicode Script Detection",
    };
  }

  // 2. Hindi script detection (Devanagari)
  const hindiScriptPattern = /[\u0900-\u097F]/;

  if (hindiScriptPattern.test(cleanText)) {
    return {
      language: "Hindi",
      confidence: "High",
      needsReview: false,
      analysisMethod: "Unicode Script Detection",
    };
  }

  // 3. Urdu / Arabic script detection
  // Urdu uses Arabic-derived script.
  const arabicScriptPattern = /\p{Script=Arabic}/u;

  if (arabicScriptPattern.test(cleanText)) {
    return {
      language: "Urdu",
      confidence: "High",
      needsReview: false,
      analysisMethod: "Unicode Script Detection",
    };
  }

  // 4. Roman text detection
  const words = lowerText.match(/[a-z]+/g) || [];

  if (words.length === 0) {
    return unknownResult;
  }

  // Roman Urdu vocabulary
  const romanUrduWords = [
    "hai", "hain", "ho", "hum", "ham", "main", "mein",
    "mera", "meri", "mere", "aap", "ap", "ka", "ki",
    "ke", "ko", "kya", "kyun", "nahi", "nahin",
    "acha", "achha", "bohat", "bahut", "mujhe",
    "hamara", "unka", "karna", "karen", "raha",
    "rahi", "tha", "thi", "yeh", "ye", "woh", "wo",
    "aur", "lekin", "masla", "chahiye", "gaya",
    "gayi", "sakta", "sakti", "hoon", "khush",
    "khushi", "udaas", "dukhi", "pareshan",
    "kharab", "behtar", "bura", "acha", "haar",
    "gaye", "karo", "karta", "karte", "tum",
    "tera", "teri", "tumhara", "mujh", "kab",
    "kahan", "kaise", "kyun", "shukriya"
  ];

  // Roman Sindhi vocabulary
  const romanSindhiWords = [
    "aahe", "aahen", "ahyan", "tawhan", "maan",
    "munjho", "munjhi", "munhanjo", "chha", "chaa",
    "kare", "kando", "kandi", "kayo", "karyan",
    "nahe", "naahi", "sagho", "saghi", "tawhanjo",
    "hin", "hun", "je", "jo", "ji", "aahyo",
    "aahein", "pyo", "thi", "thiyo", "sutho",
    "suthi", "munhanji", "kithay", "chawan"
  ];

  // English vocabulary
  const englishWords = [
    "i", "me", "my", "mine", "am", "is", "are",
    "was", "were", "be", "been", "being",
    "the", "this", "that", "these", "those",
    "what", "why", "how", "when", "where", "which",
    "who", "and", "but", "because", "with", "from",
    "for", "have", "has", "had", "will", "would",
    "can", "could", "should", "do", "does", "did",
    "not", "please", "thank", "thanks",
    "happy", "sad", "angry", "good", "bad", "great",
    "excellent", "amazing", "love", "like", "dislike",
    "feel", "feeling", "hope", "want", "need",
    "university", "student", "issue", "problem",
    "analysis", "data", "system", "education",
    "department", "feedback", "teacher", "class",
    "study", "school", "college", "work", "working",
    "hello", "hi", "yes", "no", "okay", "fine",
    "very", "really", "today", "tomorrow", "yesterday",
    "we", "they", "he", "she", "it", "you", "your",
    "our", "their", "his", "her", "us", "them",
    "cannot", "all", "some", "many", "much",
    "about", "after", "before", "also", "unhappy",
    "worried", "support", "service", "teacher",
    "management", "staff", "facilities", "improvement"
  ];

  const countMatches = (dictionary) => {
    return words.filter((word) => dictionary.includes(word)).length;
  };

  const urduMatches = countMatches(romanUrduWords);
  const sindhiMatches = countMatches(romanSindhiWords);
  const englishMatches = countMatches(englishWords);

  // 5. Mixed language detection
  if (
    (urduMatches > 0 && englishMatches > 0) ||
    (sindhiMatches > 0 && englishMatches > 0) ||
    (urduMatches > 0 && sindhiMatches > 0)
  ) {
    return {
      language: "Mixed Language",
      confidence: "Medium",
      needsReview: true,
      analysisMethod: "Rule-Based",
    };
  }

  // 6. Roman Urdu detection
  if (urduMatches > sindhiMatches && urduMatches > 0) {
    return {
      language: "Roman Urdu",
      confidence: urduMatches >= 2 ? "High" : "Medium",
      needsReview: urduMatches < 2,
      analysisMethod: "Dictionary-Based Detection",
    };
  }

  // 7. Roman Sindhi detection
  if (sindhiMatches > urduMatches && sindhiMatches > 0) {
    return {
      language: "Roman Sindhi",
      confidence: sindhiMatches >= 2 ? "High" : "Medium",
      needsReview: sindhiMatches < 2,
      analysisMethod: "Dictionary-Based Detection",
    };
  }

  // 8. English detection
  if (englishMatches > 0 && urduMatches === 0 && sindhiMatches === 0) {
    return {
      language: "English",
      confidence: englishMatches >= 2 ? "High" : "Medium",
      needsReview: englishMatches < 2,
      analysisMethod: "Dictionary-Based Detection",
    };
  }

  return unknownResult;
};

module.exports = {
  detectLanguageWithAI,
};