const express = require("express");
const {getAvailableFromPsCode, getPageInstance} = require("../controllers/ps.controller");
const router = express.Router()/* GET users listing. */

router.get('/setPage', async function (req, res, next) {
    await getPageInstance()
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
