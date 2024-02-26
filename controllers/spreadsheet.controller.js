const {GoogleSpreadsheet} = require('google-spreadsheet');
const {serviceAccountAuth} = require("../configs/google-auth");
const {spreadsheetId} = require("../configs/environment");
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
        price: row.get("Price"),
        areaSize: row.get("AreaSize"),
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
        images: []
    }));
};

module.exports = {
    getAllListings
}
