import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

class GitHubService {
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

  // Verify GitHub token
  async verifyToken(token) {
    const response = await this.api.post('/github/verify-token', { token })
    return response
  }

  // Get user repositories
  async getUserRepositories(token, page = 1) {
    const response = await this.api.post('/github/repositories', { token, page })
    return response
  }

  // Get repository details
  async getRepository(owner, repo) {
    const response = await this.api.get(`/github/repository/${owner}/${repo}`)
    return response
  }

  // Test commit to repository
  async testCommit(repoFullName, filePath) {
    const response = await this.api.post('/github/test-commit', {
      repoFullName,
      filePath
    })
    return response
  }

  // Trigger manual commit
  async triggerManualCommit() {
    const response = await this.api.post('/commit/manual')
    return response
  }

  // Get commit history
  async getCommitHistory(limit = 10) {
    const response = await this.api.get(`/commit/history?limit=${limit}`)
    return response
  }
}

export const githubService = new GitHubService()
export default githubService
