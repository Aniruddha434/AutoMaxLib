import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'
import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss'
import hpp from 'hpp'
import { logSecurity } from '../config/logger.js'

/**
 * Security middleware configuration
 */

// Enhanced Helmet configuration
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: [
        "'self'",
        "https://*.clerk.dev",
        "https://*.clerk.com",
        "https://clerk.autogitpilot.com",
        "https://accounts.google.com",
        "https://apis.google.com"
      ],
      connectSrc: [
        "'self'",
        "https://api.clerk.dev",
        "https://*.clerk.dev",
        "https://*.clerk.com",
        "https://clerk.autogitpilot.com",
        "https://accounts.google.com",
        "https://apis.google.com",
        "wss:",
        "https:"
      ],
      frameSrc: [
        "'self'",
        "https://*.clerk.dev",
        "https://*.clerk.com",
        "https://accounts.google.com"
      ],
      formAction: ["'self'", "https://*.clerk.dev", "https://*.clerk.com", "https://accounts.google.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for Clerk compatibility
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true,
  referrerPolicy: { policy: 'same-origin' }
})

// Rate limiting configuration
export const createRateLimit = (windowMs = 15 * 60 * 1000, max = 100, message = 'Too many requests') => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: message,
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Prefer per-user limiting when authenticated; otherwise fall back to IP
    keyGenerator: (req) => (req.auth?.userId ? `user:${req.auth.userId}` : `ip:${req.ip}`),
    handler: (req, res) => {
      logSecurity('rate_limit_exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.path
      }, req)

      res.status(429).json({
        success: false,
        error: message,
        retryAfter: Math.ceil(windowMs / 1000)
      })
    }
  })
}

// Slow down middleware for brute force protection
export const createSlowDown = (windowMs = 15 * 60 * 1000, delayAfter = 5, maxDelayMs = 20000) => {
  return slowDown({
    windowMs,
    delayAfter,
    delayMs: 500,
    maxDelayMs,
    onLimitReached: (req, res) => {
      logSecurity('slow_down_triggered', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.path
      }, req)
    }
  })
}

// Specific rate limits for different endpoints
export const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  60, // allow more auth/sync requests per user to prevent accidental lockouts
  'Too many authentication attempts, please try again later'
)

export const apiRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests
  'Too many API requests, please try again later'
)

export const paymentRateLimit = createRateLimit(
  60 * 60 * 1000, // 1 hour
  10, // 10 payment attempts
  'Too many payment attempts, please try again later'
)

export const patternRateLimit = createRateLimit(
  60 * 60 * 1000, // 1 hour
  20, // 20 pattern generations
  'Too many pattern generation requests, please try again later'
)

// MongoDB injection protection
export const mongoSanitizeConfig = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    logSecurity('mongo_injection_attempt', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      sanitizedKey: key,
      endpoint: req.path
    }, req)
  }
})

// XSS protection middleware
export const xssProtection = (req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        const original = req.body[key]
        req.body[key] = xss(req.body[key])
        
        if (original !== req.body[key]) {
          logSecurity('xss_attempt', {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            field: key,
            endpoint: req.path
          }, req)
        }
      }
    }
  }
  next()
}

// HTTP Parameter Pollution protection
export const hppProtection = hpp({
  whitelist: ['tags', 'categories'] // Allow arrays for these parameters
})

// Security headers middleware
export const securityHeaders = (req, res, next) => {
  // Remove server information
  res.removeHeader('X-Powered-By')
  
  // Add custom security headers
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  
  // HSTS for production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }
  
  next()
}

// IP whitelist middleware (for admin endpoints)
export const createIPWhitelist = (allowedIPs = []) => {
  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress
    
    if (allowedIPs.length > 0 && !allowedIPs.includes(clientIP)) {
      logSecurity('ip_blocked', {
        ip: clientIP,
        userAgent: req.get('User-Agent'),
        endpoint: req.path
      }, req)
      
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      })
    }
    
    next()
  }
}

// Request size limiting
export const requestSizeLimit = (limit = '10mb') => {
  return (req, res, next) => {
    const contentLength = parseInt(req.get('Content-Length') || '0')
    const maxSize = parseSize(limit)
    
    if (contentLength > maxSize) {
      logSecurity('request_size_exceeded', {
        ip: req.ip,
        contentLength,
        maxSize,
        endpoint: req.path
      }, req)
      
      return res.status(413).json({
        success: false,
        error: 'Request entity too large'
      })
    }
    
    next()
  }
}

// Helper function to parse size strings
function parseSize(size) {
  const units = { b: 1, kb: 1024, mb: 1024 * 1024, gb: 1024 * 1024 * 1024 }
  const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)?$/)
  
  if (!match) return 0
  
  const value = parseFloat(match[1])
  const unit = match[2] || 'b'
  
  return value * units[unit]
}

// Suspicious activity detection
export const suspiciousActivityDetection = (req, res, next) => {
  // Skip security checks for legitimate API endpoints
  const whitelistedPaths = [
    '/api/payment/create-order',
    '/api/pattern/create',
    '/api/profile/readme/create'
  ]

  if (whitelistedPaths.some(path => req.path.includes(path))) {
    return next()
  }

  const suspiciousPatterns = [
    /\b(union|select|insert|delete|drop|create|alter)\b/i, // SQL injection
    /<script|javascript:|vbscript:|onload|onerror/i, // XSS
    /\.\.\//g, // Path traversal
    /__proto__|constructor|prototype/i, // Prototype pollution
  ]

  const checkString = JSON.stringify(req.body) + req.url + JSON.stringify(req.query)
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(checkString)) {
      logSecurity('suspicious_activity', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        pattern: pattern.toString(),
        endpoint: req.path,
        method: req.method
      }, req)
      
      return res.status(400).json({
        success: false,
        error: 'Invalid request'
      })
    }
  }
  
  next()
}

// CORS security enhancement
export const corsSecurityCheck = (req, res, next) => {
  const origin = req.get('Origin')
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean)
  
  if (origin && allowedOrigins.length > 0 && !allowedOrigins.includes(origin)) {
    logSecurity('cors_violation', {
      ip: req.ip,
      origin,
      allowedOrigins,
      endpoint: req.path
    }, req)
  }
  
  next()
}
