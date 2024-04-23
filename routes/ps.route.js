const express = require("express");
const {getAvailableFromPsCode} = require("../controllers/ps.controller");
const router = express.Router()/* GET users listing. */

router.get('/available/:psCode', async function (req, res, next) {
    const {psCode} = req.params

    const response = await getAvailableFromPsCode(psCode)
    res.send({
        data: response
    });
});

module.exports = router;
