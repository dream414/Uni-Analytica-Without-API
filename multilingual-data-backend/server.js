
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const dataRoutes = require("./routes/dataRoutes");
const processingRoutes = require("./routes/processingRoutes");
const duplicateRoutes = require("./routes/duplicateRoutes");
const languageRoutes = require("./routes/languageRoutes");
const aiServiceRoutes = require("./routes/aiServiceRoutes");
const translationRoutes = require("./routes/translationRoutes");
const classificationRoutes = require("./routes/classificationRoutes");
const textAnalysisRoutes = require("./routes/textAnalysisRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const exportRoutes = require("./routes/exportRoutes");
const suggestionRoutes = require("./routes/suggestionRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Multilingual Data Analysis API is running!"
  });
});

// API Routes
app.use("/api/data", dataRoutes);
app.use("/api/processing", processingRoutes);
app.use("/api/duplicates", duplicateRoutes);
app.use("/api/language", languageRoutes);
app.use("/api/ai", aiServiceRoutes);
app.use("/api/translation", translationRoutes);
app.use("/api/classification", classificationRoutes);
app.use("/api/text-analysis", textAnalysisRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/suggestions", suggestionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

// Server port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
