import express from 'express'
import crypto from 'crypto'
import { Webhook } from 'svix'
import User from '../models/User.js'
import paymentService from '../services/paymentService.js'
import logger from '../config/logger.js'

// Webhook verification utilities
const WEBHOOK_TOLERANCE = 300 // 5 minutes in seconds
const MAX_BODY_SIZE = 1024 * 1024 // 1MB
const SUPPORTED_WEBHOOK_VERSIONS = ['v1']

const router = express.Router()

// Webhook request size limit (1MB)
const WEBHOOK_SIZE_LIMIT = '1mb'

// Retry configuration
const RETRY_ATTEMPTS = 3
const RETRY_DELAY = 1000 // 1 second

// Comprehensive webhook validation function
function validateWebhookRequest(req, requestId) {
  const errors = []
  const warnings = []

  // Check content type
  const contentType = req.headers['content-type']
  if (!contentType || !contentType.includes('application/json')) {
    errors.push(`Invalid content type: ${contentType}`)
  }

  // Check content length
  const contentLength = parseInt(req.headers['content-length'] || '0')
  if (contentLength === 0) {
    errors.push('Empty request body')
  }
  if (contentLength > MAX_BODY_SIZE) {
    errors.push(`Request body too large: ${contentLength} bytes`)
  }

  // Check user agent (should be from Svix)
  const userAgent = req.headers['user-agent']
  if (!userAgent || !userAgent.includes('Svix-Webhooks')) {
    warnings.push(`Unexpected user agent: ${userAgent}`)
  }

  // Check for required Svix headers
  const requiredHeaders = ['svix-id', 'svix-timestamp', 'svix-signature']
  const missingHeaders = requiredHeaders.filter(header => !req.headers[header])

  if (missingHeaders.length > 0) {
    errors.push(`Missing required headers: ${missingHeaders.join(', ')}`)
  }

  // Validate timestamp format and age
  const timestamp = req.headers['svix-timestamp']
  if (timestamp) {
    const timestampNum = parseInt(timestamp)
    if (isNaN(timestampNum)) {
      errors.push(`Invalid timestamp format: ${timestamp}`)
    } else {
      const now = Math.floor(Date.now() / 1000)
      const age = now - timestampNum
      if (age > WEBHOOK_TOLERANCE) {
        errors.push(`Timestamp too old: ${age} seconds (max: ${WEBHOOK_TOLERANCE})`)
      }
      if (age < -60) { // Allow 1 minute clock skew
        warnings.push(`Timestamp from future: ${Math.abs(age)} seconds`)
      }
    }
  }

  // Validate signature format
  const signature = req.headers['svix-signature']
  if (signature) {
    const signatureParts = signature.split(',')
    const validVersions = signatureParts.filter(part => {
      const [version] = part.split('=')
      return SUPPORTED_WEBHOOK_VERSIONS.includes(version)
    })

    if (validVersions.length === 0) {
      errors.push(`No supported signature versions found in: ${signature}`)
    }
  }

  logger.info(`[${requestId}] Webhook validation completed`, {
    errors: errors.length,
    warnings: warnings.length,
    contentLength,
    userAgent: userAgent?.substring(0, 50)
  })

  return { errors, warnings, isValid: errors.length === 0 }
}

// Clerk webhook verification endpoint (GET request)
router.get('/clerk', (req, res) => {
  // Clerk sometimes sends GET requests to verify the webhook endpoint
  res.json({
    success: true,
    message: 'Clerk webhook endpoint is active',
    timestamp: new Date().toISOString(),
    service: 'autogitpilot-backend'
  })
})

