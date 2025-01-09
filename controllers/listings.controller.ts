import {GoogleSpreadsheet} from "google-spreadsheet";
import {serviceAccountAuth, drive} from "../configs/google-auth";
import {
    internalSearchSpreadsheetId,
    imagesRootSpreadsheetId,
    internalSearchListingsSheetId,
    internalSearchLVIdSheetId
} from "../configs/environment";
import _ from "lodash";
import {mapperListingObject, mapperSheetObject, mapperLvIdObject} from "../utils/sheetUtils";
import {Listing, SheetListing} from "../types";

const doc = new GoogleSpreadsheet(internalSearchSpreadsheetId, serviceAccountAuth);

export const getAllListings = async () => {
    await doc.loadInfo();
    const sheet = doc.sheetsById[+internalSearchListingsSheetId];
    const rows = await sheet.getRows<SheetListing>();

    return rows.map(row => mapperListingObject(row));
};

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

export const getAllLvId = async () => {
    const doc = new GoogleSpreadsheet(internalSearchSpreadsheetId, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsById[+internalSearchLVIdSheetId];
    const rows = await sheet.getRows();

    return rows.map(row => mapperLvIdObject(row));
};

export const getImagesFromSku = async (sku: string, limit?: number) => {
    const response = await drive.files.list({
        q: `'${imagesRootSpreadsheetId}' in parents and mimeType='application/vnd.google-apps.folder' and name='${sku}'`
    });
    const folderId = response.data.files ? response.data.files[0].id : null;
    if (!folderId) throw new Error("FolderId not found");
    return await drive.files.list({
        q: `'${folderId}' in parents`,
        pageSize: limit,
        orderBy: "name"
    });
};

export const updateListing = async (postType: string, sku: string, listingObj: Listing) => {
    const doc = new GoogleSpreadsheet(internalSearchSpreadsheetId, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsById[+internalSearchListingsSheetId];
    const rows = await sheet.getRows<SheetListing>();

    const row = rows.find(row => row.get("SKU") === sku && row.get("PostType") === postType);
    if (!row) throw new Error("Row not found");
    const tel = listingObj.tel || row.get("Tel.");
    const whatsapp = listingObj.whatsapp || row.get("Whatsapp");
    const areaLV = row.get("Area LV");

    const payload = _.omitBy(mapperSheetObject({
        ...listingObj,
        areaLV,
        updateAvailability: new Date().toISOString(),
        tel: tel ? ("'" + tel) : tel,
        whatsapp: whatsapp ? ("'" + whatsapp) : whatsapp
    }), _.isNil) as SheetListing;
    row.assign(payload);
    await row.save();
    return mapperListingObject(row);
};
