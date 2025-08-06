#!/usr/bin/env node

/**
 * Production Webhook Fix Deployment Script
 * Helps deploy the webhook fixes and verify they're working
 */

import https from 'https'
import { execSync } from 'child_process'

console.log('🚀 CLERK WEBHOOK FIX DEPLOYMENT')
console.log('===============================\n')

// Configuration
const PRODUCTION_URL = 'https://automaxlib.onrender.com'
const WEBHOOK_ENDPOINT = '/api/webhook/clerk'

// Step 1: Pre-deployment checks
async function preDeploymentChecks() {
  console.log('🔍 Step 1: Pre-deployment Checks')
  console.log('=================================')

  // Check if we're in the right directory
  try {
    const packageJson = JSON.parse(execSync('cat package.json', { encoding: 'utf8' }))
    if (!packageJson.name || !packageJson.name.includes('automaxlib')) {
      console.log('⚠️  Warning: Not in AutoMaxLib project directory')
    } else {
      console.log('✅ In correct project directory')
    }
  } catch (error) {
    console.log('❌ Cannot read package.json - ensure you\'re in the project root')
    return false
  }

  // Check if backend files exist
  const requiredFiles = [
    'backend/routes/webhook.js',
    'backend/server.js',
    'backend/.env.production'
  ]

  for (const file of requiredFiles) {
    try {
      execSync(`test -f ${file}`)
      console.log(`✅ Found: ${file}`)
    } catch (error) {
      console.log(`❌ Missing: ${file}`)
      return false
    }
  }

  return true
}

// Step 2: Check current webhook status
async function checkCurrentWebhookStatus() {
  console.log('\n🔍 Step 2: Current Webhook Status')
  console.log('==================================')

  return new Promise((resolve) => {
    // Test GET endpoint
    const options = {
      hostname: 'automaxlib.onrender.com',
      port: 443,
      path: WEBHOOK_ENDPOINT,
      method: 'GET'
    }

    const req = https.request(options, (res) => {
      let responseData = ''
      
      res.on('data', (chunk) => {
        responseData += chunk
      })
      
      res.on('end', () => {
        console.log(`📊 GET ${WEBHOOK_ENDPOINT} Status: ${res.statusCode}`)
        console.log(`📄 Response: ${responseData}`)
        
        const working = res.statusCode === 200
        console.log(`🔗 Webhook Endpoint: ${working ? 'ACCESSIBLE' : 'NOT ACCESSIBLE'}`)
        
        resolve(working)
      })
    })

    req.on('error', (error) => {
      console.log(`❌ Error checking webhook: ${error.message}`)
      resolve(false)
    })

    req.end()
  })
}

// Step 3: Environment variable guidance
function environmentVariableGuidance() {
  console.log('\n🔧 Step 3: Environment Variable Setup')
  console.log('======================================')
  
  console.log('📋 Required Actions:')
  console.log('1. Login to Clerk Dashboard: https://dashboard.clerk.com')
  console.log('2. Navigate to: Your App > Webhooks')
  console.log('3. Find webhook with URL: https://automaxlib.onrender.com/api/webhook/clerk')
  console.log('4. Copy the "Signing Secret" (starts with wh' + 'sec_)')
  console.log('5. Login to Render Dashboard: https://dashboard.render.com')
  console.log('6. Go to: Your Backend Service > Environment')
  console.log('7. Update CLERK_WEBHOOK_SECRET with the copied secret')
  console.log('8. Save changes and wait for automatic redeploy')

  console.log('\n⚠️  CRITICAL NOTES:')
  console.log('- Secret must start with "wh' + 'sec_"')
  console.log('- Secret must match exactly what\'s in Clerk Dashboard')
  console.log('- No extra spaces or characters')
  console.log('- Case sensitive')
  
  console.log('\n📝 Webhook Events to Enable in Clerk:')
  console.log('- user.created')
  console.log('- user.updated')
  console.log('- user.deleted')
  console.log('- session.created')
  console.log('- session.ended')
}

