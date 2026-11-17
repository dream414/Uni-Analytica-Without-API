
const express = require("express");
const router = express.Router();

const {
  getTextAnalysis,
  analyzeSingleText
} = require("../controllers/textAnalysisController");

// Analyze all university issue records
router.get("/", getTextAnalysis);

// Analyze a single sentence entered by the user
router.post("/analyze", analyzeSingleText);

module.exports = router;
