import express from 'express'
import User from '../models/User.js'
import mongoose from 'mongoose'

const router = express.Router()

// Health check endpoint for auth service
router.get('/health', async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'

    // Check if we can query the database
    const userCount = await User.countDocuments()

    res.json({
      success: true,
      status: 'healthy',
      database: {
        status: dbStatus,
        userCount
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

// Verify user session and sync with database
router.post('/sync', async (req, res) => {
  try {
    console.log('Auth sync request received:', {
      body: req.body,
      auth: req.auth,
      headers: {
        authorization: req.headers.authorization ? 'Bearer [PRESENT]' : 'MISSING',
        origin: req.headers.origin
      }
    })

    const { email, firstName, lastName } = req.body

    if (!req.auth?.userId) {
      console.error('Auth sync failed: No user ID in request', {
        auth: req.auth,
        headers: req.headers.authorization ? 'Bearer [PRESENT]' : 'MISSING'
      })
      return res.status(401).json({
        success: false,
        message: 'No user ID found in request'
      })
    }

    let user = await User.findOne({ clerkId: req.auth.userId })

    if (!user) {
      // Create new user if doesn't exist
      console.log('Creating new user for Clerk ID:', req.auth.userId)
      console.log('User data:', { email, firstName, lastName })

      user = new User({
        clerkId: req.auth.userId,
        email: email || 'unknown@example.com',
        firstName: firstName || 'User',
        lastName: lastName || 'Name',
        plan: 'free'
      })

      console.log('About to save user:', user.toObject())
      await user.save()
      console.log('User created successfully:', user._id)
    } else {
      // Update user info if changed
      let updated = false

      // Check if email needs to be updated and if it's available
      if (email && user.email !== email) {
        // Check if the new email is already taken by another user
        const existingUser = await User.findOne({
          email: email,
          clerkId: { $ne: req.auth.userId }
        })

        if (existingUser) {
          console.warn('Email already taken by another user, keeping existing email on current account:', {
            attemptedEmail: email,
            existingUserId: existingUser._id,
            currentUserId: user._id
          })
          // Do NOT update email to avoid conflict; continue syncing other fields
        } else {
          user.email = email
          updated = true
        }
      }

      if (firstName && user.firstName !== firstName) {
        user.firstName = firstName
        updated = true
      }
      if (lastName && user.lastName !== lastName) {
        user.lastName = lastName
        updated = true
      }

      if (updated) {
        try {
          await user.save()
          console.log('User updated successfully:', user._id)
        } catch (saveError) {
          // Handle duplicate key errors specifically
          if (saveError.code === 11000) {
            console.error('Duplicate key error during user update:', saveError)
            return res.status(400).json({
              success: false,
              message: 'Email address is already in use by another account',
              error: 'EMAIL_CONFLICT',
              details: {
                email: email,
                suggestions: [
                  'Sign in to your existing account instead',
                  'Use a different email address',
                  'Contact support if you believe this is an error'
                ]
              }
            })
          }
          throw saveError // Re-throw other errors
        }
      }
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        plan: user.plan,
        isPremium: user.isPremium(),
        stats: user.stats,
        preferences: user.preferences
      }
    })
  } catch (error) {
    console.error('Error syncing user:', error)
    console.error('Error stack:', error.stack)
    console.error('Request body:', req.body)
    console.error('Request auth:', req.auth)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
})

// Get current user session info
router.get('/me', async (req, res) => {
  try {
    let user = await User.findOne({ clerkId: req.auth.userId })

    if (!user) {
      // Auto-create user if they don't exist
      console.log('Auto-creating user for /me request, Clerk ID:', req.auth.userId)
      user = new User({
        clerkId: req.auth.userId,
        email: 'unknown@example.com',
        firstName: 'User',
        lastName: 'Name',
        plan: 'free'
      })
      await user.save()
      console.log('User auto-created for /me:', user._id)
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        plan: user.plan,
        isPremium: user.isPremium(),
        stats: user.stats,
        preferences: user.preferences
      }
    })
  } catch (error) {
    console.error('Error fetching user info:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Test route to debug authentication
router.get('/test', async (req, res) => {
  try {
    console.log('Auth test - req.auth:', req.auth)
    console.log('Auth test - headers:', req.headers.authorization)

    res.json({
      success: true,
      auth: req.auth,
      hasAuth: !!req.auth,
      userId: req.auth?.userId,
      message: 'Authentication test successful'
    })
  } catch (error) {
    console.error('Auth test error:', error)
    res.status(500).json({
      success: false,
      message: 'Auth test failed',
      error: error.message
    })
  }
})

export default router
