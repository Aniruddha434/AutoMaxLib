import { apiService } from './apiService'

class RepositoryService {
  constructor() {
    this.api = apiService
  }

  // Get available repository README templates
  async getRepositoryReadmeTemplates() {
    try {
      const response = await this.api.get('/repository/readme/templates')
      return response
    } catch (error) {
      console.error('Error fetching repository README templates:', error)
      throw error
    }
  }

  // Get repository README generation history
  async getRepositoryReadmeHistory() {
    try {
      const response = await this.api.get('/repository/readme/history')
      return response
    } catch (error) {
      console.error('Error fetching repository README history:', error)
      throw error
    }
  }

  // Analyze repository structure and content
  async analyzeRepository(repositoryUrl) {
    try {
      const response = await this.api.post('/repository/readme/analyze', {
        repositoryUrl
      })
      return response
    } catch (error) {
      console.error('Error analyzing repository:', error)
      throw error
    }
  }

  // Generate repository README
  async generateRepositoryReadme(repositoryData, analysisData, template = 'web-application', customSections = {}) {
    try {
      const response = await this.api.post('/repository/readme/generate', {
        repositoryData,
        analysisData,
        template,
        customSections
      })
      return response
    } catch (error) {
      console.error('Error generating repository README:', error)
      throw error
    }
  }

  // Get specific repository README by ID
  async getRepositoryReadme(readmeId) {
    try {
      const response = await this.api.get(`/repository/readme/${readmeId}`)
      return response
    } catch (error) {
      console.error('Error fetching repository README:', error)
      throw error
    }
  }

  // Deploy repository README to GitHub repository
  async deployRepositoryReadme(readmeId, targetRepository) {
    try {
      const response = await this.api.post(`/repository/readme/${readmeId}/deploy`, {
        targetRepository
      })
      return response
    } catch (error) {
      console.error('Error deploying repository README:', error)
      throw error
    }
  }