// Clerk webhook handler
router.post('/clerk', express.raw({ type: 'application/json' }), async (req, res) => {
  const requestId = Math.random().toString(36).substring(7)
  const startTime = Date.now()

  try {
    logger.info(`[${requestId}] Clerk webhook request received`, {
      method: req.method,
      url: req.url,
      userAgent: req.headers['user-agent'],
      contentType: req.headers['content-type'],
      contentLength: req.headers['content-length']
    })

    // Comprehensive request validation
    const validation = validateWebhookRequest(req, requestId)

    if (!validation.isValid) {
      logger.error(`[${requestId}] Webhook request validation failed`, {
        errors: validation.errors,
        warnings: validation.warnings
      })
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook request',
        error: 'VALIDATION_FAILED',
        requestId,
        errors: validation.errors
      })
    }

    if (validation.warnings.length > 0) {
      logger.warn(`[${requestId}] Webhook request validation warnings`, {
        warnings: validation.warnings
      })
    }

    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

    // Enhanced secret validation
    if (!WEBHOOK_SECRET) {
      logger.error(`[${requestId}] Missing CLERK_WEBHOOK_SECRET environment variable`)
      return res.status(500).json({
        success: false,
        message: 'Webhook secret not configured',
        error: 'MISSING_WEBHOOK_SECRET',
        requestId
      })
    }

    const expectedPrefix = 'wh' + 'sec_'
    if (!WEBHOOK_SECRET.startsWith(expectedPrefix)) {
      logger.error(`[${requestId}] Invalid webhook secret format`, {
        secretLength: WEBHOOK_SECRET.length,
        secretPrefix: WEBHOOK_SECRET.substring(0, 6)
      })
      return res.status(500).json({
        success: false,
        message: 'Invalid webhook secret format',
        error: 'INVALID_SECRET_FORMAT',
        requestId
      })
    }

    // Get and validate headers
    const svix_id = req.headers['svix-id']
    const svix_timestamp = req.headers['svix-timestamp']
    const svix_signature = req.headers['svix-signature']

    // Enhanced header logging
    logger.info(`[${requestId}] Webhook headers received`, {
      'svix-id': svix_id || 'MISSING',
      'svix-timestamp': svix_timestamp || 'MISSING',
      'svix-signature': svix_signature ? 'PRESENT' : 'MISSING',
      'user-agent': req.headers['user-agent'] || 'MISSING'
    })

    // Validate required headers
    const missingHeaders = []
    if (!svix_id) missingHeaders.push('svix-id')
    if (!svix_timestamp) missingHeaders.push('svix-timestamp')
    if (!svix_signature) missingHeaders.push('svix-signature')

    if (missingHeaders.length > 0) {
      logger.warn(`[${requestId}] Missing required svix headers`, {
        missingHeaders,
        allHeaders: Object.keys(req.headers)
      })
      return res.status(400).json({
        success: false,
        message: `Missing required headers: ${missingHeaders.join(', ')}`,
        error: 'MISSING_HEADERS',
        requestId,
        missingHeaders
      })
    }

    // Validate timestamp (not too old)
    const timestamp = parseInt(svix_timestamp)
    const now = Math.floor(Date.now() / 1000)
    const maxAge = 300 // 5 minutes

    if (now - timestamp > maxAge) {
      logger.warn(`[${requestId}] Webhook timestamp too old`, {
        timestamp,
        now,
        age: now - timestamp,
        maxAge
      })
      return res.status(400).json({
        success: false,
        message: 'Webhook timestamp too old',
        error: 'TIMESTAMP_TOO_OLD',
        requestId
      })
    }

    // Create Svix instance and verify webhook
    let evt
    let verificationMethod = 'svix'

    try {
      // Convert buffer to string for Svix verification
      const body = req.body.toString()

      logger.info(`[${requestId}] Processing webhook body`, {
        bodyLength: body.length,
        bodyPreview: body.substring(0, 100) + (body.length > 100 ? '...' : ''),
        headers: {
          'svix-id': svix_id,
          'svix-timestamp': svix_timestamp,
          'svix-signature': svix_signature.substring(0, 20) + '...',
          'content-type': req.headers['content-type'],
          'content-length': req.headers['content-length']
        }
      })

      // Primary verification using Svix
      const wh = new Webhook(WEBHOOK_SECRET)
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      })

      logger.info(`[${requestId}] Webhook verification successful`, {
        eventType: evt.type,
        eventId: evt.data?.id,
        method: verificationMethod
      })

    } catch (svixError) {
      logger.warn(`[${requestId}] Primary Svix verification failed, attempting fallback`, {
        error: svixError.message,
        errorType: svixError.constructor.name
      })

      // Fallback verification method
      try {
        verificationMethod = 'manual'
        const body = req.body.toString()

        // Manual signature verification as fallback
        const secretPrefix = 'wh' + 'sec_'
        const expectedSignature = crypto
          .createHmac('sha256', WEBHOOK_SECRET.replace(secretPrefix, ''))
          .update(`${svix_id}.${svix_timestamp}.${body}`)
          .digest('base64')

        const providedSignatures = svix_signature.split(',').map(sig => {
          const [version, signature] = sig.split('=')
          return { version, signature }
        })

        const validSignature = providedSignatures.some(sig =>
          sig.version === 'v1' && sig.signature === expectedSignature
        )

        if (!validSignature) {
          throw new Error('Manual signature verification failed')
        }

        // Parse the body as JSON for manual verification
        evt = JSON.parse(body)

        logger.info(`[${requestId}] Fallback verification successful`, {
          eventType: evt.type,
          eventId: evt.data?.id,
          method: verificationMethod
        })

      } catch (fallbackError) {
        logger.error(`[${requestId}] All webhook verification methods failed`, {
          svixError: svixError.message,
          fallbackError: fallbackError.message,
          secretLength: WEBHOOK_SECRET.length,
          secretValid: WEBHOOK_SECRET.startsWith('wh' + 'sec_'),
          bodyLength: req.body.length,
          headers: {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature ? 'present' : 'missing'
          }
        })

        return res.status(400).json({
          success: false,
          message: 'Webhook signature verification failed',
          error: 'SIGNATURE_VERIFICATION_FAILED',
          requestId,
          details: process.env.NODE_ENV === 'development' ? {
            svixError: svixError.message,
            fallbackError: fallbackError.message
          } : undefined
        })
      }
    }

    // Handle the webhook event
    const { type, data } = evt
    logger.info(`[${requestId}] Processing Clerk webhook event`, {
      eventType: type,
      userId: data?.id || data?.user_id,
      eventData: process.env.NODE_ENV === 'development' ? data : { id: data?.id }
    })

    try {
      switch (type) {
        case 'user.created':
          await handleUserCreated(data, requestId)
          logger.info(`[${requestId}] User created successfully`, { userId: data.id })
          break

        case 'user.updated':
          await handleUserUpdated(data, requestId)
          logger.info(`[${requestId}] User updated successfully`, { userId: data.id })
          break

        case 'user.deleted':
          await handleUserDeleted(data, requestId)
          logger.info(`[${requestId}] User deleted successfully`, { userId: data.id })
          break

        case 'session.created':
          logger.info(`[${requestId}] Session created`, { userId: data.user_id })
          break

        case 'session.ended':
        case 'session.removed':
        case 'session.revoked':
          logger.info(`[${requestId}] Session ended`, {
            userId: data.user_id,
            sessionEvent: type
          })
          break

        default:
          logger.warn(`[${requestId}] Unhandled Clerk webhook event`, {
            eventType: type,
            availableEvents: ['user.created', 'user.updated', 'user.deleted', 'session.created', 'session.ended']
          })
      }

      const processingTime = Date.now() - startTime
      logger.info(`[${requestId}] Webhook processed successfully`, {
        eventType: type,
        processingTime: `${processingTime}ms`
      })

      res.json({
        success: true,
        message: 'Webhook processed successfully',
        requestId,
        eventType: type,
        processingTime: `${processingTime}ms`
      })

    } catch (eventError) {
      logger.error(`[${requestId}] Error processing webhook event`, {
        eventType: type,
        error: eventError.message,
        stack: eventError.stack,
        userId: data?.id || data?.user_id
      })

      // Still return success to Clerk to avoid retries for application errors
      res.json({
        success: true,
        message: 'Webhook received but processing failed',
        requestId,
        eventType: type,
        error: 'PROCESSING_ERROR'
      })
    }
  } catch (error) {
    const processingTime = Date.now() - startTime
    logger.error(`[${requestId}] Unexpected error processing Clerk webhook`, {
      error: error.message,
      stack: error.stack,
      processingTime: `${processingTime}ms`,
      headers: {
        'user-agent': req.headers['user-agent'],
        'content-type': req.headers['content-type']
      }
    })

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'UNEXPECTED_ERROR',
      requestId,
      processingTime: `${processingTime}ms`
    })
  }
})

