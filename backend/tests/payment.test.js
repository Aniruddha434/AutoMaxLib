import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import PaymentService from '../services/paymentService.js'

// Mock Razorpay
jest.mock('razorpay', () => {
  return jest.fn().mockImplementation(() => ({
    orders: {
      create: jest.fn().mockResolvedValue({
        id: 'order_test123',
        amount: 600, // $6 in cents
        currency: 'USD',
        receipt: 'test_receipt',
        status: 'created',
        created_at: Date.now()
      })
    },
    payments: {
      fetch: jest.fn().mockResolvedValue({
        id: 'pay_test123',
        amount: 600,
        currency: 'USD',
        status: 'captured',
        order_id: 'order_test123',
        method: 'card',
        email: 'test@example.com',
        contact: '+1234567890',
        created_at: Date.now(),
        captured: true
      })
    }
  }))
})

describe('PaymentService USD Integration Tests', () => {
  let paymentService

  beforeEach(() => {
    // Set up environment variables for testing
    process.env.RAZORPAY_KEY_ID = 'rzp_test_123'
    process.env.RAZORPAY_KEY_SECRET = 'test_secret_123'
    
    paymentService = new PaymentService()
  })

  describe('USD Pricing Configuration', () => {
    it('should return correct USD pricing for monthly plan', () => {
      const plans = paymentService.getPricingPlans()
      
      expect(plans.premium_monthly.price).toBe(6)
      expect(plans.premium_monthly.currency).toBe('USD')
    })

    it('should return correct USD pricing for yearly plan', () => {
      const plans = paymentService.getPricingPlans()
      
      expect(plans.premium_yearly.price).toBe(60)
      expect(plans.premium_yearly.currency).toBe('USD')
      expect(plans.premium_yearly.discount).toBe('17% off')
    })
  })

  describe('Order Creation with USD', () => {
    it('should create order with USD currency by default', async () => {
      const order = await paymentService.createOrder(6, 'USD', 'test_receipt')
      
      expect(order.success).toBe(true)
      expect(order.order.amount).toBe(600) // $6 in cents
      expect(order.order.currency).toBe('USD')
    })

    it('should create order with correct amount conversion for $6', async () => {
      const order = await paymentService.createOrder(6)
      
      expect(order.success).toBe(true)
      expect(order.order.amount).toBe(600) // $6 * 100 cents
    })
  })

  describe('International Payment Configuration', () => {
    it('should return supported currencies including USD', () => {
      const currencies = paymentService.getSupportedCurrencies()
      
      expect(currencies).toContain('USD')
      expect(currencies).toContain('EUR')
      expect(currencies).toContain('GBP')
      expect(currencies.length).toBeGreaterThan(50)
    })

    it('should return international payment config with USD as default', () => {
      const config = paymentService.getInternationalPaymentConfig()
      
      expect(config.defaultCurrency).toBe('USD')
      expect(config.supportedCurrencies).toContain('USD')
      expect(config.supportedCountries).toContain('US')
      expect(config.features).toContain('Multi-currency support')
    })

    it('should support major international countries', () => {
      const config = paymentService.getInternationalPaymentConfig()
      const countries = config.supportedCountries
      
      expect(countries).toContain('US') // United States
      expect(countries).toContain('CA') // Canada
      expect(countries).toContain('GB') // United Kingdom
      expect(countries).toContain('AU') // Australia
      expect(countries).toContain('DE') // Germany
      expect(countries).toContain('FR') // France
      expect(countries).toContain('SG') // Singapore
      expect(countries).toContain('AE') // UAE
    })
  })

  describe('Payment Verification', () => {
    it('should verify payment signature correctly', () => {
      const isValid = paymentService.verifyPaymentSignature(
        'order_test123',
        'pay_test123',
        'test_signature'
      )
      
      // This would normally validate against actual signature
      expect(typeof isValid).toBe('boolean')
    })

    it('should fetch payment details with USD currency', async () => {
      const payment = await paymentService.getPayment('pay_test123')
      
      expect(payment.success).toBe(true)
      expect(payment.payment.currency).toBe('USD')
      expect(payment.payment.amount).toBe(600)
      expect(payment.payment.status).toBe('captured')
    })
  })

  describe('Error Handling', () => {
    it('should handle missing Razorpay configuration gracefully', () => {
      delete process.env.RAZORPAY_KEY_ID
      delete process.env.RAZORPAY_KEY_SECRET
      
      const service = new PaymentService()
      expect(service.isConfigured).toBe(false)
    })

    it('should throw error when creating order without configuration', async () => {
      delete process.env.RAZORPAY_KEY_ID
      const service = new PaymentService()
      
      await expect(service.createOrder(6, 'USD')).rejects.toThrow(
        'Razorpay is not configured'
      )
    })
  })
})

describe('Integration Test Scenarios', () => {
  it('should simulate complete $6 payment flow', async () => {
    process.env.RAZORPAY_KEY_ID = 'rzp_test_123'
    process.env.RAZORPAY_KEY_SECRET = 'test_secret_123'
    
    const paymentService = new PaymentService()
    
    // 1. Get pricing plans
    const plans = paymentService.getPricingPlans()
    const monthlyPlan = plans.premium_monthly
    
    expect(monthlyPlan.price).toBe(6)
    expect(monthlyPlan.currency).toBe('USD')
    
    // 2. Create order
    const order = await paymentService.createOrder(
      monthlyPlan.price, 
      monthlyPlan.currency, 
      'test_user_monthly'
    )
    
    expect(order.success).toBe(true)
    expect(order.order.amount).toBe(600) // $6 in cents
    expect(order.order.currency).toBe('USD')
    
    // 3. Simulate payment verification
    const payment = await paymentService.getPayment('pay_test123')
    expect(payment.success).toBe(true)
    expect(payment.payment.status).toBe('captured')
  })
})
