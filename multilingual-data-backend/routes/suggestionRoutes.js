
const express = require("express");
const router = express.Router();

const {
  getSuggestions
} = require("../controllers/suggestionController");

// Get AI Suggestions and Insights
router.get("/", getSuggestions);

module.exports = router;
