const express = require('express');
const {getImagesFromSku} = require("../controllers/images.controller");
const router = express.Router()/* GET users listing. */

router.get('/:sku', async function (req, res, next) {
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
