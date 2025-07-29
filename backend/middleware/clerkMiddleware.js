import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'

export const clerkMiddleware = ClerkExpressRequireAuth({
  onError: (error) => {
    console.error('Clerk authentication error:', error)
    return {
      status: 401,
      message: 'Unauthorized'
    }
  }
})

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
