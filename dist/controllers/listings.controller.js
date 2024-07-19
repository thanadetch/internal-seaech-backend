"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateListing = exports.getImagesFromSku = exports.getAllLvId = exports.getAllListings = void 0;
const google_spreadsheet_1 = require("google-spreadsheet");
const google_auth_1 = require("../configs/google-auth");
const environment_1 = require("../configs/environment");
const lodash_1 = __importDefault(require("lodash"));
const sheetUtils_1 = require("../utils/sheetUtils");
const getAllListings = async () => {
    const doc = new google_spreadsheet_1.GoogleSpreadsheet(environment_1.internalSearchSpreadsheetId, google_auth_1.serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsById[environment_1.internalSearchListingsSheetId];
    const rows = await sheet.getRows();
    return rows.map(row => (0, sheetUtils_1.mapperListingObject)(row));
};
exports.getAllListings = getAllListings;
// export const getAllZoneListings = async () => {
//     const doc = new GoogleSpreadsheet(zoneSpreadsheetId, serviceAccountAuth);
//     await doc.loadInfo();
//     const sheet = doc.sheetsByTitle["Zone list"];
//     const rows = await sheet.getRows();
//
//     const results = rows.map(row => ({
//         zoneNameEnglish: row.get("Zone name English"),
//     }));
//     return [...new Set(results.reduce((acc, cur) => {
//         const zoneNameList = cur.zoneNameEnglish.split(", ");
//         return [...acc, ...zoneNameList];
//     }, []))].sort((a, b) => a.localeCompare(b));
// };
const getAllLvId = async () => {
    const doc = new google_spreadsheet_1.GoogleSpreadsheet(environment_1.internalSearchSpreadsheetId, google_auth_1.serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsById[environment_1.internalSearchLVIdSheetId];
    const rows = await sheet.getRows();
    return rows.map(row => (0, sheetUtils_1.mapperLvIdObject)(row));
};
exports.getAllLvId = getAllLvId;
const getImagesFromSku = async (sku, limit) => {
    const response = await google_auth_1.drive.files.list({
        q: `'${environment_1.imagesRootSpreadsheetId}' in parents and mimeType='application/vnd.google-apps.folder' and name='${sku}'`
    });
    const folderId = response.data.files ? response.data.files[0].id : null;
    if (!folderId)
        throw new Error("FolderId not found");
    return await google_auth_1.drive.files.list({
        q: `'${folderId}' in parents`,
        pageSize: limit,
        orderBy: "name"
    });
};
exports.getImagesFromSku = getImagesFromSku;
const updateListing = async (postType, sku, listingObj) => {
    const doc = new google_spreadsheet_1.GoogleSpreadsheet(environment_1.internalSearchSpreadsheetId, google_auth_1.serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsById[environment_1.internalSearchListingsSheetId];
    const rows = await sheet.getRows();
    const row = rows.find(row => row.get("SKU") === sku && row.get("PostType") === postType);
    if (!row)
        throw new Error("Row not found");
    const payload = lodash_1.default.omitBy((0, sheetUtils_1.mapperSheetObject)(listingObj), lodash_1.default.isNil);
    const tel = listingObj.tel || row.get("Tel.");
    const whatsapp = listingObj.whatsapp || row.get("Whatsapp");
    row.assign(lodash_1.default.omitBy({
        ...payload,
        "Update Availability": new Date(),
        "Tel.": tel ? ("'" + tel) : tel,
        "Whatsapp": whatsapp ? ("'" + whatsapp) : whatsapp
    }, lodash_1.default.isNil));
    await row.save();
    return (0, sheetUtils_1.mapperListingObject)(row);
};
exports.updateListing = updateListing;
