import express from 'express'
import { body, validationResult } from 'express-validator'
import { patternService } from '../services/patternService.js'
import User from '../models/User.js'

const router = express.Router()

// Note: Authentication is handled by clerkMiddleware in server.js

// Get available pattern templates
router.get('/templates', async (req, res) => {
  try {
    const templates = patternService.getTemplates()
    
    res.json({
      success: true,
      templates
    })
  } catch (error) {
    console.error('Error fetching pattern templates:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Preview pattern without creating commits
router.post('/preview', [
  body('text').notEmpty().withMessage('Text is required'),
  body('intensity').optional().isInt({ min: 1, max: 4 }).withMessage('Intensity must be between 1 and 4'),
  body('alignment').optional().isIn(['left', 'center', 'right']).withMessage('Alignment must be left, center, or right'),
  body('spacing').optional().isInt({ min: 0, max: 3 }).withMessage('Spacing must be between 0 and 3'),
  body('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date')
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

    const { text, intensity = 3, alignment = 'center', spacing = 1, endDate } = req.body

    // Validate text
    const validation = patternService.validatePatternText(text)
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid text',
        errors: validation.errors
      })
    }

    // Check if user has premium access
    const user = await User.findOne({ clerkId: req.auth.userId })
    if (!user || user.plan !== 'premium') {
      return res.status(403).json({
        success: false,
        message: 'Pattern generation is a premium feature'
      })
    }

    const options = {
      intensity,
      alignment,
      spacing,
      endDate: endDate ? new Date(endDate) : new Date()
    }

    const preview = await patternService.previewPattern(text, options)
    
    res.json(preview)
  } catch (error) {
    console.error('Error previewing pattern:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Generate pattern commits
router.post('/generate', [
  body('text').notEmpty().withMessage('Text is required'),
  body('intensity').optional().isInt({ min: 1, max: 4 }).withMessage('Intensity must be between 1 and 4'),
  body('alignment').optional().isIn(['left', 'center', 'right']).withMessage('Alignment must be left, center, or right'),
  body('spacing').optional().isInt({ min: 0, max: 3 }).withMessage('Spacing must be between 0 and 3'),
  body('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date'),
  body('confirm').isBoolean().withMessage('Confirmation is required')
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

    const { text, intensity = 3, alignment = 'center', spacing = 1, endDate, confirm } = req.body

    if (!confirm) {
      return res.status(400).json({
        success: false,
        message: 'Pattern generation must be confirmed'
      })
    }

    // Validate text
    const validation = patternService.validatePatternText(text)
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid text',
        errors: validation.errors
      })
    }

    // Check if user has premium access and active repository
    const user = await User.findOne({ clerkId: req.auth.userId })
    if (!user || user.plan !== 'premium') {
      return res.status(403).json({
        success: false,
        message: 'Pattern generation is a premium feature'
      })
    }

    if (!user.githubToken) {
      return res.status(400).json({
        success: false,
        message: 'GitHub token not found. Please connect your GitHub account.'
      })
    }

    const activeRepo = user.getActiveRepository()
    if (!activeRepo) {
      return res.status(400).json({
        success: false,
        message: 'No active repository found. Please connect a repository first.'
      })
    }

    const options = {
      intensity,
      alignment,
      spacing,
      endDate: endDate ? new Date(endDate) : new Date()
    }

    // Generate the pattern commits
    const result = await patternService.generatePatternCommits(req.auth.userId, text, options)
    
    res.json({
      success: true,
      message: 'Pattern generation completed successfully',
      stats: result.stats
    })
  } catch (error) {
    console.error('Error generating pattern:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Validate pattern text
router.post('/validate', [
  body('text').notEmpty().withMessage('Text is required')
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

    const { text } = req.body
    const validation = patternService.validatePatternText(text)
    
    res.json({
      success: true,
      validation
    })
  } catch (error) {
    console.error('Error validating pattern text:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

export default router
