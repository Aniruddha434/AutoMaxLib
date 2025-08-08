import express from 'express'
import monitoringService from '../services/monitoringService.js'
import logger from '../config/logger.js'

const router = express.Router()

// Basic health check endpoint
router.get('/health', async (req, res) => {
  try {
    const health = monitoringService.getHealthStatus()
    res.status(200).json(health)
  } catch (error) {
    logger.error('Health check failed', { error: error.message })
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

// Detailed health check (includes external services)
router.get('/health/detailed', async (req, res) => {
  try {
    const health = await monitoringService.getDetailedHealth()
    res.status(200).json(health)
  } catch (error) {
    logger.error('Detailed health check failed', { error: error.message })
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

// Readiness probe (for Kubernetes)
router.get('/ready', async (req, res) => {
  try {
    const dbHealth = await monitoringService.checkDatabaseHealth()

    if (dbHealth.status === 'healthy') {
      res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString()
      })
    } else {
      res.status(503).json({
        status: 'not_ready',
        reason: 'Database not available',
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    res.status(503).json({
      status: 'not_ready',
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

// Liveness probe (for Kubernetes)
router.get('/live', (req, res) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString()
  })
})

// Metrics endpoint (protected in production)
router.get('/metrics', (req, res) => {
  try {
    // In production, you might want to protect this endpoint
    if (process.env.NODE_ENV === 'production' && !req.headers['x-monitoring-token']) {
      return res.status(401).json({
        error: 'Monitoring token required'
      })
    }

    const metrics = monitoringService.getMetrics()
    res.status(200).json(metrics)
  } catch (error) {
    logger.error('Metrics endpoint failed', { error: error.message })
    res.status(500).json({
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

// Client error intake from frontend (CORS-enabled via global middleware)
router.post('/client-error', async (req, res) => {
  try {
    const { type, error, timestamp, userAgent, url, sessionId } = req.body || {}
    logger.warn('Client error reported', {
      type,
      error,
      timestamp,
      userAgent: userAgent || req.get('User-Agent'),
      url,
      sessionId,
      origin: req.get('Origin'),
      ip: req.ip
    })
    res.status(200).json({ success: true })
  } catch (e) {
    logger.error('Failed to record client error', { error: e.message })
    res.status(500).json({ success: false })
  }
})


// System information endpoint
router.get('/info', (req, res) => {
  try {
    const info = {
      name: 'AutoGitPilot Backend',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }

    res.status(200).json(info)
  } catch (error) {
    logger.error('Info endpoint failed', { error: error.message })
    res.status(500).json({
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

// Database status endpoint
router.get('/database', async (req, res) => {
  try {
    const dbHealth = await monitoringService.checkDatabaseHealth()
    res.status(dbHealth.status === 'healthy' ? 200 : 503).json(dbHealth)
  } catch (error) {
    logger.error('Database status check failed', { error: error.message })
    res.status(503).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

// External services status
router.get('/services', async (req, res) => {
  try {
    const services = await monitoringService.checkExternalServices()
    res.status(200).json({
      services,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    logger.error('Services status check failed', { error: error.message })
    res.status(500).json({
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

export default router
