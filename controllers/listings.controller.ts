import {drive} from "../configs/google-auth";
import {imagesRootSpreadsheetId} from "../configs/environment";
import _ from "lodash";
import {mapperListingObject, mapperLvIdObject, mapperSheetObject} from "../utils/sheetUtils";
import {Listing, SheetListing} from "../types";
import {sheet} from "../configs/spreadsheet";
import {GoogleSpreadsheetRow} from "google-spreadsheet";
import {CacheManager} from "../utils/cacheManager";
import {BatchOperationsManager, BatchOperation} from "../utils/batchOperations";

// Cache keys
const CACHE_KEYS = {
    ALL_ROWS: 'all_rows',
    ROW_MAP: 'row_map',
    FOLDER_PREFIX: 'folder_'
} as const;

const cacheManager = CacheManager.getInstance();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL
const FOLDER_CACHE_TTL = 30 * 60 * 1000; // 30 minutes cache for folders

// Helper function to get rows with caching and optimized fetching
const getCachedRows = async (): Promise<{
    rows: GoogleSpreadsheetRow<SheetListing>[];
    rowMap: Map<string, GoogleSpreadsheetRow<SheetListing>>;
}> => {
    const cachedRows = cacheManager.get<GoogleSpreadsheetRow<SheetListing>[]>(CACHE_KEYS.ALL_ROWS);
    const cachedRowMap = cacheManager.get<Map<string, GoogleSpreadsheetRow<SheetListing>>>(CACHE_KEYS.ROW_MAP);

    if (cachedRows && cachedRowMap) {
        return { rows: cachedRows, rowMap: cachedRowMap };
    }

    const limit = 2000;
    const totalRows = sheet.rowCount;
    const numberOfChunks = Math.ceil(totalRows / limit);

    // Use Promise.all for parallel fetching
    const promises = Array.from({length: numberOfChunks}, (_, i) => 
        sheet.getRows<SheetListing>({limit, offset: i * limit})
    );
    
    const rowsChunks = await Promise.all(promises);
    const rows = rowsChunks.flat();
    
    // Create optimized map for O(1) lookups
    const rowMap = new Map<string, GoogleSpreadsheetRow<SheetListing>>();
    rows.forEach(row => {
        const key = `${row.get("SKU")}_${row.get("PostType")}`;
        rowMap.set(key, row);
    });

    // Update cache
    cacheManager.set(CACHE_KEYS.ALL_ROWS, rows, CACHE_TTL);
    cacheManager.set(CACHE_KEYS.ROW_MAP, rowMap, CACHE_TTL);

    return { rows, rowMap };
};

// Optimized function to find a specific row without fetching all data
const findRowBySku = async (sku: string, postType: string): Promise<GoogleSpreadsheetRow<SheetListing> | null> => {
    // First check cache
    const cachedRowMap = cacheManager.get<Map<string, GoogleSpreadsheetRow<SheetListing>>>(CACHE_KEYS.ROW_MAP);
    if (cachedRowMap) {
        return cachedRowMap.get(`${sku}_${postType}`) || null;
    }

    // If not in cache, fetch all rows and return the specific one
    const { rowMap } = await getCachedRows();
    return rowMap.get(`${sku}_${postType}`) || null;
};

export const getAllListings = async (): Promise<Listing[]> => {
    const { rows } = await getCachedRows();
    
    // Use more efficient mapping without creating intermediate arrays
    const listings: Listing[] = new Array(rows.length);
    for (let i = 0; i < rows.length; i++) {
        listings[i] = mapperListingObject(rows[i]);
    }
    
    return listings;
};

export const getAllRows = async (): Promise<GoogleSpreadsheetRow<SheetListing>[]> => {
    const { rows } = await getCachedRows();
    return rows;
};

export const getAllLvId = async () => {
    const { rows } = await getCachedRows();
    
    // Use more efficient mapping without creating intermediate arrays
    const lvIds = new Array(rows.length);
    for (let i = 0; i < rows.length; i++) {
        lvIds[i] = mapperLvIdObject(rows[i]);
    }
    
    return lvIds;
};

