const admin = require("firebase-admin");

const {
    firebaseType, firebaseProjectId, firebasePrivateKeyId, firebasePrivateKey, firebaseClientEmail, firebaseClientId,
    firebaseAuthUri, firebaseTokenUri, firebaseAuthProviderX509CertUrl, firebaseClientX509CertUrl,
    firebaseUniverseDomain
} = require("./environment");

admin.initializeApp({
    credential: admin.credential.cert({
        type: firebaseType,
        project_id: firebaseProjectId,
        private_key_id: firebasePrivateKeyId,
        private_key: firebasePrivateKey,
        client_email: firebaseClientEmail,
        client_id: firebaseClientId,
        auth_uri: firebaseAuthUri,
        token_uri: firebaseTokenUri,
        auth_provider_x_509_cert_url: firebaseAuthProviderX509CertUrl,
        client_x_509_cert_url: firebaseClientX509CertUrl,
        universe_domain: firebaseUniverseDomain
    })
});

module.exports = {
    admin
}
