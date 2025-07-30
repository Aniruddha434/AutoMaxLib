#!/usr/bin/env node

/**
 * Image accessibility test script
 * Tests if images are properly accessible on the deployed site
 */

const https = require('https');
const http = require('http');

const config = {
  domains: [
    'https://www.automaxlib.online',
    'https://automaxlib.online'
  ],
  images: [
    '/patternEX.png',
    '/ReadmiEX.png',
    '/vite.svg'
  ]
};

const testImage = (url) => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.request(url, {
      method: 'HEAD', // Use HEAD to check if image exists without downloading
      timeout: 10000,
      headers: {
        'User-Agent': 'AutoGitPilot-Image-Checker/1.0'
      }
    }, (res) => {
      resolve({
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        contentType: res.headers['content-type'],
        contentLength: res.headers['content-length']
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

const runImageTests = async () => {
  console.log('🖼️  AutoGitPilot Image Accessibility Test\n');
  
  for (const domain of config.domains) {
    console.log(`📡 Testing domain: ${domain}`);
    console.log('─'.repeat(50));
    
    for (const imagePath of config.images) {
      const fullUrl = `${domain}${imagePath}`;
      console.log(`🔍 Checking: ${imagePath}`);
      
      try {
        const result = await testImage(fullUrl);
        
        if (result.statusCode === 200) {
          console.log(`✅ ${result.statusCode} ${result.statusMessage}`);
          console.log(`   Content-Type: ${result.contentType || 'unknown'}`);
          console.log(`   Size: ${result.contentLength ? `${result.contentLength} bytes` : 'unknown'}`);
        } else {
          console.log(`❌ ${result.statusCode} ${result.statusMessage}`);
          if (result.statusCode === 502) {
            console.log(`   🚨 502 Error - This is the image optimization issue!`);
          }
        }
      } catch (error) {
        console.log(`❌ Request failed: ${error.message}`);
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log(''); // Empty line between domains
  }
  
  console.log('🔧 TROUBLESHOOTING GUIDE');
  console.log('═'.repeat(50));
  console.log('If you see 502 errors:');
  console.log('1. ✅ Disable Vercel image optimization (already done)');
  console.log('2. 🔄 Redeploy your Vercel application');
  console.log('3. 🧹 Clear Vercel cache if needed');
  console.log('4. 📁 Verify images exist in public folder');
  console.log('');
  console.log('If you see 404 errors:');
  console.log('1. 📁 Check if images are in frontend/public/ folder');
  console.log('2. 🔄 Ensure images are included in build');
  console.log('3. 📝 Verify image paths in components');
  console.log('');
  console.log('Next steps:');
  console.log('- Commit the vercel.json changes');
  console.log('- Redeploy to Vercel');
  console.log('- Run this test again to verify fix');
};

// Run the tests
runImageTests().catch(console.error);
