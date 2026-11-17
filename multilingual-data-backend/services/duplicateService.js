
const detectDuplicates = (records) => {
  const seen = new Map();

  const results = records.map((record, index) => {
    const university = (record["University Name"] || "")
      .trim()
      .toLowerCase();

    const category = (record["University Issue Category"] || "")
      .trim()
      .toLowerCase();

    const description = (record["Describe Your Issue"] || "")
      .trim()
      .toLowerCase();

    const duplicateKey = `${university}|${category}|${description}`;

    if (seen.has(duplicateKey)) {
      return {
        ...record,
        duplicate: true,
        duplicateOf: seen.get(duplicateKey)
      };
    }

    seen.set(duplicateKey, index + 1);

    return {
      ...record,
      duplicate: false,
      duplicateOf: null
    };
  });

  const duplicateCount = results.filter(
    (record) => record.duplicate
  ).length;

  return {
    totalRecords: results.length,
    uniqueRecords: results.length - duplicateCount,
    duplicateCount,
    data: results
  };
};

module.exports = {
  detectDuplicates
};