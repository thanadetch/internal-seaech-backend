const express = require("express");
const {getAvailableFromPsCode, getPageInstance} = require("../controllers/ps.controller");
const {getBrowser, getPageAndSignIn} = require("../utils/scrapingUtils");
const router = express.Router()/* GET users listing. */

router.get('/setup/browser', async function (req, res, next) {
    await getBrowser()
    res.send({
        data: true
    });
});

router.get('/setup/signIn', async function (req, res, next) {
    getPageAndSignIn()
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
