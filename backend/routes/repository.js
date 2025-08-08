import express from 'express'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'
import aiService from '../services/aiService.js'
import githubService from '../services/githubService.js'

const router = express.Router()

// Get repository README templates
router.get('/readme/templates', async (req, res) => {
  try {
    const templates = aiService.getAvailableRepositoryTemplates()

    res.json({
      success: true,
      templates
    })
  } catch (error) {
    console.error('Error fetching repository README templates:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch repository templates'
    })
  }
})

// Get user's repository README generation history
router.get('/readme/history', async (req, res) => {
  try {
    let user = await User.findOne({ clerkId: req.auth.userId })

    if (!user) {
      // Auto-create user if they don't exist
      console.log('Auto-creating user for repository README history request, Clerk ID:', req.auth.userId)
      user = new User({
        clerkId: req.auth.userId,
        email: 'unknown@example.com',
        firstName: 'User',
        lastName: 'Name',
        plan: 'free'
      })
      await user.save()
      console.log('User auto-created for repository README history:', user._id)
    }

    const readmeHistory = user.repositoryReadmeGeneration.generatedReadmes.map(readme => ({
      id: readme.id,
      template: readme.template,
      repositoryData: readme.repositoryData,
      generatedAt: readme.generatedAt,
      wordCount: readme.wordCount,
      isDeployed: readme.isDeployed,
      deployedAt: readme.deployedAt,
      deployedToRepository: readme.deployedToRepository
    }))

    // Get usage limits for display
    const usageLimits = user.canGenerateRepositoryReadme()

    res.json({
      success: true,
      history: readmeHistory,
      usage: {
        monthly: user.repositoryReadmeGeneration.monthlyUsage || 0,
        total: user.repositoryReadmeGeneration.totalGenerations || 0
      },
      limits: {
        canGenerate: usageLimits.canGenerate,
        usage: usageLimits.usage,
        limit: usageLimits.limit,
        remaining: usageLimits.remaining,
        isPremium: usageLimits.isPremium,
        limitType: usageLimits.limitType,
        reason: usageLimits.reason || null
      }
    })
  } catch (error) {
    console.error('Error fetching repository README history:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch repository README history'
    })
  }
})

// Analyze repository structure and content
router.post('/readme/analyze', [
  body('repositoryUrl').isURL().withMessage('Valid repository URL is required'),
  body('repositoryUrl').matches(/github\.com\/[^\/]+\/[^\/]+/).withMessage('Must be a valid GitHub repository URL')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { repositoryUrl } = req.body
    
    // Extract owner and repo from URL
    const urlMatch = repositoryUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (!urlMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid GitHub repository URL format'
      })
    }

    const [, owner, repoName] = urlMatch
    const cleanRepoName = repoName.replace(/\.git$/, '')

    let user = await User.findOne({ clerkId: req.auth.userId })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check if user has GitHub token
    if (!user.githubToken) {
      return res.status(400).json({
        success: false,
        message: 'GitHub token not found. Please connect your GitHub account first.'
      })
    }

    // Analyze repository
    const analysisResult = await aiService.analyzeRepository(
      user.githubToken,
      owner,
      cleanRepoName
    )

    res.json({
      success: true,
      analysis: analysisResult
    })
  } catch (error) {
    console.error('Error analyzing repository:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze repository'
    })
  }
})

// Generate repository README
router.post('/readme/generate', [
  body('template').isIn(['web-application', 'library-package', 'cli-tool', 'api-service', 'mobile-app', 'data-science', 'game-entertainment', 'educational']).withMessage('Invalid template'),
  body('repositoryData').isObject().withMessage('Repository data is required'),
  body('analysisData').isObject().withMessage('Analysis data is required'),
  body('customSections').optional().isObject().withMessage('Custom sections must be an object')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { template, repositoryData, analysisData, customSections = {} } = req.body

    let user = await User.findOne({ clerkId: req.auth.userId })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check if user can generate repository README
    const canGenerate = user.canGenerateRepositoryReadme()
    if (!canGenerate.canGenerate) {
      return res.status(403).json({
        success: false,
        message: canGenerate.reason,
        usage: {
          monthly: user.repositoryReadmeGeneration.monthlyUsage,
          limit: canGenerate.limit
        }
      })
    }

    // Generate repository README content
    const readmeResult = await aiService.generateRepositoryReadmeContent(
      repositoryData,
      analysisData,
      template,
      customSections
    )

    // Save the generated repository README
    const readmeData = {
      template,
      content: readmeResult.content,
      repositoryData,
      analysisData,
      customSections,
      wordCount: readmeResult.wordCount,
      generatedAt: readmeResult.generatedAt
    }

    const savedReadme = user.addGeneratedRepositoryReadme(readmeData)
    await user.save()

    // Get updated usage limits after generation
    const updatedLimits = user.canGenerateRepositoryReadme()

    res.json({
      success: true,
      message: 'Repository README generated successfully',
      readme: {
        id: savedReadme.id,
        content: savedReadme.content,
        template: savedReadme.template,
        wordCount: savedReadme.wordCount,
        generatedAt: savedReadme.generatedAt,
        repositoryData: savedReadme.repositoryData
      },
      usage: {
        monthly: user.repositoryReadmeGeneration.monthlyUsage || 0,
        total: user.repositoryReadmeGeneration.totalGenerations || 0
      },
      limits: {
        canGenerate: updatedLimits.canGenerate,
        usage: updatedLimits.usage,
        limit: updatedLimits.limit,
        remaining: updatedLimits.remaining,
        isPremium: updatedLimits.isPremium,
        limitType: updatedLimits.limitType,
        reason: updatedLimits.reason || null
      }
    })
  } catch (error) {
    console.error('Error generating repository README:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate repository README'
    })
  }
})

