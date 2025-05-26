import express from "express";
import { ApplicationInitializer } from "../utils/initialization";
import { CacheManager } from "../utils/cacheManager";

export const healthRouter = express.Router();

// General health check
healthRouter.get("/", async function (req, res): Promise<void> {
    try {
        res.send({
            status: "ok",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage()
        });
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Performance health check
healthRouter.get("/performance", async function (req, res): Promise<void> {
    try {
        const healthStatus = ApplicationInitializer.getHealthStatus();
        
        res.send({
            ...healthStatus,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Cache health check
healthRouter.get("/cache", async function (req, res): Promise<void> {
    try {
        const cacheManager = CacheManager.getInstance();
        const stats = cacheManager.getStats();
        
        res.send({
            status: "ok",
            cache: {
                ...stats,
                memoryUsageMB: Math.round(stats.memoryUsage / 1024 / 1024 * 100) / 100
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
