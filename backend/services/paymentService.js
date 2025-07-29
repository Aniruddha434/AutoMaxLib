import Razorpay from 'razorpay'
import crypto from 'crypto'

class PaymentService {
  constructor() {
    // Only initialize Razorpay if keys are provided
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      this.razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
      this.isConfigured = true
      console.log('✅ Razorpay configured for international payments with USD support')
    } else {
      console.warn('⚠️ Razorpay keys not configured. Payment features will be disabled.')
      this.razorpay = null
      this.isConfigured = false
    }
  }

  // Create payment order
  async createOrder(amount, currency = 'USD', receipt = null) {
    if (!this.isConfigured) {
      throw new Error('Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.')
    }

    try {
      const options = {
        amount: amount * 100, // Razorpay expects amount in smallest currency unit (cents for USD)
        currency,
        receipt: receipt || `order_${Date.now()}`,
        payment_capture: 1, // Auto capture payment
      }

      const order = await this.razorpay.orders.create(options)

      return {
        success: true,
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          receipt: order.receipt,
          status: order.status,
          created_at: order.created_at
        }
      }
    } catch (error) {
      console.error('Error creating Razorpay order:', error)
      throw new Error('Failed to create payment order')
    }
  }

  // Verify payment signature
  verifyPaymentSignature(orderId, paymentId, signature) {
    try {
      const body = orderId + '|' + paymentId
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex')

      return expectedSignature === signature
    } catch (error) {
      console.error('Error verifying payment signature:', error)
      return false
    }
  }

  // Get payment details
  async getPayment(paymentId) {
    if (!this.isConfigured) {
      throw new Error('Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.')
    }

    try {
      const payment = await this.razorpay.payments.fetch(paymentId)
      
      return {
        success: true,
        payment: {
          id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          order_id: payment.order_id,
          method: payment.method,
          email: payment.email,
          contact: payment.contact,
          created_at: payment.created_at,
          captured: payment.captured
        }
      }
    } catch (error) {
      console.error('Error fetching payment:', error)
      throw new Error('Failed to fetch payment details')
    }
  }

  // Create subscription (for recurring payments)
  async createSubscription(planId, customerId, totalCount = 12) {
    try {
      const subscription = await this.razorpay.subscriptions.create({
        plan_id: planId,
        customer_id: customerId,
        total_count: totalCount,
        quantity: 1,
        start_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // Start tomorrow
        expire_by: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60), // Expire in 1 year
        addons: [],
        notes: {
          service: 'AutoGitPilot Premium'
        }
      })

      return {
        success: true,
        subscription: {
          id: subscription.id,
          plan_id: subscription.plan_id,
          customer_id: subscription.customer_id,
          status: subscription.status,
          current_start: subscription.current_start,
          current_end: subscription.current_end,
          created_at: subscription.created_at
        }
      }
    } catch (error) {
      console.error('Error creating subscription:', error)
      throw new Error('Failed to create subscription')
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId, cancelAtCycleEnd = false) {
    try {
      const subscription = await this.razorpay.subscriptions.cancel(
        subscriptionId,
        cancelAtCycleEnd
      )

      return {
        success: true,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          cancelled_at: subscription.cancelled_at
        }
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      throw new Error('Failed to cancel subscription')
    }
  }

  // Verify webhook signature
  verifyWebhookSignature(body, signature) {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(body)
        .digest('hex')

      return expectedSignature === signature
    } catch (error) {
      console.error('Error verifying webhook signature:', error)
      return false
    }
  }

  // Process webhook event
  async processWebhookEvent(event) {
    try {
      const { entity, event: eventType } = event

      switch (eventType) {
        case 'payment.captured':
          return await this.handlePaymentCaptured(entity)
        
        case 'payment.failed':
          return await this.handlePaymentFailed(entity)
        
        case 'subscription.activated':
          return await this.handleSubscriptionActivated(entity)
        
        case 'subscription.cancelled':
          return await this.handleSubscriptionCancelled(entity)
        
        case 'subscription.completed':
          return await this.handleSubscriptionCompleted(entity)
        
        default:
          console.log(`Unhandled webhook event: ${eventType}`)
          return { success: true, message: 'Event ignored' }
      }
    } catch (error) {
      console.error('Error processing webhook event:', error)
      throw new Error('Failed to process webhook event')
    }
  }

  // Handle payment captured
  async handlePaymentCaptured(payment) {
    // This will be implemented in the webhook route
    // to update user subscription status
    return {
      success: true,
      action: 'payment_captured',
      payment_id: payment.id,
      amount: payment.amount
    }
  }

  // Handle payment failed
  async handlePaymentFailed(payment) {
    return {
      success: true,
      action: 'payment_failed',
      payment_id: payment.id,
      error: payment.error_description
    }
  }

  // Handle subscription activated
  async handleSubscriptionActivated(subscription) {
    return {
      success: true,
      action: 'subscription_activated',
      subscription_id: subscription.id,
      customer_id: subscription.customer_id
    }
  }

  // Handle subscription cancelled
  async handleSubscriptionCancelled(subscription) {
    return {
      success: true,
      action: 'subscription_cancelled',
      subscription_id: subscription.id,
      customer_id: subscription.customer_id
    }
  }

  // Handle subscription completed
  async handleSubscriptionCompleted(subscription) {
    return {
      success: true,
      action: 'subscription_completed',
      subscription_id: subscription.id,
      customer_id: subscription.customer_id
    }
  }

  // Get pricing plans
  getPricingPlans() {
    return {
      free: {
        id: 'free',
        name: 'Free Plan',
        price: 0, // USD
        currency: 'USD',
        interval: 'forever',
        features: [
          '15-day free trial with auto-commits',
          'Daily auto-commit (10 AM IST)',
          '1 repository connection',
          'Basic commit messages',
          '7-day commit history',
          'Manual commit button',
          'Dark mode support'
        ]
      },
      premium_monthly: {
        id: 'premium_monthly',
        name: 'Premium Monthly',
        price: 6, // USD
        currency: 'USD',
        interval: 'monthly',
        features: [
          'Multiple repository support',
          'Custom commit scheduling',
          'Smart file generator',
          'AI-generated commit messages',
          'Past commit generation',
          'GitHub contribution booster',
          'Email alerts and monthly summary',
          'Backup and restore settings',
          'Public shareable streak profile',
          'GitHub OAuth support'
        ]
      },
      premium_yearly: {
        id: 'premium_yearly',
        name: 'Premium Yearly',
        price: 60, // USD (save 2 months - 17% off)
        currency: 'USD',
        interval: 'yearly',
        discount: '17% off',
        features: [
          'All Premium Monthly features',
          '2 months free',
          'Priority support',
          'Early access to new features'
        ]
      }
    }
  }

  // Get supported currencies for international payments
  getSupportedCurrencies() {
    return [
      'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'SGD', 'AED', 'JPY', 'CHF', 'SEK',
      'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK', 'RSD', 'BAM',
      'MKD', 'ALL', 'ISK', 'TRY', 'RUB', 'UAH', 'BYN', 'MDL', 'GEL', 'AMD',
      'AZN', 'KZT', 'UZS', 'KGS', 'TJS', 'TMT', 'MNT', 'CNY', 'HKD', 'TWD',
      'KRW', 'THB', 'VND', 'IDR', 'MYR', 'PHP', 'BND', 'LAK', 'KHR', 'MMK',
      'LKR', 'NPR', 'BTN', 'BDT', 'PKR', 'AFN', 'IRR', 'IQD', 'JOD', 'KWD',
      'LBP', 'OMR', 'QAR', 'SAR', 'SYP', 'YER', 'BHD', 'EGP', 'LYD', 'MAD',
      'TND', 'DZD', 'AOA', 'BWP', 'BIF', 'XOF', 'XAF', 'KMF', 'DJF', 'ERN',
      'ETB', 'GMD', 'GHS', 'GNF', 'KES', 'LSL', 'LRD', 'MGA', 'MWK', 'MUR',
      'MZN', 'NAD', 'NGN', 'RWF', 'SHP', 'SLL', 'SOS', 'SZL', 'TZS', 'UGX',
      'ZAR', 'ZMW', 'ZWL', 'ARS', 'BOB', 'BRL', 'CLP', 'COP', 'CRC', 'CUP',
      'DOP', 'GTQ', 'HNL', 'JMD', 'MXN', 'NIO', 'PAB', 'PEN', 'PYG', 'SVC',
      'TTD', 'UYU', 'VES', 'BBD', 'BZD', 'BMD', 'KYD', 'XCD', 'FJD', 'PGK',
      'SBD', 'TOP', 'VUV', 'WST', 'NZD'
    ]
  }

  // Get international payment configuration
  getInternationalPaymentConfig() {
    return {
      supportedCurrencies: this.getSupportedCurrencies(),
      defaultCurrency: 'USD',
      supportedCountries: [
        'US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT',
        'SE', 'NO', 'DK', 'FI', 'IE', 'PT', 'GR', 'PL', 'CZ', 'HU', 'RO', 'BG',
        'HR', 'SI', 'SK', 'EE', 'LV', 'LT', 'LU', 'MT', 'CY', 'IS', 'LI', 'MC',
        'SM', 'VA', 'AD', 'TR', 'RU', 'UA', 'BY', 'MD', 'GE', 'AM', 'AZ', 'KZ',
        'UZ', 'KG', 'TJ', 'TM', 'MN', 'CN', 'HK', 'TW', 'JP', 'KR', 'TH', 'VN',
        'ID', 'MY', 'PH', 'SG', 'BN', 'LA', 'KH', 'MM', 'LK', 'NP', 'BT', 'BD',
        'PK', 'AF', 'IR', 'IQ', 'JO', 'KW', 'LB', 'OM', 'QA', 'SA', 'SY', 'YE',
        'BH', 'AE', 'EG', 'LY', 'MA', 'TN', 'DZ', 'AO', 'BW', 'BI', 'BF', 'CI',
        'CM', 'CF', 'TD', 'KM', 'DJ', 'ER', 'ET', 'GM', 'GH', 'GN', 'KE', 'LS',
        'LR', 'MG', 'MW', 'MU', 'MZ', 'NA', 'NG', 'RW', 'SH', 'SL', 'SO', 'SZ',
        'TZ', 'UG', 'ZA', 'ZM', 'ZW', 'AR', 'BO', 'BR', 'CL', 'CO', 'CR', 'CU',
        'DO', 'GT', 'HN', 'JM', 'MX', 'NI', 'PA', 'PE', 'PY', 'SV', 'TT', 'UY',
        'VE', 'BB', 'BZ', 'BM', 'KY', 'AG', 'DM', 'GD', 'KN', 'LC', 'VC', 'FJ',
        'PG', 'SB', 'TO', 'VU', 'WS', 'NZ'
      ],
      features: [
        'Multi-currency support',
        'International card payments',
        'Local payment methods',
        'Real-time currency conversion',
        'Fraud protection',
        '3D Secure 2.0 support'
      ]
    }
  }
}

export default new PaymentService()
