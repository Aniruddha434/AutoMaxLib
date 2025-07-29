import express from 'express'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'
import githubService from '../services/githubService.js'

const router = express.Router()

// Verify GitHub token
router.post('/verify-token', [
  body('token').notEmpty().withMessage('GitHub token is required')
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

    const { token } = req.body
    const verification = await githubService.verifyToken(token)

    res.json({
      success: true,
      valid: verification.valid,
      user: verification.user,
      error: verification.error
    })
  } catch (error) {
    console.error('Error verifying GitHub token:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Get user repositories
router.post('/repositories', [
  body('token').notEmpty().withMessage('GitHub token is required'),
  body('page').optional().isInt({ min: 1 })
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

    const { token, page = 1 } = req.body
    const repositories = await githubService.getUserRepositories(token, page)

    res.json({
      success: true,
      repositories: repositories.repositories,
      pagination: repositories.pagination
    })
  } catch (error) {
    console.error('Error fetching repositories:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get repository details
router.get('/repository/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params
    
    const user = await User.findOne({ clerkId: req.auth.userId })
    if (!user || !user.githubToken) {
      return res.status(400).json({
        success: false,
        message: 'GitHub token not found'
      })
    }

    const repository = await githubService.getRepository(user.githubToken, owner, repo)

    res.json({
      success: true,
      repository: repository.repository
    })
  } catch (error) {
    console.error('Error fetching repository:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Test commit to repository
router.post('/test-commit', [
  body('repoFullName').notEmpty().withMessage('Repository full name is required'),
  body('filePath').notEmpty().withMessage('File path is required')
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

    const { repoFullName, filePath } = req.body
    const [owner, repo] = repoFullName.split('/')

    const user = await User.findOne({ clerkId: req.auth.userId })
    if (!user || !user.githubToken) {
      return res.status(400).json({
        success: false,
        message: 'GitHub token not found'
      })
    }

    // Validate repository access and get default branch
    const repoValidation = await githubService.validateRepositoryAccess(
      user.githubToken,
      owner,
      repo
    )

    if (!repoValidation.success) {
      return res.status(400).json({
        success: false,
        message: `Repository validation failed: ${repoValidation.error}`
      })
    }

    // Check if file exists
    const fileCheck = await githubService.checkFileExists(
      user.githubToken,
      owner,
      repo,
      filePath
    )

    res.json({
      success: true,
      fileExists: fileCheck.exists,
      defaultBranch: repoValidation.defaultBranch,
      branch: fileCheck.branch,
      message: fileCheck.exists
        ? `File exists and can be updated on branch: ${fileCheck.branch}`
        : `File will be created on first commit on branch: ${fileCheck.branch}`
    })
  } catch (error) {
    console.error('Error testing commit:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get repository statistics
router.get('/stats/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params
    
    const user = await User.findOne({ clerkId: req.auth.userId })
    if (!user || !user.githubToken) {
      return res.status(400).json({
        success: false,
        message: 'GitHub token not found'
      })
    }

    const stats = await githubService.getRepositoryStats(user.githubToken, owner, repo)

    res.json({
      success: true,
      stats: stats.stats
    })
  } catch (error) {
    console.error('Error fetching repository stats:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Debug repository information
router.get('/debug/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params

    const user = await User.findOne({ clerkId: req.auth.userId })
    if (!user || !user.githubToken) {
      return res.status(400).json({
        success: false,
        message: 'GitHub token not found'
      })
    }

    // Validate repository access
    const validation = await githubService.validateRepositoryAccess(
      user.githubToken,
      owner,
      repo
    )

    res.json({
      success: true,
      validation: validation,
      cacheInfo: {
        hasCachedBranch: githubService.branchCache.has(`${owner}/${repo}`),
        cachedBranch: githubService.branchCache.get(`${owner}/${repo}`)
      }
    })
  } catch (error) {
    console.error('Error debugging repository:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get commit history
router.get('/commits/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params
    const { path, limit = 10 } = req.query

    const user = await User.findOne({ clerkId: req.auth.userId })
    if (!user || !user.githubToken) {
      return res.status(400).json({
        success: false,
        message: 'GitHub token not found'
      })
    }

    const commits = await githubService.getCommitHistory(
      user.githubToken,
      owner,
      repo,
      path,
      parseInt(limit)
    )

    res.json({
      success: true,
      commits: commits.commits
    })
  } catch (error) {
    console.error('Error fetching commit history:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

export default router
