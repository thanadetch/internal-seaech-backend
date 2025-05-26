// Initialization utilities for performance optimizations
import { CacheManager } from './cacheManager';
import { PerformanceMonitor } from './performance';

export class ApplicationInitializer {
    private static cleanupInterval: NodeJS.Timeout | null = null;

    /**
     * Initialize all performance-related components
     */
    static async initialize(): Promise<void> {
        console.log('[Initialization] Starting performance optimizations...');
        
        // Start cache auto-cleanup
        this.startCacheCleanup();
        
        // Log initial performance settings
        this.logPerformanceSettings();
        
        console.log('[Initialization] Performance optimizations initialized successfully');
    }

    /**
     * Start automatic cache cleanup
     */
    private static startCacheCleanup(): void {
        const cacheManager = CacheManager.getInstance();
        
        // Clean up every 10 minutes
        this.cleanupInterval = cacheManager.startAutoCleanup(10 * 60 * 1000);
        
        console.log('[CacheManager] Auto-cleanup started (interval: 10 minutes)');
    }

    /**
     * Stop all background processes
     */
    static shutdown(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
            console.log('[Initialization] Cache cleanup stopped');
        }
    }

    /**
     * Log current performance settings
     */
    private static logPerformanceSettings(): void {
        const cacheManager = CacheManager.getInstance();
        const stats = cacheManager.getStats();
        
        console.log('[Performance] Current settings:');
        console.log(`  - Cache entries: ${stats.size}`);
        console.log(`  - Memory usage: ${Math.round(stats.memoryUsage / 1024)} KB`);
        console.log(`  - Performance monitoring: Enabled`);
        console.log(`  - Batch operations: Enabled (max 100 ops/batch)`);
    }

    /**
     * Warm up critical caches on application start
     */
    static async warmUpCaches(): Promise<void> {
        try {
            console.log('[Initialization] Warming up caches...');
            
            // Import here to avoid circular dependencies
            const { warmUpCache } = await import('../controllers/listings.controller');
            
            await PerformanceMonitor.measure('cache-warmup', async () => {
                await warmUpCache();
            });
            
            console.log('[Initialization] Cache warm-up completed');
        } catch (error) {
            console.warn('[Initialization] Cache warm-up failed:', error);
        }
    }

    /**
     * Get performance health status
     */
    static getHealthStatus(): {
        status: 'healthy' | 'warning' | 'error';
        details: {
            cache: object;
            uptime: number;
            memoryUsage: NodeJS.MemoryUsage;
        };
    } {
        const cacheManager = CacheManager.getInstance();
        const cacheStats = cacheManager.getStats();
        
        let status: 'healthy' | 'warning' | 'error' = 'healthy';
        
        // Check for potential issues
        if (cacheStats.memoryUsage > 50 * 1024 * 1024) { // 50MB
            status = 'warning';
        }
        
        if (cacheStats.size > 10000) {
            status = 'warning';
        }

        return {
            status,
            details: {
                cache: cacheStats,
                uptime: process.uptime(),
                memoryUsage: process.memoryUsage()
            }
        };
    }
}

// Graceful shutdown handling
process.on('SIGINT', () => {
    console.log('\n[Shutdown] Gracefully shutting down...');
    ApplicationInitializer.shutdown();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n[Shutdown] Gracefully shutting down...');
    ApplicationInitializer.shutdown();
    process.exit(0);
});
