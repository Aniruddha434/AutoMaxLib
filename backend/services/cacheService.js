import Redis from 'ioredis'
import NodeCache from 'node-cache'
import logger from '../config/logger.js'

/**
 * Caching service with Redis fallback to in-memory cache
 */
class CacheService {
  constructor() {
    this.redis = null
    this.memoryCache = new NodeCache({
      stdTTL: 600, // 10 minutes default TTL
      checkperiod: 120, // Check for expired keys every 2 minutes
      useClones: false
    })
    
    this.isRedisConnected = false
    this.initializeRedis()
  }

  async initializeRedis() {
    if (!process.env.REDIS_URL) {
      logger.warn('Redis URL not configured, using in-memory cache only')
      return
    }

    try {
      this.redis = new Redis(process.env.REDIS_URL, {
        retryDelayOnFailover: 100,
        enableReadyCheck: false,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        password: process.env.REDIS_PASSWORD || undefined,
        db: parseInt(process.env.REDIS_DB) || 0
      })

      this.redis.on('connect', () => {
        logger.info('Redis connected successfully')
        this.isRedisConnected = true
      })

      this.redis.on('error', (error) => {
        logger.error('Redis connection error', { error: error.message })
        this.isRedisConnected = false
      })

      this.redis.on('close', () => {
        logger.warn('Redis connection closed')
        this.isRedisConnected = false
      })

      await this.redis.connect()
    } catch (error) {
      logger.error('Failed to initialize Redis', { error: error.message })
      this.redis = null
      this.isRedisConnected = false
    }
  }

  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {Promise<any>} Cached value or null
   */
  async get(key) {
    try {
      // Try Redis first
      if (this.isRedisConnected && this.redis) {
        const value = await this.redis.get(key)
        if (value !== null) {
          return JSON.parse(value)
        }
      }

      // Fallback to memory cache
      return this.memoryCache.get(key) || null
    } catch (error) {
      logger.error('Cache get error', { key, error: error.message })
      return null
    }
  }

  /**
   * Set value in cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in seconds (optional)
   * @returns {Promise<boolean>} Success status
   */
  async set(key, value, ttl = 600) {
    try {
      const serializedValue = JSON.stringify(value)

      // Set in Redis if available
      if (this.isRedisConnected && this.redis) {
        if (ttl > 0) {
          await this.redis.setex(key, ttl, serializedValue)
        } else {
          await this.redis.set(key, serializedValue)
        }
      }

      // Always set in memory cache as backup
      this.memoryCache.set(key, value, ttl)
      return true
    } catch (error) {
      logger.error('Cache set error', { key, error: error.message })
      return false
    }
  }

  /**
   * Delete value from cache
   * @param {string} key - Cache key
   * @returns {Promise<boolean>} Success status
   */
  async del(key) {
    try {
      // Delete from Redis
      if (this.isRedisConnected && this.redis) {
        await this.redis.del(key)
      }

      // Delete from memory cache
      this.memoryCache.del(key)
      return true
    } catch (error) {
      logger.error('Cache delete error', { key, error: error.message })
      return false
    }
  }

  /**
   * Check if key exists in cache
   * @param {string} key - Cache key
   * @returns {Promise<boolean>} Existence status
   */
  async exists(key) {
    try {
      // Check Redis first
      if (this.isRedisConnected && this.redis) {
        const exists = await this.redis.exists(key)
        if (exists) return true
      }

      // Check memory cache
      return this.memoryCache.has(key)
    } catch (error) {
      logger.error('Cache exists error', { key, error: error.message })
      return false
    }
  }

  /**
   * Clear all cache
   * @returns {Promise<boolean>} Success status
   */
  async clear() {
    try {
      // Clear Redis
      if (this.isRedisConnected && this.redis) {
        await this.redis.flushdb()
      }

      // Clear memory cache
      this.memoryCache.flushAll()
      return true
    } catch (error) {
      logger.error('Cache clear error', { error: error.message })
      return false
    }
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getStats() {
    const memoryStats = this.memoryCache.getStats()
    
    return {
      redis: {
        connected: this.isRedisConnected,
        url: process.env.REDIS_URL ? 'configured' : 'not_configured'
      },
      memory: {
        keys: memoryStats.keys,
        hits: memoryStats.hits,
        misses: memoryStats.misses,
        hitRate: memoryStats.hits / (memoryStats.hits + memoryStats.misses) || 0
      }
    }
  }

  /**
   * Cache wrapper for functions
   * @param {string} key - Cache key
   * @param {Function} fn - Function to execute if cache miss
   * @param {number} ttl - Time to live in seconds
   * @returns {Promise<any>} Cached or computed value
   */
  async wrap(key, fn, ttl = 600) {
    try {
      // Try to get from cache first
      const cached = await this.get(key)
      if (cached !== null) {
        return cached
      }

      // Execute function and cache result
      const result = await fn()
      await this.set(key, result, ttl)
      return result
    } catch (error) {
      logger.error('Cache wrap error', { key, error: error.message })
      // If caching fails, still execute the function
      return await fn()
    }
  }

  /**
   * Increment a counter in cache
   * @param {string} key - Cache key
   * @param {number} increment - Increment value (default: 1)
   * @param {number} ttl - Time to live in seconds
   * @returns {Promise<number>} New counter value
   */
  async increment(key, increment = 1, ttl = 3600) {
    try {
      if (this.isRedisConnected && this.redis) {
        const value = await this.redis.incrby(key, increment)
        if (ttl > 0) {
          await this.redis.expire(key, ttl)
        }
        return value
      }

      // Fallback to memory cache
      const current = this.memoryCache.get(key) || 0
      const newValue = current + increment
      this.memoryCache.set(key, newValue, ttl)
      return newValue
    } catch (error) {
      logger.error('Cache increment error', { key, error: error.message })
      return increment
    }
  }

  /**
   * Set expiration for a key
   * @param {string} key - Cache key
   * @param {number} ttl - Time to live in seconds
   * @returns {Promise<boolean>} Success status
   */
  async expire(key, ttl) {
    try {
      if (this.isRedisConnected && this.redis) {
        await this.redis.expire(key, ttl)
      }

      // For memory cache, we need to get and reset the value
      const value = this.memoryCache.get(key)
      if (value !== undefined) {
        this.memoryCache.set(key, value, ttl)
      }

      return true
    } catch (error) {
      logger.error('Cache expire error', { key, error: error.message })
      return false
    }
  }

  /**
   * Get multiple keys at once
   * @param {string[]} keys - Array of cache keys
   * @returns {Promise<Object>} Object with key-value pairs
   */
  async mget(keys) {
    const result = {}
    
    try {
      if (this.isRedisConnected && this.redis) {
        const values = await this.redis.mget(keys)
        keys.forEach((key, index) => {
          result[key] = values[index] ? JSON.parse(values[index]) : null
        })
      } else {
        // Fallback to memory cache
        keys.forEach(key => {
          result[key] = this.memoryCache.get(key) || null
        })
      }
    } catch (error) {
      logger.error('Cache mget error', { keys, error: error.message })
      // Return empty results on error
      keys.forEach(key => {
        result[key] = null
      })
    }

    return result
  }
}

// Create singleton instance
const cacheService = new CacheService()

export default cacheService
