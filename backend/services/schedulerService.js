import cron from 'node-cron'
import User from '../models/User.js'
import Commit from '../models/Commit.js'
import githubService from './githubService.js'
import emailService from './emailService.js'

class SchedulerService {
  constructor() {
    this.jobs = new Map()
    this.isInitialized = false
  }

  // Initialize scheduler
  initializeScheduler() {
    if (this.isInitialized) {
      console.log('⚠️ Scheduler already initialized')
      return
    }

    console.log('🕐 Initializing commit scheduler...')

    // Schedule for free users (10 AM IST daily)
    this.scheduleFreeUserCommits()

    // Schedule for premium users (custom times)
    this.schedulePremiumUserCommits()

    // Schedule retry jobs (every hour)
    this.scheduleRetryJobs()

    // Schedule cleanup jobs (daily at midnight)
    this.scheduleCleanupJobs()

    this.isInitialized = true
    console.log('✅ Commit scheduler initialized')
  }

  // Schedule commits for free users
  scheduleFreeUserCommits() {
    // Run at 10:00 AM IST every day
    const job = cron.schedule('0 10 * * *', async () => {
      console.log('🔄 Running free user commits...')
      await this.processFreeUserCommits()
    }, {
      scheduled: true,
      timezone: 'Asia/Kolkata'
    })

    this.jobs.set('free_users', job)
    console.log('📅 Scheduled free user commits for 10:00 AM IST')
  }

  // Schedule commits for premium users
  schedulePremiumUserCommits() {
    // Run every hour to check for premium user schedules
    const job = cron.schedule('0 * * * *', async () => {
      console.log('🔄 Checking premium user schedules...')
      await this.processPremiumUserCommits()
    }, {
      scheduled: true,
      timezone: 'Asia/Kolkata'
    })

    this.jobs.set('premium_users', job)
    console.log('📅 Scheduled premium user commit checks (hourly)')
  }

  // Schedule retry jobs
  scheduleRetryJobs() {
    const job = cron.schedule('0 * * * *', async () => {
      console.log('🔄 Processing failed commit retries...')
      await this.processRetryJobs()
    }, {
      scheduled: true
    })

    this.jobs.set('retry_jobs', job)
    console.log('📅 Scheduled retry jobs (hourly)')
  }

  // Schedule cleanup jobs
  scheduleCleanupJobs() {
    const job = cron.schedule('0 0 * * *', async () => {
      console.log('🧹 Running cleanup jobs...')
      await this.cleanupOldCommits()
    }, {
      scheduled: true
    })

    this.jobs.set('cleanup', job)
    console.log('📅 Scheduled cleanup jobs (daily at midnight)')
  }

  // Process commits for free users
  async processFreeUserCommits() {
    try {
      console.log('🔍 Starting free user commit processing...')

      const freeUsers = await User.find({
        plan: 'free',
        isActive: true,
        githubToken: { $exists: true, $ne: null },
        'repositories.isActive': true,
        'commitSettings.enableAutoCommits': true
      })

      console.log(`📊 Found ${freeUsers.length} free users for commits`)

      let eligibleUsers = 0
      let trialExpiredUsers = 0
      let alreadyCommittedUsers = 0
      let errorUsers = 0

      for (const user of freeUsers) {
        try {
          console.log(`🔍 Processing user ${user.clerkId} (${user.firstName} ${user.lastName})`)

          // Check if user's trial period is still active
          if (!user.canUseAutoCommit()) {
            trialExpiredUsers++
            const daysRemaining = user.getTrialDaysRemaining()
            console.log(`⏰ Trial expired for user ${user.clerkId}, ${daysRemaining} days remaining`)
            continue
          }

          // Check if user already committed today
          const today = new Date()
          today.setHours(0, 0, 0, 0)

          const existingCommit = await Commit.findOne({
            clerkId: user.clerkId,
            createdAt: { $gte: today },
            status: 'success',
            type: 'auto'
          })

          if (existingCommit) {
            alreadyCommittedUsers++
            console.log(`✅ User ${user.clerkId} already committed today`)
            continue
          }

          console.log(`🚀 Processing auto commit for user ${user.clerkId}`)
          eligibleUsers++
          await this.processUserCommit(user, 'auto')
          console.log(`✅ Successfully processed commit for user ${user.clerkId}`)
        } catch (error) {
          errorUsers++
          console.error(`❌ Error processing commit for user ${user.clerkId}:`, error.message)
        }
      }

      console.log(`📊 Free user commit summary:`)
      console.log(`   - Total users found: ${freeUsers.length}`)
      console.log(`   - Eligible users processed: ${eligibleUsers}`)
      console.log(`   - Trial expired users: ${trialExpiredUsers}`)
      console.log(`   - Already committed today: ${alreadyCommittedUsers}`)
      console.log(`   - Users with errors: ${errorUsers}`)
    } catch (error) {
      console.error('❌ Error processing free user commits:', error)
    }
  }

