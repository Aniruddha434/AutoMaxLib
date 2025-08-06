#!/usr/bin/env node

/**
 * Comprehensive Clerk Webhook Production Fix Script
 * This script helps diagnose and fix Clerk webhook issues in production
 */

import https from 'https'
import fs from 'fs'
import path from 'path'

const WEBHOOK_URL = 'https://automaxlib.onrender.com/api/webhook/clerk'
const ENV_FILE_PATH = './backend/.env.production'

console.log('🚀 Clerk Webhook Production Fix Script')
console.log('=====================================\n')

// Step 1: Check current environment configuration
function checkEnvironmentFile() {
  console.log('📋 Step 1: Checking environment configuration...')
  
  try {
    if (!fs.existsSync(ENV_FILE_PATH)) {
      console.log('❌ Environment file not found:', ENV_FILE_PATH)
      return null
    }
    
    const envContent = fs.readFileSync(ENV_FILE_PATH, 'utf8')
    const lines = envContent.split('\n')
    
    let clerkSecret = null
    let clerkSecretLine = null
    
    lines.forEach((line, index) => {
      if (line.startsWith('CLERK_WEBHOOK_SECRET=')) {
        clerkSecret = line.split('=')[1]
        clerkSecretLine = index + 1
      }
    })
    
    if (clerkSecret) {
      console.log(`✅ Found CLERK_WEBHOOK_SECRET on line ${clerkSecretLine}`)
      console.log(`📝 Current secret: ${clerkSecret}`)
      console.log(`📏 Length: ${clerkSecret.length} characters`)
      console.log(`🔤 Starts with 'whsec_': ${clerkSecret.startsWith('whsec_')}`)
      
      if (clerkSecret.includes('REPLACE_WITH_ACTUAL_SECRET')) {
        console.log('⚠️  Secret needs to be replaced with actual value from Clerk Dashboard')
        return { needsUpdate: true, currentSecret: clerkSecret }
      }
      
      return { needsUpdate: false, currentSecret: clerkSecret }
    } else {
      console.log('❌ CLERK_WEBHOOK_SECRET not found in environment file')
      return null
    }
  } catch (error) {
    console.error('❌ Error reading environment file:', error.message)
    return null
  }
}

// Step 2: Test webhook endpoint accessibility
async function testWebhookEndpoint() {
  console.log('\n📋 Step 2: Testing webhook endpoint...')
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'automaxlib.onrender.com',
      port: 443,
      path: '/api/webhook/clerk',
      method: 'GET',
      headers: {
        'User-Agent': 'Clerk-Webhook-Fix-Script/1.0'
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
        resolve({ status: res.statusCode, data: responseData, success: res.statusCode === 200 })
      })
    })

    req.on('error', (error) => {
      console.error('❌ Error accessing webhook endpoint:', error.message)
      resolve({ error: error.message, success: false })
    })

    req.setTimeout(10000, () => {
      console.error('❌ Request timeout')
      req.destroy()
      resolve({ error: 'Timeout', success: false })
    })

    req.end()
  })
}

// Step 3: Test webhook with simulated Clerk request
async function testWebhookWithSignature(secret) {
  console.log('\n📋 Step 3: Testing webhook signature validation...')
  
  if (!secret || secret.includes('REPLACE_WITH_ACTUAL_SECRET')) {
    console.log('⚠️  Skipping signature test - secret needs to be configured')
    return { skipped: true }
  }
  
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
        'User-Agent': 'Svix-Webhooks/1.68.0 (test; +https://www.svix.com/)',
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
          console.log('✅ Good! Webhook is validating signatures correctly')
          resolve({ success: true, validating: true })
        } else if (res.statusCode === 500) {
          console.log('❌ Server error - check environment variables')
          resolve({ success: false, error: 'Server error' })
        } else {
          console.log('⚠️  Unexpected response')
          resolve({ success: false, error: 'Unexpected response' })
        }
      })
    })

    req.on('error', (error) => {
      console.error('❌ Error sending webhook request:', error.message)
      resolve({ error: error.message, success: false })
    })

    req.setTimeout(10000, () => {
      console.error('❌ Request timeout')
      req.destroy()
      resolve({ error: 'Timeout', success: false })
    })

    req.write(testPayload)
    req.end()
  })
}

// Step 4: Generate fix instructions
function generateFixInstructions(envCheck, endpointTest, signatureTest) {
  console.log('\n📋 Step 4: Fix Instructions')
  console.log('============================')
  
  if (!endpointTest.success) {
    console.log('❌ CRITICAL: Webhook endpoint is not accessible')
    console.log('   1. Check if your backend is deployed and running')
    console.log('   2. Verify the URL: https://automaxlib.onrender.com/api/webhook/clerk')
    console.log('   3. Check deployment logs for errors')
    return
  }
  
  if (envCheck?.needsUpdate) {
    console.log('🔧 ACTION REQUIRED: Update webhook secret')
    console.log('   1. Go to Clerk Dashboard: https://dashboard.clerk.com')
    console.log('   2. Select your production application')
    console.log('   3. Navigate to "Webhooks" in the sidebar')
    console.log('   4. Find webhook: https://automaxlib.onrender.com/api/webhook/clerk')
    console.log('   5. Copy the "Signing Secret" (starts with whsec_)')
    console.log('   6. Update your production environment variables:')
    console.log('      CLERK_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_SECRET')
    console.log('   7. Redeploy your application')
    return
  }
  
  if (signatureTest?.validating) {
    console.log('✅ Webhook configuration appears correct!')
    console.log('   - Endpoint is accessible')
    console.log('   - Secret is configured')
    console.log('   - Signature validation is working')
    console.log('\n🔍 If you\'re still experiencing issues:')
    console.log('   1. Check Clerk Dashboard webhook logs')
    console.log('   2. Verify webhook is enabled and active')
    console.log('   3. Check your application logs for errors')
    console.log('   4. Ensure webhook events are configured correctly')
  } else {
    console.log('⚠️  Webhook endpoint is accessible but may have configuration issues')
    console.log('   1. Verify CLERK_WEBHOOK_SECRET matches Clerk Dashboard')
    console.log('   2. Check application logs for detailed error messages')
    console.log('   3. Ensure environment variables are loaded correctly')
  }
}

// Main execution
async function main() {
  try {
    const envCheck = checkEnvironmentFile()
    const endpointTest = await testWebhookEndpoint()
    const signatureTest = await testWebhookWithSignature(envCheck?.currentSecret)
    
    generateFixInstructions(envCheck, endpointTest, signatureTest)
    
    console.log('\n📞 Need Help?')
    console.log('   - Check CLERK_WEBHOOK_TROUBLESHOOTING.md for detailed guide')
    console.log('   - Review application logs for specific error messages')
    console.log('   - Verify Clerk Dashboard webhook configuration')
    
  } catch (error) {
    console.error('❌ Script error:', error.message)
  }
}

main()
