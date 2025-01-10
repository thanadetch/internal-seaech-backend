import {GoogleSpreadsheet, GoogleSpreadsheetWorksheet} from "google-spreadsheet";
import {internalSearchListingsSheetId, internalSearchSpreadsheetId} from "./environment";
import {serviceAccountAuth} from "./google-auth";

let sheet: GoogleSpreadsheetWorksheet; // Store the sheet reference globally

const initializeSpreadsheet = async () => {
    const doc = new GoogleSpreadsheet(internalSearchSpreadsheetId, serviceAccountAuth);
    await doc.loadInfo(); // Load the spreadsheet info
    sheet = doc.sheetsById[+internalSearchListingsSheetId]; // Store the sheet reference
};

export {
    initializeSpreadsheet,
    sheet
};
