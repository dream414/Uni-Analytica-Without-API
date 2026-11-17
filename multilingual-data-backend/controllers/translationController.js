
const { translateText } = require("../services/translationService");

const translateData = async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({
        success: false,
        message: "Text and target language are required"
      });
    }

    const result = await translateText(text, targetLanguage);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error("Translation Controller Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Translation failed"
    });
  }
};

module.exports = {
  translateData
};
