const express = require("express");
const router = express.Router();

const { cleanData } = require("../controllers/processingController");

// Data Cleaning API
router.get("/clean", cleanData);

module.exports = router;