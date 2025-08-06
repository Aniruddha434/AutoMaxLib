#!/usr/bin/env node

/**
 * Simple verification script to confirm webhook fix
 * Run this after updating the webhook secret in production
 */

import https from 'https'

const WEBHOOK_URL = 'https://automaxlib.onrender.com/api/webhook/clerk'

console.log('🔍 Verifying Clerk Webhook Fix...\n')

// Test 1: Check endpoint accessibility
async function testEndpoint() {
  console.log('1. Testing webhook endpoint accessibility...')
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'automaxlib.onrender.com',
      port: 443,
      path: '/api/webhook/clerk',
      method: 'GET',
      headers: {
        'User-Agent': 'Webhook-Verification/1.0'
      }
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('   ✅ Endpoint is accessible')
          resolve(true)
        } else {
          console.log(`   ❌ Endpoint returned status: ${res.statusCode}`)
          resolve(false)
        }
      })
    })

    req.on('error', (error) => {
      console.log(`   ❌ Error: ${error.message}`)
      resolve(false)
    })

    req.setTimeout(10000, () => {
      console.log('   ❌ Request timeout')
      req.destroy()
      resolve(false)
    })

    req.end()
  })
}

// Test 2: Check signature validation
async function testSignatureValidation() {
  console.log('2. Testing signature validation...')
  
  const testPayload = JSON.stringify({
    type: 'user.created',
    data: { id: 'test_user', email_addresses: [{ email_address: 'test@example.com' }] }
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
        'User-Agent': 'Svix-Webhooks/1.68.0',
        'svix-id': 'msg_test_' + Date.now(),
        'svix-timestamp': Math.floor(Date.now() / 1000).toString(),
        'svix-signature': 'v1,invalid_signature_for_testing'
      }
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        if (res.statusCode === 400 && data.includes('Invalid webhook signature')) {
          console.log('   ✅ Signature validation is working correctly')
          resolve(true)
        } else if (res.statusCode === 500) {
          console.log('   ❌ Server error - webhook secret may not be configured')
          resolve(false)
        } else {
          console.log(`   ⚠️  Unexpected response: ${res.statusCode} - ${data}`)
          resolve(false)
        }
      })
    })

    req.on('error', (error) => {
      console.log(`   ❌ Error: ${error.message}`)
      resolve(false)
    })

    req.setTimeout(10000, () => {
      console.log('   ❌ Request timeout')
      req.destroy()
      resolve(false)
    })

    req.write(testPayload)
    req.end()
  })
}

// Main verification
async function verify() {
  const endpointOk = await testEndpoint()
  const signatureOk = await testSignatureValidation()
  
  console.log('\n📊 Verification Results:')
  console.log('========================')
  
  if (endpointOk && signatureOk) {
    console.log('✅ SUCCESS: Webhook configuration is working correctly!')
    console.log('\nNext steps:')
    console.log('1. Test webhook from Clerk Dashboard')
    console.log('2. Create a test user to verify end-to-end flow')
    console.log('3. Monitor application logs for webhook events')
  } else if (endpointOk && !signatureOk) {
    console.log('⚠️  PARTIAL: Endpoint accessible but signature validation failing')
    console.log('\nAction needed:')
    console.log('1. Verify CLERK_WEBHOOK_SECRET is set correctly in production')
    console.log('2. Ensure the secret matches Clerk Dashboard')
    console.log('3. Redeploy if environment variables were recently updated')
  } else {
    console.log('❌ FAILED: Webhook endpoint is not accessible')
    console.log('\nAction needed:')
    console.log('1. Check if backend service is running')
    console.log('2. Verify deployment was successful')
    console.log('3. Check application logs for errors')
  }
  
  console.log('\n🔗 Useful links:')
  console.log('- Clerk Dashboard: https://dashboard.clerk.com')
  console.log('- Webhook endpoint: https://automaxlib.onrender.com/api/webhook/clerk')
  console.log('- Troubleshooting guide: PRODUCTION_WEBHOOK_FIX_GUIDE.md')
}

verify().catch(console.error)
