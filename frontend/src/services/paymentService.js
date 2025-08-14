import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

class PaymentService {
  constructor() {
    // Cache for pricing data to avoid repeated API calls
    this.pricingCache = null
    this.pricingCacheExpiry = null
    this.CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

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

    // Handle response errors with retry logic for rate limiting
    this.api.interceptors.response.use(
      (response) => response.data,
      (error) => {
        const enhancedError = new Error(error.response?.data?.message || error.message || 'An error occurred')
        enhancedError.status = error.response?.status
        enhancedError.response = error.response
        enhancedError.retryAfter = error.response?.data?.retryAfter
        throw enhancedError
      }
    )
  }

  // Helper method to handle retries for rate limiting
  async makeRequestWithRetry(requestFn, retryCount = 0, maxRetries = 3) {
    try {
      return await requestFn()
    } catch (error) {
      // Handle rate limiting (HTTP 429)
      if (error.status === 429 && retryCount < maxRetries) {
        const retryAfter = error.retryAfter || Math.pow(2, retryCount + 1) // Exponential backoff
        const delayMs = retryAfter * 1000

        console.warn(`[PaymentService] Rate limited (429). Retrying after ${delayMs}ms... (attempt ${retryCount + 1}/${maxRetries})`)

        await new Promise(resolve => setTimeout(resolve, delayMs))
        return this.makeRequestWithRetry(requestFn, retryCount + 1, maxRetries)
      }

      // For 429 errors that exceed max retries, provide user-friendly message
      if (error.status === 429) {
        const userFriendlyError = new Error('Too many requests. Please wait a moment and try again.')
        userFriendlyError.status = 429
        userFriendlyError.isRateLimit = true
        throw userFriendlyError
      }

      throw error
    }
  }

  // Create payment order with retry logic
  async createOrder(amount, planId) {
    return this.makeRequestWithRetry(async () => {
      const response = await this.api.post('/payment/create-order', {
        amount,
        planId
      })
      return response
    })
  }

  // Get international pricing with caching and retry logic
  async getInternationalPricing() {
    // Check cache first
    if (this.pricingCache && this.pricingCacheExpiry && Date.now() < this.pricingCacheExpiry) {
      console.log('[PaymentService] Returning cached pricing data')
      return this.pricingCache
    }

    return this.makeRequestWithRetry(async () => {
      const response = await this.api.get('/payment/pricing')

      // Cache the response
      this.pricingCache = response
      this.pricingCacheExpiry = Date.now() + this.CACHE_DURATION

      return response
    })
  }

  // Verify payment with retry logic
  async verifyPayment(paymentData) {
    return this.makeRequestWithRetry(async () => {
      const response = await this.api.post('/payment/verify', paymentData)
      return response
    })
  }

  // Get payment history with retry logic
  async getPaymentHistory() {
    return this.makeRequestWithRetry(async () => {
      const response = await this.api.get('/payment/history')
      return response.payments
    })
  }

  // Cancel subscription with retry logic
  async cancelSubscription() {
    return this.makeRequestWithRetry(async () => {
      const response = await this.api.post('/payment/cancel-subscription')
      return response
    })
  }

  // Clear pricing cache (useful for testing or manual refresh)
  clearPricingCache() {
    this.pricingCache = null
    this.pricingCacheExpiry = null
    console.log('[PaymentService] Pricing cache cleared')
  }
}

export const paymentService = new PaymentService()
export default paymentService
