
const sentimentKeywords = {
  positive: [
    // English
    "good", "excellent", "improvement", "improved",
    "support", "opportunity", "opportunities", "quality",
    "success", "helpful", "better", "accessible", "effective",
    "recognition", "happy", "glad", "satisfied", "satisfaction",
    "pleased", "excited", "grateful", "thankful", "amazing",
    "wonderful", "great", "best", "love", "enjoy",
    "appreciate", "delighted", "perfect", "beautiful",

    // Roman Urdu
    "acha", "achha", "behtareen", "khush", "khushi",
    "shukriya", "shukar", "zabardast", "khoob", "behtar",
    "madadgar", "mutmain", "kamiyab", "pasand",

    // Roman Sindhi
    "sutho", "suthi", "wadhiya", "wah", "meharbani",
    "khushi", "sukoon",

    // Urdu script
    "خوش", "خوشی", "بہترین", "اچھا", "اچھی",
    "اچھے", "زبردست", "شاندار", "بہتر", "مددگار",
    "مطمئن", "مطمئن ہوں", "شکرگزار", "کامیاب",
    "پسند", "خوبصورت", "اطمینان", "اچھا تجربہ",

    // Sindhi script
    "سٺو", "سٺي", "بهترين", "بهتر", "خوش",
    "خوشي", "مهرباني", "مددگار", "ڪامياب",
    "سڪون", "واهه",

    // Arabic
    "سعيد", "سعيدة", "سعداء", "فرح", "فرحان",
    "فرحانة", "ممتاز", "جيد", "جيدة", "رائع",
    "رائعة", "جميل", "جميلة", "ممتن", "ممتنة",
    "راض", "راضية", "نجاح"
  ],

  negative: [
    // English
    "problem", "problems", "issue", "issues",
    "shortage", "delay", "delays", "lack", "poor",
    "unfair", "difficulties", "complaints", "harassment",
    "discrimination", "disruption", "disappointment",
    "error", "errors", "failure", "crash", "unsafe",
    "missing", "bad", "worst", "hate", "unhappy",
    "sad", "angry", "frustrated", "disappointed",
    "dissatisfied", "useless", "terrible", "inadequate",
    "broken", "unavailable", "worried", "afraid",
    "fear", "anxious", "stress", "stressful",
    "disgusting", "horrible", "painful",

    // Roman Urdu
    "bura", "burra", "masla", "maslay", "pareshan",
    "naraz", "udaas", "dukhi", "mushkil", "kharab",
    "naakhush", "tang", "dikkat", "takleef",
    "na-insafi", "kami", "haar", "darr", "khauf",
    "mayus", "afsos", "ghussa", "gussa",

    // Roman Sindhi
    "kharab", "buro", "pareshan", "dukhi",
    "maslo", "masla", "takleef", "nahe",
    "darr", "ghuso", "na-insafi",

    // Urdu script
    "اداس", "غمگین", "افسردہ", "مایوس", "دکھی",
    "پریشان", "ناخوش", "خراب", "مسئلہ", "مسائل",
    "مشکل", "مشکلات", "تکلیف", "درد", "ناکامی",
    "ناکام", "ناانصافی", "غصہ", "ناراض",
    "خوف", "ڈر", "پریشانی", "مایوسی",
    "شکایت", "شکایات", "غیر محفوظ", "بے چین",
    "تنہا", "اکیلا", "اکیلی", "ظلم", "بے بسی",

    // Sindhi script
    "اداس", "ڏک", "ڏکويل", "مايوس", "پريشان",
    "خراب", "مسئلو", "مسئلا", "تڪليف", "ناانصافي",
    "ڪاوڙ", "ناراض", "ڊپ", "خوف", "ناڪامي",
    "شڪايت", "ظلم",

    // Arabic
    "حزين", "حزينة", "حزن", "غاضب", "غاضبة",
    "مشكلة", "مشاكل", "سيئ", "سيئة", "ظلم",
    "خائف", "خائفة", "خوف", "قلق", "قلقة",
    "غضب", "غاضبون", "فشل", "صعب", "صعبة",
    "حزينون", "مستاء", "مستاءة", "غير عادل",
    "سيء", "كارثة"
  ]
};

