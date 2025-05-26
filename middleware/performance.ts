import { Request, Response, NextFunction } from 'express';

// Performance monitoring middleware
export const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    
    // Override res.json to capture when response is sent
    const originalJson = res.json;
    res.json = function(body: any) {
        const duration = Date.now() - startTime;
        
        // Add performance headers
        res.set('X-Response-Time', `${duration}ms`);
        res.set('X-Request-Start', startTime.toString());
        
        return originalJson.call(this, body);
    };
    
    next();
};

// Rate limiting middleware for expensive operations
export const rateLimitMiddleware = (
    maxRequests: number = 10,
    windowMs: number = 60000 // 1 minute
) => {
    const requests = new Map<string, { count: number; resetTime: number }>();
    
    return (req: Request, res: Response, next: NextFunction): void => {
        const clientId = req.ip || 'unknown';
        const now = Date.now();
        
        let clientRequests = requests.get(clientId);
        
        if (!clientRequests || now > clientRequests.resetTime) {
            clientRequests = {
                count: 1,
                resetTime: now + windowMs
            };
        } else {
            clientRequests.count++;
        }
        
        requests.set(clientId, clientRequests);
        
        if (clientRequests.count > maxRequests) {
            res.status(429).json({
                error: 'Too many requests',
                retryAfter: Math.ceil((clientRequests.resetTime - now) / 1000)
            });
            return;
        }
        
        // Cleanup expired entries periodically
        if (Math.random() < 0.1) { // 10% chance
            for (const [key, value] of requests.entries()) {
                if (now > value.resetTime) {
                    requests.delete(key);
                }
            }
        }
        
        next();
    };
};

// Cache control middleware
export const cacheControlMiddleware = (maxAge: number = 300) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Only cache GET requests
        if (req.method === 'GET') {
            res.set('Cache-Control', `public, max-age=${maxAge}`);
            res.set('ETag', `"${Date.now()}"`);
        }
        next();
    };
};

// Request validation middleware
export const validateRequest = (schema: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: 'Validation error',
                details: error.details.map((detail: any) => detail.message)
            });
        }
        next();
    };
};

// Compression middleware for large responses
export const compressionMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json;
    
    res.json = function(body: any) {
        const jsonString = JSON.stringify(body);
        
        // Add content length header
        res.set('Content-Length', Buffer.byteLength(jsonString).toString());
        
        // Add compression info if response is large
        if (jsonString.length > 1000) {
            res.set('X-Large-Response', 'true');
            res.set('X-Uncompressed-Size', jsonString.length.toString());
        }
        
        return originalJson.call(this, body);
    };
    
    next();
};
