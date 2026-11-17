
const convertToCSV = (records) => {
  if (!Array.isArray(records) || records.length === 0) {
    return "";
  }

  // Get column names
  const headers = Object.keys(records[0]);

  // Escape CSV values
  const escapeCSVValue = (value) => {
    if (value === null || value === undefined) {
      return '""';
    }

    const text = String(value);

    return `"${text.replace(/"/g, '""')}"`;
  };

  // Create CSV header row
  const headerRow = headers
    .map(escapeCSVValue)
    .join(",");

  // Create CSV data rows
  const dataRows = records.map((record) => {
    return headers
      .map((header) => escapeCSVValue(record[header]))
      .join(",");
  });

  // Add UTF-8 BOM for better Excel compatibility
  return "\uFEFF" + [headerRow, ...dataRows].join("\r\n");
};

module.exports = {
  convertToCSV
};
