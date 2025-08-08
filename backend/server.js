// Load and validate environment variables FIRST
import { getConfig, printEnvironmentStatus } from './config/envValidation.js'

// Print environment status
printEnvironmentStatus()

// Get validated configuration
const config = getConfig()

import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import compression from 'compression'
import {
  helmetConfig,
  apiRateLimit,
  authRateLimit,
  paymentRateLimit,
  patternRateLimit,
  mongoSanitizeConfig,
  xssProtection,
  hppProtection,
  securityHeaders,
  suspiciousActivityDetection,
  corsSecurityCheck
} from './middleware/security.js'
import { connectDB } from './config/database.js'
import { initializeScheduler } from './services/schedulerService.js'
import { errorHandler } from './middleware/errorHandler.js'
import { enhancedClerkMiddleware } from './middleware/clerkMiddleware.js'
import logger, { morganStream, logRequest } from './config/logger.js'
import monitoringService from './services/monitoringService.js'
import User from './models/User.js'
import mongoose from 'mongoose'

// Import routes
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import githubRoutes from './routes/github.js'
import commitRoutes from './routes/commit.js'
import paymentRoutes from './routes/payment.js'
import webhookRoutes from './routes/webhook.js'
import patternRoutes from './routes/pattern.js'
import profileRoutes from './routes/profile.js'
import repositoryRoutes from './routes/repository.js'
import schedulerRoutes from './routes/scheduler.js'
import monitoringRoutes from './routes/monitoring.js'

const app = express()
const PORT = process.env.PORT || 5000

// Trust proxy for production (behind load balancer/reverse proxy)
// Enable automatically in production unless explicitly disabled
if (process.env.NODE_ENV === 'production' || process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1)
}

// CORS configuration (must be before security middleware)
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3000',
  // Production domains
  'https://www.automaxlib.online',
  'https://automaxlib.online'
]

// Add additional origins from ALLOWED_ORIGINS environment variable
if (process.env.ALLOWED_ORIGINS) {
  const additionalOrigins = process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  allowedOrigins.push(...additionalOrigins)
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

// Security middleware
app.use(helmetConfig)
app.use(securityHeaders)
app.use(compression())
app.use(mongoSanitizeConfig)
app.use(hppProtection)
app.use(suspiciousActivityDetection)
app.use(corsSecurityCheck)

// Global rate limiting
app.use('/api/', apiRateLimit)

// Body parsing middleware with security
app.use(express.json({
  limit: process.env.MAX_FILE_SIZE || '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf
  }
}))
app.use(express.urlencoded({
  extended: true,
  limit: process.env.MAX_FILE_SIZE || '10mb'
}))

// XSS protection for request bodies
app.use(xssProtection)

// Logging with Winston
const morganFormat = process.env.NODE_ENV === 'production'
  ? 'combined'
  : 'dev'

app.use(morgan(morganFormat, { stream: morganStream }))

// Request monitoring middleware
app.use((req, res, next) => {
  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start
    monitoringService.recordRequest(res.statusCode < 400)
    logRequest(req, res, duration)
  })

  next()
})

// Root endpoint - API information
app.get('/', (req, res) => {
  // Log webhook verification attempts
  const userAgent = req.get('User-Agent')
  if (userAgent && userAgent.includes('Go-http-client')) {
    logger.info('Webhook verification request detected', {
      userAgent,
      ip: req.ip,
      headers: req.headers,
      path: req.path,
      method: req.method
    })
  }

  res.json({
    name: 'AutoGitPilot API',
    version: '1.0.0',
    status: 'running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      monitoring: '/monitoring/health',
      api: '/api',
      scheduler: '/api/scheduler/status',
      webhooks: {
        clerk: '/api/webhook/clerk',
        razorpay: '/api/webhook/razorpay',
        github: '/api/webhook/github'
      }
    },
    message: 'Welcome to AutoGitPilot API. This is a backend service.'
  })
})

// Simple test endpoint (no middleware)
app.get('/test', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running', timestamp: new Date().toISOString() })
})