  // Process commits for premium users
  async processPremiumUserCommits() {
    try {
      const now = new Date()
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()

      console.log(`🔍 Checking premium user schedules at ${currentHour}:${currentMinute.toString().padStart(2, '0')}`)

      const premiumUsers = await User.find({
        plan: 'premium',
        subscriptionStatus: 'active',
        isActive: true,
        githubToken: { $exists: true, $ne: null },
        'repositories.isActive': true,
        'commitSettings.enableAutoCommits': true
      })

      console.log(`📊 Found ${premiumUsers.length} premium users`)

      let processedUsers = 0
      let skippedUsers = 0

      for (const user of premiumUsers) {
        try {
          const [hour, minute] = user.commitSettings.time.split(':').map(Number)

          console.log(`🔍 User ${user.clerkId} scheduled for ${hour}:${minute.toString().padStart(2, '0')}`)

          // Check if it's time for this user's commit (within 5 minute window)
          if (hour === currentHour && Math.abs(minute - currentMinute) <= 5) {
            // Check if user already committed today
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            const existingCommit = await Commit.findOne({
              clerkId: user.clerkId,
              createdAt: { $gte: today },
              status: 'success',
              type: 'auto'
            })

            if (existingCommit) {
              console.log(`✅ Premium user ${user.clerkId} already committed today`)
              skippedUsers++
              continue
            }

            console.log(`🚀 Processing scheduled commit for premium user ${user.clerkId}`)
            await this.processUserCommit(user, 'auto')
            processedUsers++
            console.log(`✅ Successfully processed commit for premium user ${user.clerkId}`)
          } else {
            // User not scheduled for this time
            skippedUsers++
          }
        } catch (error) {
          console.error(`❌ Error processing commit for premium user ${user.clerkId}:`, error.message)
        }
      }

      if (processedUsers > 0 || premiumUsers.length > 0) {
        console.log(`📊 Premium user summary: ${processedUsers} processed, ${skippedUsers} skipped`)
      }
    } catch (error) {
      console.error('❌ Error processing premium user commits:', error)
    }
  }

  // Process individual user commit
  async processUserCommit(user, type = 'auto') {
    try {
      const activeRepo = user.getActiveRepository()
      if (!activeRepo) {
        console.log(`⚠️ No active repository for user ${user.clerkId}`)
        return
      }

      // Check if user already committed today
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const existingCommit = await Commit.findOne({
        clerkId: user.clerkId,
        'repository.fullName': activeRepo.fullName,
        createdAt: { $gte: today },
        status: 'success'
      })

      if (existingCommit && type === 'auto') {
        console.log(`✅ User ${user.clerkId} already committed today`)
        return
      }

      // Generate commit content
      const content = this.generateCommitContent(user)
      const message = this.generateCommitMessage(user)

      // Create commit record
      const commit = new Commit({
        userId: user._id,
        clerkId: user.clerkId,
        repository: {
          name: activeRepo.name,
          fullName: activeRepo.fullName,
          url: activeRepo.url
        },
        filePath: activeRepo.filePath,
        commitMessage: message,
        content,
        contentType: user.commitSettings.enableSmartContent ? 'quote' : 'timestamp',
        type,
        scheduledFor: new Date(),
        metadata: {
          source: 'scheduler'
        }
      })

      await commit.save()

      // Execute the commit
      await this.executeCommit(commit, user)

    } catch (error) {
      console.error(`❌ Error processing user commit:`, error)
      throw error
    }
  }

