const {
  detectLanguageWithAI,
} = require("../services/aiService");

const testLanguageDetection = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid text for language detection.",
      });
    }

    const result = await detectLanguageWithAI(text);

    return res.status(200).json({
      success: true,
      message: "Language detection completed successfully.",
      originalText: text,
      languageDetection: result,
    });
  } catch (error) {
    console.error("Language Detection Error:", error);

    return res.status(500).json({
      success: false,
      message: "Language detection failed.",
      error: error.message,
    });
  }
};

module.exports = {
  testLanguageDetection,
};