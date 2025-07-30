#!/usr/bin/env node

/**
 * Test script to verify environment variables are loaded correctly
 * This helps debug if the webhook secret is actually available to the application
 */

import https from 'https'

// Test endpoint that returns environment variable status
async function testEnvironmentVariables() {
  console.log('🔍 Testing environment variable loading...')
  
  const testPayload = JSON.stringify({
    action: 'test_env'
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
        'User-Agent': 'Env-Test/1.0'
        // Intentionally omitting svix headers to trigger the "Missing svix headers" response
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
        
        if (res.statusCode === 400 && responseData.includes('Missing svix headers')) {
          console.log('✅ Good! Environment variables are loaded (webhook secret check passed)')
          console.log('   The error is expected since we omitted required headers')
        } else if (res.statusCode === 500 && responseData.includes('Webhook secret not configured')) {
          console.log('❌ Environment variable CLERK_WEBHOOK_SECRET is not loaded!')
          console.log('   Check your production environment configuration')
        } else {
          console.log('🔍 Unexpected response - check server logs for details')
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

// Test the health endpoint
async function testHealthEndpoint() {
  console.log('\n🔍 Testing health endpoint...')
  
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
        console.log(`📊 Health check status: ${res.statusCode}`)
        console.log(`📄 Response: ${responseData}`)
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
  console.log('🚀 Testing Environment Variables...\n')
  
  await testHealthEndpoint()
  await testEnvironmentVariables()
  
  console.log('\n💡 Troubleshooting Tips:')
  console.log('1. If webhook secret is not configured:')
  console.log('   - Check if .env.production is being loaded')
  console.log('   - Verify CLERK_WEBHOOK_SECRET is set correctly')
  console.log('   - Restart your application after changing environment variables')
  console.log('')
  console.log('2. If webhook secret is loaded but signature fails:')
  console.log('   - Get the correct secret from Clerk Dashboard')
  console.log('   - Ensure webhook URL in Clerk matches your endpoint')
  console.log('   - Check webhook is enabled and active')
}

main().catch(console.error)
