const express = require('express');
const {getAllListings} = require("../controllers/spreadsheet.controller");
const {getImagesFromSku} = require("../controllers/images.controller");
const router = express.Router()/* GET users listing. */

router.get('/all', async function (req, res, next) {
    const response = await getAllListings()
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
