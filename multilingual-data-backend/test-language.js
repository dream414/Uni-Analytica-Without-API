
const { detectLanguage } = require("./services/languageService");

const samples = [
  "Many students have hidden talents and need support from their university.",
  "Mujhe apni university mein admission ke hawale se information chahiye.",
  "Tawhanjo nalo chha aahe?",
  "مجھے اپنی یونیورسٹی میں داخلے کے بارے میں معلومات چاہیے۔",
  "I need admission information, mujhe madad chahiye."
];

samples.forEach((sentence, index) => {
  console.log(`\n========== TEST ${index + 1} ==========`);
  console.log("Sentence:", sentence);
  console.log("Result:", detectLanguage(sentence));
});
