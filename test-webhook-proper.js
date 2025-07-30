// Test webhook with proper Svix headers (like Clerk sends)
const https = require('https');

const testWebhookWithHeaders = () => {
  const data = JSON.stringify({
    type: 'user.created',
    data: {
      id: 'user_test123',
      email_addresses: [{ email_address: 'test@example.com' }],
      first_name: 'Test',
      last_name: 'User'
    }
  });

  const options = {
    hostname: 'automaxlib.onrender.com',
    port: 443,
    path: '/api/webhook/clerk',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'svix-id': 'msg_test123456789',
      'svix-timestamp': '1753842741',
      'svix-signature': 'v1,test_signature_here'
    },
    timeout: 10000
  };

  console.log('Testing webhook with proper headers...');
  
  const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Status Message: ${res.statusMessage}`);
    
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      console.log('Response:', responseData);
      
      if (res.statusCode === 400 && responseData.includes('Invalid webhook signature')) {
        console.log('\n✅ Good! Backend is processing webhooks but signature verification failed (expected with test signature)');
        console.log('This means your webhook endpoint is working and environment variables are loaded.');
      } else if (res.statusCode === 400 && responseData.includes('Missing')) {
        console.log('\n❌ Backend is missing webhook secret or headers');
      } else {
        console.log('\n🔍 Unexpected response - check backend logs');
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request Error:', error.message);
    if (error.code === 'ECONNRESET') {
      console.log('Connection reset - backend might be restarting or having issues');
    }
  });

  req.on('timeout', () => {
    console.log('❌ Request timed out');
    req.destroy();
  });

  req.write(data);
  req.end();
};

// Test health first, then webhook
const testHealth = () => {
  const options = {
    hostname: 'automaxlib.onrender.com',
    port: 443,
    path: '/api/webhook/health',
    method: 'GET',
    timeout: 5000
  };

  console.log('Testing health endpoint...');
  
  const req = https.request(options, (res) => {
    console.log(`Health Status: ${res.statusCode}`);
    
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      console.log('Health Response:', responseData);
      console.log('\n---\n');
      
      // Now test webhook
      testWebhookWithHeaders();
    });
  });

  req.on('error', (error) => {
    console.error('Health Check Error:', error.message);
  });

  req.on('timeout', () => {
    console.log('Health check timed out');
    req.destroy();
  });

  req.end();
};

testHealth();