  // Execute commit to GitHub
  async executeCommit(commit, user) {
    try {
      const [owner, repo] = commit.repository.fullName.split('/')

      // For backfill and pattern commits, use the scheduled date as custom date to preserve historical dates
      const customDate = (commit.type === 'backfill' || commit.type === 'pattern') ? commit.scheduledFor : null

      // Prepare user info for custom date commits (required for createCommitWithCustomDate)
      const userInfo = customDate ? {
        githubName: user.githubName || user.name,
        githubEmail: user.githubEmail || user.email,
        name: user.name,
        email: user.email
      } : null

      if (customDate) {
        console.log(`🕒 Creating ${commit.type} commit with historical date: ${customDate.toISOString()}`)
      }

      const result = await githubService.createOrUpdateFile(
        user.githubToken,
        owner,
        repo,
        commit.filePath,
        commit.content,
        commit.commitMessage,
        null, // branch (auto-detect default branch)
        customDate, // Pass historical date for backfill commits
        userInfo // User info for proper commit attribution
      )

      if (result.success) {
        await commit.markAsSuccess(result.commit.sha, result.commit.url)

        // Update user stats
        if (user.updateCommitStats) {
          user.updateCommitStats()
          await user.save()
        }

        console.log(`✅ Commit successful for user ${user.clerkId}`)

        // Send email notification for premium users (with better error handling)
        if (user.isPremium() && user.preferences?.emailNotifications) {
          // Check if email notifications are disabled globally
          if (process.env.DISABLE_EMAIL_NOTIFICATIONS === 'true') {
            console.log('📧 Email notifications disabled via environment variable')
          } else if (process.env.SMTP_HOST && process.env.SMTP_USER &&
                     process.env.SMTP_HOST !== 'smtp.gmail.com' &&
                     process.env.SMTP_USER !== 'your_email@gmail.com') {
            try {
              await emailService.sendCommitNotification(user, commit, result.commit)
            } catch (emailError) {
              console.error('❌ Error sending email notification:', emailError.message)
              // Don't throw - email failure shouldn't break the commit process
            }
          } else {
            console.log('📧 Email notifications disabled - SMTP not configured properly')
          }
        }

        // Return the result for the caller
        return {
          success: true,
          commitUrl: result.commit.url,
          sha: result.commit.sha,
          commit: result.commit
        }
      } else {
        throw new Error('GitHub commit failed')
      }
    } catch (error) {
      await commit.markAsFailed(error)
      console.error(`❌ Commit failed for user ${user.clerkId}:`, error)
      throw error
    }
  }

  // Generate commit content
  generateCommitContent(user) {
    if (user.isPremium() && user.commitSettings.enableSmartContent) {
      return githubService.generateSmartContent('quote')
    }
    
    return githubService.generateSmartContent('timestamp')
  }

  // Generate commit message
  generateCommitMessage(user) {
    const messages = user.commitSettings.messages || ['Daily update']
    const customMessages = user.commitSettings.customMessages || []
    const allMessages = [...messages, ...customMessages]
    
    if (allMessages.length === 0) {
      return 'Daily update'
    }
    
    return allMessages[Math.floor(Math.random() * allMessages.length)]
  }

