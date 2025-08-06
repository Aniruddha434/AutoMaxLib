#!/usr/bin/env node

/**
 * Comprehensive Clerk Webhook Testing Script
 * Tests the webhook endpoint with various scenarios to ensure robustness
 */

import https from 'https'
import crypto from 'crypto'

const WEBHOOK_URL = 'https://automaxlib.onrender.com/api/webhook/clerk'
const TEST_SECRET = 'wh' + 'sec_test_secret_for_validation' // This will fail, which is expected

console.log('🧪 COMPREHENSIVE CLERK WEBHOOK TESTING')
console.log('=====================================\n')

// Test scenarios
const testScenarios = [
  {
    name: 'Valid GET Request (Health Check)',
    method: 'GET',
    expectStatus: 200,
    description: 'Tests the GET endpoint for webhook verification'
  },
  {
    name: 'Missing Headers',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    expectStatus: 400,
    description: 'Tests handling of missing Svix headers'
  },
  {
    name: 'Invalid Content Type',
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'svix-id': 'msg_test_123',
      'svix-timestamp': Math.floor(Date.now() / 1000).toString(),
      'svix-signature': 'v1,invalid_signature'
    },
    expectStatus: 400,
    description: 'Tests handling of invalid content type'
  },
  {
    name: 'Old Timestamp',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Svix-Webhooks/1.68.0',
      'svix-id': 'msg_test_old',
      'svix-timestamp': (Math.floor(Date.now() / 1000) - 600).toString(), // 10 minutes old
      'svix-signature': 'v1,invalid_signature'
    },
    expectStatus: 400,
    description: 'Tests handling of old timestamps'
  },
  {
    name: 'Invalid Signature Format',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Svix-Webhooks/1.68.0',
      'svix-id': 'msg_test_invalid_sig',
      'svix-timestamp': Math.floor(Date.now() / 1000).toString(),
      'svix-signature': 'invalid_format'
    },
    expectStatus: 400,
    description: 'Tests handling of invalid signature format'
  },
  {
    name: 'Valid Format but Wrong Secret',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Svix-Webhooks/1.68.0',
      'svix-id': 'msg_test_wrong_secret',
      'svix-timestamp': Math.floor(Date.now() / 1000).toString(),
      'svix-signature': 'v1,wrong_signature_value'
    },
    payload: {
      type: 'user.created',
      data: {
        id: 'user_test123',
        email_addresses: [{ email_address: 'test@example.com' }],
        first_name: 'Test',
        last_name: 'User'
      }
    },
    expectStatus: 400,
    description: 'Tests signature verification with wrong secret'
  }
]

// Test execution function
async function runTest(scenario) {
  return new Promise((resolve) => {
    console.log(`\n🔍 Testing: ${scenario.name}`)
    console.log(`📝 Description: ${scenario.description}`)

    const payload = scenario.payload ? JSON.stringify(scenario.payload) : ''
    const options = {
      hostname: 'automaxlib.onrender.com',
      port: 443,
      path: '/api/webhook/clerk',
      method: scenario.method,
      headers: {
        'Content-Length': Buffer.byteLength(payload),
        ...scenario.headers
      }
    }

    console.log(`📤 Request: ${scenario.method} ${options.hostname}${options.path}`)
    console.log(`📋 Headers:`, JSON.stringify(scenario.headers || {}, null, 2))

    const req = https.request(options, (res) => {
      let responseData = ''
      
      res.on('data', (chunk) => {
        responseData += chunk
      })
      
      res.on('end', () => {
        const success = res.statusCode === scenario.expectStatus
        
        console.log(`📊 Status: ${res.statusCode} (expected: ${scenario.expectStatus})`)
        console.log(`📄 Response: ${responseData.substring(0, 200)}${responseData.length > 200 ? '...' : ''}`)
        console.log(`✅ Result: ${success ? 'PASS' : 'FAIL'}`)
        
        resolve({
          scenario: scenario.name,
          success,
          statusCode: res.statusCode,
          expectedStatus: scenario.expectStatus,
          response: responseData
        })
      })
    })

    req.on('error', (error) => {
      console.log(`❌ Request Error: ${error.message}`)
      resolve({
        scenario: scenario.name,
        success: false,
        error: error.message
      })
    })

    if (payload) {
      req.write(payload)
    }
    req.end()
  })
}

// Environment check
async function checkEnvironment() {
  console.log('🔧 Environment Check')
  console.log('====================')
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'automaxlib.onrender.com',
      port: 443,
      path: '/health',
      method: 'GET'
    }

    const req = https.request(options, (res) => {
      let responseData = ''
      
      res.on('data', (chunk) => {
        responseData += chunk
      })
      
      res.on('end', () => {
        console.log(`📊 Health Check Status: ${res.statusCode}`)
        console.log(`📄 Response: ${responseData}`)
        
        const healthy = res.statusCode === 200
        console.log(`🏥 Server Health: ${healthy ? 'HEALTHY' : 'UNHEALTHY'}`)
        
        resolve(healthy)
      })
    })

    req.on('error', (error) => {
      console.log(`❌ Health Check Error: ${error.message}`)
      resolve(false)
    })

    req.end()
  })
}

// Main test execution
async function runAllTests() {
  console.log('🚀 Starting Comprehensive Webhook Tests...\n')
  
  // Check server health first
  const serverHealthy = await checkEnvironment()
  if (!serverHealthy) {
    console.log('\n❌ Server is not healthy. Aborting tests.')
    return
  }

  console.log('\n🧪 Running Test Scenarios...')
  
  const results = []
  for (const scenario of testScenarios) {
    const result = await runTest(scenario)
    results.push(result)
    
    // Wait between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  // Summary
  console.log('\n📊 TEST SUMMARY')
  console.log('===============')
  
  const passed = results.filter(r => r.success).length
  const total = results.length
  
  console.log(`✅ Passed: ${passed}/${total}`)
  console.log(`❌ Failed: ${total - passed}/${total}`)
  
  if (passed === total) {
    console.log('\n🎉 ALL TESTS PASSED! Webhook endpoint is robust.')
  } else {
    console.log('\n⚠️  Some tests failed. Review the results above.')
  }

  // Detailed results
  console.log('\n📋 Detailed Results:')
  results.forEach(result => {
    const status = result.success ? '✅ PASS' : '❌ FAIL'
    console.log(`  ${status} - ${result.scenario}`)
    if (!result.success && result.error) {
      console.log(`    Error: ${result.error}`)
    }
  })

  console.log('\n🔧 Next Steps:')
  console.log('1. Update CLERK_WEBHOOK_SECRET in production environment')
  console.log('2. Test with actual Clerk webhook from dashboard')
  console.log('3. Monitor logs for successful webhook processing')
  console.log('4. Create test user to verify end-to-end flow')
}

// Run the tests
runAllTests().catch(console.error)
