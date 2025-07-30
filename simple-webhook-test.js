#!/usr/bin/env node

/**
 * Simple Webhook Test to Check Secret Loading
 */

import https from 'https'

console.log('🔧 SIMPLE WEBHOOK SECRET TEST')
console.log('==============================\n')

async function testWebhookSecret() {
  console.log('📋 Testing webhook secret loading...')
  
  const testPayload = JSON.stringify({
    type: 'user.created',
    data: { id: 'test_secret_check' }
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
          console.log('\n✅ GOOD: Webhook secret is loaded and signature validation is working')
          console.log('🔍 Check your Render logs for:')
          console.log('   - "Webhook secret length: [number]"')
          console.log('   - "Webhook secret starts with whsec_: [true/false]"')
          console.log('')
          console.log('📋 Expected values:')
          console.log('   - Length: 38')
          console.log('   - Starts with whsec_: true')
          console.log('')
          console.log('🎯 NEXT STEPS:')
          console.log('1. Check Render logs for the secret length')
          console.log('2. If length ≠ 38: Your app has wrong secret')
          console.log('3. If length = 38: Secret is correct, issue is elsewhere')
          
        } else if (res.statusCode === 500) {
          console.log('\n❌ BAD: Webhook secret NOT loaded')
          console.log('🔧 SOLUTION: Environment variable issue')
          console.log('')
          console.log('Try these fixes:')
          console.log('1. Remove CLERK_WEBHOOK_SECRET from Render Dashboard')
          console.log('2. Ensure .env.production has the secret')
          console.log('3. Commit and push to Git')
          console.log('4. Wait for Render deployment')
          
        } else {
          console.log('\n⚠️  UNEXPECTED: Different response than expected')
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
  console.log('🚀 Testing webhook secret loading...\n')
  
  try {
    await testWebhookSecret()
    
    console.log('\n📋 SUMMARY OF SOLUTIONS:')
    console.log('========================')
    console.log('')
    console.log('🎯 SOLUTION A - Use Render Dashboard (Recommended):')
    console.log('1. Go to Render Dashboard → Your Service → Environment')
    console.log('2. Set: CLERK_WEBHOOK_SECRET = whsec_ZBysbrLyJU3zrW7ud+20O3fccgyc54Ie')
    console.log('3. Save and restart service')
    console.log('4. Test webhook from Clerk Dashboard')
    console.log('')
    console.log('🎯 SOLUTION B - Use .env.production file:')
    console.log('1. Remove CLERK_WEBHOOK_SECRET from Render Dashboard')
    console.log('2. Ensure .env.production has: CLERK_WEBHOOK_SECRET=whsec_ZBysbrLyJU3zrW7ud+20O3fccgyc54Ie')
    console.log('3. Commit: git add backend/.env.production && git commit -m "Update webhook secret"')
    console.log('4. Push: git push origin main')
    console.log('5. Wait for Render deployment')
    console.log('6. Test webhook from Clerk Dashboard')
    console.log('')
    console.log('🎯 SOLUTION C - Regenerate Secret (if A & B fail):')
    console.log('1. Go to Clerk Dashboard → Webhooks → Regenerate signing secret')
    console.log('2. Copy new secret')
    console.log('3. Use Solution A or B with new secret')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

main().catch(console.error)
