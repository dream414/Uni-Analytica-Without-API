
const express = require("express");
const router = express.Router();

const {
  getAnalytics
} = require("../controllers/analyticsController");

// Get complete analytics summary
router.get("/", getAnalytics);

module.exports = router;
