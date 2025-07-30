#!/usr/bin/env node

/**
 * Comprehensive Clerk Webhook Diagnostic Script
 * This script systematically checks all aspects of webhook configuration
 */

import https from 'https'

const EXPECTED_SECRET = 'whsec_ZBysbrLyJU3zrW7ud+20O3fccgyc54Ie'
const WEBHOOK_URL = 'https://automaxlib.onrender.com/api/webhook/clerk'

console.log('🔍 COMPREHENSIVE CLERK WEBHOOK DIAGNOSTIC')
console.log('==========================================\n')

// Test 1: Verify webhook endpoint accessibility
async function test1_EndpointAccessibility() {
  console.log('📋 TEST 1: Webhook Endpoint Accessibility')
  console.log('------------------------------------------')
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'automaxlib.onrender.com',
      port: 443,
      path: '/api/webhook/clerk',
      method: 'GET',
      headers: {
        'User-Agent': 'Diagnostic-Script/1.0'
      }
    }

    const req = https.request(options, (res) => {
      let responseData = ''
      
      res.on('data', (chunk) => {
        responseData += chunk
      })
      
      res.on('end', () => {
        console.log(`✅ Status: ${res.statusCode}`)
        console.log(`📄 Response: ${responseData}`)
        
        if (res.statusCode === 200) {
          console.log('✅ PASS: Webhook endpoint is accessible\n')
        } else {
          console.log('❌ FAIL: Webhook endpoint not accessible\n')
        }
        
        resolve({ status: res.statusCode, data: responseData })
      })
    })

    req.on('error', (error) => {
      console.error('❌ FAIL: Error accessing webhook endpoint:', error.message)
      resolve({ error: error.message })
    })

    req.end()
  })
}

// Test 2: Check if webhook secret is loaded in running application
async function test2_WebhookSecretLoaded() {
  console.log('📋 TEST 2: Webhook Secret Loading Check')
  console.log('---------------------------------------')
  
  const testPayload = JSON.stringify({
    type: 'user.created',
    data: { id: 'diagnostic_test' }
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
        'User-Agent': 'Diagnostic-Script/1.0',
        'svix-id': 'msg_diagnostic_' + Date.now(),
        'svix-timestamp': Math.floor(Date.now() / 1000).toString(),
        'svix-signature': 'v1,diagnostic_test_signature'
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
          console.log('✅ PASS: Webhook secret is loaded and signature validation is working')
          console.log('📝 Check Render logs for secret length details')
        } else if (res.statusCode === 500) {
          console.log('❌ FAIL: Webhook secret not loaded or server error')
        } else if (res.statusCode === 400 && responseData.includes('Missing svix headers')) {
          console.log('⚠️  WARNING: Headers processed but different error')
        }
        
        console.log('')
        resolve({ status: res.statusCode, data: responseData })
      })
    })

    req.on('error', (error) => {
      console.error('❌ FAIL: Error testing webhook secret:', error.message)
      resolve({ error: error.message })
    })

    req.write(testPayload)
    req.end()
  })
}

// Test 3: Test with missing headers (should fail gracefully)
async function test3_MissingHeaders() {
  console.log('📋 TEST 3: Missing Headers Handling')
  console.log('-----------------------------------')
  
  const testPayload = JSON.stringify({ test: 'data' })

  return new Promise((resolve) => {
    const options = {
      hostname: 'automaxlib.onrender.com',
      port: 443,
      path: '/api/webhook/clerk',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(testPayload),
        'User-Agent': 'Diagnostic-Script/1.0'
        // Intentionally omitting svix headers
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
          console.log('✅ PASS: Missing headers handled correctly')
        } else {
          console.log('⚠️  WARNING: Unexpected response for missing headers')
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

// Test 4: Check health endpoint
async function test4_HealthCheck() {
  console.log('📋 TEST 4: Health Endpoint Check')
  console.log('---------------------------------')
  
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
        console.log(`📊 Status: ${res.statusCode}`)
        console.log(`📄 Response: ${responseData}`)
        
        if (res.statusCode === 200) {
          const data = JSON.parse(responseData)
          console.log(`✅ PASS: Service healthy (timestamp: ${data.timestamp})`)
        } else {
          console.log('❌ FAIL: Health check failed')
        }
        
        console.log('')
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

// Analysis and recommendations
function analyzeResults() {
  console.log('📋 ANALYSIS & RECOMMENDATIONS')
  console.log('==============================\n')
  
  console.log('🔍 Configuration Verification:')
  console.log(`Expected webhook secret: ${EXPECTED_SECRET}`)
  console.log(`Expected webhook URL: ${WEBHOOK_URL}`)
  console.log(`Secret length: ${EXPECTED_SECRET.length} characters`)
  console.log(`Secret format: ${EXPECTED_SECRET.startsWith('whsec_') ? 'Valid' : 'Invalid'}`)
  console.log('')
  
  console.log('📝 Next Steps Based on Test Results:')
  console.log('')
  console.log('IF Test 1 FAILED (endpoint not accessible):')
  console.log('  → Check if Render service is running')
  console.log('  → Verify webhook URL in Clerk Dashboard')
  console.log('  → Check for any deployment issues')
  console.log('')
  console.log('IF Test 2 shows server error (500):')
  console.log('  → Webhook secret not loaded in environment')
  console.log('  → Check Render environment variables')
  console.log('  → Force restart Render service')
  console.log('')
  console.log('IF Test 2 shows signature validation working but Clerk still fails:')
  console.log('  → Secret mismatch between Clerk and Render')
  console.log('  → Copy exact secret from Clerk Dashboard')
  console.log('  → Update Render environment variable')
  console.log('  → Restart service')
  console.log('')
  console.log('🔧 Immediate Actions to Try:')
  console.log('1. Check Render logs for "Webhook secret length: X" message')
  console.log('2. If length ≠ 38, restart Render service again')
  console.log('3. If length = 38, regenerate webhook secret in Clerk')
  console.log('4. Copy new secret to Render environment variables')
  console.log('5. Restart Render service')
  console.log('6. Test webhook from Clerk Dashboard')
}

// Main diagnostic function
async function runComprehensiveDiagnostic() {
  console.log('🚀 Starting comprehensive webhook diagnostic...\n')
  
  try {
    await test1_EndpointAccessibility()
    await test2_WebhookSecretLoaded()
    await test3_MissingHeaders()
    await test4_HealthCheck()
    
    analyzeResults()
    
  } catch (error) {
    console.error('❌ Diagnostic failed:', error)
  }
}

// Run the diagnostic
runComprehensiveDiagnostic().catch(console.error)
