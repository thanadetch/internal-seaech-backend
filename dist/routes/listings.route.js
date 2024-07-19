"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listingsRouter = void 0;
const express_1 = __importDefault(require("express"));
const listings_controller_1 = require("../controllers/listings.controller");
const listings_controller_2 = require("../controllers/listings.controller");
exports.listingsRouter = express_1.default.Router(); /* GET users listing. */
exports.listingsRouter.get("/all", async function (req, res, next) {
    const response = await (0, listings_controller_1.getAllListings)();
    res.send({
        data: response
    });
});
exports.listingsRouter.get("/lvId/all", async function (req, res, next) {
    const response = await (0, listings_controller_1.getAllLvId)();
    res.send({
        data: response
    });
});
// router.get("/zone/all", async function (req, res, next) {
//     const response = await getAllZoneListings();
//     res.send({
//         data: response
//     });
// });
exports.listingsRouter.put("/:postType/:sku", async function (req, res, next) {
    const { postType, sku } = req.params;
    const response = await (0, listings_controller_1.updateListing)(postType, sku, req.body);
    res.send({
        data: response
    });
});
exports.listingsRouter.get("/images/:sku", async function (req, res, next) {
    const { sku } = req.params;
    const { limit } = req.query;
    try {
        const fileResponse = await (0, listings_controller_2.getImagesFromSku)(sku, limit);
        res.send({
            files: fileResponse.data.files || []
        });
    }
    catch (e) {
        res.send({
            files: []
        });
    }
});
