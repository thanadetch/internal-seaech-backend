#!/usr/bin/env node

/**
 * Performance Testing Script
 * 
 * This script tests the performance improvements of the optimized listings controller
 * Run with: node performance-test.js
 */

const axios = require('axios');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const AUTH_TOKEN = process.env.AUTH_TOKEN || '';

// Test configuration
const TESTS = {
    getAllListings: {
        method: 'GET',
        url: '/api/listings/all',
        iterations: 10
    },
    searchListings: {
        method: 'GET',
        url: '/api/listings/search?propertyType=condo&minPrice=10000',
        iterations: 5
    },
    cacheStats: {
        method: 'GET',
        url: '/api/listings/cache/stats',
        iterations: 3
    },
    healthCheck: {
        method: 'GET',
        url: '/api/health/performance',
        iterations: 3
    }
};

async function runTest(testName, config) {
    console.log(`\n🧪 Running ${testName} test (${config.iterations} iterations)...`);
    
    const times = [];
    let errors = 0;
    
    for (let i = 0; i < config.iterations; i++) {
        try {
            const startTime = Date.now();
            
            const response = await axios({
                method: config.method,
                url: `${BASE_URL}${config.url}`,
                headers: AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {},
                timeout: 30000
            });
            
            const endTime = Date.now();
            const duration = endTime - startTime;
            times.push(duration);
            
            console.log(`  Iteration ${i + 1}: ${duration}ms (${response.status})`);
            
        } catch (error) {
            errors++;
            console.log(`  Iteration ${i + 1}: ERROR - ${error.message}`);
        }
        
        // Small delay between requests
        if (i < config.iterations - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    if (times.length > 0) {
        const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
        const min = Math.min(...times);
        const max = Math.max(...times);
        
        console.log(`\n📊 ${testName} Results:`);
        console.log(`  Average: ${avg}ms`);
        console.log(`  Min: ${min}ms`);
        console.log(`  Max: ${max}ms`);
        console.log(`  Success Rate: ${((times.length / config.iterations) * 100).toFixed(1)}%`);
        
        return { avg, min, max, successRate: times.length / config.iterations };
    } else {
        console.log(`❌ ${testName}: All requests failed`);
        return null;
    }
}

async function testCachePerformance() {
    console.log(`\n🔄 Testing cache performance...`);
    
    try {
        // First request (cache miss)
        console.log('Making first request (cache miss)...');
        const start1 = Date.now();
        await axios.get(`${BASE_URL}/api/listings/all`);
        const time1 = Date.now() - start1;
        
        // Second request (cache hit)
        console.log('Making second request (cache hit)...');
        const start2 = Date.now();
        await axios.get(`${BASE_URL}/api/listings/all`);
        const time2 = Date.now() - start2;
        
        const improvement = ((time1 - time2) / time1 * 100).toFixed(1);
        
        console.log(`\n📈 Cache Performance:`);
        console.log(`  Cache Miss: ${time1}ms`);
        console.log(`  Cache Hit: ${time2}ms`);
        console.log(`  Improvement: ${improvement}%`);
        
        return { cacheMiss: time1, cacheHit: time2, improvement };
        
    } catch (error) {
        console.log(`❌ Cache test failed: ${error.message}`);
        return null;
    }
}

async function testBatchOperations() {
    if (!AUTH_TOKEN) {
        console.log('\n⚠️ Skipping batch operations test (no auth token)');
        return null;
    }
    
    console.log(`\n🔄 Testing batch operations...`);
    
    try {
        const operations = [
            {
                type: 'update',
                sku: 'TEST001',
                postType: 'rent',
                data: {
                    price: 15000,
                    availability: 'available'
                }
            }
        ];
        
        const startTime = Date.now();
        const response = await axios.post(`${BASE_URL}/api/listings/batch`, {
            operations
        }, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
        });
        const duration = Date.now() - startTime;
        
        console.log(`\n📊 Batch Operations:`);
        console.log(`  Duration: ${duration}ms`);
        console.log(`  Status: ${response.status}`);
        console.log(`  Operations: ${operations.length}`);
        
        return { duration, status: response.status };
        
    } catch (error) {
        console.log(`❌ Batch operations test failed: ${error.message}`);
        return null;
    }
}

async function main() {
    console.log('🚀 Performance Testing Suite');
    console.log(`Testing URL: ${BASE_URL}`);
    console.log(`Auth Token: ${AUTH_TOKEN ? 'Provided' : 'Not provided'}`);
    console.log('='.repeat(50));
    
    const results = {};
    
    // Run basic performance tests
    for (const [testName, config] of Object.entries(TESTS)) {
        results[testName] = await runTest(testName, config);
    }
    
    // Test cache performance
    results.cachePerformance = await testCachePerformance();
    
    // Test batch operations (if auth token provided)
    results.batchOperations = await testBatchOperations();
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📋 PERFORMANCE SUMMARY');
    console.log('='.repeat(50));
    
    for (const [testName, result] of Object.entries(results)) {
        if (result) {
            if (result.avg) {
                console.log(`${testName}: ${result.avg}ms avg (${(result.successRate * 100).toFixed(1)}% success)`);
            } else if (result.duration) {
                console.log(`${testName}: ${result.duration}ms`);
            } else if (result.improvement) {
                console.log(`${testName}: ${result.improvement}% faster with cache`);
            }
        } else {
            console.log(`${testName}: FAILED`);
        }
    }
    
    console.log('\n✅ Performance testing completed!');
    
    // Performance recommendations
    if (results.getAllListings && results.getAllListings.avg > 1000) {
        console.log('\n⚠️  Warning: getAllListings taking >1s. Consider cache warmup.');
    }
    
    if (results.cachePerformance && parseFloat(results.cachePerformance.improvement) < 50) {
        console.log('\n⚠️  Warning: Cache improvement <50%. Check cache configuration.');
    }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error('\n❌ Uncaught Exception:', error.message);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    console.error('\n❌ Unhandled Rejection:', error.message);
    process.exit(1);
});

// Run the tests
main().catch(error => {
    console.error('\n❌ Test suite failed:', error.message);
    process.exit(1);
});
