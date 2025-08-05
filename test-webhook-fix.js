#!/usr/bin/env node

/**
 * Test script to verify Clerk webhook fix
 * Run this after updating the environment variable
 */

import https from 'https'

const WEBHOOK_URL = 'https://automaxlib.onrender.com/api/webhook/clerk'

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
}

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// Test 1: Check if webhook endpoint is accessible
async function testWebhookEndpoint() {
  log('blue', '🔍 Step 1: Testing webhook endpoint accessibility...')
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'automaxlib.onrender.com',
      port: 443,
      path: '/api/webhook/clerk',
      method: 'GET',
      headers: {
        'User-Agent': 'Webhook-Fix-Test/1.0'
      }
    }

    const req = https.request(options, (res) => {
      let responseData = ''
      
      res.on('data', (chunk) => {
        responseData += chunk
      })
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          log('green', '✅ Webhook endpoint is accessible')
          console.log(`📄 Response: ${responseData}`)
        } else {
          log('red', `❌ Unexpected status: ${res.statusCode}`)
          console.log(`📄 Response: ${responseData}`)
        }
        resolve({ status: res.statusCode, data: responseData })
      })
    })

    req.on('error', (error) => {
      log('red', `❌ Error accessing webhook endpoint: ${error.message}`)
      resolve({ error: error.message })
    })

    req.end()
  })
}

// Test 2: Check environment variable loading
async function testEnvironmentVariable() {
  log('blue', '\n🔍 Step 2: Testing environment variable loading...')
  
  const testPayload = JSON.stringify({
    test: 'environment_check'
  })

  return new Promise((resolve) => {
    const options = {
      hostname: 'automaxlib.onrender.com',
      port: 443,
      path: '/api/webhook/clerk',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(testPayload),
        'User-Agent': 'Webhook-Fix-Test/1.0'
        // Intentionally omitting svix headers to test env var loading
      }
    }

    const req = https.request(options, (res) => {
      let responseData = ''
      
      res.on('data', (chunk) => {
        responseData += chunk
      })
      
      res.on('end', () => {
        console.log(`📊 Status: ${res.statusCode}`)
        console.log(`📄 Response: ${responseData}`)
        
        if (res.statusCode === 400 && responseData.includes('Missing svix headers')) {
          log('green', '✅ Environment variable is loaded correctly!')
          log('green', '   (The error is expected since we omitted required headers)')
        } else if (res.statusCode === 500 && responseData.includes('Webhook secret not configured')) {
          log('red', '❌ Environment variable CLERK_WEBHOOK_SECRET is still not loaded!')
          log('yellow', '   → Check your hosting platform environment variables')
          log('yellow', '   → Make sure you redeployed after updating the variable')
        } else {
          log('yellow', '🔍 Unexpected response - check server logs for details')
        }
        
        resolve({ status: res.statusCode, data: responseData })
      })
    })

    req.on('error', (error) => {
      log('red', `❌ Error: ${error.message}`)
      resolve({ error: error.message })
    })

    req.write(testPayload)
    req.end()
  })
}

// Test 3: Simulate a Clerk webhook (with fake signature)
async function testWebhookProcessing() {
  log('blue', '\n🔍 Step 3: Testing webhook signature validation...')
  
  const mockWebhookPayload = JSON.stringify({
    data: {
      id: "user_test123",
      email_addresses: [{ email_address: "test@example.com" }],
      first_name: "Test",
      last_name: "User"
    },
    type: "user.created"
  })

  return new Promise((resolve) => {
    const options = {
      hostname: 'automaxlib.onrender.com',
      port: 443,
      path: '/api/webhook/clerk',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(mockWebhookPayload),
        'User-Agent': 'Svix-Webhooks/1.68.0',
        'svix-id': 'msg_test123',
        'svix-timestamp': Math.floor(Date.now() / 1000).toString(),
        'svix-signature': 'v1,fake_signature_for_testing'
      }
    }

    const req = https.request(options, (res) => {
      let responseData = ''
      
      res.on('data', (chunk) => {
        responseData += chunk
      })
      
      res.on('end', () => {
        console.log(`📊 Status: ${res.statusCode}`)
        console.log(`📄 Response: ${responseData}`)
        
        if (res.statusCode === 400 && responseData.includes('Invalid webhook signature')) {
          log('green', '✅ Webhook signature validation is working!')
          log('green', '   (The error is expected since we used a fake signature)')
          log('green', '   → Your webhook secret is properly configured')
        } else if (res.statusCode === 500) {
          log('red', '❌ Server error - webhook secret might still be missing')
        } else {
          log('yellow', '🔍 Unexpected response - check server logs')
        }
        
        resolve({ status: res.statusCode, data: responseData })
      })
    })

    req.on('error', (error) => {
      log('red', `❌ Error: ${error.message}`)
      resolve({ error: error.message })
    })

    req.write(mockWebhookPayload)
    req.end()
  })
}

// Main test function
async function runWebhookTests() {
  log('blue', '🚀 Starting Clerk Webhook Fix Verification...\n')
  
  await testWebhookEndpoint()
  await testEnvironmentVariable()
  await testWebhookProcessing()
  
  log('blue', '\n📋 Next Steps:')
  console.log('1. If environment variable is not loaded:')
  console.log('   → Double-check the variable name: CLERK_WEBHOOK_SECRET')
  console.log('   → Ensure you redeployed after updating')
  console.log('   → Check hosting platform logs for deployment errors')
  console.log('')
  console.log('2. If signature validation is working:')
  console.log('   → Test from Clerk Dashboard: Send a test webhook')
  console.log('   → Monitor your server logs for successful processing')
  console.log('   → Try creating a new user to test the full flow')
  console.log('')
  console.log('3. If still having issues:')
  console.log('   → Check Clerk Dashboard webhook status')
  console.log('   → Verify webhook URL is exactly: https://automaxlib.onrender.com/api/webhook/clerk')
  console.log('   → Ensure webhook is enabled and active')
}

// Run the tests
runWebhookTests().catch(console.error)
