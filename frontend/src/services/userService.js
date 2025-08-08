import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

class UserService {
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
        const message = error.response?.data?.message || error.message || 'An error occurred'
        const err = new Error(message)
        err.status = error.response?.status
        err.code = error.response?.data?.error || error.code
        err.requestId = error.response?.data?.requestId
        // Preserve backend payload for callers that need more details
        err.details = error.response?.data?.details
        err.response = error.response
        throw err
      }
    )
  }

  // Sync user with backend with retry logic
  async syncUser(userData, retryCount = 0) {
    const maxRetries = 3
    const retryDelay = 1000 * Math.pow(2, retryCount) // Exponential backoff

    try {
      console.log(`[UserService] Syncing user (attempt ${retryCount + 1}/${maxRetries + 1}):`, {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName
      })

      const response = await this.api.post('/auth/sync', userData)
      console.log('[UserService] User sync successful:', response.user)
      return response.user
    } catch (error) {
      console.error(`[UserService] User sync failed (attempt ${retryCount + 1}):`, {
        message: error.message,
        status: error.status,
        code: error.code,
        requestId: error.requestId
      })

      // Handle email conflict errors specifically (don't retry these)
      if (error.status === 400 && error.message.includes('Email address is already in use')) {
        const emailConflictError = new Error(error.message)
        emailConflictError.type = 'EMAIL_CONFLICT'
        emailConflictError.status = error.status
        emailConflictError.email = userData.email
        emailConflictError.originalError = error
        throw emailConflictError
      }

      // Handle rate limiting explicitly (HTTP 429)
      if (error.status === 429) {
        if (retryCount >= maxRetries) {
          console.warn('[UserService] Rate limited (429) and max retries reached. Aborting.')
          throw error
        }
        const serverRetryAfterSec = error.response?.data?.retryAfter
        const delayMs = (serverRetryAfterSec ? serverRetryAfterSec : Math.min(60, Math.pow(2, retryCount + 3))) * 1000
        console.warn(`[UserService] Rate limited (429). Retrying after ${delayMs}ms...`)
        await new Promise(resolve => setTimeout(resolve, delayMs))
        return this.syncUser(userData, retryCount + 1)
      }

      // Retry on server errors or network issues
      if (retryCount < maxRetries && (
        error.status >= 500 ||
        error.message.includes('Network Error') ||
        error.message.includes('timeout') ||
        error.code === 'DB_DISCONNECTED' ||
        error.code === 'CLERK_AUTH_ERROR'
      )) {
        console.log(`[UserService] Retrying user sync in ${retryDelay}ms...`)
        await new Promise(resolve => setTimeout(resolve, retryDelay))
        return this.syncUser(userData, retryCount + 1)
      }

      throw error
    }
  }

  // Get current user
  async getCurrentUser() {
    const response = await this.api.get('/auth/me')
    return response.user
  }

  // Get user profile
  async getUserProfile() {
    const response = await this.api.get('/user/profile')
    return response.user
  }

  // Create user profile
  async createUser(userData) {
    const response = await this.api.post('/user/profile', userData)
    return response.user
  }

  // Update user profile
  async updateUser(updates) {
    const response = await this.api.put('/user/profile', updates)
    return response.user
  }

  // Update commit settings
  async updateCommitSettings(settings) {
    const response = await this.api.put('/user/commit-settings', settings)
    return response.commitSettings
  }

  // Get dashboard data
  async getDashboardData() {
    const response = await this.api.get('/user/dashboard')
    return response.dashboard
  }

  // Delete user account
  async deleteAccount() {
    const response = await this.api.delete('/user/account')
    return response
  }
}

export const userService = new UserService()
export default userService