// Handle user created
async function handleUserCreated(userData, requestId = 'unknown') {
  try {
    logger.info(`[${requestId}] Processing user created webhook`, {
      userId: userData.id,
      email: userData.email_addresses?.[0]?.email_address,
      firstName: userData.first_name,
      lastName: userData.last_name
    })

    // Validate required data
    if (!userData.id) {
      throw new Error('Missing user ID in webhook data')
    }

    if (!userData.email_addresses || userData.email_addresses.length === 0) {
      throw new Error('Missing email addresses in webhook data')
    }

    // Check if user already exists
    const existingUser = await User.findOne({ clerkId: userData.id })
    if (existingUser) {
      logger.warn(`[${requestId}] User already exists`, {
        userId: userData.id,
        existingUserId: existingUser._id
      })
      return existingUser
    }

    // Create user in database
    const user = new User({
      clerkId: userData.id,
      email: userData.email_addresses[0].email_address,
      firstName: userData.first_name || 'User',
      lastName: userData.last_name || '',
      plan: 'free',
      trialStartDate: new Date(),
      trialEndDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days trial
    })

    await user.save()
    logger.info(`[${requestId}] User created successfully in database`, {
      userId: userData.id,
      databaseId: user._id,
      email: user.email
    })

    return user
  } catch (error) {
    logger.error(`[${requestId}] Error handling user created webhook`, {
      userId: userData?.id,
      error: error.message,
      stack: error.stack
    })
    throw error
  }
}

