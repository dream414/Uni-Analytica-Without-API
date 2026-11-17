
const { getSheetData } = require("../config/googleSheets");
const { cleanText, cleanRecords } = require("../services/cleaningService");
const { detectDuplicates } = require("../services/duplicateService");

const checkDuplicates = async (req, res) => {
  try {
    const rows = await getSheetData();

    if (rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No data found",
        totalRecords: 0,
        uniqueRecords: 0,
        duplicateCount: 0,
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
    const result = detectDuplicates(cleanedRecords);

    return res.status(200).json({
      success: true,
      message: "Duplicate detection completed successfully",
      ...result
    });

  } catch (error) {
    console.error("Duplicate Detection Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to detect duplicates",
      error: error.message
    });
  }
};

module.exports = { checkDuplicates };
