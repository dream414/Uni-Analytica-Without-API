
const { getSheetData } = require("../config/googleSheets");
const { cleanText, cleanRecords } = require("../services/cleaningService");
const { detectLanguages } = require("../services/languageService");

const detectLanguageData = async (req, res) => {
  try {
    const rows = await getSheetData();

    if (rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No data found for language detection",
        totalRecords: 0,
        data: []
      });
    }

    const headers = rows[0].map((header) => cleanText(header));

    const records = rows.slice(1).map((row) => {
      const record = {};

      headers.forEach((header, index) => {
        record[header] = row[index] || "";
      });

      return record;
    });

    const cleanedRecords = cleanRecords(records);
    const detectedData = detectLanguages(cleanedRecords);

    return res.status(200).json({
      success: true,
      message: "Language detection completed successfully",
      totalRecords: detectedData.length,
      data: detectedData
    });

  } catch (error) {
    console.error("Language Detection Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to detect languages",
      error: error.message
    });
  }
};

module.exports = {
  detectLanguageData
};