  // Download repository README as file
  async downloadRepositoryReadme(readmeId) {
    try {
      const response = await fetch(`${this.api.api.defaults.baseURL}/repository/readme/${readmeId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await window.Clerk?.session?.getToken()}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to download repository README')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Repository-README-${readmeId}.md`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      return { success: true }
    } catch (error) {
      console.error('Error downloading repository README:', error)
      throw error
    }
  }

  // Validate repository URL
  validateRepositoryUrl(repositoryUrl) {
    const errors = []
    const warnings = []

    // Check if URL is provided
    if (!repositoryUrl || repositoryUrl.trim().length === 0) {
      errors.push('Repository URL is required')
      return { isValid: false, errors, warnings }
    }

    // Check if it's a valid URL
    try {
      const url = new URL(repositoryUrl)
      
      // Check if it's a GitHub URL
      if (url.hostname !== 'github.com') {
        errors.push('Only GitHub repositories are supported')
      }

      // Check URL format
      const pathParts = url.pathname.split('/').filter(part => part.length > 0)
      if (pathParts.length < 2) {
        errors.push('Invalid GitHub repository URL format. Expected: https://github.com/owner/repo')
      }

      // Check for valid owner and repo names
      if (pathParts.length >= 2) {
        const [owner, repo] = pathParts
        if (!owner || !repo) {
          errors.push('Repository owner and name are required')
        }
        
        // Basic validation for GitHub username/repo name format
        const validNamePattern = /^[a-zA-Z0-9._-]+$/
        if (!validNamePattern.test(owner)) {
          errors.push('Invalid repository owner name')
        }
        if (!validNamePattern.test(repo.replace(/\.git$/, ''))) {
          errors.push('Invalid repository name')
        }
      }

    } catch (error) {
      errors.push('Invalid URL format')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  // Parse repository URL to extract owner and repo
  parseRepositoryUrl(repositoryUrl) {
    try {
      const url = new URL(repositoryUrl)
      const pathParts = url.pathname.split('/').filter(part => part.length > 0)
      
      if (pathParts.length >= 2) {
        const owner = pathParts[0]
        const repo = pathParts[1].replace(/\.git$/, '')
        
        return {
          success: true,
          owner,
          repo,
          fullName: `${owner}/${repo}`
        }
      }
    } catch (error) {
      // Invalid URL
    }

    return {
      success: false,
      owner: null,
      repo: null,
      fullName: null
    }
  }

  // Get default repository data structure
  getDefaultRepositoryData() {
    return {
      owner: '',
      name: '',
      fullName: '',
      description: '',
      language: '',
      languages: [],
      topics: [],
      license: '',
      homepage: '',
      size: 0,
      stargazersCount: 0,
      forksCount: 0,
      openIssuesCount: 0,
      defaultBranch: 'main'
    }
  }

  // Get default analysis data structure
  getDefaultAnalysisData() {
    return {
      projectType: 'web-application',
      technologies: [],
      frameworks: [],
      buildTools: [],
      packageManagers: [],
      databases: [],
      deploymentPlatforms: [],
      mainFiles: [],
      configFiles: [],
      hasTests: false,
      hasDocumentation: false,
      hasCI: false,
      estimatedComplexity: 'moderate',
      keyFeatures: [],
      architecture: '',
      setupInstructions: '',
      codeStructure: {
        totalFiles: 0,
        directories: [],
        fileTypes: {}
      }
    }
  }

  // Format repository data for display
  formatRepositoryDataForDisplay(repositoryData) {
    return {
      ...repositoryData,
      languagesText: repositoryData.languages ? repositoryData.languages.join(', ') : '',
      topicsText: repositoryData.topics ? repositoryData.topics.join(', ') : '',
      sizeFormatted: this.formatFileSize(repositoryData.size || 0),
      starsFormatted: this.formatNumber(repositoryData.stargazersCount || 0),
      forksFormatted: this.formatNumber(repositoryData.forksCount || 0)
    }
  }

  // Format analysis data for display
  formatAnalysisDataForDisplay(analysisData) {
    return {
      ...analysisData,
      technologiesText: analysisData.technologies ? analysisData.technologies.join(', ') : '',
      frameworksText: analysisData.frameworks ? analysisData.frameworks.join(', ') : '',
      buildToolsText: analysisData.buildTools ? analysisData.buildTools.join(', ') : '',
      keyFeaturesText: analysisData.keyFeatures ? analysisData.keyFeatures.join(', ') : '',
      complexityBadge: this.getComplexityBadge(analysisData.estimatedComplexity)
    }
  }

  // Format file size
  formatFileSize(sizeInKB) {
    if (sizeInKB < 1024) {
      return `${sizeInKB} KB`
    } else if (sizeInKB < 1024 * 1024) {
      return `${(sizeInKB / 1024).toFixed(1)} MB`
    } else {
      return `${(sizeInKB / (1024 * 1024)).toFixed(1)} GB`
    }
  }

  // Format numbers with K, M suffixes
  formatNumber(num) {
    if (num < 1000) {
      return num.toString()
    } else if (num < 1000000) {
      return `${(num / 1000).toFixed(1)}K`
    } else {
      return `${(num / 1000000).toFixed(1)}M`
    }
  }

  // Get complexity badge
  getComplexityBadge(complexity) {
    const badges = {
      'simple': { color: 'green', text: 'Simple' },
      'moderate': { color: 'yellow', text: 'Moderate' },
      'complex': { color: 'red', text: 'Complex' }
    }
    return badges[complexity] || badges['moderate']
  }

  // Get project type icon
  getProjectTypeIcon(projectType) {
    const icons = {
      'web-application': '🌐',
      'library-package': '📦',
      'cli-tool': '⚡',
      'api-service': '🔌',
      'mobile-app': '📱',
      'data-science': '📊',
      'game-entertainment': '🎮',
      'educational': '📚'
    }
    return icons[projectType] || '💻'
  }
}

export const repositoryService = new RepositoryService()
export default repositoryService
