import express from "express";
import {
    getAllListings, 
    updateListing, 
    getAllLvId, 
    deleteListing, 
    getImagesFromSku,
    searchListings,
    batchUpdateListings,
    clearCache,
    warmUpCache,
    getCacheStats
} from "../controllers/listings.controller";
import {checkAuth} from "../middleware/auth";
import {rateLimitMiddleware} from "../middleware/performance";

export const listingsRouter = express.Router();

/* GET all listings with optimized caching */
listingsRouter.get("/all", async function (req, res, next) {
    try {
        const response = await getAllListings();
        // Add cache headers for better performance
        res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
        res.send({
            data: response
        });
    } catch (error) {
        res.status(500).send({
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/* Search listings with criteria-based filtering */
listingsRouter.get("/search", async function (req, res, next) {
    try {
        const criteria = {
            propertyType: req.query.propertyType as string,
            postType: req.query.postType as string,
            minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
            maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
            areaLP: req.query.areaLP as string,
            bedroom: req.query.bedroom as string,
        };
        
        const response = await searchListings(criteria);
        res.set('Cache-Control', 'public, max-age=60'); // 1 minute cache for search
        res.send({
            data: response
        });
    } catch (error) {
        res.status(500).send({
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/* GET LV IDs with longer cache */
listingsRouter.get("/lvId/all", async function (req, res, next) {
    try {
        const response = await getAllLvId();
        res.set('Cache-Control', 'public, max-age=600'); // 10 minutes
        res.send({
            data: response
        });
    } catch (error) {
        res.status(500).send({
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/* UPDATE listing with optimized single-row fetch */
listingsRouter.put("/:postType/:sku", async function (req, res, next) {
    try {
        const {postType, sku} = req.params;
        const response = await updateListing(postType, sku, req.body);
        res.send({
            data: response
        });
    } catch (error) {
        res.status(500).send({
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/* DELETE listing with optimized single-row fetch */
listingsRouter.delete("/:postType/:sku", async function (req, res, next) {
    try {
        const { postType, sku } = req.params;
        const response = await deleteListing(postType, sku);
        res.send({
            data: response
        });
    } catch (error) {
        res.status(500).send({
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/* GET images with folder caching */
listingsRouter.get("/images/:sku", async function (req, res, next) {
    try {
        const {sku} = req.params;
        const {limit} = req.query as any;
        const fileResponse = await getImagesFromSku(sku, limit);
        res.set('Cache-Control', 'public, max-age=1800'); // 30 minutes for images
        res.send({
            files: fileResponse.data.files || []
        });
    } catch (e) {
        res.send({
            files: []
        });
    }
});

/* Batch operations for multiple updates */
listingsRouter.post("/batch", 
    checkAuth, 
    rateLimitMiddleware(5, 60000), // Max 5 batch requests per minute
    async function (req, res, next): Promise<void> {
        try {
            const operations = req.body.operations;
            if (!operations || !Array.isArray(operations)) {
                res.status(400).send({ error: 'Operations array is required' });
                return;
            }
            
            const results = await batchUpdateListings(operations);
            res.send({
                data: results
            });
        } catch (error) {
            res.status(500).send({
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
);

/* Cache management endpoints */
listingsRouter.post("/cache/clear", checkAuth, async function (req, res, next): Promise<void> {
    try {
        clearCache();
        res.send({ message: 'Cache cleared successfully' });
    } catch (error) {
        res.status(500).send({
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

listingsRouter.post("/cache/warmup", checkAuth, async function (req, res, next): Promise<void> {
    try {
        await warmUpCache();
        res.send({ message: 'Cache warmed up successfully' });
    } catch (error) {
        res.status(500).send({
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

listingsRouter.get("/cache/stats", checkAuth, async function (req, res, next): Promise<void> {
    try {
        const stats = getCacheStats();
        res.send({
            data: stats
        });
    } catch (error) {
        res.status(500).send({
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
