import express from "express";
import {
    getAvailableFromPsCode,
    getInternalSearchListing
} from "../controllers/ps.controller";

export const psRouter = express.Router();/* GET users listing. */

psRouter.get("/available/:psCode", async function (req, res, next) {
    const {psCode} = req.params;

    const response = await getAvailableFromPsCode(psCode);
    res.send({
        data: response
    });
});

psRouter.post("/internal-search", async function (req, res, next) {
    const response = await getInternalSearchListing();
    res.send({
        data: response
    });
});
