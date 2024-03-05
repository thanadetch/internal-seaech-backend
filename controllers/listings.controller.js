const {GoogleSpreadsheet} = require('google-spreadsheet');
const {serviceAccountAuth, drive} = require("../configs/google-auth");
const {spreadsheetId, zoneSpreadsheetId} = require("../configs/environment");
const _ = require("lodash");
const {mapperListingObject, mapperSheetObject} = require("../utils/sheetUtils");

const getAllListings = async () => {
    const doc = new GoogleSpreadsheet(spreadsheetId, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    return rows.map(row => mapperListingObject(row));
};

const getAllZoneListings = async () => {
    const doc = new GoogleSpreadsheet(zoneSpreadsheetId, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Zone list'];
    const rows = await sheet.getRows();

    const results = rows.map(row => ({
        zoneNameEnglish: row.get("Zone name English"),
    }));
    return [...new Set(results.reduce((acc, cur) => {
        const zoneNameList = cur.zoneNameEnglish.split(', ');
        return [...acc, ...zoneNameList];
    }, []))].sort((a, b) => a.localeCompare(b));
};


const getImagesFromSku = async (sku, limit) => {
    const response = await drive.files.list({
        q: `mimeType='application/vnd.google-apps.folder' and name='${sku}'`
    });
    const folderId = response.data.files ? response.data.files[0].id : null;
    if (!folderId) throw new Error("FolderId not found");
    return await drive.files.list({
        q: `'${folderId}' in parents`,
        pageSize: limit
    });
}

const updateListing = async (postType, sku, listingObj = {}) => {
    const doc = new GoogleSpreadsheet(spreadsheetId, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const row = rows.find(row => row.get('SKU') === sku && row.get('PostType') === postType)
    const payload = _.omitBy(mapperSheetObject(listingObj), _.isNil)

    const tel = listingObj['Tel.'] || row.get('Tel.')
    const whatsapp = listingObj['Whatsapp'] || row.get('Whatsapp')
    const oldAvailability = row.get('Availability')

    row.assign(_.omitBy({
        ...payload,
        'Update Availability': oldAvailability !== payload['Availability'] ? new Date() : null,
        'Tel.': tel ? ("'" + tel) : tel,
        'Whatsapp': whatsapp ? ("'" + whatsapp) : whatsapp
    }, _.isNil))
    await row.save()
    return mapperListingObject(row);
}

module.exports = {
    getAllListings,
    getImagesFromSku,
    getAllZoneListings,
    updateListing
}
