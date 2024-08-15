import { Request, Response, NextFunction } from "express";
import { admin } from "../configs/firebase-config";

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1] || '';
    try {
        const decodeValue = await admin.auth().verifyIdToken(token);
        if (decodeValue) {
            return next();
        }
        return res.status(403).json({ status: 403, message: 'Unauthorized' });
    } catch (e) {
        return res.status(403).json({ status: 403, message: 'Unauthorized' });
    }
};
