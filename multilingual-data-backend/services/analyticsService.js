
const { detectDuplicates } = require("./duplicateService");
const { detectLanguages } = require("./languageService");
const { classifyRecords } = require("./classificationService");
const { analyzeRecords } = require("./textAnalysisService");

// Generate summary counts
const createSummary = (records, getValue) => {
  const summary = {};

  records.forEach((record) => {
    const value = getValue(record) || "Unknown";

    summary[value] = (summary[value] || 0) + 1;
  });

  return summary;
};

// Generate complete analytics
const generateAnalytics = (records) => {
  // Duplicate Analysis
  const duplicateResult = detectDuplicates(records);

  // Language Analysis
  const languageData = detectLanguages(records);

  // Category Analysis
  const classifiedData = classifyRecords(records);

  // Sentiment and Emotion Analysis
  const analyzedData = analyzeRecords(records);

  // Generate summaries
  const languageSummary = createSummary(
    languageData,
    (record) => record.languageDetection.language
  );

  const categorySummary = createSummary(
    classifiedData,
    (record) => record.suggestedCategory
  );

  const sentimentSummary = createSummary(
    analyzedData,
    (record) => record.textAnalysis.sentiment
  );

  const emotionSummary = createSummary(
    analyzedData,
    (record) => record.textAnalysis.emotion
  );

  // Manual review counts
  const needsLanguageReview = languageData.filter(
    (record) => record.languageDetection.needsReview
  ).length;

  const needsClassificationReview = classifiedData.filter(
    (record) => record.needsReview
  ).length;

  const needsTextAnalysisReview = analyzedData.filter(
    (record) => record.textAnalysis.needsReview
  ).length;

  return {
    totalRecords: records.length,

    uniqueRecords: duplicateResult.uniqueRecords,
    duplicateCount: duplicateResult.duplicateCount,

    languageSummary,
    categorySummary,
    sentimentSummary,
    emotionSummary,

    reviewSummary: {
      language: needsLanguageReview,
      classification: needsClassificationReview,
      textAnalysis: needsTextAnalysisReview
    },

    analysisMethod: "Rule-Based"
  };
};

module.exports = {
  generateAnalytics
};
