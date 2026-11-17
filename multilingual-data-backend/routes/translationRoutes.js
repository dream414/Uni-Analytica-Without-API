
const express = require("express");
const router = express.Router();

const { translateData } = require("../controllers/translationController");

router.post("/", translateData);

module.exports = router;