  // Process retry jobs
  async processRetryJobs() {
    try {
      const failedCommits = await Commit.find({
        status: 'failed',
        retryCount: { $lt: 1 } // Max 1 retry
      }).populate('userId')

      console.log(`📊 Found ${failedCommits.length} commits to retry`)

      for (const commit of failedCommits) {
        try {
          if (commit.canRetry()) {
            await commit.markAsRetrying()
            await this.executeCommit(commit, commit.userId)
          }
        } catch (error) {
          console.error(`❌ Retry failed for commit ${commit._id}:`, error)
        }
      }
    } catch (error) {
      console.error('❌ Error processing retry jobs:', error)
    }
  }

  // Cleanup old commits
  async cleanupOldCommits() {
    try {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const result = await Commit.deleteMany({
        createdAt: { $lt: thirtyDaysAgo },
        status: { $in: ['failed', 'success'] }
      })

      console.log(`🧹 Cleaned up ${result.deletedCount} old commits`)
    } catch (error) {
      console.error('❌ Error cleaning up old commits:', error)
    }
  }

  // Manual commit trigger
  async triggerManualCommit(clerkId) {
    try {
      const user = await User.findOne({ clerkId })
      if (!user) {
        throw new Error('User not found')
      }

      // Check if user already committed today
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const existingCommit = await Commit.findOne({
        clerkId: user.clerkId,
        createdAt: { $gte: today },
        status: 'success',
        type: 'manual'
      })

      if (existingCommit) {
        throw new Error('Manual commit already done today')
      }

      await this.processUserCommit(user, 'manual')
      return { success: true, message: 'Manual commit triggered successfully' }
    } catch (error) {
      console.error('❌ Error triggering manual commit:', error)
      throw error
    }
  }

