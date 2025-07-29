import express from 'express'
import crypto from 'crypto'
import User from '../models/User.js'
import paymentService from '../services/paymentService.js'

const router = express.Router()

// Razorpay webhook handler
router.post('/razorpay', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature']
    
    if (!signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing signature'
      })
    }

    // Verify webhook signature
    const isValid = paymentService.verifyWebhookSignature(req.body, signature)
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid signature'
      })
    }

    const event = JSON.parse(req.body.toString())
    console.log('Received Razorpay webhook:', event.event)

    // Process the webhook event
    const result = await paymentService.processWebhookEvent(event)

    // Handle specific events
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity)
        break
        
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity)
        break
        
      case 'subscription.activated':
        await handleSubscriptionActivated(event.payload.subscription.entity)
        break
        
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event.payload.subscription.entity)
        break
        
      default:
        console.log(`Unhandled webhook event: ${event.event}`)
    }

    res.json({
      success: true,
      message: 'Webhook processed successfully',
      result
    })
  } catch (error) {
    console.error('Error processing Razorpay webhook:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Handle payment captured
async function handlePaymentCaptured(payment) {
  try {
    console.log('Processing payment captured:', payment.id)
    
    // Extract user info from order receipt
    if (payment.order_id) {
      // Get order details to find user
      // In a real implementation, you'd store order-user mapping
      console.log('Payment captured for order:', payment.order_id)
      
      // Update user subscription status
      // This would typically be done by matching order details
    }
  } catch (error) {
    console.error('Error handling payment captured:', error)
  }
}

// Handle payment failed
async function handlePaymentFailed(payment) {
  try {
    console.log('Processing payment failed:', payment.id)
    
    // Log failed payment for analysis
    // Send notification to user about failed payment
    // You might want to retry or offer alternative payment methods
  } catch (error) {
    console.error('Error handling payment failed:', error)
  }
}

// Handle subscription activated
async function handleSubscriptionActivated(subscription) {
  try {
    console.log('Processing subscription activated:', subscription.id)
    
    // Update user subscription status
    // Send welcome email
    // Enable premium features
  } catch (error) {
    console.error('Error handling subscription activated:', error)
  }
}

// Handle subscription cancelled
async function handleSubscriptionCancelled(subscription) {
  try {
    console.log('Processing subscription cancelled:', subscription.id)
    
    // Update user subscription status
    // Send cancellation confirmation
    // Schedule feature downgrade
  } catch (error) {
    console.error('Error handling subscription cancelled:', error)
  }
}

// GitHub webhook handler (for future OAuth integration)
router.post('/github', express.json(), async (req, res) => {
  try {
    const signature = req.headers['x-hub-signature-256']
    const event = req.headers['x-github-event']
    
    if (!signature || !event) {
      return res.status(400).json({
        success: false,
        message: 'Missing required headers'
      })
    }

    // Verify GitHub webhook signature
    const payload = JSON.stringify(req.body)
    const expectedSignature = `sha256=${crypto
      .createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET || 'secret')
      .update(payload)
      .digest('hex')}`

    if (signature !== expectedSignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid signature'
      })
    }

    console.log('Received GitHub webhook:', event)

    // Handle different GitHub events
    switch (event) {
      case 'push':
        // Handle push events if needed
        break
        
      case 'repository':
        // Handle repository events
        break
        
      default:
        console.log(`Unhandled GitHub event: ${event}`)
    }

    res.json({
      success: true,
      message: 'GitHub webhook processed successfully'
    })
  } catch (error) {
    console.error('Error processing GitHub webhook:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Health check for webhooks
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Webhook endpoints are healthy',
    timestamp: new Date().toISOString()
  })
})

export default router
