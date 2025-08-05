import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'
import logger from '../config/logger.js'

export const clerkMiddleware = ClerkExpressRequireAuth({
  onError: (error) => {
    console.error('Clerk authentication error:', error)
    return {
      status: 401,
      message: 'Unauthorized'
    }
  }
})

// Enhanced Clerk middleware with better error handling and logging
export const enhancedClerkMiddleware = (req, res, next) => {
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

    ClerkExpressRequireAuth({
      onError: (error) => {
        logger.error(`[${requestId}] Clerk authentication error:`, {
          error: error.message,
          stack: error.stack,
          path: req.path,
          method: req.method,
          headers: {
            authorization: req.headers.authorization ? 'Bearer [PRESENT]' : 'MISSING',
            origin: req.headers.origin
          }
        })

        // Return structured error response
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          error: 'CLERK_AUTH_ERROR',
          requestId
        })
      }
    })(req, res, (err) => {
      if (err) {
        logger.error(`[${requestId}] Clerk middleware error:`, err)
        return res.status(401).json({
          success: false,
          message: 'Authentication failed',
          error: 'CLERK_MIDDLEWARE_ERROR',
          requestId
        })
      }

      // Log successful authentication
      if (req.auth?.userId) {
        logger.debug(`[${requestId}] Authentication successful for user: ${req.auth.userId}`)
      }

      next()
    })
  } catch (error) {
    logger.error(`[${requestId}] Clerk middleware exception:`, {
      error: error.message,
      stack: error.stack,
      path: req.path,
      method: req.method
    })

    return res.status(500).json({
      success: false,
      message: 'Authentication service error',
      error: 'CLERK_SERVICE_ERROR',
      requestId
    })
  }
}

// Optional middleware for routes that don't require auth
export const optionalClerkMiddleware = (req, res, next) => {
  try {
    ClerkExpressRequireAuth()(req, res, (err) => {
      if (err) {
        // Continue without auth if there's an error
        req.auth = null
      }
      next()
    })
  } catch (error) {
    req.auth = null
    next()
  }
}
