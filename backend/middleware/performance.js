import { performance } from 'perf_hooks'
import logger, { logPerformance } from '../config/logger.js'
import cacheService from '../services/cacheService.js'

/**
 * Performance monitoring middleware
 */

// Request timing middleware
export const requestTiming = (req, res, next) => {
  const start = performance.now()
  
  // Add timing data to request
  req.timing = {
    start,
    marks: {}
  }
  
  // Mark function for adding timing points
  req.mark = (name) => {
    req.timing.marks[name] = performance.now() - start
  }
  
  // Override res.end to capture total time
  const originalEnd = res.end
  res.end = function(...args) {
    const duration = performance.now() - start
    
    // Add performance headers
    res.setHeader('X-Response-Time', `${duration.toFixed(2)}ms`)
    res.setHeader('X-Process-Time', `${process.uptime()}`)
    
    // Log slow requests
    if (duration > 1000) { // Log requests slower than 1 second
      logPerformance('slow_request', duration, {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        marks: req.timing.marks
      })
    }
    
    // Call original end
    originalEnd.apply(this, args)
  }
  
  next()
}

// Database query performance monitoring
export const dbQueryMonitoring = () => {
  const mongoose = require('mongoose')
  
  // Monitor slow queries
  mongoose.set('debug', (collectionName, method, query, doc, options) => {
    const start = performance.now()
    
    // Override the callback to measure time
    const originalCallback = options?.callback
    if (originalCallback) {
      options.callback = function(...args) {
        const duration = performance.now() - start
        
        if (duration > 100) { // Log queries slower than 100ms
          logPerformance('slow_query', duration, {
            collection: collectionName,
            method,
            query: JSON.stringify(query)
          })
        }
        
        originalCallback.apply(this, args)
      }
    }
  })
}

// Memory usage monitoring
export const memoryMonitoring = (req, res, next) => {
  const memUsage = process.memoryUsage()
  
  // Add memory info to response headers in development
  if (process.env.NODE_ENV === 'development') {
    res.setHeader('X-Memory-Usage', `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`)
    res.setHeader('X-Memory-Total', `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`)
  }
  
  // Log high memory usage
  const heapUsedMB = memUsage.heapUsed / 1024 / 1024
  if (heapUsedMB > 500) { // Log if using more than 500MB
    logger.warn('High memory usage detected', {
      heapUsed: `${heapUsedMB.toFixed(2)}MB`,
      heapTotal: `${(memUsage.heapTotal / 1024 / 1024).toFixed(2)}MB`,
      external: `${(memUsage.external / 1024 / 1024).toFixed(2)}MB`,
      rss: `${(memUsage.rss / 1024 / 1024).toFixed(2)}MB`
    })
  }
  
  next()
}

// Cache performance middleware
export const cachePerformance = (req, res, next) => {
  const originalGet = cacheService.get
  const originalSet = cacheService.set
  
  // Monitor cache get operations
  cacheService.get = async function(key) {
    const start = performance.now()
    const result = await originalGet.call(this, key)
    const duration = performance.now() - start
    
    if (duration > 50) { // Log slow cache operations
      logPerformance('slow_cache_get', duration, { key })
    }
    
    return result
  }
  
  // Monitor cache set operations
  cacheService.set = async function(key, value, ttl) {
    const start = performance.now()
    const result = await originalSet.call(this, key, value, ttl)
    const duration = performance.now() - start
    
    if (duration > 50) { // Log slow cache operations
      logPerformance('slow_cache_set', duration, { key })
    }
    
    return result
  }
  
  next()
}

// API response compression monitoring
export const compressionMonitoring = (req, res, next) => {
  const originalWrite = res.write
  const originalEnd = res.end
  let responseSize = 0
  
  res.write = function(chunk, encoding) {
    if (chunk) {
      responseSize += Buffer.isBuffer(chunk) ? chunk.length : Buffer.byteLength(chunk, encoding)
    }
    return originalWrite.call(this, chunk, encoding)
  }
  
  res.end = function(chunk, encoding) {
    if (chunk) {
      responseSize += Buffer.isBuffer(chunk) ? chunk.length : Buffer.byteLength(chunk, encoding)
    }
    
    // Add response size header
    res.setHeader('X-Response-Size', responseSize)
    
    // Log large responses
    if (responseSize > 1024 * 1024) { // Log responses larger than 1MB
      logger.warn('Large response detected', {
        url: req.url,
        method: req.method,
        size: `${(responseSize / 1024 / 1024).toFixed(2)}MB`,
        contentType: res.getHeader('Content-Type')
      })
    }
    
    return originalEnd.call(this, chunk, encoding)
  }
  
  next()
}