const emotionKeywords = {
  Happy: [
    // English
    "happy", "glad", "satisfied", "satisfaction",
    "pleased", "excited", "grateful", "thankful",
    "appreciate", "joy", "joyful", "delighted",
    "cheerful", "wonderful", "love", "enjoy",

    // Roman Urdu
    "khush", "khushi", "zabardast", "mazay",
    "mutmain", "shukar", "behtareen",

    // Urdu
    "خوش", "خوشی", "بہت خوش", "مطمئن",
    "شکرگزار", "مسرت", "شاد", "پُرمسرت",
    "خوشگوار", "اطمینان",

    // Sindhi
    "خوش", "خوشي", "سٺو", "سٺي", "سڪون",

    // Arabic
    "سعيد", "سعيدة", "فرح", "فرحان", "فرحانة",
    "مسرور", "مسرورة", "مبسوط", "مبسوطة",
    "ممتن", "ممتنة"
  ],

  Sad: [
    // English
    "sad", "upset", "disappointed", "disappointment",
    "unhappy", "regret", "heartbroken", "hopeless",
    "lonely", "depressed", "cry", "crying",
    "miserable", "sorrow", "grief",

    // Roman Urdu
    "dukhi", "udaas", "afsos", "mayus",
    "pareshan", "ghamgeen",

    // Urdu
    "اداس", "غمگین", "افسردہ", "مایوس",
    "دکھی", "تنہا", "اکیلا", "اکیلی",
    "دلگیر", "غم", "افسوس", "مایوسی",
    "رونا", "رو رہی", "رو رہا", "آنسو",
    "دل ٹوٹ گیا",

    // Sindhi
    "اداس", "ڏکويل", "ڏک", "مايوس",
    "اڪيلو", "اڪيلائي", "روئڻ",

    // Arabic
    "حزين", "حزينة", "حزن", "مكتئب",
    "مكتئبة", "حسرة", "بكاء", "وحيد",
    "وحيدة", "حزينون"
  ],

  Anger: [
    // English
    "angry", "anger", "frustrated", "frustrating",
    "annoyed", "furious", "unfair", "unacceptable",
    "irritated", "mad", "outraged", "disgusted",
    "rage", "infuriated",

    // Roman Urdu
    "naraz", "ghussa", "gussa", "tang",
    "na-insafi",

    // Urdu
    "غصہ", "ناراض", "غصے", "مشتعل",
    "چڑچڑا", "چڑچڑاہٹ", "غصے میں",
    "ناانصافی", "ظلم", "غیر منصفانہ",
    "بیزار",

    // Sindhi
    "ڪاوڙ", "ناراض", "ظلم", "ناانصافي",

    // Arabic
    "غاضب", "غاضبة", "غضب", "غاضبون",
    "منزعج", "منزعجة", "مستاء", "مستاءة",
    "مستفز", "مستفزة"
  ],

  Fear: [
    // English
    "fear", "afraid", "unsafe", "threat",
    "threatened", "violence", "harassment",
    "worried", "worry", "concern", "concerns",
    "concerned", "anxious", "tension",
    "scared", "nervous", "terrified", "panic",

    // Roman Urdu
    "darr", "khauf", "pareshan", "fikar",
    "ghabrahat",

    // Urdu
    "خوف", "ڈر", "ڈرا", "ڈری", "خائف",
    "پریشان", "فکر", "فکرمند", "گھبراہٹ",
    "غیر محفوظ", "دھمکی", "خطرہ",
    "خطرناک", "بے چینی",

    // Sindhi
    "ڊپ", "خوف", "ڊڄان", "ڳڻتي",
    "پريشان", "خطرو",

    // Arabic
    "خائف", "خائفة", "خوف", "قلق",
    "قلقة", "خائفون", "مرعوب", "مرعوبة",
    "متوتر", "متوترة", "تهديد", "خطر"
  ]
};

const emotionCategories = [
  "Anger",
  "Fear",
  "Happy",
  "Neutral",
  "Sad"
];

// Normalize text for matching across different scripts
const normalizeText = (text) => {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[ًٌٍَُِّْـ]/g, "")
    .replace(/[يى]/g, "ی")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه");
};

// Split text into Unicode-aware words
const tokenize = (text) => {
  return normalizeText(text).match(/[\p{L}\p{N}]+/gu) || [];
};

// Find exact words and phrases
const findMatches = (tokens, keywords) => {
  const matches = [];

  for (const keyword of keywords) {
    const keywordTokens = tokenize(keyword);

    if (!keywordTokens.length) continue;

    for (
      let i = 0;
      i <= tokens.length - keywordTokens.length;
      i++
    ) {
      const matched = keywordTokens.every(
        (word, index) => tokens[i + index] === word
      );

      if (matched) {
        matches.push({
          keyword,
          index: i,
          length: keywordTokens.length
        });
      }
    }
  }

  return matches;
};

// Negation words in English, Urdu, Sindhi and Arabic
const negationWords = new Set(
  tokenize(
    [
      "not", "never", "no", "cannot", "without",
      "nahi", "nahin", "mat",
      "نہیں", "نہ", "مت",
      "نه", "نا",
      "لا", "ليس", "ليست", "لم", "لن", "ما"
    ].join(" ")
  )
);

