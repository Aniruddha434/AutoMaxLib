import express from 'express'
import crypto from 'crypto'
import { Webhook } from 'svix'
import User from '../models/User.js'
import paymentService from '../services/paymentService.js'

const router = express.Router()

// Clerk webhook handler
router.post('/clerk', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
      console.error('Missing CLERK_WEBHOOK_SECRET environment variable')
      return res.status(500).json({
        success: false,
        message: 'Webhook secret not configured'
      })
    }

    // Get headers
    const svix_id = req.headers['svix-id']
    const svix_timestamp = req.headers['svix-timestamp']
    const svix_signature = req.headers['svix-signature']

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing svix headers'
      })
    }

    // Create a new Svix instance with your webhook secret
    const wh = new Webhook(WEBHOOK_SECRET)

    let evt
    try {
      // Convert buffer to string for Svix verification
      const body = req.body.toString()
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      })
    } catch (err) {
      console.error('Error verifying webhook:', err)
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature'
      })
    }

    // Handle the webhook
    const { type, data } = evt
    console.log('Received Clerk webhook:', type)

    switch (type) {
      case 'user.created':
        await handleUserCreated(data)
        break

      case 'user.updated':
        await handleUserUpdated(data)
        break

      case 'user.deleted':
        await handleUserDeleted(data)
        break

      case 'session.created':
        console.log('Session created for user:', data.user_id)
        break

      case 'session.ended':
      case 'session.removed':
      case 'session.revoked':
        console.log('Session ended for user:', data.user_id)
        break

      default:
        console.log(`Unhandled Clerk webhook event: ${type}`)
    }

    res.json({
      success: true,
      message: 'Webhook processed successfully'
    })
  } catch (error) {
    console.error('Error processing Clerk webhook:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Handle user created
async function handleUserCreated(userData) {
  try {
    console.log('Processing user created:', userData.id)

    // Create user in your database
    const user = new User({
      clerkId: userData.id,
      email: userData.email_addresses[0]?.email_address || 'unknown@example.com',
      firstName: userData.first_name || 'User',
      lastName: userData.last_name || '',
      plan: 'free',
      trialStartDate: new Date(),
      trialEndDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days trial
    })

    await user.save()
    console.log('User created in database:', user._id)
  } catch (error) {
    console.error('Error handling user created:', error)
  }
}

// Handle user updated
async function handleUserUpdated(userData) {
  try {
    console.log('Processing user updated:', userData.id)

    // Update user in your database
    await User.findOneAndUpdate(
      { clerkId: userData.id },
      {
        email: userData.email_addresses[0]?.email_address,
        firstName: userData.first_name,
        lastName: userData.last_name,
        updatedAt: new Date()
      }
    )

    console.log('User updated in database')
  } catch (error) {
    console.error('Error handling user updated:', error)
  }
}

// Handle user deleted
async function handleUserDeleted(userData) {
  try {
    console.log('Processing user deleted:', userData.id)

    // Delete or deactivate user in your database
    await User.findOneAndDelete({ clerkId: userData.id })

    console.log('User deleted from database')
  } catch (error) {
    console.error('Error handling user deleted:', error)
  }
}

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
