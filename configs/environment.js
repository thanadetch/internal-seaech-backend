const {
    PORT: port,
    GOOGLE_CLIENT_EMAIL: googleClientEmail,
    GOOGLE_PRIVATE_KEY: googlePrivateKey,
    SPREADSHEET_ID: spreadsheetId,
    ZONE_SPREADSHEET_ID: zoneSpreadsheetId,
    LV_SHEET_ID: lvSheetId,
    IMAGES_ROOT_SPREADSHEET_ID: imagesRootSpreadsheetId
} = process.env

module.exports = {
    port,
    googleClientEmail,
    googlePrivateKey,
    spreadsheetId,
    zoneSpreadsheetId,
    lvSheetId,
    imagesRootSpreadsheetId
}
