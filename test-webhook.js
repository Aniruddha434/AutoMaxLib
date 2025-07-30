// Test script to simulate Clerk webhook
const https = require('https');

const testWebhook = () => {
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
      'svix-id': 'msg_test123',
      'svix-timestamp': Math.floor(Date.now() / 1000).toString(),
      'svix-signature': 'v1,test_signature'
    }
  };

  const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      console.log('Response:', responseData);
    });
  });

  req.on('error', (error) => {
    console.error('Error:', error);
  });

  req.write(data);
  req.end();
};

testWebhook();
