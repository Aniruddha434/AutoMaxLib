import express from 'express'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'
import paymentService from '../services/paymentService.js'

const router = express.Router()

// Create payment order
router.post('/create-order', [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('planId').notEmpty().withMessage('Plan ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      })
    }

    const { amount, planId } = req.body
    let user = await User.findOne({ clerkId: req.auth.userId })

    if (!user) {
      // Auto-create user if they don't exist
      console.log('Auto-creating user for payment request, Clerk ID:', req.auth.userId)
      user = new User({
        clerkId: req.auth.userId,
        email: 'unknown@example.com',
        firstName: 'User',
        lastName: 'Name',
        plan: 'free'
      })
      await user.save()
      console.log('User auto-created for payment:', user._id)
    }

    // Create order with user info in receipt (max 40 chars for Razorpay)
    const shortUserId = user.clerkId.slice(-8) // Last 8 chars of user ID
    const shortPlanId = planId === 'premium_monthly' ? 'PM' : 'PY' // PM or PY
    const timestamp = Date.now().toString().slice(-8) // Last 8 digits of timestamp
    const receipt = `${shortUserId}_${shortPlanId}_${timestamp}` // Max ~20 chars
    // Using INR for testing since international payments not enabled
    const order = await paymentService.createOrder(amount, 'INR', receipt)

    res.json({
      success: true,
      order: order.order
    })
  } catch (error) {
    console.error('Error creating payment order:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Verify payment
router.post('/verify', [
  body('razorpay_order_id').notEmpty().withMessage('Order ID is required'),
  body('razorpay_payment_id').notEmpty().withMessage('Payment ID is required'),
  body('razorpay_signature').notEmpty().withMessage('Signature is required')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      })
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    // Verify payment signature
    const isValid = paymentService.verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    )

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      })
    }

    // Get payment details
    const payment = await paymentService.getPayment(razorpay_payment_id)

    if (payment.success && payment.payment.status === 'captured') {
      // Update user subscription
      const user = await User.findOne({ clerkId: req.auth.userId })
      if (user) {
        user.plan = 'premium'
        user.subscriptionStatus = 'active'
        user.subscriptionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        await user.save()
      }

      res.json({
        success: true,
        message: 'Payment verified successfully',
        payment: payment.payment
      })
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not captured'
      })
    }
  } catch (error) {
    console.error('Error verifying payment:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get pricing plans
router.get('/plans', (req, res) => {
  try {
    const plans = paymentService.getPricingPlans()

    res.json({
      success: true,
      plans
    })
  } catch (error) {
    console.error('Error fetching pricing plans:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Get international payment configuration
router.get('/international-config', (req, res) => {
  try {
    const config = paymentService.getInternationalPaymentConfig()

    res.json({
      success: true,
      config
    })
  } catch (error) {
    console.error('Error fetching international payment config:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Cancel subscription
router.post('/cancel-subscription', async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId })
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    if (user.plan !== 'premium') {
      return res.status(400).json({
        success: false,
        message: 'No active premium subscription found'
      })
    }

    // Update user subscription status
    user.subscriptionStatus = 'cancelled'
    await user.save()

    res.json({
      success: true,
      message: 'Subscription cancelled successfully'
    })
  } catch (error) {
    console.error('Error cancelling subscription:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get payment history
router.get('/history', async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId })
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // For now, return subscription info
    // In a real app, you'd store payment history in a separate collection
    const paymentHistory = []
    
    if (user.plan === 'premium') {
      paymentHistory.push({
        id: 'subscription_1',
        amount: 6,
        currency: 'USD',
        status: 'success',
        description: 'Premium Monthly Subscription',
        date: user.updatedAt
      })
    }

    res.json({
      success: true,
      payments: paymentHistory
    })
  } catch (error) {
    console.error('Error fetching payment history:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

export default router
