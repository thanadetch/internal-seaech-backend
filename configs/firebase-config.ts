import admin from "firebase-admin";
import {
    firebaseProjectId,
    firebasePrivateKey,
    firebaseClientEmail,
} from "./environment";

admin.initializeApp({
    credential: admin.credential.cert({
        clientEmail: firebaseClientEmail,
        privateKey: firebasePrivateKey,
        projectId: firebaseProjectId,
    })
});

export { admin };