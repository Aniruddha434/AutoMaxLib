import express from 'express'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'
import Commit from '../models/Commit.js'

const router = express.Router()

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    if (!req.auth?.userId) {
      return res.status(401).json({
        success: false,
        message: 'No authentication found'
      })
    }

    let user = await User.findOne({ clerkId: req.auth.userId })

    if (!user) {
      // Auto-create user if they don't exist
      console.log('Auto-creating user for Clerk ID:', req.auth.userId)
      user = new User({
        clerkId: req.auth.userId,
        email: 'unknown@example.com',
        firstName: 'User',
        lastName: 'Name',
        plan: 'free'
      })
      await user.save()
      console.log('User auto-created:', user._id)
    }

    // Add trial information for free users
    const trialInfo = user.plan === 'free' ? {
      isTrialActive: user.isTrialActive(),
      daysRemaining: user.getTrialDaysRemaining(),
      trialStartDate: user.trialStartDate,
      trialEndDate: user.trialEndDate,
      canUseAutoCommit: user.canUseAutoCommit()
    } : null

    // Remove sensitive data
    const userProfile = {
      id: user._id,
      clerkId: user.clerkId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      plan: user.plan,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionExpiry: user.subscriptionExpiry,
      githubUsername: user.githubUsername,
      repositories: user.repositories,
      commitSettings: user.commitSettings,
      preferences: user.preferences,
      stats: user.stats,
      isPremium: user.isPremium(),
      trial: trialInfo,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

    res.json({
      success: true,
      user: userProfile
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Create user profile
router.post('/profile', [
  body('email').isEmail().normalizeEmail(),
  body('firstName').trim().isLength({ min: 1 }),
  body('lastName').trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      })
    }

    const { email, firstName, lastName } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ clerkId: req.auth.userId })
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists'
      })
    }

    // Create new user
    const user = new User({
      clerkId: req.auth.userId,
      email,
      firstName,
      lastName,
      plan: 'free'
    })

    await user.save()

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        plan: user.plan
      }
    })
  } catch (error) {
    console.error('Error creating user:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Update user profile
router.put('/profile', [
  body('firstName').optional().trim().isLength({ min: 1 }),
  body('lastName').optional().trim().isLength({ min: 1 }),
  body('githubToken').optional().isString(),
  body('githubUsername').optional().isString(),
  body('githubEmail').optional().custom((value) => {
    if (value === null || value === undefined || value === '') {
      return true // Allow null/empty values
    }
    // If value exists, it should be a valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      throw new Error('Invalid email format')
    }
    return true
  }),
  body('githubName').optional().custom((value) => {
    if (value === null || value === undefined || value === '') {
      return true // Allow null/empty values
    }
    // If value exists, it should be a string
    if (typeof value !== 'string') {
      throw new Error('GitHub name must be a string')
    }
    return true
  }),
  body('repositories').optional().isArray(),
  body('plan').optional().isIn(['free', 'premium']),
  body('subscriptionStatus').optional().isString(),
  body('preferences.darkMode').optional().isBoolean(),
  body('preferences.emailNotifications').optional().isBoolean(),
  body('preferences.publicProfile').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.error('❌ User profile validation errors:', errors.array())
      console.error('📋 Request body:', req.body)
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      })
    }

    let user = await User.findOne({ clerkId: req.auth.userId })
    if (!user) {
      // Auto-create user if they don't exist
      console.log('Auto-creating user during update for Clerk ID:', req.auth.userId)
      user = new User({
        clerkId: req.auth.userId,
        email: 'unknown@example.com',
        firstName: 'User',
        lastName: 'Name',
        plan: 'free'
      })
      await user.save()
      console.log('User auto-created during update:', user._id)
    }

    const { firstName, lastName, githubToken, githubUsername, githubEmail, githubName, repositories, plan, subscriptionStatus, preferences } = req.body

    // Update fields
    if (firstName) user.firstName = firstName
    if (lastName) user.lastName = lastName
    if (githubToken !== undefined) user.githubToken = githubToken
    if (githubUsername !== undefined) user.githubUsername = githubUsername
    if (githubEmail !== undefined) user.githubEmail = githubEmail
    if (githubName !== undefined) user.githubName = githubName
    if (repositories) user.repositories = repositories
    if (plan) user.plan = plan
    if (subscriptionStatus) user.subscriptionStatus = subscriptionStatus
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences }
    }

    await user.save()

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        plan: user.plan,
        githubUsername: user.githubUsername,
        repositories: user.repositories,
        commitSettings: user.commitSettings,
        preferences: user.preferences,
        stats: user.stats,
        isPremium: user.isPremium()
      }
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Update commit settings
router.put('/commit-settings', [
  body('time').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('timezone').optional().isString(),
  body('messages').optional().isArray(),
  body('customMessages').optional().isArray(),
  body('enableAutoCommits').optional().isBoolean(),
  body('enableSmartContent').optional().isBoolean(),
  body('enableAIMessages').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      })
    }

    const user = await User.findOne({ clerkId: req.auth.userId })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const { time, timezone, messages, customMessages, enableAutoCommits, enableSmartContent, enableAIMessages } = req.body

    // Check premium features
    if (!user.isPremium()) {
      if (time && time !== '10:00') {
        return res.status(403).json({
          success: false,
          message: 'Custom commit time is a premium feature'
        })
      }
      if (enableSmartContent || enableAIMessages) {
        return res.status(403).json({
          success: false,
          message: 'Smart content and AI messages are premium features'
        })
      }

      // Check trial period for auto commits
      if (enableAutoCommits && !user.canUseAutoCommit()) {
        const daysRemaining = user.getTrialDaysRemaining()
        return res.status(403).json({
          success: false,
          message: `Your 15-day free trial for auto commits has expired. Upgrade to premium to continue using auto commits.`,
          trialExpired: true,
          daysRemaining
        })
      }
    }

    // Update commit settings
    if (time) user.commitSettings.time = time
    if (timezone) user.commitSettings.timezone = timezone
    if (messages) user.commitSettings.messages = messages
    if (customMessages) user.commitSettings.customMessages = customMessages
    if (enableAutoCommits !== undefined) user.commitSettings.enableAutoCommits = enableAutoCommits
    if (enableSmartContent !== undefined) user.commitSettings.enableSmartContent = enableSmartContent
    if (enableAIMessages !== undefined) user.commitSettings.enableAIMessages = enableAIMessages

    await user.save()

    res.json({
      success: true,
      message: 'Commit settings updated successfully',
      commitSettings: user.commitSettings
    })
  } catch (error) {
    console.error('Error updating commit settings:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Get user dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    if (!req.auth?.userId) {
      return res.status(401).json({
        success: false,
        message: 'No authentication found'
      })
    }

    let user = await User.findOne({ clerkId: req.auth.userId })
    if (!user) {
      // Auto-create user if they don't exist
      user = new User({
        clerkId: req.auth.userId,
        email: 'unknown@example.com',
        firstName: 'User',
        lastName: 'Name',
        plan: 'free'
      })
      await user.save()
    }

    // Get recent commits
    const recentCommits = await Commit.getRecentCommits(req.auth.userId, 7)

    // Get today's commit status
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayCommit = await Commit.findOne({
      clerkId: req.auth.userId,
      createdAt: { $gte: today },
      status: 'success'
    })

    // Get active repository
    const activeRepo = user.getActiveRepository()

    // Add trial information for free users
    const trialInfo = user.plan === 'free' ? {
      isTrialActive: user.isTrialActive(),
      daysRemaining: user.getTrialDaysRemaining(),
      trialStartDate: user.trialStartDate,
      trialEndDate: user.trialEndDate,
      canUseAutoCommit: user.canUseAutoCommit()
    } : null

    res.json({
      success: true,
      dashboard: {
        user: {
          name: user.fullName,
          plan: user.plan,
          isPremium: user.isPremium(),
          stats: user.stats,
          trial: trialInfo
        },
        activeRepository: activeRepo,
        todayCommit: !!todayCommit,
        recentCommits: recentCommits.map(commit => ({
          id: commit._id,
          message: commit.commitMessage,
          status: commit.status,
          repository: commit.repository,
          createdAt: commit.createdAt,
          commitUrl: commit.commitUrl
        })),
        nextCommitTime: user.commitSettings.time
      }
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Delete user account
router.delete('/account', async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Delete user's commits
    await Commit.deleteMany({ clerkId: req.auth.userId })

    // Delete user
    await User.deleteOne({ clerkId: req.auth.userId })

    res.json({
      success: true,
      message: 'Account deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting user account:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

export default router