// CPU usage monitoring
export const cpuMonitoring = () => {
  let lastCpuUsage = process.cpuUsage()
  
  setInterval(() => {
    const currentCpuUsage = process.cpuUsage(lastCpuUsage)
    const cpuPercent = (currentCpuUsage.user + currentCpuUsage.system) / 1000000 // Convert to seconds
    
    if (cpuPercent > 0.8) { // Log high CPU usage (80%+)
      logger.warn('High CPU usage detected', {
        cpuPercent: `${(cpuPercent * 100).toFixed(2)}%`,
        user: currentCpuUsage.user,
        system: currentCpuUsage.system
      })
    }
    
    lastCpuUsage = process.cpuUsage()
  }, 30000) // Check every 30 seconds
}

// Request rate monitoring
export const requestRateMonitoring = () => {
  const requestCounts = new Map()
  
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress
    const now = Date.now()
    const windowStart = now - 60000 // 1 minute window
    
    // Clean old entries
    for (const [key, timestamps] of requestCounts.entries()) {
      requestCounts.set(key, timestamps.filter(time => time > windowStart))
      if (requestCounts.get(key).length === 0) {
        requestCounts.delete(key)
      }
    }
    
    // Add current request
    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, [])
    }
    requestCounts.get(ip).push(now)
    
    // Check for high request rate
    const requestCount = requestCounts.get(ip).length
    if (requestCount > 100) { // More than 100 requests per minute
      logger.warn('High request rate detected', {
        ip,
        requestCount,
        userAgent: req.get('User-Agent'),
        url: req.url
      })
    }
    
    next()
  }
}

// Performance metrics collection
export const collectMetrics = () => {
  const metrics = {
    requests: {
      total: 0,
      byStatus: {},
      byMethod: {},
      averageResponseTime: 0,
      slowRequests: 0
    },
    memory: {
      current: 0,
      peak: 0,
      gcCount: 0
    },
    cpu: {
      usage: 0,
      loadAverage: []
    },
    cache: {
      hits: 0,
      misses: 0,
      hitRate: 0
    }
  }
  
  return (req, res, next) => {
    const start = performance.now()
    
    // Increment request count
    metrics.requests.total++
    
    // Track by method
    metrics.requests.byMethod[req.method] = (metrics.requests.byMethod[req.method] || 0) + 1
    
    res.on('finish', () => {
      const duration = performance.now() - start
      
      // Track by status
      metrics.requests.byStatus[res.statusCode] = (metrics.requests.byStatus[res.statusCode] || 0) + 1
      
      // Update average response time
      metrics.requests.averageResponseTime = 
        (metrics.requests.averageResponseTime * (metrics.requests.total - 1) + duration) / metrics.requests.total
      
      // Track slow requests
      if (duration > 1000) {
        metrics.requests.slowRequests++
      }
      
      // Update memory metrics
      const memUsage = process.memoryUsage()
      metrics.memory.current = memUsage.heapUsed
      metrics.memory.peak = Math.max(metrics.memory.peak, memUsage.heapUsed)
      
      // Update CPU metrics
      const loadAvg = require('os').loadavg()
      metrics.cpu.loadAverage = loadAvg
      
      // Store metrics in cache for monitoring endpoint
      cacheService.set('performance_metrics', metrics, 300) // 5 minutes TTL
    })
    
    next()
  }
}

// Initialize performance monitoring
export const initializePerformanceMonitoring = () => {
  // Start CPU monitoring
  cpuMonitoring()
  
  // Start database query monitoring
  if (process.env.MONGODB_MONITOR_COMMANDS === 'true') {
    dbQueryMonitoring()
  }
  
  logger.info('Performance monitoring initialized')
}
