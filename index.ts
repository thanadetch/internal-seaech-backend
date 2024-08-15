require("dotenv").config();

import {checkAuth} from "./middleware/auth";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import {port} from "./configs/environment";
import {listingsRouter, psRouter} from "./routes";

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// Health check route
app.get("/", (req, res) => {
    res.send({ status: "ok" });
});
app.use(checkAuth);

app.use("/api/listings", listingsRouter);
app.use("/api/ps", psRouter);

app.listen(port, async () => {
    console.log(`App listening on port ${port}`);
});
