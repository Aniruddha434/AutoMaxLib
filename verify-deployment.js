#!/usr/bin/env node

/**
 * Deployment verification script for AutoGitPilot
 * Checks if frontend and backend are properly deployed and accessible
 */

const https = require('https');
const http = require('http');

const domains = [
  {
    name: 'Production Frontend',
    url: 'https://www.automaxlib.online',
    paths: ['/', '/sign-up', '/sign-in', '/dashboard'],
    expectedStatus: [200, 302] // 302 for redirects is OK
  },
  {
    name: 'Alternative Frontend',
    url: 'https://automaxlib.online',
    paths: ['/', '/sign-up', '/sign-in'],
    expectedStatus: [200, 302]
  },
  {
    name: 'Backend API',
    url: 'https://automaxlib.onrender.com',
    paths: ['/', '/health', '/api/webhook/health'],
    expectedStatus: [200]
  }
];

const makeRequest = (url) => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.request(url, {
      method: 'GET',
      timeout: 10000,
      headers: {
        'User-Agent': 'AutoGitPilot-Deployment-Checker/1.0'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          headers: res.headers,
          data: data.substring(0, 500) // First 500 chars
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

    req.end();
  });
};

const checkEndpoint = async (baseUrl, path, expectedStatus) => {
  const fullUrl = `${baseUrl}${path}`;
  console.log(`🔍 Checking: ${fullUrl}`);
  
  try {
    const response = await makeRequest(fullUrl);
    const isExpected = expectedStatus.includes(response.statusCode);
    
    if (isExpected) {
      console.log(`✅ ${response.statusCode} ${response.statusMessage}`);
      
      // Check if it's an HTML page (frontend) or JSON (backend)
      const contentType = response.headers['content-type'] || '';
      if (contentType.includes('text/html')) {
        const hasReact = response.data.includes('react') || response.data.includes('React');
        const hasClerk = response.data.includes('clerk') || response.data.includes('Clerk');
        console.log(`   📄 HTML page detected (React: ${hasReact}, Clerk: ${hasClerk})`);
      } else if (contentType.includes('application/json')) {
        console.log(`   📊 JSON response: ${response.data.substring(0, 100)}...`);
      }
    } else {
      console.log(`❌ ${response.statusCode} ${response.statusMessage} (Expected: ${expectedStatus.join(' or ')})`);
      if (response.statusCode === 404) {
        console.log(`   🔍 404 Error - Check deployment and routing configuration`);
      }
    }
    
    return { success: isExpected, statusCode: response.statusCode, response };
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`);
    return { success: false, error: error.message };
  }
};

const runDeploymentCheck = async () => {
  console.log('🚀 AutoGitPilot Deployment Verification\n');
  
  const results = [];
  
  for (const domain of domains) {
    console.log(`\n📡 Testing ${domain.name}: ${domain.url}`);
    console.log('─'.repeat(50));
    
    const domainResults = [];
    
    for (const path of domain.paths) {
      const result = await checkEndpoint(domain.url, path, domain.expectedStatus);
      domainResults.push({ path, ...result });
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    results.push({
      domain: domain.name,
      url: domain.url,
      results: domainResults
    });
  }
  
  // Summary
  console.log('\n📋 DEPLOYMENT SUMMARY');
  console.log('═'.repeat(50));
  
  let allGood = true;
  
  for (const domain of results) {
    const successCount = domain.results.filter(r => r.success).length;
    const totalCount = domain.results.length;
    const status = successCount === totalCount ? '✅' : '❌';
    
    console.log(`${status} ${domain.domain}: ${successCount}/${totalCount} endpoints working`);
    
    if (successCount !== totalCount) {
      allGood = false;
      const failedPaths = domain.results.filter(r => !r.success).map(r => r.path);
      console.log(`   Failed paths: ${failedPaths.join(', ')}`);
    }
  }
  
  console.log('\n🔧 TROUBLESHOOTING GUIDE');
  console.log('═'.repeat(50));
  
  if (!allGood) {
    console.log('❌ Issues detected. Here\'s what to check:');
    console.log('');
    console.log('1. Frontend 404 errors:');
    console.log('   - Check if Vercel deployment is successful');
    console.log('   - Verify domain DNS configuration');
    console.log('   - Ensure vercel.json has correct routing rules');
    console.log('   - Check environment variables in Vercel dashboard');
    console.log('');
    console.log('2. Backend errors:');
    console.log('   - Check Render deployment logs');
    console.log('   - Verify environment variables');
    console.log('   - Check database connection');
    console.log('');
    console.log('3. Domain issues:');
    console.log('   - Verify DNS records point to correct servers');
    console.log('   - Check SSL certificate status');
    console.log('   - Ensure both www and non-www versions work');
  } else {
    console.log('✅ All endpoints are working correctly!');
  }
  
  console.log('\n🔗 Quick Links:');
  console.log('- Vercel Dashboard: https://vercel.com/dashboard');
  console.log('- Render Dashboard: https://dashboard.render.com/');
  console.log('- Clerk Dashboard: https://dashboard.clerk.com/');
  console.log('- Domain DNS: Check your domain registrar');
};

// Run the verification
runDeploymentCheck().catch(console.error);
