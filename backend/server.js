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
import { clerkMiddleware } from './middleware/clerkMiddleware.js'
import logger, { morganStream, logRequest } from './config/logger.js'
import monitoringService from './services/monitoringService.js'

// Import routes
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import githubRoutes from './routes/github.js'
import commitRoutes from './routes/commit.js'
import paymentRoutes from './routes/payment.js'
import webhookRoutes from './routes/webhook.js'
import patternRoutes from './routes/pattern.js'
import profileRoutes from './routes/profile.js'
import schedulerRoutes from './routes/scheduler.js'
import monitoringRoutes from './routes/monitoring.js'

const app = express()
const PORT = process.env.PORT || 5000

// Trust proxy for production (behind load balancer/reverse proxy)
if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1)
}

// CORS configuration (must be before security middleware)
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3000'
  ],
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

// Monitoring routes (public)
app.use('/health', monitoringRoutes)
app.use('/monitoring', monitoringRoutes)

// Webhook routes (before Clerk middleware)
app.use('/api/webhook', webhookRoutes)

// Scheduler routes (public for debugging)
app.use('/api/scheduler', schedulerRoutes)

// Clerk middleware for protected routes
app.use('/api', clerkMiddleware)

// API routes with specific rate limiting
app.use('/api/auth', authRateLimit, authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/github', githubRoutes)
app.use('/api/commit', commitRoutes)
app.use('/api/payment', paymentRateLimit, paymentRoutes)
app.use('/api/pattern', patternRateLimit, patternRoutes)
app.use('/api/profile', profileRoutes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

// Error handling middleware
app.use(errorHandler)

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB()
    
    // Initialize scheduler
    initializeScheduler()
    
    app.listen(PORT, () => {
      logger.info('🚀 Server started successfully', {
        port: PORT,
        environment: process.env.NODE_ENV,
        nodeVersion: process.version,
        pid: process.pid
      })

      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📊 Environment: ${process.env.NODE_ENV}`)
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
