#!/usr/bin/env node

/**
 * Check if the webhook secret is properly loaded in the running application
 */

import https from 'https'

async function checkWebhookSecretLoaded() {
  console.log('🔍 Checking if webhook secret is loaded in running application...')
  
  // Send a POST request that will trigger the webhook secret logging
  const testPayload = JSON.stringify({
    type: 'user.created',
    data: { id: 'test' }
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
        'User-Agent': 'Test-Secret-Check/1.0',
        'svix-id': 'msg_test_' + Date.now(),
        'svix-timestamp': Math.floor(Date.now() / 1000).toString(),
        'svix-signature': 'v1,test_signature_to_trigger_logging'
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
          console.log('✅ Application is processing webhooks and has a webhook secret loaded')
          console.log('📝 Check your Render logs now - you should see:')
          console.log('   - "Webhook secret length: [number]"')
          console.log('   - "Webhook secret starts with whsec_: true"')
          console.log('')
          console.log('🔍 If the secret length is NOT 38 characters, the wrong secret is loaded')
          console.log('🔍 Expected secret: whsec_ZBysbrLyJU3zrW7ud+20O3fccgyc54Ie (38 chars)')
        } else if (res.statusCode === 500) {
          console.log('❌ Webhook secret is NOT loaded - check environment variables')
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
  console.log('🚀 Checking Webhook Secret Status...\n')
  
  await checkWebhookSecretLoaded()
  
  console.log('\n📋 Next Steps:')
  console.log('1. Check your Render logs for the webhook secret details')
  console.log('2. If secret length is not 38, your app needs restart')
  console.log('3. If secret length is 38 but still failing, check Clerk Dashboard secret')
  console.log('')
  console.log('🔄 To restart on Render:')
  console.log('   - Go to Render Dashboard')
  console.log('   - Find your backend service')
  console.log('   - Click "Manual Deploy" or restart the service')
}

main().catch(console.error)
