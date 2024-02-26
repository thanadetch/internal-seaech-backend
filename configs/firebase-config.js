const admin = require("firebase-admin");

const serviceAccount = require("./internal-search-dev-firebase-adminsdk-lt55k-b93deb5292.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = {
    admin,
    serviceAccount
}
