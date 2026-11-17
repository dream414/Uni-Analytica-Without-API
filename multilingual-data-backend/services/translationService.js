
const { translate } = require("googletrans");

const translateText = async (text, targetLanguage) => {
  try {
    if (!text || typeof text !== "string" || !text.trim()) {
      throw new Error("Text is required for translation");
    }

    const supportedLanguages = ["en", "ur", "sd"];

    if (!supportedLanguages.includes(targetLanguage)) {
      throw new Error("Unsupported target language");
    }

    const result = await translate(text.trim(), {
      to: targetLanguage
    });

    return {
      success: true,
      originalText: text,
      translatedText: result.text,
      detectedSourceLanguage: result.src,
      targetLanguage,
      needsReview:
        result.hasCorrectedText ||
        result.text.trim() === text.trim()
    };

  } catch (error) {
    console.error("Translation Service Error:", error.message);

    return {
      success: false,
      originalText: text,
      translatedText: null,
      error: error.message,
      needsReview: true
    };
  }
};

module.exports = {
  translateText
};
