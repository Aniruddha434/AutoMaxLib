import express from 'express'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'
import Commit from '../models/Commit.js'
import schedulerService from '../services/schedulerService.js'

const router = express.Router()

// Trigger manual commit
router.post('/manual', async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check if user can use commit feature (trial period check for free users)
    if (!user.canUseAutoCommit()) {
      const daysRemaining = user.getTrialDaysRemaining()
      return res.status(403).json({
        success: false,
        message: `Your 15-day free trial for commits has expired. Upgrade to premium to continue making commits.`,
        trialExpired: true,
        daysRemaining
      })
    }

    // Check if user has active repository
    const activeRepo = user.getActiveRepository()
    if (!activeRepo) {
      return res.status(400).json({
        success: false,
        message: 'No active repository found. Please connect a repository first.'
      })
    }

    // Check if user already made a manual commit today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const existingManualCommit = await Commit.findOne({
      clerkId: req.auth.userId,
      type: 'manual',
      createdAt: { $gte: today },
      status: 'success'
    })

    if (existingManualCommit) {
      return res.status(400).json({
        success: false,
        message: 'Manual commit already done today. Try again tomorrow.'
      })
    }

    // Trigger manual commit
    const result = await schedulerService.triggerManualCommit(req.auth.userId)

    res.json({
      success: true,
      message: 'Manual commit triggered successfully',
      result
    })
  } catch (error) {
    console.error('Error triggering manual commit:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get commit history
router.get('/history', async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const commits = await Commit.find({ clerkId: req.auth.userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('userId', 'firstName lastName email')

    const total = await Commit.countDocuments({ clerkId: req.auth.userId })

    res.json({
      success: true,
      commits: commits.map(commit => ({
        id: commit._id,
        message: commit.commitMessage,
        status: commit.status,
        type: commit.type,
        repository: commit.repository,
        filePath: commit.filePath,
        commitSha: commit.commitSha,
        commitUrl: commit.commitUrl,
        error: commit.error,
        createdAt: commit.createdAt,
        executedAt: commit.executedAt
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('Error fetching commit history:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Get commit statistics
router.get('/stats', async (req, res) => {
  try {
    const { days = 30 } = req.query

    const stats = await Commit.getCommitStats(req.auth.userId, parseInt(days))

    // Get today's commit status
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayCommit = await Commit.findOne({
      clerkId: req.auth.userId,
      createdAt: { $gte: today },
      status: 'success'
    })

    // Get total counts
    const totalCommits = await Commit.countDocuments({
      clerkId: req.auth.userId,
      status: 'success'
    })

    const failedCommits = await Commit.countDocuments({
      clerkId: req.auth.userId,
      status: 'failed'
    })

    res.json({
      success: true,
      stats: {
        dailyStats: stats,
        totalCommits,
        failedCommits,
        todayCommitted: !!todayCommit,
        successRate: totalCommits > 0 ? ((totalCommits / (totalCommits + failedCommits)) * 100).toFixed(1) : 0
      }
    })
  } catch (error) {
    console.error('Error fetching commit stats:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Retry failed commit
router.post('/retry/:commitId', async (req, res) => {
  try {
    const { commitId } = req.params

    const commit = await Commit.findOne({
      _id: commitId,
      clerkId: req.auth.userId
    }).populate('userId')

    if (!commit) {
      return res.status(404).json({
        success: false,
        message: 'Commit not found'
      })
    }

    if (!commit.canRetry()) {
      return res.status(400).json({
        success: false,
        message: 'Commit cannot be retried (max retries reached or not failed)'
      })
    }

    // Mark as retrying and execute
    await commit.markAsRetrying()
    await schedulerService.executeCommit(commit, commit.userId)

    res.json({
      success: true,
      message: 'Commit retry initiated',
      commit: {
        id: commit._id,
        status: commit.status,
        retryCount: commit.retryCount
      }
    })
  } catch (error) {
    console.error('Error retrying commit:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get commit details
router.get('/:commitId', async (req, res) => {
  try {
    const { commitId } = req.params

    const commit = await Commit.findOne({
      _id: commitId,
      clerkId: req.auth.userId
    }).populate('userId', 'firstName lastName email')

    if (!commit) {
      return res.status(404).json({
        success: false,
        message: 'Commit not found'
      })
    }

    res.json({
      success: true,
      commit: {
        id: commit._id,
        message: commit.commitMessage,
        status: commit.status,
        type: commit.type,
        repository: commit.repository,
        filePath: commit.filePath,
        content: commit.content,
        contentType: commit.contentType,
        commitSha: commit.commitSha,
        commitUrl: commit.commitUrl,
        error: commit.error,
        retryCount: commit.retryCount,
        maxRetries: commit.maxRetries,
        scheduledFor: commit.scheduledFor,
        executedAt: commit.executedAt,
        createdAt: commit.createdAt,
        metadata: commit.metadata,
        canRetry: commit.canRetry()
      }
    })
  } catch (error) {
    console.error('Error fetching commit details:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Generate past commits (Premium feature)
router.post('/backfill', async (req, res) => {
  try {
    console.log('🔄 Backfill request received:', {
      userId: req.auth?.userId,
      hasAuth: !!req.auth,
      body: req.body
    })

    if (!req.auth?.userId) {
      console.log('❌ No authentication found in request')
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    const user = await User.findOne({ clerkId: req.auth.userId })
    if (!user) {
      console.log('❌ User not found:', req.auth.userId)
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    console.log('✅ User found:', user.email)

    // Check if user has premium plan
    if (user.plan !== 'premium') {
      return res.status(403).json({
        success: false,
        message: 'Past commit generation is a premium feature'
      })
    }

    // Check if user has active repository
    const activeRepo = user.getActiveRepository()
    if (!activeRepo) {
      return res.status(400).json({
        success: false,
        message: 'No active repository found. Please connect a repository first.'
      })
    }

    const { startDate, endDate, settings, force = false } = req.body

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      })
    }

    // Validate date range
    const start = new Date(startDate)
    const end = new Date(endDate)
    const today = new Date()

    if (start >= today || end >= today) {
      return res.status(400).json({
        success: false,
        message: 'Backfill dates must be in the past'
      })
    }

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'Start date must be before end date'
      })
    }

    const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    if (daysDiff > 365) {
      return res.status(400).json({
        success: false,
        message: 'Maximum backfill period is 365 days'
      })
    }

    // Check if user already has backfill commits in this period
    const existingBackfillCommits = await Commit.find({
      clerkId: req.auth.userId,
      type: 'backfill',
      createdAt: {
        $gte: start,
        $lte: end
      }
    })

    if (existingBackfillCommits.length > 0 && !force) {
      return res.status(400).json({
        success: false,
        message: 'Backfill commits already exist in this date range. Use force=true to overwrite.',
        existingCommits: existingBackfillCommits.length
      })
    }

    // If force is true, delete existing backfill commits in the range
    if (force && existingBackfillCommits.length > 0) {
      console.log(`🗑️ Deleting ${existingBackfillCommits.length} existing backfill commits`)
      await Commit.deleteMany({
        clerkId: req.auth.userId,
        type: 'backfill',
        createdAt: {
          $gte: start,
          $lte: end
        }
      })
    }

    // Generate past commits
    const result = await schedulerService.generatePastCommits(req.auth.userId, {
      startDate,
      endDate,
      settings
    })

    res.json({
      success: true,
      message: 'Past commits generated successfully',
      commitsCreated: result.commitsCreated,
      dateRange: { startDate, endDate }
    })

  } catch (error) {
    console.error('❌ Error generating past commits:', error)
    console.error('❌ Error stack:', error.stack)
    res.status(500).json({
      success: false,
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
})

// Streak maintenance endpoint for free users (15-day limit)
router.post('/streak-maintenance', async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    console.log('✅ User found for streak maintenance:', user.email)

    // Check if user can use commit feature (trial period check for free users)
    if (!user.canUseAutoCommit()) {
      const daysRemaining = user.getTrialDaysRemaining()
      return res.status(403).json({
        success: false,
        message: `Your 15-day free trial for commits has expired. Upgrade to premium to continue using streak maintenance.`,
        trialExpired: true,
        daysRemaining
      })
    }

    // Check if user has active repository
    const activeRepo = user.getActiveRepository()
    if (!activeRepo) {
      return res.status(400).json({
        success: false,
        message: 'No active repository found. Please connect a repository first.'
      })
    }

    const { dates, settings, force = false } = req.body

    if (!dates || !Array.isArray(dates) || dates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one date is required for streak maintenance'
      })
    }

    // Validate each date
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    const maxDaysBack = 15
    const validDates = []
    const invalidDates = []

    for (const dateStr of dates) {
      const date = new Date(dateStr)
      const daysFromToday = Math.ceil((today - date) / (1000 * 60 * 60 * 24))

      if (date >= today) {
        invalidDates.push({ date: dateStr, reason: 'Date must be in the past' })
      } else if (daysFromToday > maxDaysBack && user.plan !== 'premium') {
        invalidDates.push({
          date: dateStr,
          reason: `Free users can only maintain streaks for the last ${maxDaysBack} days. Upgrade to Premium for unlimited access.`
        })
      } else {
        validDates.push(dateStr)
      }
    }

    if (invalidDates.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Some dates are invalid for streak maintenance',
        invalidDates,
        validDates
      })
    }

    // Check for existing commits on these dates
    const existingCommits = await Commit.find({
      clerkId: req.auth.userId,
      scheduledFor: {
        $in: validDates.map(date => new Date(date))
      },
      status: 'success'
    })

    if (existingCommits.length > 0 && !force) {
      return res.status(400).json({
        success: false,
        message: 'Commits already exist for some of these dates. Use force=true to overwrite.',
        existingCommits: existingCommits.map(c => ({
          date: c.scheduledFor,
          type: c.type
        }))
      })
    }

    // Generate streak maintenance commits
    const result = await schedulerService.generateStreakMaintenanceCommits(req.auth.userId, {
      dates: validDates,
      settings,
      force
    })

    res.json({
      success: true,
      message: 'Streak maintenance commits generated successfully',
      commitsCreated: result.commitsCreated,
      dates: validDates,
      userPlan: user.plan
    })

  } catch (error) {
    console.error('❌ Error generating streak maintenance commits:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Test endpoint to validate backfill setup
router.get('/backfill/validate', async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const activeRepo = user.getActiveRepository()

    res.json({
      success: true,
      user: {
        email: user.email,
        plan: user.plan,
        hasGithubToken: !!user.githubToken
      },
      repository: activeRepo ? {
        name: activeRepo.name,
        filePath: activeRepo.filePath,
        url: activeRepo.url,
        isActive: activeRepo.isActive
      } : null,
      canBackfill: user.plan === 'premium' && !!activeRepo && !!user.githubToken
    })

  } catch (error) {
    console.error('❌ Error validating backfill setup:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Debug endpoint to check existing backfill commits
router.get('/backfill/debug', async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    const existingBackfillCommits = await Commit.find({
      clerkId: req.auth.userId,
      type: 'backfill',
      createdAt: {
        $gte: start,
        $lte: end
      }
    }).sort({ createdAt: 1 })

    res.json({
      success: true,
      existingCommits: existingBackfillCommits.length,
      commits: existingBackfillCommits.map(commit => ({
        id: commit._id,
        createdAt: commit.createdAt,
        status: commit.status,
        message: commit.commitMessage,
        error: commit.error
      }))
    })

  } catch (error) {
    console.error('❌ Error debugging backfill:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Clear existing backfill commits (for debugging)
router.delete('/backfill/clear', async (req, res) => {
  try {
    const { startDate, endDate } = req.body

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    const result = await Commit.deleteMany({
      clerkId: req.auth.userId,
      type: 'backfill',
      createdAt: {
        $gte: start,
        $lte: end
      }
    })

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} backfill commits`,
      deletedCount: result.deletedCount
    })

  } catch (error) {
    console.error('❌ Error clearing backfill commits:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Manual commit trigger (for testing)
router.post('/trigger-manual', async (req, res) => {
  try {
    if (!req.auth?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    const result = await schedulerService.triggerManualCommit(req.auth.userId)

    res.json({
      success: true,
      message: 'Manual commit triggered successfully',
      result
    })
  } catch (error) {
    console.error('Error triggering manual commit:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to trigger manual commit'
    })
  }
})

export default router
