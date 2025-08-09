import axios from 'axios'
import authTokenService from './authTokenService.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add auth token to requests with enhanced error handling
    this.api.interceptors.request.use(async (config) => {
      const requestId = Math.random().toString(36).substring(7)
      config.metadata = { requestId, startTime: Date.now() }

      try {
        console.log(`[${requestId}] API Request: ${config.method?.toUpperCase()} ${config.url}`)

        const token = await authTokenService.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
          console.log(`[${requestId}] Auth token added`)
        } else {
          console.warn(`[${requestId}] No auth token available`)
        }
      } catch (error) {
        console.error(`[${requestId}] Failed to get auth token:`, {
          message: error.message,
          name: error.name,
          isAuthenticated: authTokenService.isAuthenticated()
        })
      }
      return config
    })

    // Handle response errors with enhanced logging and token refresh
    this.api.interceptors.response.use(
      (response) => {
        const requestId = response.config.metadata?.requestId
        const duration = Date.now() - (response.config.metadata?.startTime || 0)
        console.log(`[${requestId}] API Success: ${response.status} in ${duration}ms`)
        return response.data
      },
      async (error) => {
        const requestId = error.config?.metadata?.requestId
        const duration = Date.now() - (error.config?.metadata?.startTime || 0)

        const errorInfo = {
          requestId,
          duration: `${duration}ms`,
          method: error.config?.method?.toUpperCase(),
          url: error.config?.url,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          name: error.name
        }

        console.error(`[${requestId}] API Error:`, errorInfo)

        // Handle 401 errors by refreshing token and retrying
        if (error.response?.status === 401 && !error.config._retry) {
          console.log(`[${requestId}] 401 error detected, attempting token refresh...`)

          try {
            // Force refresh the token
            const newToken = await authTokenService.forceRefresh()

            if (newToken) {
              console.log(`[${requestId}] Token refreshed, retrying request...`)

              // Mark this request as a retry to prevent infinite loops
              error.config._retry = true
              error.config.headers.Authorization = `Bearer ${newToken}`

              // Retry the original request
              return this.api.request(error.config)
            }
          } catch (refreshError) {
            console.error(`[${requestId}] Token refresh failed:`, refreshError)
          }
        }

        // Enhanced error object with more context
        const enhancedError = error.response?.data || {
          message: error.message,
          status: error.response?.status,
          code: 'NETWORK_ERROR'
        }

        // Add request context to error
        enhancedError.requestId = requestId
        enhancedError.duration = duration
        enhancedError.url = error.config?.url

        throw enhancedError
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