// Step 4: Test webhook after deployment
async function testWebhookAfterDeployment() {
  console.log('\n🧪 Step 4: Post-deployment Testing')
  console.log('===================================')
  
  console.log('🔄 Waiting 30 seconds for deployment to complete...')
  await new Promise(resolve => setTimeout(resolve, 30000))
  
  // Test with invalid signature (should get proper error)
  return new Promise((resolve) => {
    const testPayload = JSON.stringify({
      type: 'user.created',
      data: {
        id: 'test_user_123',
        email_addresses: [{ email_address: 'test@example.com' }]
      }
    })

    const options = {
      hostname: 'automaxlib.onrender.com',
      port: 443,
      path: WEBHOOK_ENDPOINT,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(testPayload),
        'User-Agent': 'Svix-Webhooks/1.68.0',
        'svix-id': 'msg_test_' + Date.now(),
        'svix-timestamp': Math.floor(Date.now() / 1000).toString(),
        'svix-signature': 'v1,test_invalid_signature'
      }
    }

    const req = https.request(options, (res) => {
      let responseData = ''
      
      res.on('data', (chunk) => {
        responseData += chunk
      })
      
      res.on('end', () => {
        console.log(`📊 POST Test Status: ${res.statusCode}`)
        console.log(`📄 Response: ${responseData}`)
        
        // We expect 400 or 500 - both indicate the endpoint is processing
        const processing = res.statusCode === 400 || res.statusCode === 500
        
        if (res.statusCode === 400 && responseData.includes('signature')) {
          console.log('✅ Webhook is properly validating signatures')
        } else if (res.statusCode === 500 && responseData.includes('secret')) {
          console.log('⚠️  Webhook secret still needs to be configured')
        } else {
          console.log('❓ Unexpected response - check logs')
        }
        
        resolve(processing)
      })
    })

    req.on('error', (error) => {
      console.log(`❌ Error testing webhook: ${error.message}`)
      resolve(false)
    })

    req.write(testPayload)
    req.end()
  })
}

// Step 5: Final verification steps
function finalVerificationSteps() {
  console.log('\n✅ Step 5: Final Verification')
  console.log('=============================')
  
  console.log('🧪 Manual Testing Steps:')
  console.log('1. Run comprehensive test: node test-clerk-webhook-comprehensive.js')
  console.log('2. Create a test user in your application')
  console.log('3. Check server logs for webhook processing')
  console.log('4. Verify user data appears in database')
  
  console.log('\n📊 Expected Log Output (Success):')
  console.log('```')
  console.log('Webhook headers: { svix-id: "msg_...", svix-timestamp: "...", svix-signature: "present" }')
  console.log('Webhook verification successful')
  console.log('Received Clerk webhook: user.created')
  console.log('User created successfully in database')
  console.log('```')
  
  console.log('\n🆘 If Still Not Working:')
  console.log('1. Double-check webhook secret in Clerk Dashboard')
  console.log('2. Ensure webhook is enabled in Clerk Dashboard')
  console.log('3. Check Render logs for detailed error messages')
  console.log('4. Verify webhook URL is correct in Clerk Dashboard')
  console.log('5. Contact support if issue persists')
}

// Main deployment process
async function runDeployment() {
  console.log('🚀 Starting Webhook Fix Deployment Process...\n')
  
  // Step 1: Pre-deployment checks
  const preChecksPassed = await preDeploymentChecks()
  if (!preChecksPassed) {
    console.log('\n❌ Pre-deployment checks failed. Please fix issues and try again.')
    return
  }
  
  // Step 2: Check current status
  const webhookAccessible = await checkCurrentWebhookStatus()
  
  // Step 3: Environment guidance
  environmentVariableGuidance()
  
  // Ask user to update environment variables
  console.log('\n⏸️  PAUSE: Please update the environment variables as instructed above.')
  console.log('Press Ctrl+C to exit, then run this script again after updating.')
  console.log('Or press Enter to continue with testing (if already updated)...')
  
  // Wait for user input
  process.stdin.setRawMode(true)
  process.stdin.resume()
  process.stdin.on('data', async () => {
    process.stdin.setRawMode(false)
    process.stdin.pause()
    
    // Step 4: Test after deployment
    const testPassed = await testWebhookAfterDeployment()
    
    // Step 5: Final steps
    finalVerificationSteps()
    
    console.log('\n🎉 Deployment process completed!')
    console.log('📞 Need help? Check CLERK_WEBHOOK_TROUBLESHOOTING.md')
    
    process.exit(0)
  })
}

// Run the deployment
runDeployment().catch(console.error)
