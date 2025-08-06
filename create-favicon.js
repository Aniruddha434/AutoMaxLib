#!/usr/bin/env node

/**
 * Simple script to create a basic favicon.ico file
 * This creates a minimal 16x16 ICO file for the favicon
 */

import fs from 'fs'
import path from 'path'

// Simple ICO file header and data for a 16x16 favicon
// This creates a basic blue square with white "A" letter
const icoData = Buffer.from([
  // ICO Header
  0x00, 0x00, // Reserved
  0x01, 0x00, // Type (1 = ICO)
  0x01, 0x00, // Number of images
  
  // Image Directory Entry
  0x10, // Width (16)
  0x10, // Height (16)
  0x00, // Color count (0 = no palette)
  0x00, // Reserved
  0x01, 0x00, // Color planes
  0x20, 0x00, // Bits per pixel (32)
  0x00, 0x04, 0x00, 0x00, // Image size (1024 bytes)
  0x16, 0x00, 0x00, 0x00, // Image offset
  
  // BMP Header (40 bytes)
  0x28, 0x00, 0x00, 0x00, // Header size
  0x10, 0x00, 0x00, 0x00, // Width
  0x20, 0x00, 0x00, 0x00, // Height (doubled for ICO)
  0x01, 0x00, // Planes
  0x20, 0x00, // Bits per pixel
  0x00, 0x00, 0x00, 0x00, // Compression
  0x00, 0x04, 0x00, 0x00, // Image size
  0x00, 0x00, 0x00, 0x00, // X pixels per meter
  0x00, 0x00, 0x00, 0x00, // Y pixels per meter
  0x00, 0x00, 0x00, 0x00, // Colors used
  0x00, 0x00, 0x00, 0x00, // Important colors
])

// Create a simple 16x16 pixel data (BGRA format)
const pixelData = Buffer.alloc(16 * 16 * 4) // 16x16 pixels, 4 bytes each (BGRA)

// Fill with blue background and create a simple "A" pattern
for (let y = 0; y < 16; y++) {
  for (let x = 0; x < 16; x++) {
    const offset = (y * 16 + x) * 4
    
    // Simple "A" pattern (very basic)
    const isA = (
      (y >= 4 && y <= 12) && (
        (x === 6 || x === 9) || // Vertical lines
        (y === 7 && x >= 6 && x <= 9) || // Horizontal line
        (y === 4 && x >= 7 && x <= 8) // Top
      )
    )
    
    if (isA) {
      // White pixel for "A"
      pixelData[offset] = 0xFF     // Blue
      pixelData[offset + 1] = 0xFF // Green
      pixelData[offset + 2] = 0xFF // Red
      pixelData[offset + 3] = 0xFF // Alpha
    } else {
      // Blue background
      pixelData[offset] = 0xF1     // Blue
      pixelData[offset + 1] = 0x66 // Green
      pixelData[offset + 2] = 0x63 // Red
      pixelData[offset + 3] = 0xFF // Alpha
    }
  }
}

// Create AND mask (all transparent)
const andMask = Buffer.alloc(16 * 16 / 8) // 1 bit per pixel

// Combine header and data
const fullIcoData = Buffer.concat([icoData, pixelData, andMask])

// Write to file
const faviconPath = path.join('frontend', 'public', 'favicon.ico')

try {
  fs.writeFileSync(faviconPath, fullIcoData)
  console.log('✅ Created favicon.ico successfully!')
  console.log(`📁 Location: ${faviconPath}`)
  console.log(`📊 Size: ${fullIcoData.length} bytes`)
} catch (error) {
  console.error('❌ Error creating favicon.ico:', error.message)
  
  // Fallback: copy the SVG as a backup
  console.log('🔄 Creating fallback solution...')
  
  // Create a simple HTML file that can serve as favicon
  const fallbackContent = `<!-- Favicon fallback - this file helps resolve 404 errors -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
  <rect width="16" height="16" fill="#6366f1"/>
  <text x="8" y="12" text-anchor="middle" fill="white" font-size="10" font-family="Arial">A</text>
</svg>`
  
  try {
    fs.writeFileSync(faviconPath.replace('.ico', '.svg'), fallbackContent)
    console.log('✅ Created fallback favicon.svg')
  } catch (fallbackError) {
    console.error('❌ Could not create fallback:', fallbackError.message)
  }
}

console.log('\n📋 Next steps:')
console.log('1. Deploy the frontend changes')
console.log('2. Test favicon loading at https://www.automaxlib.online/favicon.ico')
console.log('3. Verify no more 404 errors in browser console')
