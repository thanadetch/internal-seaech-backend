require("dotenv").config();

import express from "express";
import logger from "morgan";
import cors from "cors";
import {checkAuth} from "./middleware/auth";
import {port} from "./configs/environment";
import {initializeSpreadsheet} from "./configs/spreadsheet";
import {listingsRouter, healthRouter} from "./routes";
import {ApplicationInitializer} from "./utils/initialization";

const app = express();

// Middleware setup
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Health check route
app.get("/", (req, res) => {
    res.send({status: "ok"});
});

// Authentication middleware
app.use((req, res, next) => {
    checkAuth(req, res, next);
});

// API routes
app.use("/api/listings", listingsRouter);
app.use("/api/health", healthRouter);

initializeSpreadsheet().then(async () => {
    // Initialize performance optimizations
    await ApplicationInitializer.initialize();
    
    // Start the server
    app.listen(port, async () => {
        console.log(`App listening on port ${port}`);
        
        // Warm up caches after server starts
        await ApplicationInitializer.warmUpCaches();
    });
});
