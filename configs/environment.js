const {
    PORT: port,
    GOOGLE_CLIENT_EMAIL: googleClientEmail,
    GOOGLE_PRIVATE_KEY: googlePrivateKey,
    SPREADSHEET_ID: spreadsheetId,
    ZONE_SPREADSHEET_ID: zoneSpreadsheetId,
    LV_SHEET_ID: lvSheetId
} = process.env

module.exports = {
    port,
    googleClientEmail,
    googlePrivateKey,
    spreadsheetId,
    zoneSpreadsheetId,
    lvSheetId
}
