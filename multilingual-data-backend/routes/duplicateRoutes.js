
const express = require("express");
const router = express.Router();

const { checkDuplicates } = require("../controllers/duplicateController");

// Duplicate Detection API
router.get("/check", checkDuplicates);

module.exports = router;