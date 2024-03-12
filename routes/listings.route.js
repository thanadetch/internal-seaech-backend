const express = require('express');
const {getAllListings, getAllZoneListings, updateListing, getAllLvId} = require("../controllers/listings.controller");
const {getImagesFromSku} = require("../controllers/listings.controller");
const router = express.Router()/* GET users listing. */

router.get('/all', async function (req, res, next) {
    const response = await getAllListings()
    res.send({
        data: response
    });
});

router.get('/lvId/all', async function (req, res, next) {
    const response = await getAllLvId()
    res.send({
        data: response
    });
});

router.get('/zone/all', async function (req, res, next) {
    const response = await getAllZoneListings()
    res.send({
        data: response
    });
});

router.put('/:postType/:sku', async function (req, res, next) {
    const {postType, sku} = req.params
    const response = await updateListing(postType, sku, req.body);
    res.send({
        data: response
    });
});

router.get('/images/:sku', async function (req, res, next) {
    const {sku} = req.params
    const {limit} = req.query
    try {
        const fileResponse = await getImagesFromSku(sku, limit)
        res.send({
            files: fileResponse.data.files || []
        });
    } catch (e) {
        res.send({
            files: []
        });
    }
});

module.exports = router;
