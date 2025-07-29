import mongoose from 'mongoose'
import logger from './logger.js'

// Optimized MongoDB connection options
const mongoOptions = {
  // Connection pool settings
  maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE) || 10,
  minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE) || 2,

  // Timeout settings
  serverSelectionTimeoutMS: parseInt(process.env.MONGODB_SERVER_SELECTION_TIMEOUT) || 5000,
  socketTimeoutMS: parseInt(process.env.MONGODB_SOCKET_TIMEOUT) || 45000,
  connectTimeoutMS: parseInt(process.env.MONGODB_CONNECT_TIMEOUT) || 10000,

  // Heartbeat settings
  heartbeatFrequencyMS: 10000,

  // Retry settings
  retryWrites: true,
  retryReads: true,

  // Write concern
  w: 'majority',

  // Read preference
  readPreference: 'primary',

  // Auto index
  autoIndex: process.env.NODE_ENV !== 'production',

  // Auto create
  autoCreate: true
}

export const connectDB = async () => {
  try {
    // Set mongoose options
    mongoose.set('strictQuery', true)

    // Connect with optimized options
    const conn = await mongoose.connect(process.env.MONGODB_URI, mongoOptions)

    logger.info('✅ MongoDB Connected', {
      host: conn.connection.host,
      name: conn.connection.name,
      readyState: conn.connection.readyState,
      maxPoolSize: mongoOptions.maxPoolSize
    })

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('❌ MongoDB connection error', { error: err.message })
    })

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB disconnected')
    })

    mongoose.connection.on('reconnected', () => {
      logger.info('✅ MongoDB reconnected')
    })

    mongoose.connection.on('connecting', () => {
      logger.info('🔄 MongoDB connecting...')
    })

    mongoose.connection.on('connected', () => {
      logger.info('✅ MongoDB connected')
    })

    // Monitor connection pool
    if (process.env.NODE_ENV === 'development') {
      mongoose.connection.on('fullsetup', () => {
        logger.info('MongoDB replica set fully connected')
      })
    }

    // Performance monitoring
    if (process.env.MONGODB_MONITOR_COMMANDS === 'true') {
      mongoose.set('debug', (collectionName, method, query, doc) => {
        logger.debug('MongoDB Query', {
          collection: collectionName,
          method,
          query: JSON.stringify(query),
          doc: doc ? JSON.stringify(doc) : undefined
        })
      })
    }

  } catch (error) {
    logger.error('❌ Database connection failed', {
      error: error.message,
      stack: error.stack
    })
    console.error('❌ Database connection failed:', error)
    process.exit(1)
  }
}

// Graceful shutdown
export const disconnectDB = async () => {
  try {
    await mongoose.connection.close()
    logger.info('✅ MongoDB connection closed gracefully')
  } catch (error) {
    logger.error('❌ Error closing MongoDB connection', { error: error.message })
  }
}

// Health check function
export const checkDBHealth = async () => {
  try {
    const state = mongoose.connection.readyState
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }

    if (state === 1) {
      // Ping the database
      await mongoose.connection.db.admin().ping()
      return {
        status: 'healthy',
        state: states[state],
        host: mongoose.connection.host,
        name: mongoose.connection.name
      }
    } else {
      return {
        status: 'unhealthy',
        state: states[state],
        host: mongoose.connection.host,
        name: mongoose.connection.name
      }
    }
  } catch (error) {
    return {
      status: 'error',
      error: error.message
    }
  }
}


