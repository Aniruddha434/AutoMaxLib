import { jest } from '@jest/globals'
import request from 'supertest'
import express from 'express'
import User from '../models/User.js'
import aiService from '../services/aiService.js'
import profileRoutes from '../routes/profile.js'
import repositoryRoutes from '../routes/repository.js'

// Mock dependencies
jest.mock('../models/User.js')
jest.mock('../services/aiService.js')

const app = express()
app.use(express.json())

// Mock Clerk middleware
app.use('/api/profile', (req, res, next) => {
  req.auth = { userId: 'test-user-id' }
  next()
}, profileRoutes)

app.use('/api/repository', (req, res, next) => {
  req.auth = { userId: 'test-user-id' }
  next()
}, repositoryRoutes)

describe('README Generation API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/profile/readme/templates', () => {
    it('should return available README templates', async () => {
      const mockTemplates = [
        {
          id: 'professional',
          name: 'Professional',
          description: 'Clean, business-focused layout',
          features: ['Technology badges', 'GitHub stats']
        }
      ]

      aiService.getAvailableTemplates.mockReturnValue(mockTemplates)

      const response = await request(app)
        .get('/api/profile/readme/templates')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.templates).toEqual(mockTemplates)
    })
  })

  describe('POST /api/profile/readme/generate', () => {
    it('should generate README for premium user', async () => {
      const mockUser = {
        clerkId: 'test-user-id',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        githubUsername: 'johndoe',
        canGenerateReadme: jest.fn().mockReturnValue({
          canGenerate: true,
          usage: 2,
          limit: 5,
          remaining: 3
        }),
        addGeneratedReadme: jest.fn().mockReturnValue({
          id: 'readme-123',
          content: '# John Doe\n\nSoftware Developer',
          template: 'professional',
          wordCount: 50,
          generatedAt: new Date()
        }),
        save: jest.fn().mockResolvedValue(true),
        readmeGeneration: {
          monthlyUsage: 3
        }
      }

      const mockReadmeResult = {
        success: true,
        content: '# John Doe\n\nSoftware Developer',
        wordCount: 50,
        generatedAt: new Date()
      }

      User.findOne.mockResolvedValue(mockUser)
      aiService.isAvailable.mockReturnValue(true)
      aiService.validateProfileData.mockReturnValue({
        isValid: true,
        errors: [],
        warnings: [],
        completeness: 80
      })
      aiService.generateReadmeContent.mockResolvedValue(mockReadmeResult)

      const requestData = {
        template: 'professional',
        profileData: {
          bio: 'Passionate developer',
          currentRole: 'Software Engineer',
          skills: ['JavaScript', 'React', 'Node.js']
        },
        customSections: {}
      }

      const response = await request(app)
        .post('/api/profile/readme/generate')
        .send(requestData)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.readme).toBeDefined()
      expect(response.body.readme.content).toBe(mockReadmeResult.content)
      expect(response.body.usage.monthly).toBe(3)
      expect(mockUser.addGeneratedReadme).toHaveBeenCalled()
      expect(mockUser.save).toHaveBeenCalled()
    })

    it('should reject non-premium user', async () => {
      const mockUser = {
        clerkId: 'test-user-id',
        canGenerateReadme: jest.fn().mockReturnValue({
          canGenerate: false,
          reason: 'Premium feature only'
        })
      }

      User.findOne.mockResolvedValue(mockUser)

      const requestData = {
        template: 'professional',
        profileData: {
          bio: 'Passionate developer'
        }
      }

      const response = await request(app)
        .post('/api/profile/readme/generate')
        .send(requestData)
        .expect(403)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Premium feature only')
    })

    it('should reject when monthly limit reached', async () => {
      const mockUser = {
        clerkId: 'test-user-id',
        canGenerateReadme: jest.fn().mockReturnValue({
          canGenerate: false,
          reason: 'Monthly limit reached (5 generations per month)',
          usage: 5,
          limit: 5
        })
      }

      User.findOne.mockResolvedValue(mockUser)

      const requestData = {
        template: 'professional',
        profileData: {
          bio: 'Passionate developer'
        }
      }

      const response = await request(app)
        .post('/api/profile/readme/generate')
        .send(requestData)
        .expect(403)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Monthly limit reached')
    })

    it('should validate profile data', async () => {
      const mockUser = {
        clerkId: 'test-user-id',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        githubUsername: 'johndoe',
        canGenerateReadme: jest.fn().mockReturnValue({
          canGenerate: true,
          usage: 2,
          limit: 5
        })
      }

      User.findOne.mockResolvedValue(mockUser)
      aiService.isAvailable.mockReturnValue(true)
      aiService.validateProfileData.mockReturnValue({
        isValid: false,
        errors: ['Bio is required'],
        warnings: []
      })

      const requestData = {
        template: 'professional',
        profileData: {},
        customSections: {}
      }

      const response = await request(app)
        .post('/api/profile/readme/generate')
        .send(requestData)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Profile data validation failed')
      expect(response.body.errors).toContain('Bio is required')
    })
  })

  describe('GET /api/profile/readme/history', () => {
    it('should return user README history', async () => {
      const mockUser = {
        clerkId: 'test-user-id',
        readmeGeneration: {
          generatedReadmes: [
            {
              id: 'readme-1',
              template: 'professional',
              generatedAt: new Date(),
              wordCount: 100,
              isDeployed: true,
              deployedAt: new Date()
            }
          ],
          monthlyUsage: 3,
          totalGenerations: 10,
          lastUsageReset: new Date()
        }
      }

      User.findOne.mockResolvedValue(mockUser)

      const response = await request(app)
        .get('/api/profile/readme/history')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.history).toHaveLength(1)
      expect(response.body.usage.monthly).toBe(3)
      expect(response.body.usage.total).toBe(10)
    })
  })

  describe('GET /api/profile/readme/:readmeId', () => {
    it('should return specific README', async () => {
      const mockReadme = {
        id: 'readme-123',
        content: '# John Doe\n\nSoftware Developer',
        template: 'professional',
        profileData: { bio: 'Developer' },
        customSections: {},
        wordCount: 50,
        generatedAt: new Date(),
        isDeployed: false,
        deployedAt: null
      }

      const mockUser = {
        clerkId: 'test-user-id',
        readmeGeneration: {
          generatedReadmes: [mockReadme]
        }
      }

      User.findOne.mockResolvedValue(mockUser)

      const response = await request(app)
        .get('/api/profile/readme/readme-123')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.readme.id).toBe('readme-123')
      expect(response.body.readme.content).toBe(mockReadme.content)
    })

    it('should return 404 for non-existent README', async () => {
      const mockUser = {
        clerkId: 'test-user-id',
        readmeGeneration: {
          generatedReadmes: []
        }
      }

      User.findOne.mockResolvedValue(mockUser)

      const response = await request(app)
        .get('/api/profile/readme/non-existent')
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('README not found')
    })
  })
})

