/**
 * Centralized authentication token service
 * Handles Clerk token retrieval, caching, and refresh logic
 */

class AuthTokenService {
  constructor() {
    this.tokenCache = null
    this.tokenExpiry = null
    this.refreshPromise = null
    this.retryCount = 0
    this.maxRetries = 3
  }

  /**
   * Get a valid authentication token
   * @returns {Promise<string|null>} The authentication token or null if unavailable
   */
  async getToken() {
    try {
      // Check if we have a cached valid token
      if (this.tokenCache && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.tokenCache
      }

      // If we're already refreshing, wait for that promise
      if (this.refreshPromise) {
        return await this.refreshPromise
      }

      // Start token refresh
      this.refreshPromise = this._refreshToken()
      const token = await this.refreshPromise
      this.refreshPromise = null

      return token
    } catch (error) {
      console.error('AuthTokenService: Error getting token:', error)
      this.refreshPromise = null
      return null
    }
  }

  /**
   * Refresh the authentication token
   * @private
   */
  async _refreshToken() {
    try {
      if (!window.Clerk?.session) {
        console.warn('AuthTokenService: Clerk session not available')
        this._clearCache()
        return null
      }

      const token = await window.Clerk.session.getToken()
      
      if (!token) {
        console.warn('AuthTokenService: No token received from Clerk')
        this._clearCache()
        return null
      }

      // Cache the token with a 50-minute expiry (tokens are valid for 60 minutes)
      this.tokenCache = token
      this.tokenExpiry = Date.now() + (50 * 60 * 1000)
      this.retryCount = 0

      console.debug('AuthTokenService: Token refreshed successfully')
      return token
    } catch (error) {
      console.error('AuthTokenService: Error refreshing token:', error)
      this._clearCache()
      
      // Retry logic for network errors
      if (this.retryCount < this.maxRetries && this._isRetryableError(error)) {
        this.retryCount++
        console.log(`AuthTokenService: Retrying token refresh (${this.retryCount}/${this.maxRetries})`)
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, this.retryCount) * 1000))
        return this._refreshToken()
      }

      throw error
    }
  }

  /**
   * Check if an error is retryable
   * @private
   */
  _isRetryableError(error) {
    return (
      error.message.includes('Network') ||
      error.message.includes('timeout') ||
      error.message.includes('fetch')
    )
  }

  /**
   * Clear the token cache
   * @private
   */
  _clearCache() {
    this.tokenCache = null
    this.tokenExpiry = null
  }

  /**
   * Force refresh the token (clears cache first)
   */
  async forceRefresh() {
    this._clearCache()
    this.refreshPromise = null
    return this.getToken()
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!(window.Clerk?.session && this.tokenCache)
  }

  /**
   * Clear all cached data (for logout)
   */
  clearAll() {
    this._clearCache()
    this.refreshPromise = null
    this.retryCount = 0
  }
}

// Export singleton instance
export const authTokenService = new AuthTokenService()
export default authTokenService