// Comprehensive debug endpoint for production troubleshooting
app.get('/debug', async (req, res) => {
  try {
    const debugInfo = {
      server: {
        status: 'running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        nodeVersion: process.version,
        environment: process.env.NODE_ENV,
        port: PORT
      },
      database: {
        connected: mongoose.connection.readyState === 1,
        state: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name
      },
      environment: {
        clerkConfigured: !!process.env.CLERK_SECRET_KEY,
        mongoConfigured: !!process.env.MONGODB_URI,
        frontendUrl: process.env.FRONTEND_URL,
        allowedOrigins: process.env.ALLOWED_ORIGINS
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
      }
    }

    // Test database connection
    if (mongoose.connection.readyState === 1) {
      try {
        await mongoose.connection.db.admin().ping()
        debugInfo.database.ping = 'success'
      } catch (pingError) {
        debugInfo.database.ping = 'failed'
        debugInfo.database.pingError = pingError.message
      }
    }

    res.json(debugInfo)
  } catch (error) {
    res.status(500).json({
      error: 'Debug endpoint failed',
      message: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

// Auth debug endpoint (with Clerk middleware)
app.get('/api/debug/auth', enhancedClerkMiddleware, async (req, res) => {
  try {
    const authDebug = {
      timestamp: new Date().toISOString(),
      auth: {
        present: !!req.auth,
        userId: req.auth?.userId,
        sessionId: req.auth?.sessionId
      },
      headers: {
        authorization: req.headers.authorization ? 'Bearer [PRESENT]' : 'MISSING',
        origin: req.headers.origin,
        'user-agent': req.headers['user-agent']?.substring(0, 100)
      },
      database: {
        connected: mongoose.connection.readyState === 1,
        state: mongoose.connection.readyState
      }
    }

    // Try to find user in database
    if (req.auth?.userId) {
      try {
        const user = await User.findOne({ clerkId: req.auth.userId })
        authDebug.user = {
          found: !!user,
          id: user?._id,
          email: user?.email,
          plan: user?.plan
        }
      } catch (dbError) {
        authDebug.user = {
          found: false,
          error: dbError.message
        }
      }
    }

    res.json(authDebug)
  } catch (error) {
    res.status(500).json({
      error: 'Auth debug failed',
      message: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

// Monitoring routes (public)
app.use('/health', monitoringRoutes)
app.use('/monitoring', monitoringRoutes)
// Support client error logging at /api/monitoring as used by frontend
app.use('/api/monitoring', monitoringRoutes)

// Webhook routes (before Clerk middleware)
app.use('/api/webhook', webhookRoutes)

// Scheduler routes (public for debugging)
app.use('/api/scheduler', schedulerRoutes)

// Clerk middleware for protected routes with enhanced error handling
app.use('/api', enhancedClerkMiddleware)

// API routes with specific rate limiting
app.use('/api/auth', authRateLimit, authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/github', githubRoutes)
app.use('/api/commit', commitRoutes)
app.use('/api/payment', paymentRateLimit, paymentRoutes)
app.use('/api/pattern', patternRateLimit, patternRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/repository', repositoryRoutes)

// 404 handler with enhanced logging for webhook debugging
app.use('*', (req, res) => {
  const userAgent = req.get('User-Agent')

  // Enhanced logging for potential webhook requests
  if (userAgent && (userAgent.includes('Go-http-client') || userAgent.includes('Svix'))) {
    logger.warn('Webhook request to unknown route', {
      method: req.method,
      path: req.path,
      userAgent,
      ip: req.ip,
      headers: req.headers,
      query: req.query,
      body: req.body
    })
  }

  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method,
    availableWebhooks: {
      clerk: '/api/webhook/clerk',
      razorpay: '/api/webhook/razorpay',
      github: '/api/webhook/github',
      health: '/api/webhook/health'
    }
  })
})

// Error handling middleware
app.use(errorHandler)

// Start server
const startServer = async () => {
  let dbConnected = false

  try {
    // Try to connect to database
    await connectDB()
    dbConnected = true
    logger.info('✅ Database connected successfully')
  } catch (error) {
    logger.error('❌ Database connection failed, starting server without database', {
      error: error.message
    })
    console.error('❌ Database connection failed, starting server without database:', error.message)
    dbConnected = false
  }

  try {
    // Initialize scheduler only if database is connected
    if (dbConnected) {
      initializeScheduler()
    }

    app.listen(PORT, () => {
      logger.info('🚀 Server started successfully', {
        port: PORT,
        environment: process.env.NODE_ENV,
        nodeVersion: process.version,
        pid: process.pid,
        databaseConnected: dbConnected
      })

      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📊 Environment: ${process.env.NODE_ENV}`)
      console.log(`💾 Database: ${dbConnected ? '✅ Connected' : '❌ Disconnected'}`)
      console.log(`🔗 Health check: http://localhost:${PORT}/health`)
      console.log(`📊 Monitoring: http://localhost:${PORT}/monitoring/health`)
      console.log(`🔧 Scheduler debug: http://localhost:${PORT}/api/scheduler/status`)
    })
  } catch (error) {
    logger.error('❌ Failed to start server', { error: error.message, stack: error.stack })
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection', { error: err.message, stack: err.stack })
  console.error('Unhandled Promise Rejection:', err)
  process.exit(1)
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', { error: err.message, stack: err.stack })
  console.error('Uncaught Exception:', err)
  process.exit(1)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully')
  process.exit(0)
})

startServer()
