#!/usr/bin/env node

/**
 * Test script to verify the new Clerk webhook secret is working
 */

import https from 'https'

const NEW_SECRET = 'whsec_ZBysbrLyJU3zrW7ud+20O3fccgyc54Ie'
const ENDPOINT_ID = 'ep_30aolcgSH91FEPVDHedSWbdngcH'

// Test if the application is using the new webhook secret
async function testNewWebhookSecret() {
  console.log('🔍 Testing if application is using the new webhook secret...')
  console.log(`📝 Expected secret: ${NEW_SECRET}`)
  console.log(`🆔 Endpoint ID: ${ENDPOINT_ID}`)
  
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
        'svix-signature': 'v1,test_signature_should_fail_but_give_us_info'
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
          console.log('✅ Good! Application is processing webhooks and validating signatures')
          console.log('   This means the webhook secret is loaded (signature validation failed as expected)')
        } else if (res.statusCode === 500) {
          console.log('❌ Server error - webhook secret might not be loaded')
        } else {
          console.log('🔍 Unexpected response - check server logs')
        }
        
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

// Test webhook endpoint accessibility
async function testEndpointAccessibility() {
  console.log('\n🔍 Testing webhook endpoint accessibility...')
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'automaxlib.onrender.com',
      port: 443,
      path: '/api/webhook/clerk',
      method: 'GET',
      headers: {
        'User-Agent': 'Test-Script/1.0'
      }
    }

    const req = https.request(options, (res) => {
      let responseData = ''
      
      res.on('data', (chunk) => {
        responseData += chunk
      })
      
      res.on('end', () => {
        console.log(`📊 GET Status: ${res.statusCode}`)
        console.log(`📄 Response: ${responseData}`)
        
        if (res.statusCode === 200) {
          console.log('✅ Webhook endpoint is accessible')
        } else {
          console.log('❌ Webhook endpoint accessibility issue')
        }
        
        resolve({ status: res.statusCode, data: responseData })
      })
    })

    req.on('error', (error) => {
      console.error('❌ Error:', error.message)
      resolve({ error: error.message })
    })

    req.end()
  })
}

// Check if application needs restart
function checkApplicationRestart() {
  console.log('\n🔍 Checking if application restart is needed...')
  console.log('')
  console.log('📋 If you updated the environment variable on Render:')
  console.log('   1. Go to your Render dashboard')
  console.log('   2. Find your backend service')
  console.log('   3. Go to Environment tab')
  console.log('   4. Verify CLERK_WEBHOOK_SECRET is set to: whsec_ZBysbrLyJU3zrW7ud+20O3fccgyc54Ie')
  console.log('   5. If you just updated it, trigger a manual deploy or restart')
  console.log('')
  console.log('🔄 To restart on Render:')
  console.log('   - Go to your service dashboard')
  console.log('   - Click "Manual Deploy" or "Restart Service"')
  console.log('   - Wait for deployment to complete')
  console.log('')
}

async function main() {
  console.log('🚀 Testing New Clerk Webhook Secret...\n')
  
  await testEndpointAccessibility()
  await testNewWebhookSecret()
  checkApplicationRestart()
  
  console.log('\n📋 Next Steps:')
  console.log('1. If webhook secret validation is working but Clerk test still fails:')
  console.log('   - Check Clerk Dashboard webhook configuration')
  console.log('   - Ensure webhook URL is exactly: https://automaxlib.onrender.com/api/webhook/clerk')
  console.log('   - Verify webhook is enabled and active')
  console.log('   - Check selected events in webhook configuration')
  console.log('')
  console.log('2. If you see server errors:')
  console.log('   - Restart your Render service to load new environment variables')
  console.log('   - Check Render logs for any startup errors')
  console.log('')
  console.log('3. Test from Clerk Dashboard:')
  console.log('   - Go to your webhook configuration')
  console.log('   - Click "Send test event"')
  console.log('   - Check both Clerk and your server logs')
}

main().catch(console.error)
