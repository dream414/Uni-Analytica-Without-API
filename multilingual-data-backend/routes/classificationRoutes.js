
const express = require("express");
const router = express.Router();

const {
  getClassifiedData
} = require("../controllers/classificationController");

// Get classified records
router.get("/", getClassifiedData);

module.exports = router;
