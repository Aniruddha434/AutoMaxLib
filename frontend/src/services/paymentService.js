import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

class PaymentService {
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

  // Create payment order
  async createOrder(amount, planId) {
    const response = await this.api.post('/payment/create-order', {
      amount,
      planId
    })
    return response
  }

  // Get international pricing based on user's location
  async getInternationalPricing() {
    const response = await this.api.get('/payment/pricing')
    return response
  }

  // Verify payment
  async verifyPayment(paymentData) {
    const response = await this.api.post('/payment/verify', paymentData)
    return response
  }

  // Get payment history
  async getPaymentHistory() {
    const response = await this.api.get('/payment/history')
    return response.payments
  }

  // Cancel subscription
  async cancelSubscription() {
    const response = await this.api.post('/payment/cancel-subscription')
    return response
  }
}

export const paymentService = new PaymentService()
export default paymentService
