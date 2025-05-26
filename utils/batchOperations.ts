import { GoogleSpreadsheetRow } from "google-spreadsheet";
import { SheetListing, Listing } from "../types";
import { sheet } from "../configs/spreadsheet";
import { mapperSheetObject } from "./sheetUtils";
import _ from "lodash";

export interface BatchOperation {
    type: 'update' | 'delete' | 'create';
    sku: string;
    postType: string;
    data?: Partial<Listing>;
}

export interface BatchResult {
    success: boolean;
    sku: string;
    postType: string;
    error?: string;
}

export class BatchOperationsManager {
    private static readonly MAX_BATCH_SIZE = 100;
    private static readonly CONCURRENT_OPERATIONS = 5;

    // Batch update multiple listings
    static async batchUpdate(operations: BatchOperation[]): Promise<BatchResult[]> {
        if (operations.length === 0) return [];

        // Split into smaller batches to avoid overwhelming the API
        const batches = this.chunkArray(operations, this.MAX_BATCH_SIZE);
        const results: BatchResult[] = [];

        for (const batch of batches) {
            const batchResults = await this.processBatch(batch);
            results.push(...batchResults);
        }

        return results;
    }

    // Process a single batch with concurrency control
    private static async processBatch(operations: BatchOperation[]): Promise<BatchResult[]> {
        const chunks = this.chunkArray(operations, this.CONCURRENT_OPERATIONS);
        const results: BatchResult[] = [];

        for (const chunk of chunks) {
            const chunkPromises = chunk.map(op => this.processOperation(op));
            const chunkResults = await Promise.allSettled(chunkPromises);
            
            chunkResults.forEach((result, index) => {
                const operation = chunk[index];
                if (result.status === 'fulfilled') {
                    results.push(result.value);
                } else {
                    results.push({
                        success: false,
                        sku: operation.sku,
                        postType: operation.postType,
                        error: result.reason?.message || 'Unknown error'
                    });
                }
            });
        }

        return results;
    }

    // Process a single operation
    private static async processOperation(operation: BatchOperation): Promise<BatchResult> {
        try {
            const key = `${operation.sku}_${operation.postType}`;
            
            switch (operation.type) {
                case 'update':
                    await this.updateSingleRow(operation.sku, operation.postType, operation.data!);
                    break;
                case 'delete':
                    await this.deleteSingleRow(operation.sku, operation.postType);
                    break;
                case 'create':
                    await this.createSingleRow(operation.data!);
                    break;
                default:
                    throw new Error(`Unknown operation type: ${operation.type}`);
            }

            return {
                success: true,
                sku: operation.sku,
                postType: operation.postType
            };
        } catch (error) {
            return {
                success: false,
                sku: operation.sku,
                postType: operation.postType,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    // Helper method to update a single row
    private static async updateSingleRow(sku: string, postType: string, data: Partial<Listing>): Promise<void> {
        const rows = await sheet.getRows<SheetListing>();
        const row = rows.find(r => r.get("SKU") === sku && r.get("PostType") === postType);
        
        if (!row) {
            throw new Error(`Row not found for SKU: ${sku}, PostType: ${postType}`);
        }

        // Only include defined values
        const updateData = {
            ...data,
            updateAvailability: new Date().toISOString(),
        };

        const payload = _.omitBy(mapperSheetObject(updateData as Listing), _.isNil) as SheetListing;

        row.assign(payload);
        await row.save();
    }

    // Helper method to delete a single row
    private static async deleteSingleRow(sku: string, postType: string): Promise<void> {
        const rows = await sheet.getRows<SheetListing>();
        const row = rows.find(r => r.get("SKU") === sku && r.get("PostType") === postType);
        
        if (row) {
            await row.delete();
        }
    }

    // Helper method to create a single row
    private static async createSingleRow(data: Partial<Listing>): Promise<void> {
        if (!data.sku || !data.postType) {
            throw new Error('SKU and PostType are required for creating a new listing');
        }
        const payload = mapperSheetObject(data as Listing) as SheetListing;
        await sheet.addRow(payload);
    }

    // Utility method to chunk arrays
    private static chunkArray<T>(array: T[], chunkSize: number): T[][] {
        const chunks: T[][] = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    }

    // Validate operations before processing
    static validateOperations(operations: BatchOperation[]): { valid: boolean; errors: string[] } {
        const errors: string[] = [];
        
        if (!Array.isArray(operations)) {
            errors.push('Operations must be an array');
            return { valid: false, errors };
        }
        
        if (operations.length === 0) {
            errors.push('Operations array cannot be empty');
            return { valid: false, errors };
        }
        
        if (operations.length > this.MAX_BATCH_SIZE) {
            errors.push(`Batch size cannot exceed ${this.MAX_BATCH_SIZE} operations`);
        }
        
        operations.forEach((op, index) => {
            if (!op || typeof op !== 'object') {
                errors.push(`Operation ${index}: Must be an object`);
                return;
            }
            
            if (!op.sku || typeof op.sku !== 'string') {
                errors.push(`Operation ${index}: SKU is required and must be a string`);
            }
            
            if (!op.postType || typeof op.postType !== 'string') {
                errors.push(`Operation ${index}: PostType is required and must be a string`);
            }
            
            if (op.type === 'update' && (!op.data || typeof op.data !== 'object')) {
                errors.push(`Operation ${index}: Data is required for update operations`);
            }
            
            if (op.type === 'create' && (!op.data || typeof op.data !== 'object')) {
                errors.push(`Operation ${index}: Data is required for create operations`);
            }
            
            if (!['update', 'delete', 'create'].includes(op.type)) {
                errors.push(`Operation ${index}: Invalid operation type '${op.type}'. Must be 'update', 'delete', or 'create'`);
            }
            
            // Validate required fields for create operations
            if (op.type === 'create' && op.data) {
                const requiredFields = ['sku', 'postType', 'titleTH', 'titleEN'];
                requiredFields.forEach(field => {
                    if (!op.data![field as keyof Listing]) {
                        errors.push(`Operation ${index}: Create operation missing required field '${field}'`);
                    }
                });
            }
        });

        return {
            valid: errors.length === 0,
            errors
        };
    }

    // Get statistics about batch operations
    static getBatchStats(operations: BatchOperation[]): {
        total: number;
        byType: Record<string, number>;
        estimatedTime: number;
    } {
        const byType = operations.reduce((acc, op) => {
            acc[op.type] = (acc[op.type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Rough estimation: 100ms per operation, with batching reducing overhead
        const estimatedTime = Math.ceil(operations.length / this.CONCURRENT_OPERATIONS) * 100;

        return {
            total: operations.length,
            byType,
            estimatedTime
        };
    }
}
