const { getSheetData } = require("../config/googleSheets");
const { cleanText, cleanRecords } = require("../services/cleaningService");

const cleanData = async (req, res) => {
  try {
    const rows = await getSheetData();

    if (rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No data found to clean",
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

    const cleanedData = cleanRecords(records);

    return res.status(200).json({
      success: true,
      message: "Data cleaned successfully",
      totalRecords: cleanedData.length,
      data: cleanedData
    });
  } catch (error) {
    console.error("Data Cleaning Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to clean data",
      error: error.message
    });
  }
};

module.exports = { cleanData };