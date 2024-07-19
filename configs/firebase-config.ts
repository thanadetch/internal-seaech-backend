import admin from "firebase-admin";

import {
    firebaseType,
    firebaseProjectId,
    firebasePrivateKeyId,
    firebasePrivateKey,
    firebaseClientEmail,
    firebaseClientId,
    firebaseAuthUri,
    firebaseTokenUri,
    firebaseAuthProviderX509CertUrl,
    firebaseClientX509CertUrl,
    firebaseUniverseDomain
} from "./environment";

admin.initializeApp({
    credential: admin.credential.cert({
        clientEmail: firebaseClientEmail,
        privateKey: firebasePrivateKey,
        projectId: firebaseProjectId,
    }),
});

export { admin };
