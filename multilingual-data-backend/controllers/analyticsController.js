
const { getSheetData } = require("../config/googleSheets");
const { cleanRecords } = require("../services/cleaningService");
const { generateAnalytics } = require("../services/analyticsService");

const getAnalytics = async (req, res) => {
  try {
    // Fetch records from Google Sheets
    const rows = await getSheetData();

    if (rows.length <= 1) {
      return res.status(200).json({
        success: true,
        message: "No records available for analytics",
        totalRecords: 0,
        data: {}
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

    return res.status(200).json({
      success: true,
      message: "Analytics generated successfully",
      data: analytics
    });

  } catch (error) {
    console.error("Analytics Controller Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to generate analytics",
      error: error.message
    });
  }
};

module.exports = {
  getAnalytics
};
