#!/usr/bin/env node

/**
 * Test script to verify webhook endpoints are working correctly
 * This helps debug the Clerk webhook 404 issue
 */

const https = require('https');
const http = require('http');

// Configuration
const config = {
  // Change this to your actual domain
  hostname: 'automaxlib.onrender.com', // or 'localhost' for local testing
  port: 443, // Use 80 for HTTP, 443 for HTTPS
  useHttps: true // Set to false for local HTTP testing
};

const makeRequest = (options, data = null) => {
  return new Promise((resolve, reject) => {
    const client = config.useHttps ? https : http;
    
    const req = client.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          headers: res.headers,
          data: responseData
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (data) {
      req.write(data);
    }
    
    req.end();
  });
};

const testEndpoint = async (path, method = 'GET', headers = {}, body = null) => {
  console.log(`\n🔍 Testing ${method} ${path}`);
  
  const options = {
    hostname: config.hostname,
    port: config.port,
    path: path,
    method: method,
    headers: {
      'User-Agent': 'Go-http-client/2.0', // Simulate Clerk's user agent
      ...headers
    },
    timeout: 10000
  };

  try {
    const response = await makeRequest(options, body);
    
    console.log(`✅ Status: ${response.statusCode} ${response.statusMessage}`);
    
    if (response.statusCode === 200) {
      console.log(`📄 Response: ${response.data.substring(0, 200)}...`);
    } else {
      console.log(`❌ Error Response: ${response.data}`);
    }
    
    return response;
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`);
    return null;
  }
};

const runTests = async () => {
  console.log('🚀 Testing AutoGitPilot Webhook Endpoints');
  console.log(`🌐 Target: ${config.useHttps ? 'https' : 'http'}://${config.hostname}:${config.port}`);
  
  // Test 1: Root endpoint (where Clerk is currently hitting)
  await testEndpoint('/');
  
  // Test 2: Webhook health check
  await testEndpoint('/api/webhook/health');
  
  // Test 3: Clerk webhook GET (verification)
  await testEndpoint('/api/webhook/clerk');
  
  // Test 4: Clerk webhook POST (actual webhook)
  const clerkTestData = JSON.stringify({
    type: 'user.created',
    data: {
      id: 'user_test123',
      email_addresses: [{ email_address: 'test@example.com' }],
      first_name: 'Test',
      last_name: 'User'
    }
  });
  
  await testEndpoint('/api/webhook/clerk', 'POST', {
    'Content-Type': 'application/json',
    'svix-id': 'msg_test123',
    'svix-timestamp': Math.floor(Date.now() / 1000).toString(),
    'svix-signature': 'v1,test_signature'
  }, clerkTestData);
  
  // Test 5: Non-existent route (should return 404)
  await testEndpoint('/nonexistent');
  
  console.log('\n📋 Summary:');
  console.log('1. If root endpoint (/) returns 200, the issue might be in Clerk configuration');
  console.log('2. If /api/webhook/clerk GET returns 200, webhook verification should work');
  console.log('3. If /api/webhook/clerk POST returns 400 with "Invalid webhook signature", that\'s expected');
  console.log('4. Check your Clerk dashboard webhook URL configuration');
  console.log('\n🔧 Next Steps:');
  console.log('- Verify Clerk webhook URL is set to: https://your-domain.com/api/webhook/clerk');
  console.log('- Check Clerk webhook secret is properly configured');
  console.log('- Monitor backend logs for more detailed error information');
};

// Run the tests
runTests().catch(console.error);
