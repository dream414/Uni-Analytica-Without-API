
const { getSheetData } = require("../config/googleSheets");
const { cleanRecords } = require("../services/cleaningService");
const { classifyRecords } = require("../services/classificationService");

const getClassifiedData = async (req, res) => {
  try {
    // Fetch records from Google Sheets
    const rows = await getSheetData();

    if (rows.length <= 1) {
      return res.status(200).json({
        success: true,
        message: "No records available for classification",
        totalRecords: 0,
        data: []
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

    // Classify records
    const classifiedData = classifyRecords(cleanedRecords);

    // Generate category summary
    const categorySummary = {};

    classifiedData.forEach((record) => {
      const category = record.suggestedCategory;

      categorySummary[category] =
        (categorySummary[category] || 0) + 1;
    });

    // Count records requiring manual review
    const needsReviewCount = classifiedData.filter(
      (record) => record.needsReview
    ).length;

    return res.status(200).json({
      success: true,
      message: "Data classified successfully",
      totalRecords: classifiedData.length,
      classifiedRecords: classifiedData.length - needsReviewCount,
      needsReview: needsReviewCount,
      categorySummary,
      data: classifiedData
    });

  } catch (error) {
    console.error("Classification Controller Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to classify records",
      error: error.message
    });
  }
};

module.exports = {
  getClassifiedData
};
