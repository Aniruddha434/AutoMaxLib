import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add auth token to requests
    this.api.interceptors.request.use(async (config) => {
      try {
        if (window.Clerk?.session) {
          const token = await window.Clerk.session.getToken()
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }
      } catch (error) {
        console.warn('Failed to get Clerk token:', error)
      }
      return config
    })

    // Handle response errors
    this.api.interceptors.response.use(
      (response) => response.data,
      (error) => {
        console.error('API Error:', error.response?.data || error.message)
        throw error.response?.data || error
      }
    )
  }

  // Generic HTTP methods
  async get(endpoint) {
    return await this.api.get(endpoint)
  }

  async post(endpoint, data) {
    return await this.api.post(endpoint, data)
  }

  async put(endpoint, data) {
    return await this.api.put(endpoint, data)
  }

  async delete(endpoint) {
    return await this.api.delete(endpoint)
  }

  // Pattern-specific methods
  async getPatternTemplates() {
    return await this.get('/pattern/templates')
  }

  async validatePatternText(text) {
    return await this.post('/pattern/validate', { text })
  }

  async previewPattern(options) {
    return await this.post('/pattern/preview', options)
  }

  async generatePattern(options) {
    return await this.post('/pattern/generate', options)
  }

  // User methods
  async getUserProfile() {
    return await this.get('/user/profile')
  }

  async updateUserSettings(settings) {
    return await this.put('/user/settings', settings)
  }

  // GitHub methods
  async getRepositories() {
    return await this.get('/github/repositories')
  }

  async triggerManualCommit() {
    return await this.post('/commit/manual')
  }

  async getCommitHistory(limit = 10) {
    return await this.get(`/commit/history?limit=${limit}`)
  }

  // Payment methods
  async createPaymentOrder(planId) {
    return await this.post('/payment/create-order', { planId })
  }

  async verifyPayment(paymentData) {
    return await this.post('/payment/verify', paymentData)
  }

  // Profile README methods
  async getReadmeTemplates() {
    return await this.get('/profile/readme/templates')
  }

  async getReadmeHistory() {
    return await this.get('/profile/readme/history')
  }

  async generateReadme(profileData, template, customSections) {
    return await this.post('/profile/readme/generate', {
      profileData,
      template,
      customSections
    })
  }

  async getReadme(readmeId) {
    return await this.get(`/profile/readme/${readmeId}`)
  }

  async deployReadme(readmeId) {
    return await this.post(`/profile/readme/${readmeId}/deploy`)
  }

  async createProfileRepository() {
    return await this.post('/profile/create-profile-repo')
  }
}

export const apiService = new ApiService()
export default apiService
