"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tenure = exports.PropertyTypeEnum = exports.PropertyType = exports.PostBy = exports.ListingType = exports.AEManEventType = exports.DupSubClusterID = exports.RoomType = exports.Exterior = exports.AvailableFrom = exports.Availability = exports.AEManEventResult = void 0;
var AEManEventResult;
(function (AEManEventResult) {
    AEManEventResult["Available"] = "available";
    AEManEventResult["Unavailable"] = "unavailable";
})(AEManEventResult || (exports.AEManEventResult = AEManEventResult = {}));
var Availability;
(function (Availability) {
    Availability["Available"] = "available";
    Availability["NoInformation"] = "no-information";
    Availability["Rented"] = "rented";
})(Availability || (exports.Availability = Availability = {}));
var AvailableFrom;
(function (AvailableFrom) {
    AvailableFrom["Active"] = "Active";
    AvailableFrom["Duplicate"] = "Duplicate";
    AvailableFrom["Empty"] = "-";
})(AvailableFrom || (exports.AvailableFrom = AvailableFrom = {}));
var Exterior;
(function (Exterior) {
    Exterior["Building"] = "building";
    Exterior["Empty"] = "";
    Exterior["Entrance"] = "entrance";
    Exterior["Garden"] = "garden";
    Exterior["Gym"] = "gym";
    Exterior["Pool"] = "pool";
    Exterior["View"] = "view";
})(Exterior || (exports.Exterior = Exterior = {}));
var RoomType;
(function (RoomType) {
    RoomType["Balcony"] = "balcony";
    RoomType["Bathroom"] = "bathroom";
    RoomType["Bedroom"] = "bedroom";
    RoomType["Empty"] = "";
    RoomType["Kitchen"] = "kitchen";
    RoomType["Livingroom"] = "livingroom";
    RoomType["Other"] = "other";
    RoomType["Storage"] = "storage";
})(RoomType || (exports.RoomType = RoomType = {}));
var DupSubClusterID;
(function (DupSubClusterID) {
    DupSubClusterID["The10354_RentTwoBedrooms"] = "10354_rent_two_bedrooms";
    DupSubClusterID["The214_RentOneBedroom"] = "214_rent_one_bedroom";
    DupSubClusterID["The510_RentOneBedroom"] = "510_rent_one_bedroom";
})(DupSubClusterID || (exports.DupSubClusterID = DupSubClusterID = {}));
var AEManEventType;
(function (AEManEventType) {
    AEManEventType["CobrokerFeedback"] = "cobroker_feedback";
    AEManEventType["LandlordFeedback"] = "landlord_feedback";
    AEManEventType["LinkAvailable"] = "link_available";
})(AEManEventType || (exports.AEManEventType = AEManEventType = {}));
var ListingType;
(function (ListingType) {
    ListingType["Rent"] = "Rent";
    ListingType["RentSell"] = "Rent/Sell";
    ListingType["Sell"] = "Sell";
})(ListingType || (exports.ListingType = ListingType = {}));
var PostBy;
(function (PostBy) {
    PostBy["Agent"] = "agent";
    PostBy["Landlord"] = "landlord";
})(PostBy || (exports.PostBy = PostBy = {}));
var PropertyType;
(function (PropertyType) {
    PropertyType["Condo"] = "Condo";
    PropertyType["Duplex"] = "Duplex";
    PropertyType["House"] = "House";
})(PropertyType || (exports.PropertyType = PropertyType = {}));
var PropertyTypeEnum;
(function (PropertyTypeEnum) {
    PropertyTypeEnum["Condo"] = "condo";
    PropertyTypeEnum["Duplex"] = "duplex";
    PropertyTypeEnum["House"] = "house";
})(PropertyTypeEnum || (exports.PropertyTypeEnum = PropertyTypeEnum = {}));
var Tenure;
(function (Tenure) {
    Tenure["Rent"] = "rent";
    Tenure["Rentsell"] = "rentsell";
    Tenure["Sell"] = "sell";
})(Tenure || (exports.Tenure = Tenure = {}));
