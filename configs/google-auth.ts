import {google} from "googleapis";
import {googleClientEmail, googlePrivateKey} from "./environment";

const auth = new google.auth.JWT({
    key: googlePrivateKey,
    email: googleClientEmail,
    scopes: ["https://www.googleapis.com/auth/drive"],
});

export const drive = google.drive({version: "v3", auth: auth});
