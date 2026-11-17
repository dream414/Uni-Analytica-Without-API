
const express = require("express");
const router = express.Router();

const {
  detectLanguageData
} = require("../controllers/languageController");

// Language Detection API
router.get("/detect", detectLanguageData);

module.exports = router;
