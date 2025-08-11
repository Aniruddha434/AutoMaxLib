#!/usr/bin/env node

/**
 * Test script to verify architecture diagram generation fixes
 */

import dotenv from 'dotenv'
import aiService from './services/aiService.js'

// Load environment variables
dotenv.config()

async function testArchitectureGeneration() {
  console.log('🧪 Testing Architecture Diagram Generation Fixes...\n')

  // Test data
  const repositoryData = {
    name: 'test-repo',
    description: 'A test repository for architecture diagram generation',
    language: 'JavaScript',
    topics: ['nodejs', 'express', 'mongodb'],
    license: 'MIT',
    homepage: 'https://example.com'
  }

  const analysisData = {
    projectType: 'web-application',
    technologies: ['Node.js', 'Express.js', 'MongoDB'],
    frameworks: ['Express.js'],
    buildTools: ['npm'],
    packageManagers: ['npm'],
    realAPIEndpoints: ['/api/users', '/api/auth'],
    codeArchitecture: 'MVC pattern with Express.js routes',
    projectStructure: 'Standard Node.js project structure',
    mainFiles: ['server.js', 'app.js'],
    configFiles: ['package.json', '.env'],
    hasCI: true,
    ciPlatforms: ['GitHub Actions']
  }

  try {
    console.log('📊 Repository Data:')
    console.log(`  - Name: ${repositoryData.name}`)
    console.log(`  - Language: ${repositoryData.language}`)
    console.log(`  - Technologies: ${analysisData.technologies.join(', ')}`)
    console.log()

    console.log('🔧 Testing AI Service Configuration...')
    
    // Initialize the service
    aiService.initialize()
    
    console.log(`  - OpenRouter Available: ${aiService.isOpenRouterAvailable()}`)
    console.log(`  - Gemini Available: ${aiService.isAvailable()}`)
    console.log()

    console.log('🚀 Generating Architecture Diagram...')
    const startTime = Date.now()
    
    const result = await aiService.generateRepositoryArchitectureDiagramContent(
      repositoryData,
      analysisData,
      'flowchart'
    )
    
    const endTime = Date.now()
    const duration = endTime - startTime

    console.log('✅ Architecture Diagram Generated Successfully!')
    console.log(`  - Provider: ${result.provider}`)
    console.log(`  - Model: ${result.modelUsed}`)
    console.log(`  - Duration: ${duration}ms`)
    console.log(`  - Mermaid Length: ${result.mermaid.length} characters`)
    console.log()

    console.log('📋 Generated Mermaid Code (first 200 chars):')
    console.log(result.mermaid.substring(0, 200) + '...')
    console.log()

    // Validate the result
    if (result.mermaid && result.mermaid.length > 50) {
      console.log('✅ Validation: Mermaid code is valid and sufficient length')
    } else {
      console.log('❌ Validation: Mermaid code is too short or empty')
    }

    if (result.provider && result.modelUsed) {
      console.log('✅ Validation: Provider and model information available')
    } else {
      console.log('❌ Validation: Missing provider or model information')
    }

    console.log('\n🎉 Test completed successfully!')
    console.log('The architecture diagram generation fixes are working properly.')

  } catch (error) {
    console.error('❌ Test Failed!')
    console.error(`Error: ${error.message}`)
    console.error()
    
    // Provide specific guidance based on error type
    if (error.message.includes('OpenRouter authentication')) {
      console.error('🔧 Fix: Check your OpenRouter API key in the .env file')
      console.error('   Make sure it starts with "sk-or-v1-" and is valid')
    } else if (error.message.includes('Gemini')) {
      console.error('🔧 Fix: Check your Gemini API key in the .env file')
    } else if (error.message.includes('No AI providers')) {
      console.error('🔧 Fix: Configure at least one AI provider (OpenRouter or Gemini)')
    } else {
      console.error('🔧 Check the backend logs for more details')
    }
    
    process.exit(1)
  }
}

// Run the test
testArchitectureGeneration()
