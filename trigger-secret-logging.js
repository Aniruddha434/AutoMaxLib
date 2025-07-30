#!/usr/bin/env node

/**
 * Trigger webhook secret logging to check what secret is actually loaded
 */

import https from 'https'

async function triggerSecretLogging() {
  console.log('🔍 Triggering webhook secret logging...')
  console.log('This will cause your application to log the webhook secret details.')
  console.log('Check your Render logs immediately after this runs.\n')
  
  const testPayload = JSON.stringify({
    type: 'user.created',
    data: {
      id: 'secret_check_test',
      email_addresses: [{ email_address: 'test@example.com' }]
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
        'User-Agent': 'Secret-Check/1.0',
        'svix-id': 'msg_secret_check_' + Date.now(),
        'svix-timestamp': Math.floor(Date.now() / 1000).toString(),
        'svix-signature': 'v1,this_will_fail_but_trigger_logging'
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
        console.log('')
        console.log('✅ Webhook secret logging triggered!')
        console.log('')
        console.log('📋 NOW CHECK YOUR RENDER LOGS FOR:')
        console.log('   - "Webhook secret length: [number]"')
        console.log('   - "Webhook secret starts with whsec_: [true/false]"')
        console.log('')
        console.log('🎯 Expected values:')
        console.log('   - Length should be: 38')
        console.log('   - Starts with whsec_: true')
        console.log('')
        console.log('❌ If length is NOT 38:')
        console.log('   → Your app is using an old/different secret')
        console.log('   → Force restart your Render service again')
        console.log('')
        console.log('✅ If length IS 38:')
        console.log('   → Secret is loaded correctly')
        console.log('   → Issue might be in Clerk Dashboard configuration')
        console.log('   → Try regenerating the webhook secret in Clerk')
        
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
  console.log('🚀 Webhook Secret Logging Test\n')
  
  await triggerSecretLogging()
  
  console.log('\n📋 Next Steps:')
  console.log('1. Check your Render logs RIGHT NOW')
  console.log('2. Look for the webhook secret length message')
  console.log('3. Report back what length you see')
  console.log('')
  console.log('🔗 To check Render logs:')
  console.log('   - Go to Render Dashboard')
  console.log('   - Open your backend service')
  console.log('   - Click on "Logs" tab')
  console.log('   - Look for the most recent entries')
}

main().catch(console.error)
