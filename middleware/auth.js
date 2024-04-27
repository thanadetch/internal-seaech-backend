const {admin} = require("../configs/firebase-config");

const checkAuth = async (req, res, next) => {
    return next();

    const token = req.headers.authorization?.split(' ')[1];
    try {
        const decodeValue = await admin.auth().verifyIdToken(token);
        if (decodeValue) {
            return next();
        }
        return res.status(403).json({status: 403, message: 'Unauthorized'});
    } catch (e) {
        return res.status(403).json({status: 403, message: 'Unauthorized'});
    }
}

module.exports = {
    checkAuth
}
