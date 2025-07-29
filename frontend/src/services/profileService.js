import { apiService } from './apiService'

class ProfileService {
  constructor() {
    this.api = apiService
  }

  // Get available README templates
  async getReadmeTemplates() {
    try {
      const response = await this.api.get('/profile/readme/templates')
      return response
    } catch (error) {
      console.error('Error fetching README templates:', error)
      throw error
    }
  }

  // Get README generation history
  async getReadmeHistory() {
    try {
      const response = await this.api.get('/profile/readme/history')
      return response
    } catch (error) {
      console.error('Error fetching README history:', error)
      throw error
    }
  }

  // Generate new README
  async generateReadme(profileData, template = 'professional', customSections = {}) {
    try {
      const response = await this.api.post('/profile/readme/generate', {
        profileData,
        template,
        customSections
      })
      return response
    } catch (error) {
      console.error('Error generating README:', error)
      throw error
    }
  }

  // Get specific README by ID
  async getReadme(readmeId) {
    try {
      const response = await this.api.get(`/profile/readme/${readmeId}`)
      return response
    } catch (error) {
      console.error('Error fetching README:', error)
      throw error
    }
  }

  // Deploy README to GitHub profile
  async deployReadme(readmeId) {
    try {
      const response = await this.api.post(`/profile/readme/${readmeId}/deploy`)
      return response
    } catch (error) {
      console.error('Error deploying README:', error)
      throw error
    }
  }

  // Create GitHub profile repository
  async createProfileRepository() {
    try {
      const response = await this.api.post('/profile/create-profile-repo')
      return response
    } catch (error) {
      console.error('Error creating profile repository:', error)
      throw error
    }
  }

