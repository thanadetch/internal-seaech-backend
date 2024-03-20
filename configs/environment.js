const {
    PORT: port,
    GOOGLE_CLIENT_EMAIL: googleClientEmail,
    GOOGLE_PRIVATE_KEY: googlePrivateKey,
    INTERNAL_SEARCH_SPREADSHEET_ID: internalSearchSpreadsheetId,
    INTERNAL_SEARCH_LISTINGS_SHEET_ID: internalSearchListingsSheetId,
    INTERNAL_SEARCH_LV_ID_SHEET_ID: internalSearchLVIdSheetId,
    ZONE_SPREADSHEET_ID: zoneSpreadsheetId,
    IMAGES_ROOT_SPREADSHEET_ID: imagesRootSpreadsheetId
} = process.env

module.exports = {
    port,
    googleClientEmail,
    googlePrivateKey,
    internalSearchSpreadsheetId,
    internalSearchListingsSheetId,
    internalSearchLVIdSheetId,
    zoneSpreadsheetId,
    imagesRootSpreadsheetId
}
