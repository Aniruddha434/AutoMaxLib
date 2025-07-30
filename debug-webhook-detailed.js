#!/usr/bin/env node

/**
 * Detailed webhook debugging to find the exact issue
 */

import https from 'https'
import crypto from 'crypto'

console.log('🔍 DETAILED WEBHOOK DEBUGGING')
console.log('==============================\n')

// Test with a properly formatted Clerk webhook payload
async function testWithClerkFormat() {
  console.log('📋 Testing with Clerk-formatted webhook...')
  
  const timestamp = Math.floor(Date.now() / 1000)
  const msgId = `msg_${Date.now()}`
  
  // Proper Clerk webhook payload format
  const payload = {
    data: {
      id: "user_test123",
      email_addresses: [
        {
          email_address: "test@example.com",
          id: "idn_test123"
        }
      ],
      first_name: "Test",
      last_name: "User"
    },
    object: "event",
    type: "user.created"
  }
  
  const payloadString = JSON.stringify(payload)
  
  // Generate signature the way Clerk does it
  const secret = 'whsec_test_secret_for_debugging' // We'll use a test secret first
  const signedPayload = `${msgId}.${timestamp}.${payloadString}`
  const signature = crypto
    .createHmac('sha256', secret.replace('whsec_', ''))
    .update(signedPayload, 'utf8')
    .digest('base64')
  
  const svixSignature = `v1,${signature}`

  return new Promise((resolve) => {
    const options = {
      hostname: 'automaxlib.onrender.com',
      port: 443,
      path: '/api/webhook/clerk',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payloadString),
        'User-Agent': 'Svix-Webhooks/1.68.0',
        'svix-id': msgId,
        'svix-timestamp': timestamp.toString(),
        'svix-signature': svixSignature
      }
    }

    console.log('📤 Sending request with:')
    console.log(`   svix-id: ${msgId}`)
    console.log(`   svix-timestamp: ${timestamp}`)
    console.log(`   svix-signature: ${svixSignature}`)
    console.log(`   payload length: ${payloadString.length}`)
    console.log('')

    const req = https.request(options, (res) => {
      let responseData = ''
      
      res.on('data', (chunk) => {
        responseData += chunk
      })
      
      res.on('end', () => {
        console.log(`📊 Status: ${res.statusCode}`)
        console.log(`📄 Response: ${responseData}`)
        console.log('')
        
        resolve({ status: res.statusCode, data: responseData })
      })
    })

    req.on('error', (error) => {
      console.error('❌ Error:', error.message)
      resolve({ error: error.message })
    })

    req.write(payloadString)
    req.end()
  })
}

// Test the health endpoint to make sure service is running
async function testHealth() {
  console.log('📋 Testing health endpoint...')
  
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
        console.log(`📄 Health Response: ${responseData}`)
        console.log('')
        
        resolve({ status: res.statusCode, data: responseData })
      })
    })

    req.on('error', (error) => {
      console.error('❌ Health Error:', error.message)
      resolve({ error: error.message })
    })

    req.end()
  })
}

// Test with missing headers to see error handling
async function testMissingHeaders() {
  console.log('📋 Testing with missing headers...')
  
  const payload = JSON.stringify({ test: 'missing_headers' })

  return new Promise((resolve) => {
    const options = {
      hostname: 'automaxlib.onrender.com',
      port: 443,
      path: '/api/webhook/clerk',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }

    const req = https.request(options, (res) => {
      let responseData = ''
      
      res.on('data', (chunk) => {
        responseData += chunk
      })
      
      res.on('end', () => {
        console.log(`📊 Missing Headers Status: ${res.statusCode}`)
        console.log(`📄 Missing Headers Response: ${responseData}`)
        console.log('')
        
        resolve({ status: res.statusCode, data: responseData })
      })
    })

    req.on('error', (error) => {
      console.error('❌ Missing Headers Error:', error.message)
      resolve({ error: error.message })
    })

    req.write(payload)
    req.end()
  })
}

async function main() {
  console.log('🚀 Starting detailed webhook debugging...\n')
  
  try {
    // Test 1: Health check
    await testHealth()
    
    // Test 2: Missing headers (should show proper error handling)
    await testMissingHeaders()
    
    // Test 3: Properly formatted webhook (will fail signature but show debug info)
    await testWithClerkFormat()
    
    console.log('📋 ANALYSIS:')
    console.log('============')
    console.log('')
    console.log('🔍 Check your Render logs NOW for:')
    console.log('   1. "Webhook body length: [number]"')
    console.log('   2. "Webhook secret length: [number]"')
    console.log('   3. "Webhook secret starts with whsec_: [true/false]"')
    console.log('')
    console.log('📝 If you see these logs, the issue is signature generation/verification')
    console.log('📝 If you DON\'T see these logs, there\'s a deeper routing/parsing issue')
    console.log('')
    console.log('🎯 NEXT STEPS:')
    console.log('1. Check Render logs for the debug messages above')
    console.log('2. If logs appear: Issue is with signature verification logic')
    console.log('3. If no logs: Issue is with request routing or body parsing')
    console.log('4. Report back what you see in the logs!')
    
  } catch (error) {
    console.error('❌ Debug failed:', error)
  }
}

main().catch(console.error)
