const {
    PORT: port,
    GOOGLE_CLIENT_EMAIL: googleClientEmail,
    GOOGLE_PRIVATE_KEY: googlePrivateKey,
    INTERNAL_SEARCH_SPREADSHEET_ID: internalSearchSpreadsheetId,
    INTERNAL_SEARCH_LISTINGS_SHEET_ID: internalSearchListingsSheetId,
    INTERNAL_SEARCH_LV_ID_SHEET_ID: internalSearchLVIdSheetId,
    ZONE_SPREADSHEET_ID: zoneSpreadsheetId,
    IMAGES_ROOT_SPREADSHEET_ID: imagesRootSpreadsheetId,
    PS_USERNAME: psUsername,
    PS_PASSWORD: psPassword,
    PS_WEB_URL: psWebURL,
    IS_LOCAL: isLocal,
    GOOGLE_CHROME_PATH: googleChromePath,
} = process.env

module.exports = {
    port,
    googleClientEmail,
    googlePrivateKey,
    internalSearchSpreadsheetId,
    internalSearchListingsSheetId,
    internalSearchLVIdSheetId,
    zoneSpreadsheetId,
    imagesRootSpreadsheetId,
    psUsername,
    psPassword,
    psWebURL,
    isLocal: isLocal === 'true',
    googleChromePath
}
