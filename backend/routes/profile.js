import express from 'express'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'
import aiService from '../services/aiService.js'
import githubService from '../services/githubService.js'

const router = express.Router()

// Get README templates
router.get('/readme/templates', async (req, res) => {
  try {
    const templates = aiService.getAvailableTemplates()

    res.json({
      success: true,
      templates
    })
  } catch (error) {
    console.error('Error fetching README templates:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch templates'
    })
  }
})

// Get user's README generation history
router.get('/readme/history', async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId })
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const readmeHistory = user.readmeGeneration.generatedReadmes.map(readme => ({
      id: readme.id,
      template: readme.template,
      generatedAt: readme.generatedAt,
      wordCount: readme.wordCount,
      isDeployed: readme.isDeployed,
      deployedAt: readme.deployedAt
    }))

    res.json({
      success: true,
      history: readmeHistory,
      usage: {
        monthly: user.readmeGeneration.monthlyUsage,
        total: user.readmeGeneration.totalGenerations,
        lastReset: user.readmeGeneration.lastUsageReset
      }
    })
  } catch (error) {
    console.error('Error fetching README history:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch README history'
    })
  }
})

// Generate README
router.post('/readme/generate', [
  body('template').isIn(['modern-visual', 'professional', 'creative', 'minimalist', 'developer-focused']).withMessage('Invalid template'),
  body('profileData').isObject().withMessage('Profile data is required'),
  body('profileData.bio').optional().isString().withMessage('Bio must be a string'),
  body('profileData.currentRole').optional().isString().withMessage('Current role must be a string'),
  body('profileData.company').optional().isString().withMessage('Company must be a string'),
  body('profileData.location').optional().isString().withMessage('Location must be a string'),
  body('profileData.skills').optional().isArray().withMessage('Skills must be an array'),
  body('customSections').optional().isObject().withMessage('Custom sections must be an object')
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

    // Check if user can generate README
    const canGenerate = user.canGenerateReadme()
    if (!canGenerate.canGenerate) {
      return res.status(403).json({
        success: false,
        message: canGenerate.reason,
        usage: canGenerate.usage,
        limit: canGenerate.limit
      })
    }

    // Check if AI service is available
    if (!aiService.isAvailable()) {
      return res.status(503).json({
        success: false,
        message: 'AI service is not available. Please contact support.'
      })
    }

    const { template, profileData, customSections = {} } = req.body

    // Merge user data with provided profile data
    const completeProfileData = {
      firstName: user.firstName || 'Developer',
      lastName: user.lastName || '',
      email: user.email || '',
      githubUsername: user.githubUsername || 'username',
      ...profileData
    }

    // Validate profile data
    const validation = aiService.validateProfileData(completeProfileData)
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Profile data validation failed',
        errors: validation.errors,
        warnings: validation.warnings
      })
    }

    // Generate README content
    const readmeResult = await aiService.generateReadmeContent(
      completeProfileData,
      template,
      customSections
    )

    // Save the generated README
    const readmeData = {
      template,
      content: readmeResult.content,
      profileData: completeProfileData,
      customSections,
      wordCount: readmeResult.wordCount,
      generatedAt: readmeResult.generatedAt
    }

    const savedReadme = user.addGeneratedReadme(readmeData)
    await user.save()

    res.json({
      success: true,
      message: 'README generated successfully',
      readme: {
        id: savedReadme.id,
        content: savedReadme.content,
        template: savedReadme.template,
        wordCount: savedReadme.wordCount,
        generatedAt: savedReadme.generatedAt
      },
      usage: {
        monthly: user.readmeGeneration.monthlyUsage,
        remaining: canGenerate.limit - user.readmeGeneration.monthlyUsage
      },
      validation: {
        completeness: validation.completeness,
        warnings: validation.warnings
      }
    })
  } catch (error) {
    console.error('Error generating README:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate README'
    })
  }
})

// Get specific README by ID
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

    const readme = user.readmeGeneration.generatedReadmes.find(r => r.id === readmeId)
    
    if (!readme) {
      return res.status(404).json({
        success: false,
        message: 'README not found'
      })
    }

    res.json({
      success: true,
      readme: {
        id: readme.id,
        content: readme.content,
        template: readme.template,
        profileData: readme.profileData,
        customSections: readme.customSections,
        wordCount: readme.wordCount,
        generatedAt: readme.generatedAt,
        isDeployed: readme.isDeployed,
        deployedAt: readme.deployedAt
      }
    })
  } catch (error) {
    console.error('Error fetching README:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch README'
    })
  }
})

