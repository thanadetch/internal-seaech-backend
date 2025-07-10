import {GoogleSpreadsheet, GoogleSpreadsheetWorksheet} from "google-spreadsheet";
import {
    googleClientEmail,
    googlePrivateKey,
    internalSearchListingsSheetId,
    internalSearchSpreadsheetId
} from "./environment";
import {JWT} from "google-auth-library";

let sheet: GoogleSpreadsheetWorksheet; // Store the sheet reference globally

const serviceAccountAuth = new JWT({
    key: googlePrivateKey,
    email: googleClientEmail,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const initializeSpreadsheet = async () => {
    const doc = new GoogleSpreadsheet(internalSearchSpreadsheetId, serviceAccountAuth);
    await doc.loadInfo(); // Load the spreadsheet info
    sheet = doc.sheetsById[+internalSearchListingsSheetId]; // Store the sheet reference
};

export {
    initializeSpreadsheet,
    sheet
};
