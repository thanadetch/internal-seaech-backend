const {
    PORT: port,
    GOOGLE_CLIENT_EMAIL: googleClientEmail,
    GOOGLE_PRIVATE_KEY: googlePrivateKey,
    SPREADSHEET_ID: spreadsheetId,
    ZONE_SPREADSHEET_ID: zoneSpreadsheetId,
} = process.env

module.exports = {
    port,
    googleClientEmail,
    googlePrivateKey,
    spreadsheetId,
    zoneSpreadsheetId
}
