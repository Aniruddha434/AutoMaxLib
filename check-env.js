// Test script to check if environment variable is loaded
const https = require('https');

const checkEnv = () => {
  const options = {
    hostname: 'automaxlib.onrender.com',
    port: 443,
    path: '/api/webhook/health',
    method: 'GET'
  };

  const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      console.log('Health Check Response:', responseData);
      
      // Now test webhook endpoint to see if it gives us more info
      testWebhookSecret();
    });
  });

  req.on('error', (error) => {
    console.error('Error:', error);
  });

  req.end();
};

const testWebhookSecret = () => {
  const data = JSON.stringify({
    type: 'user.created',
    data: { id: 'test' }
  });

  const options = {
    hostname: 'automaxlib.onrender.com',
    port: 443,
    path: '/api/webhook/clerk',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = https.request(options, (res) => {
    console.log(`\nWebhook Test Status: ${res.statusCode}`);
    
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      console.log('Webhook Response:', responseData);
    });
  });

  req.on('error', (error) => {
    console.error('Webhook Error:', error);
  });

  req.write(data);
  req.end();
};

checkEnv();