  // Download README as file
  async downloadReadme(readmeId) {
    try {
      const response = await fetch(`${this.api.api.defaults.baseURL}/profile/readme/${readmeId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await window.Clerk?.session?.getToken()}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to download README')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `README-${readmeId}.md`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      return { success: true }
    } catch (error) {
      console.error('Error downloading README:', error)
      throw error
    }
  }

  // Validate profile data before generation
  validateProfileData(profileData) {
    const errors = []
    const warnings = []

    // Required fields
    if (!profileData.bio || profileData.bio.trim().length === 0) {
      warnings.push('Bio is recommended for better README content')
    }

    if (!profileData.skills || profileData.skills.length === 0) {
      warnings.push('Add skills to showcase your expertise')
    }

    if (!profileData.currentRole || profileData.currentRole.trim().length === 0) {
      warnings.push('Current role helps personalize your README')
    }

    // Validate skills array
    if (profileData.skills && profileData.skills.some(skill => !skill || skill.trim().length === 0)) {
      errors.push('All skills must be non-empty strings')
    }

    // Validate experience array
    if (profileData.experience) {
      profileData.experience.forEach((exp, index) => {
        if (!exp.role || !exp.company) {
          errors.push(`Experience item ${index + 1} must have role and company`)
        }
      })
    }

    // Validate projects array
    if (profileData.projects) {
      profileData.projects.forEach((project, index) => {
        if (!project.name || !project.description) {
          errors.push(`Project ${index + 1} must have name and description`)
        }
      })
    }

    // Validate social links
    if (profileData.socialLinks) {
      const urlPattern = /^https?:\/\/.+/
      Object.entries(profileData.socialLinks).forEach(([platform, url]) => {
        if (url && !urlPattern.test(url)) {
          errors.push(`${platform} URL must be a valid HTTP/HTTPS URL`)
        }
      })
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      completeness: this.calculateCompleteness(profileData)
    }
  }

  // Calculate profile completeness percentage
  calculateCompleteness(profileData) {
    const fields = [
      'bio', 'currentRole', 'company', 'location', 'skills', 
      'experience', 'projects', 'socialLinks'
    ]

    let completedFields = 0
    let totalFields = fields.length

    fields.forEach(field => {
      const value = profileData[field]
      if (value) {
        if (typeof value === 'string' && value.trim().length > 0) {
          completedFields++
        } else if (Array.isArray(value) && value.length > 0) {
          completedFields++
        } else if (typeof value === 'object' && Object.keys(value).length > 0) {
          // For socialLinks, check if at least one link is provided
          const hasValidLinks = Object.values(value).some(link => link && link.trim().length > 0)
          if (hasValidLinks) {
            completedFields++
          }
        }
      }
    })

    return Math.round((completedFields / totalFields) * 100)
  }

  // Get default profile data structure
  getDefaultProfileData() {
    return {
      bio: '',
      currentRole: '',
      company: '',
      location: '',
      skills: [],
      experience: [],
      projects: [],
      socialLinks: {
        linkedin: '',
        twitter: '',
        website: '',
        portfolio: ''
      }
    }
  }

  // Get sample profile data for demonstration
  getSampleProfileData() {
    return {
      firstName: 'Alex',
      lastName: 'Developer',
      email: 'alex.developer@example.com',
      githubUsername: 'alexdev',
      bio: 'Passionate full-stack developer with expertise in modern web technologies. Love building scalable applications and contributing to open source projects.',
      currentRole: 'Senior Software Engineer',
      company: 'Tech Innovations Inc.',
      location: 'San Francisco, CA',
      skills: [
        'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 
        'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes'
      ],
      experience: [
        {
          role: 'Senior Software Engineer',
          company: 'Tech Innovations Inc.',
          duration: '2022 - Present',
          description: 'Leading development of microservices architecture and mentoring junior developers'
        },
        {
          role: 'Full Stack Developer',
          company: 'StartupXYZ',
          duration: '2020 - 2022',
          description: 'Built and maintained web applications using React and Node.js'
        }
      ],
      projects: [
        {
          name: 'E-commerce Platform',
          description: 'Full-stack e-commerce solution with React, Node.js, and MongoDB',
          url: 'https://github.com/username/ecommerce-platform',
          technologies: ['React', 'Node.js', 'MongoDB', 'Stripe']
        },
        {
          name: 'Task Management App',
          description: 'Real-time collaborative task management application',
          url: 'https://github.com/username/task-manager',
          technologies: ['Vue.js', 'Express', 'Socket.io', 'PostgreSQL']
        }
      ],
      socialLinks: {
        linkedin: 'https://linkedin.com/in/username',
        twitter: 'https://twitter.com/username',
        website: 'https://yourwebsite.com',
        portfolio: 'https://portfolio.yourwebsite.com'
      }
    }
  }

  // Format profile data for display
  formatProfileDataForDisplay(profileData) {
    return {
      ...profileData,
      skillsText: profileData.skills ? profileData.skills.join(', ') : '',
      experienceCount: profileData.experience ? profileData.experience.length : 0,
      projectsCount: profileData.projects ? profileData.projects.length : 0,
      socialLinksCount: profileData.socialLinks ? 
        Object.values(profileData.socialLinks).filter(link => link && link.trim().length > 0).length : 0
    }
  }

  // Parse skills from text input
  parseSkillsFromText(skillsText) {
    if (!skillsText || typeof skillsText !== 'string') {
      return []
    }

    return skillsText
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0)
  }

  // Get technology badges for skills
  getTechnologyBadges(skills) {
    const badgeMap = {
      'javascript': 'https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black',
      'typescript': 'https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white',
      'react': 'https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB',
      'nodejs': 'https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white',
      'python': 'https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white',
      'mongodb': 'https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white',
      'postgresql': 'https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white',
      'aws': 'https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white',
      'docker': 'https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white',
      'kubernetes': 'https://img.shields.io/badge/Kubernetes-326ce5?style=for-the-badge&logo=kubernetes&logoColor=white'
    }

    return skills.map(skill => {
      const normalizedSkill = skill.toLowerCase().replace(/[^a-z0-9]/g, '')
      return {
        name: skill,
        badge: badgeMap[normalizedSkill] || `https://img.shields.io/badge/${encodeURIComponent(skill)}-blue?style=for-the-badge`
      }
    })
  }
}

export const profileService = new ProfileService()
export default profileService
