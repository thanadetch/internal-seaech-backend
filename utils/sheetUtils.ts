import {GoogleSpreadsheetRow} from "google-spreadsheet";
import {convertToNumber} from "./numberUtils";
import {Listing, SheetListing} from "../types";

export const mapperListingObject = (row:  GoogleSpreadsheetRow<SheetListing>) => {
    const listing: Listing = {
        areaLP: row.get("Area LP"),
        areaLV: `${row.get("Area LV")}, ${row.get("Area LP")}`,
        sku: row.get("SKU"),
        propertyType: row.get("Property Type"),
        postType: row.get("PostType"),
        postFrom: row.get("PostFrom"),
        titleEN: row.get("Title EN"),
        price: convertToNumber(row.get("Price")),
        areaSize: convertToNumber(row.get("AreaSize")),
        floor: row.get("Floor"),
        bedroom: row.get("Bedroom"),
        bathroom: row.get("Bathroom"),
        petAllowed: row.get("pet_allowed") || "",
        facingDirection: row.get("Facing direction") || "",
        unitNumber: row.get("Unit Number") || "",
        buildingYear: row.get("Building year") || "",
        email: row.get("Email") || "",
        lineId: row.get("Line ID") || "",
        tel: row.get("Tel.") || "",
        name: row.get("Name") || "",
        whatsapp: row.get("Whatsapp") || "",
        facebookMessenger: row.get("Facebook Messenger") || "",
        wechat: row.get("Wechat") || "",
        externalDataSource: row.get("External Data Source") || "",
        feedbackChecked: row.get("Feedback Checked") || "",
        listedOn: row.get("Listed On") || "",
        availability: row.get("Availability") || "",
        psCode: row.get("PS Code") || "",
        comment: row.get("Comment") || "",
        exclusive: row.get("Exclusive") || "",
        updateAvailability: row.get("Update Availability")
    };

    return listing;
};

export const mapperLvIdObject = (row: GoogleSpreadsheetRow<Record<string, any>>) => {
    return {
        id: row.get("id"),
        sku: row.get("sku"),
        type: row.get("type"),
    };
};

export const mapperSheetObject = (listingObj: Listing) => {
    const sheetListing: SheetListing = {
        "Area LP": listingObj.areaLP,
        "Area LV": listingObj.areaLV,
        "SKU": listingObj.sku,
        "Property Type": listingObj.propertyType,
        "PostType": listingObj.postType,
        "PostFrom": listingObj.postFrom,
        "Title EN": listingObj.titleEN,
        "Price": listingObj.price,
        "AreaSize": listingObj.areaSize,
        "Floor": listingObj.floor,
        "Bedroom": listingObj.bedroom,
        "Bathroom": listingObj.bathroom,
        "pet_allowed": listingObj.petAllowed,
        "Facing direction": listingObj.facingDirection,
        "Unit Number": listingObj.unitNumber,
        "Building year": listingObj.buildingYear,
        "Email": listingObj.email,
        "Line ID": listingObj.lineId,
        "Tel.": listingObj.tel,
        "Name": listingObj.name,
        "Whatsapp": listingObj.whatsapp,
        "Facebook Messenger": listingObj.facebookMessenger,
        "Wechat": listingObj.wechat,
        "External Data Source": listingObj.externalDataSource,
        "Feedback Checked": listingObj.feedbackChecked,
        "Listed On": listingObj.listedOn,
        "Availability": listingObj.availability,
        "PS Code": listingObj.psCode,
        "Comment": listingObj.comment,
        "Update Availability": listingObj.updateAvailability,
        "Exclusive": listingObj.exclusive
    };
    return sheetListing;
};
