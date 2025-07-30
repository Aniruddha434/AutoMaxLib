#!/usr/bin/env node

/**
 * Test if environment variables are actually loaded in Render
 */

import https from 'https'

console.log('🔍 TESTING ENVIRONMENT VARIABLE LOADING')
console.log('=======================================\n')

async function testEnvLoading() {
  console.log('📋 Testing if CLERK_WEBHOOK_SECRET is loaded in running app...')
  
  // Test with a special payload that will trigger environment variable logging
  const testPayload = JSON.stringify({
    type: 'test.env_check',
    data: { test: 'environment_variable_check' }
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
        'svix-id': 'msg_env_test_' + Date.now(),
        'svix-timestamp': Math.floor(Date.now() / 1000).toString(),
        'svix-signature': 'v1,test_signature_to_trigger_error'
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
        
        if (res.statusCode === 500 && responseData.includes('Webhook secret not configured')) {
          console.log('\n❌ CRITICAL: CLERK_WEBHOOK_SECRET is NOT loaded!')
          console.log('🔧 SOLUTION: Environment variable loading issue')
          console.log('')
          console.log('IMMEDIATE FIXES TO TRY:')
          console.log('1. Delete CLERK_WEBHOOK_SECRET from Render Dashboard')
          console.log('2. Add it back as a new variable')
          console.log('3. Restart service manually')
          console.log('4. Check if .env.production is being loaded correctly')
          
        } else if (res.statusCode === 400 && responseData.includes('Invalid webhook signature')) {
          console.log('\n✅ GOOD: CLERK_WEBHOOK_SECRET is loaded!')
          console.log('🔍 But debug logs are missing - check Render logs for:')
          console.log('   - "Webhook secret length: [number]"')
          console.log('   - "Webhook secret starts with whsec_: [true/false]"')
          console.log('')
          console.log('If you still don\'t see these logs, there might be a logging issue.')
          
        } else {
          console.log('\n⚠️  UNEXPECTED RESPONSE')
          console.log('Check the response above for clues')
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

async function main() {
  console.log('🚀 Testing environment variable loading...\n')
  
  try {
    await testEnvLoading()
    
    console.log('\n📋 NEXT STEPS BASED ON RESULTS:')
    console.log('===============================')
    console.log('')
    console.log('IF you got "Webhook secret not configured":')
    console.log('  → Environment variable is NOT loaded')
    console.log('  → Try deleting and re-adding CLERK_WEBHOOK_SECRET in Render')
    console.log('  → Force restart the service')
    console.log('')
    console.log('IF you got "Invalid webhook signature" BUT no debug logs:')
    console.log('  → Environment variable IS loaded')
    console.log('  → But logging might be buffered or filtered')
    console.log('  → Try regenerating webhook secret in Clerk Dashboard')
    console.log('')
    console.log('🎯 MOST LIKELY SOLUTION:')
    console.log('1. Go to Clerk Dashboard → Webhooks')
    console.log('2. Regenerate the signing secret')
    console.log('3. Copy new secret to Render environment variables')
    console.log('4. Restart Render service')
    console.log('5. Test webhook from Clerk Dashboard')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

main().catch(console.error)
