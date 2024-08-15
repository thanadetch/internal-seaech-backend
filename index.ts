require("dotenv").config();

import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import { checkAuth } from "./middleware/auth";
import { port } from "./configs/environment";
import { listingsRouter, psRouter } from "./routes";

const app = express();

// Middleware setup
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Health check route
app.get("/", (req, res) => {
    res.send({ status: "ok" });
});

// Authentication middleware
app.use(checkAuth);

// API routes
app.use("/api/listings", listingsRouter);
app.use("/api/ps", psRouter);

// Start the server
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
