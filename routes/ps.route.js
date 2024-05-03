const express = require("express");
const {getAvailableFromPsCode, getPageInstance} = require("../controllers/ps.controller");
const {setBrowser} = require("../utils/scrapingUtils");
const router = express.Router()/* GET users listing. */

router.get('/setBrowser', async function (req, res, next) {
    await setBrowser()
    res.send({
        data: true
    });
});

router.get('/available/:psCode', async function (req, res, next) {
    const {psCode} = req.params

    const response = await getAvailableFromPsCode(psCode)
    res.send({
        data: response
    });
});

module.exports = router;
