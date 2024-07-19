import express from "express";
import {getAllListings, updateListing, getAllLvId} from "../controllers/listings.controller";
import {getImagesFromSku} from "../controllers/listings.controller";

export const listingsRouter = express.Router();/* GET users listing. */

listingsRouter.get("/all", async function (req, res, next) {
    const response = await getAllListings();
    res.send({
        data: response
    });
});

listingsRouter.get("/lvId/all", async function (req, res, next) {
    const response = await getAllLvId();
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

listingsRouter.put("/:postType/:sku", async function (req, res, next) {
    const {postType, sku} = req.params;
    const response = await updateListing(postType, sku, req.body);
    res.send({
        data: response
    });
});

listingsRouter.get("/images/:sku", async function (req, res, next) {
    const {sku} = req.params;
    const {limit} = req.query as any;
    try {
        const fileResponse = await getImagesFromSku(sku, limit);
        res.send({
            files: fileResponse.data.files || []
        });
    } catch (e) {
        res.send({
            files: []
        });
    }
});

