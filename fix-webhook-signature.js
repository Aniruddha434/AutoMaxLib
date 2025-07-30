#!/usr/bin/env node

/**
 * Comprehensive Clerk Webhook Signature Fix
 * This script will definitively resolve the webhook signature issue
 */

import https from 'https'

const EXPECTED_SECRET = 'whsec_ZBysbrLyJU3zrW7ud+20O3fccgyc54Ie'

console.log('🔧 COMPREHENSIVE CLERK WEBHOOK SIGNATURE FIX')
console.log('=============================================\n')

// Step 1: Test current webhook secret loading
async function step1_TestCurrentSecret() {
  console.log('📋 STEP 1: Testing Current Webhook Secret Loading')
  console.log('--------------------------------------------------')
  
  const testPayload = JSON.stringify({
    type: 'user.created',
    data: { id: 'test_secret_loading' }
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
        'svix-id': 'msg_test_' + Date.now(),
        'svix-timestamp': Math.floor(Date.now() / 1000).toString(),
        'svix-signature': 'v1,invalid_signature_to_trigger_logging'
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
          console.log('✅ Webhook secret is loaded (signature validation working)')
        } else if (res.statusCode === 500) {
          console.log('❌ Webhook secret NOT loaded (server error)')
        }
        
        console.log('\n🔍 Check your Render logs NOW for:')
        console.log('   - "Webhook secret length: [number]"')
        console.log('   - "Webhook secret starts with whsec_: [true/false]"')
        console.log('')
        
        resolve({ status: res.statusCode, data: responseData })
      })
    })

    req.on('error', (error) => {
      console.error('❌ Error:', error.message)
      resolve({ error: error.message })
    })

    req.write(testPayload)
    req.end()
  })
}

// Step 2: Generate valid signature for testing
async function generateValidSignature(payload, secret, timestamp, msgId) {
  const crypto = await import('crypto')

  const signedPayload = `${msgId}.${timestamp}.${payload}`
  const signature = crypto.default.createHmac('sha256', secret.replace('whsec_', ''))
    .update(signedPayload, 'utf8')
    .digest('base64')

  return `v1,${signature}`
}

// Step 3: Test with valid signature
async function step3_TestValidSignature() {
  console.log('📋 STEP 3: Testing with Valid Signature')
  console.log('---------------------------------------')
  
  const testPayload = JSON.stringify({
    type: 'user.created',
    data: {
      id: 'test_valid_signature',
      email_addresses: [{ email_address: 'test@example.com' }]
    }
  })
  
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const msgId = 'msg_valid_test_' + Date.now()
  
  // Generate valid signature
  const validSignature = await generateValidSignature(testPayload, EXPECTED_SECRET, timestamp, msgId)

  return new Promise((resolve) => {
    const options = {
      hostname: 'automaxlib.onrender.com',
      port: 443,
      path: '/api/webhook/clerk',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(testPayload),
        'svix-id': msgId,
        'svix-timestamp': timestamp,
        'svix-signature': validSignature
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
        
        if (res.statusCode === 200) {
          console.log('🎉 SUCCESS: Valid signature accepted!')
          console.log('✅ Your webhook is working correctly')
        } else if (res.statusCode === 400 && responseData.includes('Invalid webhook signature')) {
          console.log('❌ FAIL: Valid signature rejected')
          console.log('🔍 This means the secret in your app ≠ secret used to generate signature')
        }
        
        console.log('')
        resolve({ status: res.statusCode, data: responseData })
      })
    })

    req.on('error', (error) => {
      console.error('❌ Error:', error.message)
      resolve({ error: error.message })
    })

    req.write(testPayload)
    req.end()
  })
}

// Analysis and next steps
function analyzeAndRecommend() {
  console.log('📋 ANALYSIS & NEXT STEPS')
  console.log('=========================\n')
  
  console.log('🎯 Based on the test results above:')
  console.log('')
  console.log('IF Step 1 shows "Webhook secret NOT loaded":')
  console.log('  → SOLUTION: Environment variable not loaded')
  console.log('  → ACTION: Remove CLERK_WEBHOOK_SECRET from Render Dashboard')
  console.log('  → ACTION: Commit .env.production file and push to Git')
  console.log('  → ACTION: Wait for Render to deploy')
  console.log('')
  console.log('IF Step 1 shows "Webhook secret is loaded" BUT Step 3 fails:')
  console.log('  → SOLUTION: Secret mismatch')
  console.log('  → ACTION: Regenerate webhook secret in Clerk Dashboard')
  console.log('  → ACTION: Update secret in Render environment variables')
  console.log('  → ACTION: Restart Render service')
  console.log('')
  console.log('IF Step 3 shows SUCCESS:')
  console.log('  → Your webhook is working!')
  console.log('  → Test from Clerk Dashboard should now work')
  console.log('')
  console.log('🔧 IMMEDIATE ACTIONS TO TRY:')
  console.log('')
  console.log('Option A - Use Render Dashboard Environment Variables:')
  console.log('1. Go to Render Dashboard → Environment tab')
  console.log('2. Set CLERK_WEBHOOK_SECRET = whsec_ZBysbrLyJU3zrW7ud+20O3fccgyc54Ie')
  console.log('3. Save and restart service')
  console.log('4. Test webhook from Clerk Dashboard')
  console.log('')
  console.log('Option B - Use .env.production file:')
  console.log('1. Remove CLERK_WEBHOOK_SECRET from Render Dashboard')
  console.log('2. Ensure .env.production has: CLERK_WEBHOOK_SECRET=whsec_ZBysbrLyJU3zrW7ud+20O3fccgyc54Ie')
  console.log('3. Commit and push to Git')
  console.log('4. Wait for Render deployment')
  console.log('5. Test webhook from Clerk Dashboard')
  console.log('')
  console.log('Option C - Regenerate Secret (if A & B fail):')
  console.log('1. Go to Clerk Dashboard → Webhooks')
  console.log('2. Regenerate the signing secret')
  console.log('3. Copy new secret')
  console.log('4. Update in Render (Option A) or .env.production (Option B)')
  console.log('5. Test webhook')
}

// Main function
async function main() {
  console.log('🚀 Starting comprehensive webhook signature fix...\n')
  
  try {
    await step1_TestCurrentSecret()
    
    console.log('\n⏳ Waiting 3 seconds for logs to appear...\n')
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    await step3_TestValidSignature()
    
    analyzeAndRecommend()
    
  } catch (error) {
    console.error('❌ Fix process failed:', error)
  }
}

main().catch(console.error)
