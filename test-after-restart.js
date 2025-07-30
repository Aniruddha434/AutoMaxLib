#!/usr/bin/env node

/**
 * Test script to verify webhook is working after Render restart
 */

import https from 'https'

async function testWebhookAfterRestart() {
  console.log('🔍 Testing webhook after Render restart...')
  console.log('Expected: Webhook should now work with the new secret')
  console.log('')
  
  // Test with the exact same type of request Clerk sends
  const testPayload = JSON.stringify({
    data: {
      id: "user_test123",
      first_name: "Test",
      last_name: "User",
      email_addresses: [],
      created_at: Date.now()
    },
    object: "event",
    type: "user.created",
    timestamp: Math.floor(Date.now() / 1000)
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
        'svix-signature': 'v1,test_signature_will_fail_but_shows_processing'
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
          console.log('✅ Good! Application is processing webhooks with signature validation')
          console.log('   (Test signature failed as expected)')
          console.log('')
          console.log('🎯 Now test from Clerk Dashboard - it should work!')
        } else if (res.statusCode === 500) {
          console.log('❌ Server error - check Render logs')
        } else if (res.statusCode === 200) {
          console.log('⚠️  Unexpected success - signature validation might be disabled')
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

async function checkServiceStatus() {
  console.log('🔍 Checking service status...')
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'automaxlib.onrender.com',
      port: 443,
      path: '/api/webhook/health',
      method: 'GET'
    }

    const req = https.request(options, (res) => {
      let responseData = ''
      
      res.on('data', (chunk) => {
        responseData += chunk
      })
      
      res.on('end', () => {
        console.log(`📊 Health Status: ${res.statusCode}`)
        
        if (res.statusCode === 200) {
          const data = JSON.parse(responseData)
          console.log(`✅ Service is running (timestamp: ${data.timestamp})`)
        } else {
          console.log('❌ Service health check failed')
        }
        
        resolve({ status: res.statusCode, data: responseData })
      })
    })

    req.on('error', (error) => {
      console.error('❌ Health check error:', error.message)
      resolve({ error: error.message })
    })

    req.end()
  })
}

async function main() {
  console.log('🚀 Testing After Render Restart...\n')
  
  await checkServiceStatus()
  console.log('')
  await testWebhookAfterRestart()
  
  console.log('\n📋 Next Steps:')
  console.log('1. If the test above shows webhook processing is working:')
  console.log('   → Go to Clerk Dashboard and test the webhook again')
  console.log('   → It should now return 200 OK instead of 400 Bad Request')
  console.log('')
  console.log('2. If you still see server errors:')
  console.log('   → Check Render deployment logs')
  console.log('   → Ensure the new environment variable was loaded')
  console.log('')
  console.log('3. Monitor your Render logs when testing from Clerk:')
  console.log('   → Should see "Webhook verification successful"')
  console.log('   → Should see "Received Clerk webhook: user.created"')
}

main().catch(console.error)
