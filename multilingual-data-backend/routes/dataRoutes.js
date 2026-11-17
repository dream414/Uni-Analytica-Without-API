
const express = require("express");
const router = express.Router();

const { getAllData } = require("../controllers/dataController");

// GET all Google Sheets data
router.get("/", getAllData);

module.exports = router;
