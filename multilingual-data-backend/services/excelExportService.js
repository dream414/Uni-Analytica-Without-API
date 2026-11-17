
const ExcelJS = require("exceljs");

const generateExcel = async (records) => {
  if (!Array.isArray(records) || records.length === 0) {
    throw new Error("No records available for Excel export");
  }

  // Create Excel workbook
  const workbook = new ExcelJS.Workbook();

  workbook.creator = "Multilingual Data Processing System";
  workbook.created = new Date();

  // Create worksheet
  const worksheet = workbook.addWorksheet("Submitted Data");

  // Define columns
  const headers = Object.keys(records[0]);

  worksheet.columns = headers.map((header) => ({
    header,
    key: header,
    width: Math.max(18, Math.min(header.length + 8, 35))
  }));

  // Add records
  records.forEach((record) => {
    worksheet.addRow(record);
  });

  // Style header row
  const headerRow = worksheet.getRow(1);

  headerRow.font = {
    bold: true,
    color: { argb: "FFFFFFFF" },
    size: 11
  };

  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1F4E78" }
  };

  headerRow.alignment = {
    vertical: "middle",
    horizontal: "center",
    wrapText: true
  };

  headerRow.height = 30;

  // Format data rows
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      row.alignment = {
        vertical: "top",
        wrapText: true
      };
    }
  });

  // Freeze header row
  worksheet.views = [
    { state: "frozen", ySplit: 1 }
  ];

  // Return Excel file buffer
  return await workbook.xlsx.writeBuffer();
};

module.exports = {
  generateExcel
};
