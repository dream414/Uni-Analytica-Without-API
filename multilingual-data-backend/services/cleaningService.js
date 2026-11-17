
const cleanText = (value) => {
  if (typeof value !== "string") {
    return value ?? "";
  }

  return value.trim().replace(/\s+/g, " ");
};

const cleanRecord = (record) => {
  const cleanedRecord = {};

  for (const key in record) {
    const cleanKey = cleanText(key);
    const cleanValue = cleanText(record[key]);

    cleanedRecord[cleanKey] = cleanValue;
  }

  return cleanedRecord;
};

const cleanRecords = (records) => {
  return records.map((record) => cleanRecord(record));
};

module.exports = {
  cleanText,
  cleanRecord,
  cleanRecords
};
