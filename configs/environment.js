const {
    PORT: port,
    GOOGLE_CLIENT_EMAIL: googleClientEmail,
    GOOGLE_PRIVATE_KEY: googlePrivateKey,
    SPREADSHEET_ID: spreadsheetId
} = process.env

module.exports = {
    port,
    googleClientEmail,
    googlePrivateKey,
    spreadsheetId
}