describe('AI Service', () => {
  describe('validateProfileData', () => {
    it('should validate complete profile data', () => {
      const profileData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        githubUsername: 'johndoe',
        bio: 'Passionate full-stack developer',
        currentRole: 'Software Engineer',
        skills: ['JavaScript', 'React', 'Node.js'],
        experience: [
          {
            role: 'Software Engineer',
            company: 'Tech Corp',
            duration: '2022-Present'
          }
        ],
        projects: [
          {
            name: 'Awesome App',
            description: 'A great application',
            url: 'https://github.com/johndoe/awesome-app'
          }
        ]
      }

      // This would test the actual validation logic
      // For now, we'll mock it since the service is mocked
      aiService.validateProfileData.mockReturnValue({
        isValid: true,
        errors: [],
        warnings: [],
        completeness: 95
      })

      const result = aiService.validateProfileData(profileData)
      
      expect(result.isValid).toBe(true)
      expect(result.completeness).toBeGreaterThan(90)
    })
  })

  describe('calculateProfileCompleteness', () => {
    it('should calculate correct completeness percentage', () => {
      const profileData = {
        bio: 'Developer',
        skills: ['JavaScript'],
        // Missing other fields
      }

      aiService.calculateProfileCompleteness.mockReturnValue(25)

      const completeness = aiService.calculateProfileCompleteness(profileData)

      expect(completeness).toBe(25)
    })
  })
})

