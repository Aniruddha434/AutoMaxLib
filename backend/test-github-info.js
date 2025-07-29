import dotenv from 'dotenv'
import mongoose from 'mongoose'
import User from './models/User.js'
import githubService from './services/githubService.js'

// Load environment variables
dotenv.config()

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB Connected')
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error)
    process.exit(1)
  }
}

// Test GitHub user info fetching
async function testGitHubInfo() {
  console.log('🧪 Testing GitHub user info fetching...')
  
  try {
    await connectDB()
    
    // Find a user with GitHub token
    const user = await User.findOne({ githubToken: { $exists: true, $ne: null } })
    
    if (!user) {
      console.log('❌ No user found with GitHub token')
      return
    }
    
    console.log(`\n👤 Testing with user: ${user.firstName} ${user.lastName}`)
    console.log(`📧 Current email: ${user.email}`)
    console.log(`🐙 GitHub username: ${user.githubUsername}`)
    console.log(`📧 GitHub email: ${user.githubEmail || 'Not set'}`)
    console.log(`👤 GitHub name: ${user.githubName || 'Not set'}`)
    
    // Test fetching GitHub user info
    console.log('\n🔍 Fetching GitHub user info...')
    const githubInfo = await githubService.getGitHubUserInfo(user.githubToken)
    
    if (githubInfo.success) {
      console.log('✅ GitHub user info fetched successfully:')
      console.log(`  ID: ${githubInfo.user.id}`)
      console.log(`  Login: ${githubInfo.user.login}`)
      console.log(`  Name: ${githubInfo.user.name}`)
      console.log(`  Email: ${githubInfo.user.email}`)
      console.log(`  Avatar: ${githubInfo.user.avatar_url}`)
      
      // Update user if needed
      if (!user.githubEmail || !user.githubName) {
        console.log('\n🔄 Updating user with GitHub info...')
        user.githubEmail = githubInfo.user.email || user.email
        user.githubName = githubInfo.user.name || user.githubUsername || `${user.firstName} ${user.lastName}`.trim()
        await user.save()
        console.log('✅ User updated successfully')
        console.log(`📧 New GitHub email: ${user.githubEmail}`)
        console.log(`👤 New GitHub name: ${user.githubName}`)
      } else {
        console.log('✅ User already has GitHub info')
      }
      
    } else {
      console.log('❌ Failed to fetch GitHub user info:', githubInfo.error)
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB')
  }
}

testGitHubInfo()
