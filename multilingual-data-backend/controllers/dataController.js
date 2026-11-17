
const { getSheetData } = require("../config/googleSheets");

// Get all Google Sheets data
const getAllData = async (req, res) => {
  try {
    const rows = await getSheetData();

    if (rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No data found in Google Sheet",
        totalRecords: 0,
        data: []
      });
    }

    // First row contains column headings
    const headers = rows[0];

    // Convert remaining rows into objects
    const data = rows.slice(1).map((row) => {
      const record = {};

      headers.forEach((header, index) => {
        record[header] = row[index] || "";
      });

      return record;
    });

    return res.status(200).json({
      success: true,
      message: "Google Sheets data fetched successfully",
      totalRecords: data.length,
      data
    });

  } catch (error) {
    console.error("Data Controller Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch Google Sheets data",
      error: error.message
    });
  }
};

module.exports = {
  getAllData
};