// Deploy README to GitHub profile repository
router.post('/readme/:readmeId/deploy', async (req, res) => {
  try {
    const { readmeId } = req.params
    const user = await User.findOne({ clerkId: req.auth.userId })
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    if (!user.githubToken) {
      return res.status(400).json({
        success: false,
        message: 'GitHub token not found. Please connect your GitHub account.'
      })
    }

    const readme = user.readmeGeneration.generatedReadmes.find(r => r.id === readmeId)
    
    if (!readme) {
      return res.status(404).json({
        success: false,
        message: 'README not found'
      })
    }

    // Deploy to GitHub profile repository (username/username)
    const owner = user.githubUsername
    const repo = user.githubUsername // Profile repository has same name as username
    const path = 'README.md'
    const content = readme.content
    const message = 'Update profile README via AutoGitPilot'

    console.log(`🚀 Attempting to deploy README to ${owner}/${repo}`)

    // First, validate that the profile repository exists, create if it doesn't
    try {
      const repoValidation = await githubService.validateRepositoryAccess(
        user.githubToken,
        owner,
        repo
      )

      if (!repoValidation.success) {
        console.log(`📁 Profile repository ${owner}/${repo} not found, creating automatically...`)

        try {
          const createResult = await githubService.createProfileRepository(
            user.githubToken,
            owner
          )

          if (createResult.success) {
            console.log(`✅ Profile repository created automatically: ${createResult.repository.htmlUrl}`)
          } else {
            throw new Error('Failed to create profile repository')
          }
        } catch (createError) {
          console.error('Failed to auto-create profile repository:', createError)
          return res.status(400).json({
            success: false,
            message: `GitHub profile repository '${owner}/${repo}' not found and could not be created automatically.`,
            hint: `Please create a repository named '${repo}' on GitHub manually, or check your GitHub permissions.`,
            autoCreateFailed: true
          })
        }
      }
    } catch (error) {
      console.error('Repository validation error:', error)
      return res.status(400).json({
        success: false,
        message: `Cannot access GitHub profile repository '${owner}/${repo}'. Please ensure you have proper GitHub permissions.`,
        hint: `Check your GitHub token permissions and try again.`
      })
    }

    const result = await githubService.createOrUpdateFile(
      user.githubToken,
      owner,
      repo,
      path,
      content,
      message
    )

    if (result.success) {
      // Mark README as deployed
      user.markReadmeAsDeployed(readmeId)
      await user.save()

      console.log(`✅ README deployed successfully to ${owner}/${repo}`)
      res.json({
        success: true,
        message: 'README deployed successfully to GitHub profile',
        deployment: {
          url: result.commit.url,
          sha: result.commit.sha,
          deployedAt: new Date()
        }
      })
    } else {
      console.error('GitHub deployment failed:', result)
      throw new Error('GitHub deployment failed')
    }
  } catch (error) {
    console.error('Error deploying README:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to deploy README to GitHub'
    })
  }
})

// Create GitHub profile repository
router.post('/create-profile-repo', async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    if (!user.githubToken) {
      return res.status(400).json({
        success: false,
        message: 'GitHub token not found. Please connect your GitHub account.'
      })
    }

    if (!user.githubUsername) {
      return res.status(400).json({
        success: false,
        message: 'GitHub username not found. Please update your profile.'
      })
    }

    // Check if repository already exists
    const existingRepo = await githubService.validateRepositoryAccess(
      user.githubToken,
      user.githubUsername,
      user.githubUsername
    )

    if (existingRepo.success) {
      return res.json({
        success: true,
        message: 'Profile repository already exists',
        repository: existingRepo.repository,
        alreadyExists: true
      })
    }

    // Create the profile repository
    const result = await githubService.createProfileRepository(
      user.githubToken,
      user.githubUsername
    )

    res.json({
      success: true,
      message: 'GitHub profile repository created successfully!',
      repository: result.repository,
      alreadyExists: false
    })
  } catch (error) {
    console.error('Error creating profile repository:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create profile repository'
    })
  }
})

// Download README as file
router.get('/readme/:readmeId/download', async (req, res) => {
  try {
    const { readmeId } = req.params
    const user = await User.findOne({ clerkId: req.auth.userId })
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const readme = user.readmeGeneration.generatedReadmes.find(r => r.id === readmeId)
    
    if (!readme) {
      return res.status(404).json({
        success: false,
        message: 'README not found'
      })
    }

    // Set headers for file download
    res.setHeader('Content-Type', 'text/markdown')
    res.setHeader('Content-Disposition', `attachment; filename="README-${readme.template}-${readmeId}.md"`)
    
    res.send(readme.content)
  } catch (error) {
    console.error('Error downloading README:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to download README'
    })
  }
})

export default router