  // Generate past commits (Premium feature)
  async generatePastCommits(clerkId, options) {
    try {
      console.log('🔄 Starting generatePastCommits for:', clerkId)
      console.log('📋 Options:', options)

      const { startDate, endDate, settings } = options
      const user = await User.findOne({ clerkId })

      if (!user) {
        console.log('❌ User not found in generatePastCommits:', clerkId)
        throw new Error('User not found')
      }

      console.log('✅ User found in generatePastCommits:', user.email)

      if (user.plan !== 'premium') {
        throw new Error('Past commit generation is a premium feature')
      }

      const activeRepo = user.getActiveRepository()
      console.log('📁 User repositories:', user.repositories)
      console.log('📁 Active repository:', activeRepo)

      if (!activeRepo) {
        console.log('❌ No active repository found for user:', user.email)
        throw new Error('No active repository found')
      }

      const start = new Date(startDate)
      const end = new Date(endDate)
      let commitsCreated = 0

      console.log(`🔄 Generating past commits for ${user.email} from ${startDate} to ${endDate}`)

      // Generate commits for each day in the range
      const currentDate = new Date(start)
      while (currentDate <= end) {
        const shouldCreateCommit = this.shouldCreateCommitForDate(currentDate, settings)

        if (shouldCreateCommit) {
          // Handle timeRange format (could be array or object)
          const timeRange = settings.timeRange || { start: '09:00', end: '17:00' }
          const startTime = Array.isArray(timeRange) ? timeRange[0] : timeRange.start
          const endTime = Array.isArray(timeRange) ? timeRange[1] : timeRange.end

          const commitTime = this.generateRandomTimeInRange(
            currentDate,
            startTime || '09:00',
            endTime || '17:00'
          )

          const commitData = await this.generateCommitData(settings, currentDate)

          // Generate content for the commit
          const content = this.generateBackfillCommitContent(commitData, currentDate)

          // Create commit record
          const commit = new Commit({
            userId: user._id,
            clerkId: user.clerkId,
            type: 'backfill',
            status: 'pending',
            commitMessage: commitData.message,
            filePath: activeRepo.filePath,
            content: content,
            contentType: 'timestamp',
            scheduledFor: commitTime,
            createdAt: commitTime,
            metadata: {
              backfill: true,
              originalDate: currentDate.toISOString(),
              commitType: commitData.type,
              files: commitData.files,
              source: 'api'
            }
          })

          await commit.save()

          // Execute the commit
          try {
            // Add repository info to commit
            commit.repository = {
              name: activeRepo.name,
              fullName: activeRepo.fullName, // Use the correct fullName format "owner/repo"
              url: activeRepo.url
            }

            const result = await this.executeCommit(commit, user)

            if (result && result.success) {
              commit.status = 'success'
              commit.commitUrl = result.commitUrl
              commit.commitSha = result.sha
              await commit.save()

              commitsCreated++
              console.log(`✅ Created backfill commit for ${commitTime.toISOString()}`)
            } else {
              throw new Error('Commit execution failed - no result returned')
            }

          } catch (error) {
            console.error(`❌ Failed to create backfill commit for ${commitTime.toISOString()}:`, error)
            commit.status = 'failed'
            commit.error = {
              message: error.message || 'Unknown error',
              code: error.code || 'BACKFILL_ERROR',
              details: error.stack || null
            }
            await commit.save()
          }

          // Add small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000))
        }

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1)
      }

      console.log(`✅ Past commit generation completed. Created ${commitsCreated} commits`)

      return {
        commitsCreated,
        dateRange: { startDate, endDate }
      }

    } catch (error) {
      console.error('❌ Error generating past commits:', error)
      throw error
    }
  }

  // Generate streak maintenance commits (Free users - 15 day limit)
  async generateStreakMaintenanceCommits(clerkId, options) {
    try {
      console.log('🔄 Starting generateStreakMaintenanceCommits for:', clerkId)
      console.log('📋 Options:', options)

      const { dates, settings, force = false } = options
      const user = await User.findOne({ clerkId })

      if (!user) {
        console.log('❌ User not found in generateStreakMaintenanceCommits:', clerkId)
        throw new Error('User not found')
      }

      console.log('✅ User found in generateStreakMaintenanceCommits:', user.email)

      const activeRepo = user.getActiveRepository()
      if (!activeRepo) {
        console.log('❌ No active repository found for user:', user.email)
        throw new Error('No active repository found')
      }

      let commitsCreated = 0

      console.log(`🔄 Generating streak maintenance commits for ${user.email} for ${dates.length} dates`)

      // Delete existing commits if force is true
      if (force) {
        const deleteResult = await Commit.deleteMany({
          clerkId: user.clerkId,
          scheduledFor: {
            $in: dates.map(date => new Date(date))
          }
        })
        console.log(`🗑️ Deleted ${deleteResult.deletedCount} existing commits`)
      }

      // Generate commits for each date
      for (const dateStr of dates) {
        try {
          const commitDate = new Date(dateStr)

          // Generate random time within working hours for more realistic commits
          const timeRange = settings?.timeRange || { start: '09:00', end: '18:00' }
          const scheduledTime = this.generateRandomTimeInRange(commitDate, timeRange.start, timeRange.end)

          // Generate commit content and message
          const commitData = await this.generateCommitData(settings, commitDate)
          const content = this.generateCommitContent(user)

          // Create commit record with 'backfill' type for consistency with existing system
          const commit = new Commit({
            userId: user._id,
            clerkId: user.clerkId,
            repository: {
              name: activeRepo.name,
              fullName: activeRepo.fullName,
              url: activeRepo.url
            },
            filePath: activeRepo.filePath,
            commitMessage: commitData.message,
            content,
            contentType: user.commitSettings.enableSmartContent ? 'quote' : 'timestamp',
            type: 'backfill', // Use backfill type for historical commits
            scheduledFor: scheduledTime,
            metadata: {
              source: 'streak-maintenance',
              userPlan: user.plan,
              isStreakMaintenance: true
            }
          })

          await commit.save()

          // Execute the commit
          await this.executeCommit(commit, user)
          commitsCreated++

          console.log(`✅ Created streak maintenance commit for ${dateStr}`)

          // Add small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000))

        } catch (error) {
          console.error(`❌ Error creating commit for ${dateStr}:`, error)
          // Continue with other dates even if one fails
        }
      }

      console.log(`✅ Streak maintenance generation completed. Created ${commitsCreated} commits`)

      return {
        commitsCreated,
        dates,
        userPlan: user.plan
      }

    } catch (error) {
      console.error('❌ Error generating streak maintenance commits:', error)
      throw error
    }
  }

  // Helper function to determine if commit should be created for a date
  shouldCreateCommitForDate(date, settings) {
    const dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, etc.

    switch (settings.frequency) {
      case 'daily':
        return true
      case 'workdays':
        return dayOfWeek >= 1 && dayOfWeek <= 5 // Monday to Friday
      case 'random':
        return Math.random() > 0.3 // 70% chance
      case 'custom':
        // For now, treat custom as random
        return Math.random() > 0.4 // 60% chance
      default:
        return true
    }
  }

  // Helper function to generate random time within range
  generateRandomTimeInRange(date, startTime, endTime) {
    const [startHour, startMinute] = startTime.split(':').map(Number)
    const [endHour, endMinute] = endTime.split(':').map(Number)

    const startMinutes = startHour * 60 + startMinute
    const endMinutes = endHour * 60 + endMinute

    const randomMinutes = Math.floor(Math.random() * (endMinutes - startMinutes)) + startMinutes
    const hour = Math.floor(randomMinutes / 60)
    const minute = randomMinutes % 60

    const commitDate = new Date(date)
    commitDate.setHours(hour, minute, Math.floor(Math.random() * 60), Math.floor(Math.random() * 1000))

    return commitDate
  }

  // Helper function to generate commit data
  async generateCommitData(settings, date) {
    const commitTypes = settings.commitTypes || ['feature', 'fix', 'docs', 'style', 'refactor']
    const randomType = commitTypes[Math.floor(Math.random() * commitTypes.length)]

    const messages = {
      feature: [
        'Add new functionality',
        'Implement user authentication',
        'Create dashboard component',
        'Add data validation',
        'Implement search feature',
        'Add user profile management',
        'Create notification system',
        'Implement file upload',
        'Add responsive design',
        'Create API endpoints'
      ],
      fix: [
        'Fix authentication bug',
        'Resolve styling issues',
        'Fix data validation',
        'Correct API response',
        'Fix mobile responsiveness',
        'Resolve memory leak',
        'Fix form submission',
        'Correct date formatting',
        'Fix navigation bug',
        'Resolve performance issue'
      ],
      docs: [
        'Update README',
        'Add API documentation',
        'Update installation guide',
        'Add code comments',
        'Create user manual',
        'Update changelog',
        'Add contributing guidelines',
        'Document configuration',
        'Add examples',
        'Update license'
      ],
      style: [
        'Improve code formatting',
        'Update CSS styles',
        'Refactor component structure',
        'Clean up imports',
        'Update color scheme',
        'Improve typography',
        'Add animations',
        'Update layout',
        'Improve accessibility',
        'Clean up unused code'
      ],
      refactor: [
        'Refactor authentication logic',
        'Optimize database queries',
        'Improve error handling',
        'Restructure components',
        'Optimize performance',
        'Simplify code logic',
        'Update dependencies',
        'Improve code reusability',
        'Clean up architecture',
        'Optimize bundle size'
      ]
    }

    const typeMessages = messages[randomType] || messages.feature
    const randomMessage = typeMessages[Math.floor(Math.random() * typeMessages.length)]

    const files = this.generateRandomFiles(randomType)

    return {
      type: randomType,
      message: `${randomType}: ${randomMessage}`,
      files
    }
  }

  // Helper function to generate random files for commit
  generateRandomFiles(commitType) {
    const fileTypes = {
      feature: ['src/components/', 'src/pages/', 'src/services/', 'src/utils/'],
      fix: ['src/components/', 'src/pages/', 'src/services/'],
      docs: ['README.md', 'docs/', 'CHANGELOG.md'],
      style: ['src/styles/', 'src/components/', 'public/css/'],
      refactor: ['src/services/', 'src/utils/', 'src/components/']
    }

    const extensions = ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.md', '.json']
    const paths = fileTypes[commitType] || fileTypes.feature
    const randomPath = paths[Math.floor(Math.random() * paths.length)]

    if (randomPath.endsWith('/')) {
      const fileName = `component${Math.floor(Math.random() * 100)}`
      const extension = extensions[Math.floor(Math.random() * extensions.length)]
      return [`${randomPath}${fileName}${extension}`]
    }

    return [randomPath]
  }

  // Helper function to generate commit content for backfill
  generateBackfillCommitContent(commitData, date) {
    const timestamp = date.toISOString()
    const dateStr = date.toLocaleDateString()

    // Generate realistic content based on commit type
    const contentTemplates = {
      feature: `// ${commitData.message}
// Added on ${dateStr}

function newFeature() {
  // Implementation details
  return true;
}

export default newFeature;`,

      fix: `// ${commitData.message}
// Fixed on ${dateStr}

// Bug fix implementation
const fixedIssue = {
  resolved: true,
  timestamp: '${timestamp}'
};

export { fixedIssue };`,

      docs: `# ${commitData.message}

Updated on ${dateStr}

## Changes
- Improved documentation
- Added examples
- Updated installation guide

Last updated: ${timestamp}`,

      style: `/* ${commitData.message} */
/* Updated on ${dateStr} */

.updated-styles {
  /* New styling rules */
  color: #333;
  font-size: 16px;
  margin: 10px 0;
}`,

      refactor: `// ${commitData.message}
// Refactored on ${dateStr}

class RefactoredComponent {
  constructor() {
    this.timestamp = '${timestamp}';
  }

  render() {
    return 'Improved implementation';
  }
}`
    }

    return contentTemplates[commitData.type] || contentTemplates.feature
  }

  // Manual testing methods
  async testFreeUserCommits() {
    console.log('🧪 Manual test: Running free user commits...')
    await this.processFreeUserCommits()
  }

  async testPremiumUserCommits() {
    console.log('🧪 Manual test: Running premium user commits...')
    await this.processPremiumUserCommits()
  }

  async testUserCommit(clerkId) {
    console.log(`🧪 Manual test: Running commit for user ${clerkId}...`)
    try {
      const user = await User.findOne({ clerkId })
      if (!user) {
        throw new Error('User not found')
      }
      await this.processUserCommit(user, 'manual')
      return { success: true, message: 'Test commit completed' }
    } catch (error) {
      console.error('❌ Test commit failed:', error)
      throw error
    }
  }

  // Get scheduler status
  getSchedulerStatus() {
    return {
      isInitialized: this.isInitialized,
      activeJobs: Array.from(this.jobs.keys()),
      jobCount: this.jobs.size,
      currentTime: new Date().toISOString(),
      timezone: 'Asia/Kolkata'
    }
  }

  // Stop all scheduled jobs
  stopScheduler() {
    console.log('🛑 Stopping scheduler...')

    for (const [name, job] of this.jobs) {
      job.stop()
      console.log(`⏹️ Stopped job: ${name}`)
    }

    this.jobs.clear()
    this.isInitialized = false
    console.log('✅ Scheduler stopped')
  }
}

export const schedulerService = new SchedulerService()

// Export function to initialize scheduler
export const initializeScheduler = () => {
  schedulerService.initializeScheduler()
}

export default schedulerService
