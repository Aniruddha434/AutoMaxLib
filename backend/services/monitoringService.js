import os from 'os'
import process from 'process'
import mongoose from 'mongoose'
import logger from '../config/logger.js'

/**
 * Monitoring service for application health and metrics
 */
class MonitoringService {
  constructor() {
    this.startTime = Date.now()
    this.metrics = {
      requests: {
        total: 0,
        success: 0,
        errors: 0,
        lastMinute: []
      },
      database: {
        connections: 0,
        queries: 0,
        errors: 0
      },
      memory: {
        usage: 0,
        peak: 0
      },
      cpu: {
        usage: 0
      }
    }

    // Start monitoring intervals
    this.startMonitoring()
  }

  startMonitoring() {
    // Update metrics every 30 seconds
    setInterval(() => {
      this.updateSystemMetrics()
      this.cleanupOldMetrics()
    }, 30000)

    // Log metrics every 5 minutes in production
    if (process.env.NODE_ENV === 'production') {
      setInterval(() => {
        this.logMetrics()
      }, 300000)
    }
  }

  updateSystemMetrics() {
    // Memory usage
    const memUsage = process.memoryUsage()
    this.metrics.memory.usage = memUsage.heapUsed
    this.metrics.memory.peak = Math.max(this.metrics.memory.peak, memUsage.heapUsed)

    // CPU usage (simplified)
    const cpuUsage = process.cpuUsage()
    this.metrics.cpu.usage = (cpuUsage.user + cpuUsage.system) / 1000000 // Convert to seconds

    // Database connections
    if (mongoose.connection.readyState === 1) {
      this.metrics.database.connections = mongoose.connections.length
    }
  }

  cleanupOldMetrics() {
    const oneMinuteAgo = Date.now() - 60000
    this.metrics.requests.lastMinute = this.metrics.requests.lastMinute.filter(
      timestamp => timestamp > oneMinuteAgo
    )
  }

  recordRequest(success = true) {
    this.metrics.requests.total++
    this.metrics.requests.lastMinute.push(Date.now())
    
    if (success) {
      this.metrics.requests.success++
    } else {
      this.metrics.requests.errors++
    }
  }

  recordDatabaseQuery(success = true) {
    this.metrics.database.queries++
    if (!success) {
      this.metrics.database.errors++
    }
  }

  getHealthStatus() {
    const uptime = Date.now() - this.startTime
    const memUsage = process.memoryUsage()
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: Math.floor(uptime / 1000),
        human: this.formatUptime(uptime)
      },
      memory: {
        used: this.formatBytes(memUsage.heapUsed),
        total: this.formatBytes(memUsage.heapTotal),
        external: this.formatBytes(memUsage.external),
        rss: this.formatBytes(memUsage.rss)
      },
      system: {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        cpus: os.cpus().length,
        loadAverage: os.loadavg(),
        freeMemory: this.formatBytes(os.freemem()),
        totalMemory: this.formatBytes(os.totalmem())
      },
      database: {
        status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        connections: mongoose.connections.length,
        host: mongoose.connection.host,
        name: mongoose.connection.name
      },
      requests: {
        total: this.metrics.requests.total,
        success: this.metrics.requests.success,
        errors: this.metrics.requests.errors,
        lastMinute: this.metrics.requests.lastMinute.length,
        errorRate: this.metrics.requests.total > 0 
          ? ((this.metrics.requests.errors / this.metrics.requests.total) * 100).toFixed(2) + '%'
          : '0%'
      }
    }
  }

  getMetrics() {
    return {
      ...this.metrics,
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime
    }
  }

  logMetrics() {
    const metrics = this.getMetrics()
    logger.info('System Metrics', {
      type: 'metrics',
      ...metrics
    })
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  formatUptime(ms) {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`
    if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
  }

  // Health check for specific services
  async checkDatabaseHealth() {
    try {
      await mongoose.connection.db.admin().ping()
      return { status: 'healthy', message: 'Database connection is active' }
    } catch (error) {
      return { status: 'unhealthy', message: error.message }
    }
  }

  async checkExternalServices() {
    const services = {}

    // Check Clerk
    if (process.env.CLERK_SECRET_KEY) {
      services.clerk = { status: 'configured' }
    } else {
      services.clerk = { status: 'not_configured' }
    }

    // Check Razorpay
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      services.razorpay = { status: 'configured' }
    } else {
      services.razorpay = { status: 'not_configured' }
    }

    // Check OpenAI
    if (process.env.OPENAI_API_KEY) {
      services.openai = { status: 'configured' }
    } else {
      services.openai = { status: 'not_configured' }
    }

    // Check Gemini
    if (process.env.GEMINI_API_KEY) {
      services.gemini = { status: 'configured' }
    } else {
      services.gemini = { status: 'not_configured' }
    }

    return services
  }

  async getDetailedHealth() {
    const basicHealth = this.getHealthStatus()
    const dbHealth = await this.checkDatabaseHealth()
    const servicesHealth = await this.checkExternalServices()

    return {
      ...basicHealth,
      database: {
        ...basicHealth.database,
        health: dbHealth
      },
      externalServices: servicesHealth
    }
  }
}

// Create singleton instance
const monitoringService = new MonitoringService()

export default monitoringService
