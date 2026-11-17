
const { getSheetData } = require("../config/googleSheets");
const { cleanRecords } = require("../services/cleaningService");
const { generateAnalytics } = require("../services/analyticsService");
const { generateSuggestions } = require("../services/suggestionService");

const getSuggestions = async (req, res) => {
  try {
    // Fetch Google Sheets data
    const rows = await getSheetData();

    if (rows.length <= 1) {
      return res.status(200).json({
        success: true,
        message: "No records available for suggestions",
        data: {
          totalSuggestions: 0,
          suggestions: []
        }
      });
    }

    // Convert spreadsheet rows into objects
    const headers = rows[0];

    const records = rows.slice(1).map((row) => {
      const record = {};

      headers.forEach((header, index) => {
        record[header] = row[index] || "";
      });

      return record;
    });

    // Clean records
    const cleanedRecords = cleanRecords(records);

    // Generate analytics
    const analytics = generateAnalytics(cleanedRecords);

    // Generate suggestions
    const suggestionResult = generateSuggestions(analytics);

    return res.status(200).json({
      success: true,
      message: "Suggestions generated successfully",
      data: suggestionResult
    });

  } catch (error) {
    console.error("Suggestion Controller Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to generate suggestions",
      error: error.message
    });
  }
};

module.exports = {
  getSuggestions
};
