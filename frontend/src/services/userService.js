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
        throw new Error(message)
      }
    )
  }

  // Sync user with backend
  async syncUser(userData) {
    const response = await this.api.post('/auth/sync', userData)
    return response.user
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
