
const { getSheetData } = require("../config/googleSheets");
const { cleanRecords } = require("../services/cleaningService");

const {
  analyzeText,
  analyzeRecords
} = require("../services/textAnalysisService");

const {
  detectLanguageWithAI
} = require("../services/aiService");

// Convert Google Sheets rows into objects
const getRecords = async () => {
  const rows = await getSheetData();

  if (!rows || rows.length <= 1) {
    return [];
  }

  const headers = rows[0];

  const records = rows.slice(1).map((row) => {
    const record = {};

    headers.forEach((header, index) => {
      record[header] = row[index] || "";
    });

    return record;
  });

  return cleanRecords(records);
};

// GET: Analyze all university issue records
const getTextAnalysis = async (req, res) => {
  try {
    const cleanedRecords = await getRecords();

    if (cleanedRecords.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No records available for text analysis",
        totalRecords: 0,
        analyzedRecords: 0,
        needsReview: 0,
        sentimentSummary: {},
        emotionSummary: {},
        data: []
      });
    }

    const analyzedData = analyzeRecords(cleanedRecords);

    const sentimentSummary = {};
    const emotionSummary = {};

    analyzedData.forEach((record) => {
      const analysis = record.textAnalysis;

      sentimentSummary[analysis.sentiment] =
        (sentimentSummary[analysis.sentiment] || 0) + 1;

      emotionSummary[analysis.emotion] =
        (emotionSummary[analysis.emotion] || 0) + 1;
    });

    const needsReviewCount = analyzedData.filter(
      (record) => record.textAnalysis.needsReview
    ).length;

    return res.status(200).json({
      success: true,
      message: "Text analysis completed successfully",
      totalRecords: analyzedData.length,
      analyzedRecords: analyzedData.length - needsReviewCount,
      needsReview: needsReviewCount,
      sentimentSummary,
      emotionSummary,
      data: analyzedData
    });

  } catch (error) {
    console.error("Text Analysis Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to analyze text records",
      error: error.message
    });
  }
};

// POST: Analyze one sentence entered by the user
const analyzeSingleText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter text for analysis"
      });
    }

    const cleanText = text.trim();

    // Language Detection
    // IMPORTANT: await is required because this function is asynchronous
    const languageDetection = await detectLanguageWithAI(cleanText);

    // Sentiment and Emotion Analysis
    const textAnalysis = analyzeText(cleanText);

    return res.status(200).json({
      success: true,
      message: "Text analysis completed successfully",
      originalText: cleanText,

      languageDetection,

      textAnalysis,

      summary: {
        language: languageDetection.language,
        sentiment: textAnalysis.sentiment,
        emotion: textAnalysis.emotion,
        confidence: textAnalysis.confidence,
        confidenceScore: textAnalysis.confidenceScore,
        wordCount: textAnalysis.wordCount,
        needsReview:
          languageDetection.needsReview ||
          textAnalysis.needsReview
      },

      analysisMethod: "Local Rule-Based NLP"
    });

  } catch (error) {
    console.error("Single Text Analysis Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to analyze submitted text",
      error: error.message
    });
  }
};

module.exports = {
  getTextAnalysis,
  analyzeSingleText
};