import mongoose from 'mongoose'
import User from './models/User.js'
import dotenv from 'dotenv'

dotenv.config()

async function validateTrialPeriod() {
  try {
    console.log('🚀 Starting trial period validation...')
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Test 1: Create a new user and check trial dates
    console.log('\n📝 Test 1: Creating new user with trial dates')
    const testUser = new User({
      clerkId: 'test-trial-user',
      email: 'test-trial@example.com',
      firstName: 'Test',
      lastName: 'Trial',
      plan: 'free'
    })

    await testUser.save()
    console.log('✅ User created successfully')
    console.log(`   Trial Start: ${testUser.trialStartDate}`)
    console.log(`   Trial End: ${testUser.trialEndDate}`)
    console.log(`   Is Trial Active: ${testUser.isTrialActive()}`)
    console.log(`   Days Remaining: ${testUser.getTrialDaysRemaining()}`)
    console.log(`   Can Use Auto Commit: ${testUser.canUseAutoCommit()}`)

    // Test 2: Test expired trial user
    console.log('\n📝 Test 2: Testing expired trial user')
    const expiredUser = new User({
      clerkId: 'test-expired-user',
      email: 'test-expired@example.com',
      firstName: 'Test',
      lastName: 'Expired',
      plan: 'free',
      trialStartDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
      trialEndDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    })

    await expiredUser.save()
    console.log('✅ Expired user created successfully')
    console.log(`   Trial Start: ${expiredUser.trialStartDate}`)
    console.log(`   Trial End: ${expiredUser.trialEndDate}`)
    console.log(`   Is Trial Active: ${expiredUser.isTrialActive()}`)
    console.log(`   Days Remaining: ${expiredUser.getTrialDaysRemaining()}`)
    console.log(`   Can Use Auto Commit: ${expiredUser.canUseAutoCommit()}`)

    // Test 3: Test premium user
    console.log('\n📝 Test 3: Testing premium user')
    const premiumUser = new User({
      clerkId: 'test-premium-user',
      email: 'test-premium@example.com',
      firstName: 'Test',
      lastName: 'Premium',
      plan: 'premium',
      subscriptionStatus: 'active',
      trialStartDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
      trialEndDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago (expired trial)
    })

    await premiumUser.save()
    console.log('✅ Premium user created successfully')
    console.log(`   Plan: ${premiumUser.plan}`)
    console.log(`   Is Premium: ${premiumUser.isPremium()}`)
    console.log(`   Is Trial Active: ${premiumUser.isTrialActive()}`)
    console.log(`   Days Remaining: ${premiumUser.getTrialDaysRemaining()}`)
    console.log(`   Can Use Auto Commit: ${premiumUser.canUseAutoCommit()}`)

    // Test 4: Simulate scheduler filtering
    console.log('\n📝 Test 4: Simulating scheduler filtering')
    const freeUsers = await User.find({
      plan: 'free',
      clerkId: { $in: ['test-trial-user', 'test-expired-user'] }
    })

    console.log(`   Found ${freeUsers.length} free users`)
    
    let eligibleUsers = 0
    let expiredUsers = 0

    for (const user of freeUsers) {
      if (user.canUseAutoCommit()) {
        eligibleUsers++
        console.log(`   ✅ ${user.email} - Eligible (${user.getTrialDaysRemaining()} days remaining)`)
      } else {
        expiredUsers++
        console.log(`   ❌ ${user.email} - Trial expired`)
      }
    }

    console.log(`   Summary: ${eligibleUsers} eligible, ${expiredUsers} expired`)

    // Test 5: Check existing users
    console.log('\n📝 Test 5: Checking existing users in database')
    const allUsers = await User.find({}).limit(5)
    console.log(`   Found ${allUsers.length} users in database`)
    
    for (const user of allUsers) {
      if (user.clerkId.startsWith('test-')) continue // Skip our test users
      
      console.log(`   User: ${user.email}`)
      console.log(`     Plan: ${user.plan}`)
      console.log(`     Trial Start: ${user.trialStartDate || 'Not set'}`)
      console.log(`     Trial End: ${user.trialEndDate || 'Not set'}`)
      console.log(`     Can Use Auto Commit: ${user.canUseAutoCommit()}`)
      
      if (user.plan === 'free') {
        console.log(`     Days Remaining: ${user.getTrialDaysRemaining()}`)
      }
    }

    // Clean up test users
    console.log('\n🧹 Cleaning up test users...')
    await User.deleteMany({
      clerkId: { $in: ['test-trial-user', 'test-expired-user', 'test-premium-user'] }
    })
    console.log('✅ Test users cleaned up')

    console.log('\n🎉 Trial period validation completed successfully!')

  } catch (error) {
    console.error('❌ Validation failed:', error)
  } finally {
    await mongoose.disconnect()
    console.log('✅ Disconnected from MongoDB')
  }
}

// Run the validation
validateTrialPeriod()