// Handle user updated
async function handleUserUpdated(userData, requestId = 'unknown') {
  try {
    logger.info(`[${requestId}] Processing user updated webhook`, {
      userId: userData.id,
      email: userData.email_addresses?.[0]?.email_address,
      firstName: userData.first_name,
      lastName: userData.last_name
    })

    // Validate required data
    if (!userData.id) {
      throw new Error('Missing user ID in webhook data')
    }

    // Update user in database
    const updatedUser = await User.findOneAndUpdate(
      { clerkId: userData.id },
      {
        email: userData.email_addresses?.[0]?.email_address,
        firstName: userData.first_name,
        lastName: userData.last_name,
        updatedAt: new Date()
      },
      { new: true }
    )

    if (!updatedUser) {
      logger.warn(`[${requestId}] User not found for update`, { userId: userData.id })
      // Create user if it doesn't exist (edge case)
      return await handleUserCreated(userData, requestId)
    }

    logger.info(`[${requestId}] User updated successfully in database`, {
      userId: userData.id,
      databaseId: updatedUser._id,
      email: updatedUser.email
    })

    return updatedUser
  } catch (error) {
    logger.error(`[${requestId}] Error handling user updated webhook`, {
      userId: userData?.id,
      error: error.message,
      stack: error.stack
    })
    throw error
  }
}

// Handle user deleted
async function handleUserDeleted(userData, requestId = 'unknown') {
  try {
    logger.info(`[${requestId}] Processing user deleted webhook`, {
      userId: userData.id
    })

    // Validate required data
    if (!userData.id) {
      throw new Error('Missing user ID in webhook data')
    }

    // Delete user from database
    const deletedUser = await User.findOneAndDelete({ clerkId: userData.id })

    if (!deletedUser) {
      logger.warn(`[${requestId}] User not found for deletion`, { userId: userData.id })
      return null
    }

    logger.info(`[${requestId}] User deleted successfully from database`, {
      userId: userData.id,
      databaseId: deletedUser._id,
      email: deletedUser.email
    })

    return deletedUser
  } catch (error) {
    logger.error(`[${requestId}] Error handling user deleted webhook`, {
      userId: userData?.id,
      error: error.message,
      stack: error.stack
    })
    throw error
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
