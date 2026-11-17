
const { google } = require("googleapis");
const path = require("path");
require("dotenv").config();

// Google Sheets authentication
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "google-service-account.json"),
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets.readonly"
  ]
});

// Google Sheets client
const sheets = google.sheets({
  version: "v4",
  auth
});

// Fetch data from Google Spreadsheet
const getSheetData = async () => {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error("Google Sheet ID is missing in .env");
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "A:Z"
    });

    return response.data.values || [];

  } catch (error) {
    console.error("Google Sheets Error:", error.message);
    throw error;
  }
};

module.exports = {
  getSheetData
};
