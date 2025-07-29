import express from 'express'
import User from '../models/User.js'

const router = express.Router()

// Verify user session and sync with database
router.post('/sync', async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body

    if (!req.auth?.userId) {
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
      if (email && user.email !== email) {
        user.email = email
        updated = true
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
        await user.save()
        console.log('User updated successfully:', user._id)
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
    const user = await User.findOne({ clerkId: req.auth.userId })
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
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
