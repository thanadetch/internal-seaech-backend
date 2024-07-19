"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToNumber = void 0;
const lodash_1 = __importDefault(require("lodash"));
const convertToNumber = (numberValue) => {
    if (lodash_1.default.isEmpty(numberValue))
        return undefined;
    return lodash_1.default.toNumber(lodash_1.default.isNumber(numberValue) ? numberValue : numberValue.replaceAll(/,/g, ""));
};
exports.convertToNumber = convertToNumber;
