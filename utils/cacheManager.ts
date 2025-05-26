import { GoogleSpreadsheetRow } from "google-spreadsheet";
import { SheetListing } from "../types";

export interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number;
}

export class CacheManager {
    private static instance: CacheManager;
    private cache: Map<string, CacheEntry<any>> = new Map();
    private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

    private constructor() {}

    static getInstance(): CacheManager {
        if (!CacheManager.instance) {
            CacheManager.instance = new CacheManager();
        }
        return CacheManager.instance;
    }

    set<T>(key: string, data: T, ttl?: number): void {
        const entry: CacheEntry<T> = {
            data,
            timestamp: Date.now(),
            ttl: ttl || this.DEFAULT_TTL
        };
        this.cache.set(key, entry);
    }

    get<T>(key: string): T | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        const isExpired = Date.now() - entry.timestamp > entry.ttl;
        if (isExpired) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    has(key: string): boolean {
        const entry = this.cache.get(key);
        if (!entry) return false;

        const isExpired = Date.now() - entry.timestamp > entry.ttl;
        if (isExpired) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    // Clean up expired entries
    cleanup(): number {
        const now = Date.now();
        let deletedCount = 0;

        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > entry.ttl) {
                this.cache.delete(key);
                deletedCount++;
            }
        }

        return deletedCount;
    }

    // Get cache statistics
    getStats(): {
        size: number;
        keys: string[];
        memoryUsage: number;
    } {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
            memoryUsage: JSON.stringify(Array.from(this.cache.entries())).length
        };
    }

    // Start automatic cleanup
    startAutoCleanup(intervalMs: number = 10 * 60 * 1000): NodeJS.Timeout {
        return setInterval(() => {
            const deletedCount = this.cleanup();
            if (deletedCount > 0) {
                console.log(`[CacheManager] Cleaned up ${deletedCount} expired entries`);
            }
        }, intervalMs);
    }
}
