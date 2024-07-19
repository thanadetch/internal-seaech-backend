"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.psRouter = void 0;
const express_1 = __importDefault(require("express"));
const ps_controller_1 = require("../controllers/ps.controller");
exports.psRouter = express_1.default.Router(); /* GET users listing. */
exports.psRouter.get("/available/:psCode", async function (req, res, next) {
    const { psCode } = req.params;
    const response = await (0, ps_controller_1.getAvailableFromPsCode)(psCode);
    res.send({
        data: response
    });
});
exports.psRouter.post("/internal-search/", async function (req, res, next) {
    const response = await (0, ps_controller_1.getInternalSearchListing)();
    res.send({
        data: response
    });
});
