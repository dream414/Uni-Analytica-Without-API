
const classifyIssue = (text) => {
  if (!text || typeof text !== "string" || !text.trim()) {
    return {
      category: "Uncategorized",
      confidence: "Low",
      needsReview: true,
      matchedKeywords: []
    };
  }

  const value = text.toLowerCase();

  // Normalize common spelling variations
  const normalizedValue = value
    .replace(/\bassociateed\b/g, "associate")
    .replace(/\bassocated\b/g, "associate");

  // Very short or non-informative responses need manual review
  const normalizedText = normalizedValue
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = normalizedText.split(/\s+/).filter(Boolean);

  const nonInformativeResponses = [
    "ntg",
    "nothing",
    "no issue",
    "no issues",
    "no problem",
    "no problems",
    "none",
    "n a",
    "na"
  ];

  if (
    words.length <= 2 &&
    nonInformativeResponses.includes(normalizedText)
  ) {
    return {
      category: "Other / Needs Review",
      confidence: "Low",
      needsReview: true,
      matchedKeywords: []
    };
  }

  const categories = {
    "Admission & Enrollment Issues": [
      "admission",
      "enrollment",
      "enrolment",
      "apply for admission",
      "merit",
      "seat",
      "eligibility",
      "registration",
      "admission process",
      "semester admission",
      "admission requirements",
      "admission criteria"
    ],

    "Tuition Fees & Financial Assistance": [
      "fee",
      "fees",
      "tuition",
      "scholarship",
      "financial",
      "payment",
      "installment",
      "refund",
      "afford",
      "financial assistance",
      "fee structure",
      "fee concession",
      "semester fee",
      "fee payment"
    ],

    "Examination & Assessment Issues": [
      "exam",
      "examination",
      "result",
      "marks",
      "paper",
      "test",
      "grade",
      "rechecking",
      "assessment",
      "transcript",
      "quiz",
      "exam schedule",
      "result announcement",
      "examination schedule",
      "date sheet",
      "datesheet"
    ],

    "Academic & Educational Issues": [
      "course curriculum",
      "course outline",
      "curriculum",
      "syllabus",
      "lecture",
      "teaching quality",
      "quality of education",
      "academic disruption",
      "subject selection",
      "course content",
      "class schedule",
      "academic support",
      "equal learning opportunities",
      "learning opportunities",
      "subject specialists",
      "qualified teachers",
      "academic guidance",
      "teaching resources",
      "educational resources",
      "practical learning",
      "research opportunities",
      "educational programs",
      "learning resources",
      "science learning resources",
      "improved teaching",
      "better teaching",
      "associate degree",
      "associateed degree",
      "assocated degree",
      "ads degree",
      "degree recognition",
      "hec recognition",
      "eligible for hec"
    ],

    "Student Portal & Technical Issues": [
      "portal",
      "website",
      "login",
      "password",
      "account",
      "online portal",
      "software",
      "system error",
      "internet",
      "upload",
      "download",
      "lms",
      "learning management system",
      "result portal",
      "portal down",
      "system down",
      "server",
      "crash",
      "slow website",
      "website down",
      "online learning platform",
      "online learning platforms",
      "technical support",
      "technical issue",
      "technical issues",
      "digital platform",
      "online system"
    ],

    "Transportation & Hostel Facilities": [
      "transport",
      "transportation",
      "bus",
      "van",
      "route",
      "pickup",
      "drop",
      "vehicle",
      "hostel",
      "accommodation",
      "boarding",
      "residence",
      "bus stop",
      "bus route",
      "transport fee",
      "pickup point",
      "shortage of points",
      "bus points",
      "transport facility",
      "transport facilities"
    ],

    "University Administration & Management": [
      "management",
      "administration",
      "office",
      "staff",
      "department",
      "complaint",
      "mismanagement",
      "documents",
      "procedure",
      "official",
      "management system",
      "administrative procedures",
      "administrative delay",
      "administrative services",
      "transparent procedures",
      "university administration",
      "administrative support",
      "timely services",
      "official permission",
      "formal application",
      "event permission",
      "organize an event"
    ],

    "Communication & Information Services": [
      "communication",
      "information",
      "announcement",
      "notice",
      "notification",
      "contact",
      "helpline",
      "response",
      "email",
      "message",
      "update",
      "updates",
      "information service",
      "timely updates",
      "timely information",
      "admission updates",
      "examination updates",
      "academic activities",
      "information about admissions"
    ],

    "Student Welfare, Safety & Support": [
      "welfare",
      "safety",
      "support services",
      "harassment",
      "security",
      "health",
      "counselling",
      "counseling",
      "student rights",
      "mental health",
      "student support",
      "student support services",
      "student guidance",
      "student counseling",
      "student counselling",
      "student welfare",
      "female students",
      "female student support",
      "equal opportunities for female students",
      "educational guidance",
      "personal guidance"
    ],

    "Career Development & Internship Opportunities": [
      "career",
      "internship",
      "internships",
      "job placement",
      "job opportunities",
      "employment",
      "career counseling",
      "career counselling",
      "professional training",
      "skill development",
      "skills training",
      "industry-based learning",
      "workshop",
      "certification",
      "talent recognition",
      "career development",
      "professional development",
      "business training",
      "practical business training",
      "career opportunities",
      "professional skills"
    ],

    "Campus Infrastructure & Facilities": [
      "building",
      "classroom",
      "classrooms",
      "laboratory",
      "laboratories",
      "lab",
      "labs",
      "library",
      "electricity",
      "water",
      "washroom",
      "campus infrastructure",
      "infrastructure",
      "furniture",
      "equipment",
      "studio facilities",
      "classroom facilities",
      "computer lab",
      "computer labs",
      "technical equipment",
      "laboratory equipment",
      "science laboratories",
      "digital learning facilities",
      "practical learning facilities",
      "campus facilities",
      "better facilities",
      "modern labs",
      "learning facilities",
      "female student facilities"
    ],

    "Other Issues & Suggestions": [
      "suggestion",
      "suggestions",
      "recommend",
      "improvement",
      "improve",
      "issue",
      "problem",
      "problems",
      "concern",
      "feedback",
      "opinion"
    ]
  };

  const matches = [];

  for (const [category, keywords] of Object.entries(categories)) {
    const matchedKeywords = keywords.filter((keyword) => {
      const escapedKeyword = keyword.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const pattern = new RegExp(
        `\\b${escapedKeyword}\\b`,
        "i"
      );

      return pattern.test(normalizedValue);
    });

    if (matchedKeywords.length > 0) {
      matches.push({
        category,
        count: matchedKeywords.length,
        matchedKeywords
      });
    }
  }

  // Prioritize technical issues when a system or LMS outage
  // is the main problem, even if exam terms are also mentioned.
  const technicalPriorityKeywords = [
    "lms",
    "learning management system",
    "portal down",
    "system down",
    "system error",
    "website down",
    "server",
    "crash",
    "slow website"
  ];

  const hasTechnicalPriority = technicalPriorityKeywords.some(
    (keyword) => {
      const escapedKeyword = keyword.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      return new RegExp(`\\b${escapedKeyword}\\b`, "i")
        .test(normalizedValue);
    }
  );

  if (hasTechnicalPriority) {
    const technicalMatch = matches.find(
      (item) => item.category === "Student Portal & Technical Issues"
    );

    if (technicalMatch) {
      return {
        category: technicalMatch.category,
        confidence: "Provisional",
        needsReview: false,
        matchedKeywords: technicalMatch.matchedKeywords
      };
    }
  }

  matches.sort((a, b) => b.count - a.count);

  if (matches.length === 0) {
    return {
      category: "Other / Needs Review",
      confidence: "Low",
      needsReview: true,
      matchedKeywords: []
    };
  }

  const bestMatch = matches[0];

  const tied =
    matches.length > 1 &&
    matches[0].count === matches[1].count;

  return {
    category: bestMatch.category,
    confidence: tied ? "Low" : "Provisional",
    needsReview: tied,
    matchedKeywords: bestMatch.matchedKeywords
  };
};


const classifyRecords = (records) => {
  return records.map((record) => {
    const normalizedRecord = {};

    Object.keys(record).forEach((key) => {
      const cleanKey = key.trim().replace(/\s+/g, " ");
      normalizedRecord[cleanKey] = record[key];
    });

    const originalCategory =
      normalizedRecord["University Issue Category"] || "Not Provided";

    const issueText =
      normalizedRecord["Describe Your Issue"] || "";

    const classification = classifyIssue(issueText);

    return {
      ...normalizedRecord,
      originalCategory,
      suggestedCategory: classification.category,
      classificationConfidence: classification.confidence,
      needsReview: classification.needsReview,
      matchedKeywords: classification.matchedKeywords || []
    };
  });
};


module.exports = {
  classifyIssue,
  classifyRecords
};
