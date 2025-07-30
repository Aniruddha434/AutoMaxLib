#!/usr/bin/env node

/**
 * Debug script for Clerk webhook issues
 * This script helps diagnose common Clerk webhook problems
 */

import https from 'https'

// Test webhook endpoint
const WEBHOOK_URL = 'https://automaxlib.onrender.com/api/webhook/clerk'

// Test 1: Check if webhook endpoint is accessible
async function testWebhookEndpoint() {
  console.log('🔍 Testing webhook endpoint accessibility...')
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'automaxlib.onrender.com',
      port: 443,
      path: '/api/webhook/clerk',
      method: 'GET',
      headers: {
        'User-Agent': 'Debug-Script/1.0'
      }
    }

    const req = https.request(options, (res) => {
      let responseData = ''
      
      res.on('data', (chunk) => {
        responseData += chunk
      })
      
      res.on('end', () => {
        console.log(`✅ GET request status: ${res.statusCode}`)
        console.log(`📄 Response: ${responseData}`)
        resolve({ status: res.statusCode, data: responseData })
      })
    })

    req.on('error', (error) => {
      console.error('❌ Error accessing webhook endpoint:', error.message)
      resolve({ error: error.message })
    })

    req.end()
  })
}

// Test 2: Test webhook secret validation
function testWebhookSecret() {
  console.log('\n🔍 Testing webhook secret format...')

  const testSecret = 'whsec_ZBysbrLyJU3zrW7ud+20O3fccgyc54Ie'

  console.log(`📝 Current secret: ${testSecret}`)
  console.log(`📏 Length: ${testSecret.length} characters`)
  console.log(`🔤 Starts with 'whsec_': ${testSecret.startsWith('whsec_')}`)

  // Check for common issues
  if (!testSecret.startsWith('whsec_')) {
    console.log('❌ Secret should start with "whsec_"')
  } else {
    console.log('✅ Secret format looks correct')
  }

  if (testSecret.length < 20) {
    console.log('❌ Secret seems too short')
  }

  if (testSecret.includes(' ')) {
    console.log('❌ Secret contains spaces (should not)')
  }
}

// Test 3: Simulate a Clerk webhook request
async function simulateClerkWebhook() {
  console.log('\n🔍 Simulating Clerk webhook request...')
  
  const testPayload = JSON.stringify({
    type: 'user.created',
    data: {
      id: 'user_test123',
      email_addresses: [{ email_address: 'test@example.com' }],
      first_name: 'Test',
      last_name: 'User'
    }
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
        'User-Agent': 'Svix-Webhooks/1.68.0 (sender-test; +https://www.svix.com/http-sender/)',
        'svix-id': 'msg_test_' + Date.now(),
        'svix-timestamp': Math.floor(Date.now() / 1000).toString(),
        'svix-signature': 'v1,test_signature_that_should_fail'
      }
    }

    const req = https.request(options, (res) => {
      let responseData = ''
      
      res.on('data', (chunk) => {
        responseData += chunk
      })
      
      res.on('end', () => {
        console.log(`📊 POST request status: ${res.statusCode}`)
        console.log(`📄 Response: ${responseData}`)
        
        if (res.statusCode === 400 && responseData.includes('Invalid webhook signature')) {
          console.log('✅ Good! Webhook endpoint is processing requests and validating signatures')
        } else if (res.statusCode === 400 && responseData.includes('Missing')) {
          console.log('⚠️  Webhook endpoint is missing required headers or configuration')
        } else if (res.statusCode === 500) {
          console.log('❌ Server error - check environment variables and logs')
        }
        
        resolve({ status: res.statusCode, data: responseData })
      })
    })

    req.on('error', (error) => {
      console.error('❌ Error sending webhook request:', error.message)
      resolve({ error: error.message })
    })

    req.write(testPayload)
    req.end()
  })
}

// Test 4: Check environment variable format
function checkEnvironmentFormat() {
  console.log('\n🔍 Checking environment variable format...')
  
  const secret = 'whsec_KY5BvDzBPfTG//dS3fm+tOs1JRf0eAIS'
  
  console.log(`📝 Current secret: ${secret}`)
  console.log(`📏 Length: ${secret.length} characters`)
  console.log(`🔤 Starts with 'whsec_': ${secret.startsWith('whsec_')}`)
  
  // Check for common issues
  if (!secret.startsWith('whsec_')) {
    console.log('❌ Secret should start with "whsec_"')
  }
  
  if (secret.length < 20) {
    console.log('❌ Secret seems too short')
  }
  
  if (secret.includes(' ')) {
    console.log('❌ Secret contains spaces (should not)')
  }
  
  console.log('\n💡 To get the correct webhook secret:')
  console.log('   1. Go to Clerk Dashboard (https://dashboard.clerk.com)')
  console.log('   2. Select your application')
  console.log('   3. Go to Webhooks section')
  console.log('   4. Find your webhook endpoint')
  console.log('   5. Copy the "Signing Secret" (starts with whsec_)')
}

// Main diagnostic function
async function runDiagnostics() {
  console.log('🚀 Starting Clerk Webhook Diagnostics...\n')
  
  // Run all tests
  await testWebhookEndpoint()
  testWebhookSecret()
  await simulateClerkWebhook()
  checkEnvironmentFormat()
  
  console.log('\n📋 Summary & Next Steps:')
  console.log('1. Verify your CLERK_WEBHOOK_SECRET in production environment')
  console.log('2. Check Clerk Dashboard webhook configuration')
  console.log('3. Ensure webhook URL matches: https://automaxlib.onrender.com/api/webhook/clerk')
  console.log('4. Check if webhook is enabled and active in Clerk Dashboard')
  console.log('5. Review server logs for any additional error details')
}

// Run diagnostics
runDiagnostics().catch(console.error)
