
const express = require("express");
const router = express.Router();

const {
  exportCSV,
  exportExcel,
  exportPDF
} = require("../controllers/exportController");

// Download CSV report
router.get("/csv", exportCSV);

// Download Excel report
router.get("/excel", exportExcel);

// Download PDF report
router.get("/pdf", exportPDF);

module.exports = router;