import mongoose from 'mongoose'
import User from '../models/User.js'
import dotenv from 'dotenv'

dotenv.config()

async function addTrialDatesToExistingUsers() {
  try {
    console.log('🚀 Starting migration...')
    console.log('📍 MongoDB URI:', process.env.MONGODB_URI ? 'Found' : 'Not found')

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Find all users without trial dates
    const usersWithoutTrialDates = await User.find({
      $or: [
        { trialStartDate: { $exists: false } },
        { trialEndDate: { $exists: false } }
      ]
    })

    console.log(`📊 Found ${usersWithoutTrialDates.length} users without trial dates`)

    let updatedCount = 0

    for (const user of usersWithoutTrialDates) {
      try {
        // Use the user's creation date as trial start date
        const trialStartDate = user.createdAt || new Date()
        const trialEndDate = new Date(trialStartDate.getTime() + 15 * 24 * 60 * 60 * 1000) // 15 days from start

        await User.updateOne(
          { _id: user._id },
          {
            $set: {
              trialStartDate,
              trialEndDate
            }
          }
        )

        updatedCount++
        console.log(`✅ Updated trial dates for user ${user.email} (${user.clerkId})`)
        console.log(`   Trial Start: ${trialStartDate.toISOString()}`)
        console.log(`   Trial End: ${trialEndDate.toISOString()}`)
      } catch (error) {
        console.error(`❌ Error updating user ${user.email}:`, error)
      }
    }

    console.log(`🎉 Migration completed! Updated ${updatedCount} users`)

    // Verify the migration
    const usersWithTrialDates = await User.countDocuments({
      trialStartDate: { $exists: true },
      trialEndDate: { $exists: true }
    })

    console.log(`📊 Total users with trial dates: ${usersWithTrialDates}`)

  } catch (error) {
    console.error('❌ Migration failed:', error)
  } finally {
    await mongoose.disconnect()
    console.log('✅ Disconnected from MongoDB')
  }
}

// Run the migration
if (import.meta.url === `file://${process.argv[1]}`) {
  addTrialDatesToExistingUsers()
}

export default addTrialDatesToExistingUsers
