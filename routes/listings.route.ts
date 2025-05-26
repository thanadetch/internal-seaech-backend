import express from "express";
import {
    getAllListings,
    updateListing,
    getAllLvId,
    deleteListing,
    getImagesFromSku,
} from "../controllers/listings.controller";
import {checkAuth} from "../middleware/auth";

export const listingsRouter = express.Router();

/* GET listings with caching */
listingsRouter.get("/all", async function (req, res, next) {
    try {
        const response = await getAllListings();
        res.send({
            data: response
        });
    } catch (error) {
        res.status(500).send({
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

listingsRouter.get("/lvId/all", async function (req, res, next) {
    try {
        const response = await getAllLvId();
        res.send({
            data: response
        });
    } catch (error) {
        res.status(500).send({
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

listingsRouter.patch("/:postType/:sku", checkAuth, async function (req, res, next): Promise<void> {
    try {
        const {postType, sku} = req.params;
        const response = await updateListing(postType, sku, req.body);
        res.send({
            data: response
        });
    } catch (error) {
        res.status(500).send({
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

listingsRouter.delete("/:postType/:sku", checkAuth, async function (req, res, next): Promise<void> {
    try {
        const {postType, sku} = req.params;
        const response = await deleteListing(postType, sku);
        res.send({
            data: response
        });
    } catch (error) {
        res.status(500).send({
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

listingsRouter.get("/images/:sku", async function (req, res, next) {
    try {
        const {sku} = req.params;
        const {limit} = req.query as any;
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