// Cache for folder lookups to avoid repeated API calls
export const getImagesFromSku = async (sku: string, limit?: number) => {
    // Check folder cache first
    const cacheKey = `${CACHE_KEYS.FOLDER_PREFIX}${sku}`;
    const cachedFolderId = cacheManager.get<string | null>(cacheKey);
    
    let folderId: string | null = null;
    
    if (cachedFolderId !== null && cachedFolderId !== undefined) {
        folderId = cachedFolderId;
    } else {
        const response = await drive.files.list({
            q: `'${imagesRootSpreadsheetId}' in parents and mimeType='application/vnd.google-apps.folder' and name='${sku}'`,
            pageSize: 1, // We only need the first match
            fields: 'files(id)' // Only fetch the id field to reduce data transfer
        });
        
        folderId = response.data.files && response.data.files.length > 0 ? response.data.files[0].id || null : null;
        
        // Cache the result
        cacheManager.set(cacheKey, folderId, FOLDER_CACHE_TTL);
    }
    
    if (!folderId) throw new Error("FolderId not found");
    
    return await drive.files.list({
        q: `'${folderId}' in parents`,
        pageSize: limit,
        orderBy: "name",
        fields: 'files(id,name,mimeType,size)' // Only fetch necessary fields
    });
};

export const updateListing = async (postType: string, sku: string, listingObj: Listing): Promise<Listing> => {
    // Use optimized row finding instead of getting all rows
    const row = await findRowBySku(sku, postType);
    if (!row) throw new Error("Row not found");
    
    const tel = listingObj.tel || row.get("Tel.");
    const whatsapp = listingObj.whatsapp || row.get("Whatsapp");
    const areaLV = row.get("Area LV");

    const payload = _.omitBy(mapperSheetObject({
        ...listingObj,
        areaLV,
        updateAvailability: new Date().toISOString(),
        tel: tel ? ("'" + tel) : tel,
        whatsapp: whatsapp ? ("'" + whatsapp) : whatsapp
    }), _.isNil) as SheetListing;
    
    row.assign(payload);
    await row.save();
    
    // Invalidate cache since data has changed
    invalidateRowsCache();
    
    return mapperListingObject(row);
};

export const deleteListing = async (postType: string, sku: string): Promise<{status: boolean}> => {
    // Use optimized row finding instead of getting all rows
    const row = await findRowBySku(sku, postType);
    
    if (row) {
        await row.delete();
        // Invalidate cache since data has changed
        invalidateRowsCache();
    }
    
    return {status: true};
};

// Helper function to invalidate rows cache
const invalidateRowsCache = (): void => {
    cacheManager.delete(CACHE_KEYS.ALL_ROWS);
    cacheManager.delete(CACHE_KEYS.ROW_MAP);
};

// Helper function to clear cache manually if needed
export const clearCache = (): void => {
    cacheManager.clear();
};

// Helper function to warm up cache
export const warmUpCache = async (): Promise<void> => {
    await getCachedRows();
};

// Batch operations
export const batchUpdateListings = async (operations: BatchOperation[]): Promise<any> => {
    const validation = BatchOperationsManager.validateOperations(operations);
    if (!validation.valid) {
        throw new Error(`Invalid operations: ${validation.errors.join(', ')}`);
    }

    const results = await BatchOperationsManager.batchUpdate(operations);
    
    // Invalidate cache after batch operations
    invalidateRowsCache();
    
    return results;
};

// Get cache statistics
export const getCacheStats = () => {
    return cacheManager.getStats();
};

// Search listings by criteria (optimized)
export const searchListings = async (criteria: {
    propertyType?: string;
    postType?: string;
    minPrice?: number;
    maxPrice?: number;
    areaLP?: string;
    bedroom?: string;
}): Promise<Listing[]> => {
    const { rows } = await getCachedRows();
    
    // Use efficient filtering without creating intermediate arrays
    const results: Listing[] = [];
    
    for (const row of rows) {
        let matches = true;
        
        if (criteria.propertyType && row.get("Property Type") !== criteria.propertyType) {
            matches = false;
        } else if (criteria.postType && row.get("PostType") !== criteria.postType) {
            matches = false;
        } else if (criteria.minPrice && parseFloat(row.get("Price") || "0") < criteria.minPrice) {
            matches = false;
        } else if (criteria.maxPrice && parseFloat(row.get("Price") || "0") > criteria.maxPrice) {
            matches = false;
        } else if (criteria.areaLP && !row.get("Area LP")?.includes(criteria.areaLP)) {
            matches = false;
        } else if (criteria.bedroom && row.get("Bedroom") !== criteria.bedroom) {
            matches = false;
        }
        
        if (matches) {
            results.push(mapperListingObject(row));
        }
    }
    
    return results;
};
