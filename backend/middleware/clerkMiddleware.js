import { clerkClient } from '../config/clerk.js'
import logger from '../config/logger.js'

export const clerkMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required',
        error: 'MISSING_TOKEN'
      })
    }

    const session = await clerkClient.verifyToken(token)
    req.auth = { userId: session.sub }
    next()
  } catch (error) {
    console.error('Clerk authentication error:', error)
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: 'INVALID_TOKEN'
    })
  }
}

// Enhanced Clerk middleware with better error handling and logging
export const enhancedClerkMiddleware = async (req, res, next) => {
  const requestId = Math.random().toString(36).substring(7)

  try {
    // Log request for debugging
    logger.debug(`[${requestId}] Clerk auth check for ${req.method} ${req.path}`, {
      headers: {
        authorization: req.headers.authorization ? 'Bearer [PRESENT]' : 'MISSING',
        origin: req.headers.origin,
        userAgent: req.headers['user-agent']?.substring(0, 100)
      }
    })

    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      logger.error(`[${requestId}] Missing authorization token`)
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'MISSING_TOKEN',
        requestId
      })
    }

    const session = await clerkClient.verifyToken(token)
    req.auth = { userId: session.sub }

    // Log successful authentication
    logger.debug(`[${requestId}] Authentication successful for user: ${req.auth.userId}`)
    next()

  } catch (error) {
    logger.error(`[${requestId}] Clerk authentication error:`, {
      error: error.message,
      stack: error.stack,
      path: req.path,
      method: req.method,
      errorCode: error.code,
      errorStatus: error.status,
      headers: {
        authorization: req.headers.authorization ? 'Bearer [PRESENT]' : 'MISSING',
        origin: req.headers.origin
      }
    })

    // Provide more specific error messages based on error type
    let errorMessage = 'Authentication failed'
    let errorCode = 'CLERK_MIDDLEWARE_ERROR'

    if (error.message.includes('Invalid token')) {
      errorMessage = 'Invalid or expired authentication token'
      errorCode = 'INVALID_TOKEN'
    } else if (error.message.includes('Token expired')) {
      errorMessage = 'Authentication token has expired'
      errorCode = 'TOKEN_EXPIRED'
    } else if (error.message.includes('Network')) {
      errorMessage = 'Authentication service temporarily unavailable'
      errorCode = 'AUTH_SERVICE_ERROR'
    }

    return res.status(401).json({
      success: false,
      message: errorMessage,
      error: errorCode,
      requestId,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// Optional middleware for routes that don't require auth
export const optionalClerkMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (token) {
      const session = await clerkClient.verifyToken(token)
      req.auth = { userId: session.sub }
    } else {
      req.auth = null
    }

    next()
  } catch (error) {
    req.auth = null
    next()
  }
}
