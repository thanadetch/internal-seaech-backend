"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const firebase_config_1 = require("../configs/firebase-config");
const checkAuth = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || '';
    try {
        const decodeValue = await firebase_config_1.admin.auth().verifyIdToken(token);
        if (decodeValue) {
            return next();
        }
        return res.status(403).json({ status: 403, message: 'Unauthorized' });
    }
    catch (e) {
        return res.status(403).json({ status: 403, message: 'Unauthorized' });
    }
};
exports.checkAuth = checkAuth;