// Get specific repository README by ID
router.get('/readme/:readmeId', async (req, res) => {
  try {
    const { readmeId } = req.params
    const user = await User.findOne({ clerkId: req.auth.userId })
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const readme = user.getRepositoryReadmeById(readmeId)
    
    if (!readme) {
      return res.status(404).json({
        success: false,
        message: 'Repository README not found'
      })
    }

    res.json({
      success: true,
      readme: {
        id: readme.id,
        content: readme.content,
        template: readme.template,
        repositoryData: readme.repositoryData,
        analysisData: readme.analysisData,
        customSections: readme.customSections,
        wordCount: readme.wordCount,
        generatedAt: readme.generatedAt,
        isDeployed: readme.isDeployed,
        deployedAt: readme.deployedAt,
        deployedToRepository: readme.deployedToRepository
      }
    })
  } catch (error) {
    console.error('Error fetching repository README:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch repository README'
    })
  }
})

// Deploy repository README to GitHub repository
router.post('/readme/:readmeId/deploy', [
  body('targetRepository').isObject().withMessage('Target repository information is required'),
  body('targetRepository.owner').isString().withMessage('Repository owner is required'),
  body('targetRepository.name').isString().withMessage('Repository name is required'),
  body('targetRepository.branch').optional().isString().withMessage('Branch must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { readmeId } = req.params
    const { targetRepository } = req.body
    const { owner, name, branch = 'main' } = targetRepository

    let user = await User.findOne({ clerkId: req.auth.userId })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check if user has GitHub token
    if (!user.githubToken) {
      return res.status(400).json({
        success: false,
        message: 'GitHub token not found. Please connect your GitHub account first.'
      })
    }

    const readme = user.getRepositoryReadmeById(readmeId)
    if (!readme) {
      return res.status(404).json({
        success: false,
        message: 'Repository README not found'
      })
    }

    // Deploy to GitHub repository
    const path = 'README.md'
    const content = readme.content
    const message = `Update README.md via AutoGitPilot Repository README Generator`

    console.log(`🚀 Attempting to deploy repository README to ${owner}/${name}`)

    // Validate repository access
    const repoValidation = await githubService.validateRepositoryAccess(
      user.githubToken,
      owner,
      name
    )

    if (!repoValidation.success) {
      return res.status(400).json({
        success: false,
        message: `Cannot access repository ${owner}/${name}. ${repoValidation.message}`
      })
    }

    // Deploy the README
    const deployResult = await githubService.updateRepositoryFile(
      user.githubToken,
      owner,
      name,
      path,
      content,
      message,
      branch
    )

    if (deployResult.success) {
      // Mark as deployed
      const deploymentInfo = { owner, name, branch }
      user.markRepositoryReadmeAsDeployed(readmeId, deploymentInfo)
      await user.save()

      console.log(`✅ Repository README deployed successfully to ${owner}/${name}`)

      res.json({
        success: true,
        message: 'Repository README deployed successfully',
        deployment: {
          repository: `${owner}/${name}`,
          branch,
          url: `https://github.com/${owner}/${name}`,
          commitSha: deployResult.commitSha,
          deployedAt: new Date()
        }
      })
    } else {
      console.error(`❌ Failed to deploy repository README to ${owner}/${name}:`, deployResult.message)
      res.status(500).json({
        success: false,
        message: deployResult.message || 'Failed to deploy repository README'
      })
    }
  } catch (error) {
    console.error('Error deploying repository README:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to deploy repository README'
    })
  }
})

export default router
