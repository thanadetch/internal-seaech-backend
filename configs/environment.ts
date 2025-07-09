export const port = process.env.PORT;

// Google Auth related
export const googleClientEmail = process.env.GOOGLE_CLIENT_EMAIL;
export const googlePrivateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

// Spreadsheet related
export const internalSearchSpreadsheetId = process.env.INTERNAL_SEARCH_SPREADSHEET_ID || '';
export const internalSearchListingsSheetId = process.env.INTERNAL_SEARCH_LISTINGS_SHEET_ID || '';
export const imagesRootSpreadsheetId = process.env.IMAGES_ROOT_SPREADSHEET_ID;

// Firebase related
export const firebaseProjectId = process.env.FIREBASE_PROJECT_ID;
export const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
export const firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
