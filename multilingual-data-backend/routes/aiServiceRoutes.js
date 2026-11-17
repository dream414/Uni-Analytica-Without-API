const express = require("express");
const router = express.Router();

const {
  testLanguageDetection,
} = require("../controllers/aiServiceController");

router.post("/detect-language", testLanguageDetection);

module.exports = router;