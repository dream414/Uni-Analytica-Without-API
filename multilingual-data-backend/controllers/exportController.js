
const { getSheetData } = require("../config/googleSheets");
const { cleanRecords } = require("../services/cleaningService");
const { convertToCSV } = require("../services/exportService");
const { generateExcel } = require("../services/excelExportService");
const { generatePDF } = require("../services/pdfExportService");

// CSV Export
const exportCSV = async (req, res) => {
  try {
    const rows = await getSheetData();

    if (rows.length <= 1) {
      return res.status(404).json({
        success: false,
        message: "No records available for CSV export"
      });
    }

    const headers = rows[0];

    const records = rows.slice(1).map((row) => {
      const record = {};

      headers.forEach((header, index) => {
        record[header] = row[index] || "";
      });

      return record;
    });

    const cleanedRecords = cleanRecords(records);
    const csvData = convertToCSV(cleanedRecords);

    res.setHeader("Content-Type", "text/csv; charset=utf-8");

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="multilingual-data-report.csv"'
    );

    return res.status(200).send(csvData);

  } catch (error) {
    console.error("CSV Export Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to export CSV file",
      error: error.message
    });
  }
};

// Excel Export
const exportExcel = async (req, res) => {
  try {
    const rows = await getSheetData();

    if (rows.length <= 1) {
      return res.status(404).json({
        success: false,
        message: "No records available for Excel export"
      });
    }

    const headers = rows[0];

    const records = rows.slice(1).map((row) => {
      const record = {};

      headers.forEach((header, index) => {
        record[header] = row[index] || "";
      });

      return record;
    });

    const cleanedRecords = cleanRecords(records);
    const excelBuffer = await generateExcel(cleanedRecords);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="multilingual-data-report.xlsx"'
    );

    return res.status(200).send(Buffer.from(excelBuffer));

  } catch (error) {
    console.error("Excel Export Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to export Excel file",
      error: error.message
    });
  }
};

// PDF Export
const exportPDF = async (req, res) => {
  try {
    const rows = await getSheetData();

    if (rows.length <= 1) {
      return res.status(404).json({
        success: false,
        message: "No records available for PDF export"
      });
    }

    const headers = rows[0];

    const records = rows.slice(1).map((row) => {
      const record = {};

      headers.forEach((header, index) => {
        record[header] = row[index] || "";
      });

      return record;
    });

    const cleanedRecords = cleanRecords(records);
    const pdfBuffer = await generatePDF(cleanedRecords);

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="multilingual-data-report.pdf"'
    );

    return res.status(200).send(pdfBuffer);

  } catch (error) {
    console.error("PDF Export Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to export PDF file",
      error: error.message
    });
  }
};

module.exports = {
  exportCSV,
  exportExcel,
  exportPDF
};