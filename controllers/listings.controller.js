const {GoogleSpreadsheet} = require('google-spreadsheet');
const {serviceAccountAuth, drive} = require("../configs/google-auth");
const {spreadsheetId, zoneSpreadsheetId} = require("../configs/environment");
const getAllListings = async () => {
    const doc = new GoogleSpreadsheet(spreadsheetId, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    return rows.map(row => ({
        areaLP: row.get("Area LP"),
        areaLV: row.get("Area LV"),
        sku: row.get("SKU"),
        propertyType: row.get("Property Type"),
        postType: row.get("PostType"),
        postFrom: row.get("PostFrom"),
        titleTH: row.get("Title TH"),
        titleEN: row.get("Title EN"),
        price: row.get("Price") ? +row.get("Price") : row.get("Price"),
        areaSize: row.get("AreaSize") ? +row.get("AreaSize") : row.get("AreaSize"),
        floor: row.get("Floor"),
        bedroom: row.get("Bedroom"),
        bathroom: row.get("Bathroom"),
        petAllowed: row.get("pet_allowed"),
        facingDirection: row.get("Facing direction"),
        unitNumber: row.get("Unit Number"),
        buildingYear: row.get("Building year"),
        lineId: row.get("Line ID"),
        tel: row.get("Tel."),
        name: row.get("Name"),
        whatsapp: row.get("Whatsapp"),
        facebookMessenger: row.get("Facebook Messenger"),
        wechat: row.get("Wechat"),
        externalDataSource: row.get("External Data Source"),
        feedbackChecked: row.get("Feedback Checked"),
        listedOn: row.get("Listed On"),
        availability: row.get("Availability"),
        psCode: row.get("PS Code"),
    }));
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

module.exports = {
    getAllListings,
    getImagesFromSku,
    getAllZoneListings
}
