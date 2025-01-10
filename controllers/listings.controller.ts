import {drive} from "../configs/google-auth";
import {imagesRootSpreadsheetId} from "../configs/environment";
import _ from "lodash";
import {mapperListingObject, mapperLvIdObject, mapperSheetObject} from "../utils/sheetUtils";
import {Listing, SheetListing} from "../types";
import {sheet} from "../configs/spreadsheet";

export const getAllListings = async () => {
    const limit = 2000;
    // Load total row count (assuming the sheet supports row count information)
    const totalRows = sheet.rowCount;

    // Calculate the number of chunks based on limit
    const numberOfChunks = Math.ceil(totalRows / limit);

    // Create an array of promises to fetch rows in chunks
    const promises = Array.from({length: numberOfChunks}, (_, i) => {
        const offset = i * limit;
        return sheet.getRows<SheetListing>({limit, offset});
    });

    // Use Promise.all to fetch all chunks concurrently
    const rowsChunks = await Promise.all(promises);

    // Flatten the results and map them to the desired format
    return rowsChunks.flat().map((row) => mapperListingObject(row));
};

export const getAllLvId = async () => {
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