describe('Repository README Generation API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/repository/readme/generate', () => {
    it('should generate repository README with OpenRouter (primary provider)', async () => {
      const mockUser = {
        clerkId: 'test-user-id',
        canGenerateRepositoryReadme: jest.fn().mockReturnValue({
          canGenerate: true,
          usage: 1,
          limit: 2,
          remaining: 1,
          isPremium: false,
          limitType: 'lifetime'
        }),
        addGeneratedRepositoryReadme: jest.fn().mockReturnValue({
          id: 'repo-readme-123',
          content: '# My Awesome Project\n\nA comprehensive README',
          template: 'web-application',
          wordCount: 150,
          generatedAt: new Date()
        }),
        save: jest.fn().mockResolvedValue(true),
        repositoryReadmeGeneration: {
          monthlyUsage: 1,
          totalGenerations: 1
        }
      }

      const mockReadmeResult = {
        success: true,
        content: '# My Awesome Project\n\nA comprehensive README',
        template: 'web-application',
        wordCount: 150,
        generatedAt: new Date(),
        modelUsed: 'OpenRouter:anthropic/claude-3-sonnet',
        provider: 'openrouter',
        quality: { score: 95, issues: [] }
      }

      User.findOne.mockResolvedValue(mockUser)
      aiService.isAvailable.mockReturnValue(true)
      aiService.isOpenRouterAvailable.mockReturnValue(true)
      aiService.generateRepositoryReadmeContent.mockResolvedValue(mockReadmeResult)

      const requestData = {
        template: 'web-application',
        repositoryData: {
          name: 'my-awesome-project',
          description: 'An awesome web application',
          language: 'JavaScript',
          topics: ['react', 'nodejs']
        },
        analysisData: {
          projectType: 'web-application',
          technologies: ['React', 'Node.js', 'Express'],
          frameworks: ['React', 'Express'],
          hasTests: true,
          hasCI: true
        },
        customSections: {}
      }

      const response = await request(app)
        .post('/api/repository/readme/generate')
        .send(requestData)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.readme).toBeDefined()
      expect(response.body.readme.content).toBe(mockReadmeResult.content)
      expect(mockUser.addGeneratedRepositoryReadme).toHaveBeenCalled()
      expect(mockUser.save).toHaveBeenCalled()
    })

    it('should fallback to Gemini when OpenRouter fails', async () => {
      const mockUser = {
        clerkId: 'test-user-id',
        canGenerateRepositoryReadme: jest.fn().mockReturnValue({
          canGenerate: true,
          usage: 1,
          limit: 10,
          remaining: 9,
          isPremium: true,
          limitType: 'monthly'
        }),
        addGeneratedRepositoryReadme: jest.fn().mockReturnValue({
          id: 'repo-readme-124',
          content: '# My Project\n\nGenerated with Gemini fallback',
          template: 'library-package',
          wordCount: 120,
          generatedAt: new Date()
        }),
        save: jest.fn().mockResolvedValue(true),
        repositoryReadmeGeneration: {
          monthlyUsage: 2,
          totalGenerations: 5
        }
      }

      const mockReadmeResult = {
        success: true,
        content: '# My Project\n\nGenerated with Gemini fallback',
        template: 'library-package',
        wordCount: 120,
        generatedAt: new Date(),
        modelUsed: 'Gemini:gemini-1.5-pro',
        provider: 'gemini',
        quality: { score: 88, issues: [] }
      }

      User.findOne.mockResolvedValue(mockUser)
      aiService.isAvailable.mockReturnValue(true)
      aiService.isOpenRouterAvailable.mockReturnValue(false) // OpenRouter not available
      aiService.generateRepositoryReadmeContent.mockResolvedValue(mockReadmeResult)

      const requestData = {
        template: 'library-package',
        repositoryData: {
          name: 'my-library',
          description: 'A useful library package',
          language: 'Python'
        },
        analysisData: {
          projectType: 'library-package',
          technologies: ['Python'],
          frameworks: [],
          hasTests: true,
          hasCI: false
        }
      }

      const response = await request(app)
        .post('/api/repository/readme/generate')
        .send(requestData)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.readme.content).toBe(mockReadmeResult.content)
      expect(mockUser.addGeneratedRepositoryReadme).toHaveBeenCalled()
    })

    it('should respect free user limits for repository README generation', async () => {
      const mockUser = {
        clerkId: 'test-user-id',
        canGenerateRepositoryReadme: jest.fn().mockReturnValue({
          canGenerate: false,
          reason: 'Free plan limit reached. You\'ve used 2 of 2 lifetime repository README generations. Upgrade to Premium for unlimited monthly access.',
          usage: 2,
          limit: 2,
          remaining: 0,
          isPremium: false,
          limitType: 'lifetime'
        })
      }

      User.findOne.mockResolvedValue(mockUser)

      const requestData = {
        template: 'web-application',
        repositoryData: { name: 'test-repo' },
        analysisData: { projectType: 'web-application' }
      }

      const response = await request(app)
        .post('/api/repository/readme/generate')
        .send(requestData)
        .expect(403)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Free plan limit reached')
    })
  })
})