// Check negation before or after a matched word
const isNegated = (tokens, match) => {
  const start = Math.max(0, match.index - 3);
  const end = Math.min(
    tokens.length,
    match.index + match.length + 2
  );

  const nearbyTokens = [
    ...tokens.slice(start, match.index),
    ...tokens.slice(match.index + match.length, end)
  ];

  return nearbyTokens.some((word) => negationWords.has(word));
};

const getConfidenceLabel = (score) => {
  if (score >= 4) return "High";
  if (score >= 3) return "Medium";
  return "Low";
};

// Main analysis function
const analyzeText = (text) => {
  if (!text || typeof text !== "string" || !text.trim()) {
    return {
      sentiment: "Unknown",
      emotion: "Unknown",
      confidence: "Low",
      confidenceScore: 0,
      wordCount: 0,
      matchedKeywords: [],
      emotionBreakdown: {},
      needsReview: true,
      analysisMethod: "Rule-Based"
    };
  }

  const tokens = tokenize(text);
  const wordCount = tokens.length;

  // Match sentiment keywords
  const positiveMatches = findMatches(
    tokens,
    sentimentKeywords.positive
  );

  const negativeMatches = findMatches(
    tokens,
    sentimentKeywords.negative
  );

  // Apply negation to sentiment
  let positiveScore = 0;
  let negativeScore = 0;

  for (const match of positiveMatches) {
    if (isNegated(tokens, match)) {
      negativeScore++;
    } else {
      positiveScore++;
    }
  }

  for (const match of negativeMatches) {
    if (isNegated(tokens, match)) {
      positiveScore++;
    } else {
      negativeScore++;
    }
  }

  let sentiment = "Neutral";

  if (positiveScore > negativeScore) {
    sentiment = "Positive";
  } else if (negativeScore > positiveScore) {
    sentiment = "Negative";
  }

  // Match emotions
  const emotionMatches = {};

  for (const emotion of Object.keys(emotionKeywords)) {
    const allMatches = findMatches(
      tokens,
      emotionKeywords[emotion]
    );

    emotionMatches[emotion] = allMatches.filter(
      (match) => !isNegated(tokens, match)
    );
  }

  // Create emotion breakdown
  const emotionBreakdown = {};

  for (const category of emotionCategories) {
    const matches = emotionMatches[category] || [];

    emotionBreakdown[category] = {
      count: matches.length,
      matchedKeywords: matches.map(
        (match) => match.keyword
      )
    };
  }

  // Rank emotions
  const emotionRanking = Object.entries(emotionMatches)
    .map(([name, matches]) => ({
      name,
      count: matches.length
    }))
    .sort((a, b) => b.count - a.count);

  const highestEmotionCount = emotionRanking[0]?.count || 0;
  const secondHighestCount = emotionRanking[1]?.count || 0;

  const emotionTie =
    highestEmotionCount > 0 &&
    emotionRanking.filter(
      (item) => item.count === highestEmotionCount
    ).length > 1;

  let emotion = "Neutral";

  if (highestEmotionCount > 0 && !emotionTie) {
    emotion = emotionRanking[0].name;
  }

  // Calculate rule-based confidence score
  let confidenceScore = 1;

  if (highestEmotionCount > 0) {
    const margin = highestEmotionCount - secondHighestCount;

    confidenceScore = Math.min(
      5,
      Number(
        (
          2.5 +
          Math.min(highestEmotionCount, 3) * 0.6 +
          (margin / Math.max(highestEmotionCount, 1)) * 1.2
        ).toFixed(1)
      )
    );
  } else if (sentiment !== "Neutral") {
    confidenceScore = 3;
  }

  if (emotionTie) {
    confidenceScore = Math.min(confidenceScore, 2.5);
  }

  const confidence = getConfidenceLabel(confidenceScore);

  // Collect all matched keywords
  const allEmotionMatches = Object.values(
    emotionMatches
  ).flat();

  const matchedKeywords = [
    ...new Set([
      ...positiveMatches.map((match) => match.keyword),
      ...negativeMatches.map((match) => match.keyword),
      ...allEmotionMatches.map((match) => match.keyword)
    ])
  ];

  const needsReview =
    confidence === "Low" ||
    emotionTie ||
    (sentiment === "Neutral" && emotion === "Neutral");

  return {
    sentiment,
    emotion,
    confidence,
    confidenceScore,
    wordCount,
    matchedKeywords,
    emotionBreakdown,
    needsReview,
    analysisMethod: "Multilingual Rule-Based NLP"
  };
};

// Analyze all Google Sheets records
const analyzeRecords = (records) => {
  return records.map((record) => {
    const text = record["Describe Your Issue"] || "";

    return {
      ...record,
      textAnalysis: analyzeText(text)
    };
  });
};

module.exports = {
  analyzeText,
  analyzeRecords
};