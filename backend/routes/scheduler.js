import express from 'express'
import schedulerService from '../services/schedulerService.js'
import User from '../models/User.js'
import Commit from '../models/Commit.js'

const router = express.Router()

// Get scheduler status
router.get('/status', async (req, res) => {
  try {
    const status = schedulerService.getSchedulerStatus()
    
    // Get recent commit stats
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayCommits = await Commit.countDocuments({
      createdAt: { $gte: today },
      status: 'success',
      type: 'auto'
    })

    const failedCommits = await Commit.countDocuments({
      createdAt: { $gte: today },
      status: 'failed',
      type: 'auto'
    })

    // Get user stats
    const totalUsers = await User.countDocuments({ isActive: true })
    const freeUsers = await User.countDocuments({ 
      plan: 'free', 
      isActive: true,
      'commitSettings.enableAutoCommits': true 
    })
    const premiumUsers = await User.countDocuments({ 
      plan: 'premium', 
      subscriptionStatus: 'active',
      isActive: true,
      'commitSettings.enableAutoCommits': true 
    })

    res.json({
      success: true,
      scheduler: status,
      stats: {
        todayCommits,
        failedCommits,
        totalUsers,
        freeUsers,
        premiumUsers
      }
    })
  } catch (error) {
    console.error('Error getting scheduler status:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get scheduler status',
      error: error.message
    })
  }
})

// Test free user commits (admin only)
router.post('/test/free-users', async (req, res) => {
  try {
    console.log('🧪 Manual test triggered: Free user commits')
    await schedulerService.testFreeUserCommits()
    
    res.json({
      success: true,
      message: 'Free user commits test completed'
    })
  } catch (error) {
    console.error('Error testing free user commits:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to test free user commits',
      error: error.message
    })
  }
})

// Test premium user commits (admin only)
router.post('/test/premium-users', async (req, res) => {
  try {
    console.log('🧪 Manual test triggered: Premium user commits')
    await schedulerService.testPremiumUserCommits()
    
    res.json({
      success: true,
      message: 'Premium user commits test completed'
    })
  } catch (error) {
    console.error('Error testing premium user commits:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to test premium user commits',
      error: error.message
    })
  }
})

// Test specific user commit
router.post('/test/user/:clerkId', async (req, res) => {
  try {
    const { clerkId } = req.params
    console.log(`🧪 Manual test triggered: User commit for ${clerkId}`)
    
    const result = await schedulerService.testUserCommit(clerkId)
    
    res.json({
      success: true,
      message: `User commit test completed for ${clerkId}`,
      result
    })
  } catch (error) {
    console.error('Error testing user commit:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to test user commit',
      error: error.message
    })
  }
})

// Get recent commits for debugging
router.get('/commits/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20
    
    const commits = await Commit.find({
      type: 'auto'
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'firstName lastName email plan')
    
    res.json({
      success: true,
      commits: commits.map(commit => ({
        id: commit._id,
        clerkId: commit.clerkId,
        user: commit.userId,
        repository: commit.repository,
        status: commit.status,
        type: commit.type,
        commitMessage: commit.commitMessage,
        createdAt: commit.createdAt,
        executedAt: commit.executedAt,
        error: commit.error
      }))
    })
  } catch (error) {
    console.error('Error getting recent commits:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get recent commits',
      error: error.message
    })
  }
})

// Get users eligible for auto commits
router.get('/users/eligible', async (req, res) => {
  try {
    const freeUsers = await User.find({
      plan: 'free',
      isActive: true,
      githubToken: { $exists: true, $ne: null },
      'repositories.isActive': true,
      'commitSettings.enableAutoCommits': true
    }).select('clerkId firstName lastName email trialEndDate repositories commitSettings')

    const premiumUsers = await User.find({
      plan: 'premium',
      subscriptionStatus: 'active',
      isActive: true,
      githubToken: { $exists: true, $ne: null },
      'repositories.isActive': true,
      'commitSettings.enableAutoCommits': true
    }).select('clerkId firstName lastName email repositories commitSettings')

    // Check trial status for free users
    const freeUsersWithStatus = freeUsers.map(user => ({
      ...user.toObject(),
      canUseAutoCommit: user.canUseAutoCommit(),
      trialDaysRemaining: user.getTrialDaysRemaining(),
      activeRepository: user.getActiveRepository()
    }))

    const premiumUsersWithStatus = premiumUsers.map(user => ({
      ...user.toObject(),
      canUseAutoCommit: true,
      activeRepository: user.getActiveRepository()
    }))

    res.json({
      success: true,
      freeUsers: freeUsersWithStatus,
      premiumUsers: premiumUsersWithStatus,
      summary: {
        totalFreeUsers: freeUsers.length,
        eligibleFreeUsers: freeUsersWithStatus.filter(u => u.canUseAutoCommit).length,
        totalPremiumUsers: premiumUsers.length
      }
    })
  } catch (error) {
    console.error('Error getting eligible users:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get eligible users',
      error: error.message
    })
  }
})

export default router
