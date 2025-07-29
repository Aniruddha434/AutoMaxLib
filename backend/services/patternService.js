import Commit from '../models/Commit.js'
import User from '../models/User.js'
import githubService from './githubService.js'

class PatternService {
  constructor() {
    // Define letter patterns (7 rows x 5 columns for each letter)
    this.letterPatterns = {
      'A': [
        [0,1,1,1,0],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,1,1,1,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1]
      ],
      'B': [
        [1,1,1,1,0],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,1,1,1,0],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,1,1,1,0]
      ],
      'C': [
        [0,1,1,1,0],
        [1,0,0,0,1],
        [1,0,0,0,0],
        [1,0,0,0,0],
        [1,0,0,0,0],
        [1,0,0,0,1],
        [0,1,1,1,0]
      ],
      'D': [
        [1,1,1,1,0],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,1,1,1,0]
      ],
      'E': [
        [1,1,1,1,1],
        [1,0,0,0,0],
        [1,0,0,0,0],
        [1,1,1,1,0],
        [1,0,0,0,0],
        [1,0,0,0,0],
        [1,1,1,1,1]
      ],
      'F': [
        [1,1,1,1,1],
        [1,0,0,0,0],
        [1,0,0,0,0],
        [1,1,1,1,0],
        [1,0,0,0,0],
        [1,0,0,0,0],
        [1,0,0,0,0]
      ],
      'G': [
        [0,1,1,1,0],
        [1,0,0,0,1],
        [1,0,0,0,0],
        [1,0,1,1,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [0,1,1,1,0]
      ],
      'H': [
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,1,1,1,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1]
      ],
      'I': [
        [1,1,1,1,1],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [1,1,1,1,1]
      ],
      'J': [
        [1,1,1,1,1],
        [0,0,0,1,0],
        [0,0,0,1,0],
        [0,0,0,1,0],
        [0,0,0,1,0],
        [1,0,0,1,0],
        [0,1,1,0,0]
      ],
      'K': [
        [1,0,0,0,1],
        [1,0,0,1,0],
        [1,0,1,0,0],
        [1,1,0,0,0],
        [1,0,1,0,0],
        [1,0,0,1,0],
        [1,0,0,0,1]
      ],
      'L': [
        [1,0,0,0,0],
        [1,0,0,0,0],
        [1,0,0,0,0],
        [1,0,0,0,0],
        [1,0,0,0,0],
        [1,0,0,0,0],
        [1,1,1,1,1]
      ],
      'M': [
        [1,0,0,0,1],
        [1,1,0,1,1],
        [1,0,1,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1]
      ],
      'N': [
        [1,0,0,0,1],
        [1,1,0,0,1],
        [1,0,1,0,1],
        [1,0,0,1,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1]
      ],
      'O': [
        [0,1,1,1,0],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [0,1,1,1,0]
      ],
      'P': [
        [1,1,1,1,0],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,1,1,1,0],
        [1,0,0,0,0],
        [1,0,0,0,0],
        [1,0,0,0,0]
      ],
      'Q': [
        [0,1,1,1,0],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,1,0,1],
        [1,0,0,1,0],
        [0,1,1,0,1]
      ],
      'R': [
        [1,1,1,1,0],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,1,1,1,0],
        [1,0,1,0,0],
        [1,0,0,1,0],
        [1,0,0,0,1]
      ],
      'S': [
        [0,1,1,1,0],
        [1,0,0,0,1],
        [1,0,0,0,0],
        [0,1,1,1,0],
        [0,0,0,0,1],
        [1,0,0,0,1],
        [0,1,1,1,0]
      ],
      'T': [
        [1,1,1,1,1],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0]
      ],
      'U': [
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [0,1,1,1,0]
      ],
      'V': [
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [0,1,0,1,0],
        [0,1,0,1,0],
        [0,0,1,0,0]
      ],
      'W': [
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,1,0,1],
        [1,0,1,0,1],
        [1,1,0,1,1],
        [1,0,0,0,1]
      ],
      'X': [
        [1,0,0,0,1],
        [0,1,0,1,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,1,0,1,0],
        [1,0,0,0,1]
      ],
      'Y': [
        [1,0,0,0,1],
        [0,1,0,1,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0]
      ],
      'Z': [
        [1,1,1,1,1],
        [0,0,0,1,0],
        [0,0,1,0,0],
        [0,1,0,0,0],
        [1,0,0,0,0],
        [1,0,0,0,0],
        [1,1,1,1,1]
      ],
      '0': [
        [0,1,1,1,0],
        [1,0,0,0,1],
        [1,0,0,1,1],
        [1,0,1,0,1],
        [1,1,0,0,1],
        [1,0,0,0,1],
        [0,1,1,1,0]
      ],
      '1': [
        [0,0,1,0,0],
        [0,1,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [1,1,1,1,1]
      ],
      '2': [
        [0,1,1,1,0],
        [1,0,0,0,1],
        [0,0,0,0,1],
        [0,0,0,1,0],
        [0,0,1,0,0],
        [0,1,0,0,0],
        [1,1,1,1,1]
      ],
      '3': [
        [1,1,1,1,0],
        [0,0,0,0,1],
        [0,0,0,0,1],
        [0,1,1,1,0],
        [0,0,0,0,1],
        [0,0,0,0,1],
        [1,1,1,1,0]
      ],
      '4': [
        [1,0,0,1,0],
        [1,0,0,1,0],
        [1,0,0,1,0],
        [1,1,1,1,1],
        [0,0,0,1,0],
        [0,0,0,1,0],
        [0,0,0,1,0]
      ],
      '5': [
        [1,1,1,1,1],
        [1,0,0,0,0],
        [1,1,1,1,0],
        [0,0,0,0,1],
        [0,0,0,0,1],
        [1,0,0,0,1],
        [0,1,1,1,0]
      ],
      '6': [
        [0,1,1,1,0],
        [1,0,0,0,0],
        [1,1,1,1,0],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [0,1,1,1,0]
      ],
      '7': [
        [1,1,1,1,1],
        [0,0,0,0,1],
        [0,0,0,1,0],
        [0,0,1,0,0],
        [0,1,0,0,0],
        [0,1,0,0,0],
        [0,1,0,0,0]
      ],
      '8': [
        [0,1,1,1,0],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [0,1,1,1,0],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [0,1,1,1,0]
      ],
      '9': [
        [0,1,1,1,0],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [0,1,1,1,1],
        [0,0,0,0,1],
        [0,0,0,0,1],
        [0,1,1,1,0]
      ],
      ' ': [
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0]
      ]
    }

    // Predefined pattern templates
    this.templates = {
      'AUTOMAX': 'AUTOMAX',
      'HIREME': 'HIRE ME',
      'HARDWORK': 'HARDWORK',
      'DEVELOPER': 'DEV',
      'CODING': 'CODING',
      'GITHUB': 'GITHUB',
      'OPENSOURCE': 'OPEN',
      'JAVASCRIPT': 'JS',
      'REACT': 'REACT',
      'NODEJS': 'NODE'
    }
  }

  // Generate text pattern for GitHub contribution graph
  generateTextPattern(text, options = {}) {
    const {
      intensity = 3,
      alignment = 'center',
      spacing = 1
    } = options

    // Convert text to uppercase and filter valid characters
    const cleanText = text.toUpperCase().replace(/[^A-Z0-9 ]/g, '')

    if (!cleanText) {
      throw new Error('Invalid text: only letters, numbers, and spaces are supported')
    }

    // Calculate pattern dimensions
    const letterWidth = 5
    const letterHeight = 7
    const totalWidth = cleanText.length * letterWidth + (cleanText.length - 1) * spacing

    if (totalWidth > 53) {
      throw new Error(`Text too long: maximum width is 53 characters, got ${totalWidth}`)
    }

    // Create the pattern grid (7 rows x 53 columns)
    const pattern = Array(7).fill().map(() => Array(53).fill(0))

    // Calculate starting position based on alignment
    let startCol = 0
    if (alignment === 'center') {
      startCol = Math.floor((53 - totalWidth) / 2)
    } else if (alignment === 'right') {
      startCol = 53 - totalWidth
    }

    // Draw each character
    let currentCol = startCol
    for (const char of cleanText) {
      const letterPattern = this.letterPatterns[char]
      if (!letterPattern) {
        console.warn(`Character '${char}' not supported, skipping`)
        continue
      }

      // Draw the letter
      for (let row = 0; row < letterHeight; row++) {
        for (let col = 0; col < letterWidth; col++) {
          if (letterPattern[row][col] && currentCol + col < 53) {
            pattern[row][currentCol + col] = intensity
          }
        }
      }

      currentCol += letterWidth + spacing
    }

    return pattern
  }

  // Convert pattern to commit dates
  patternToCommitDates(pattern, endDate = new Date()) {
    const commitDates = []
    const end = new Date(endDate)

    // Calculate start date (53 weeks ago)
    const start = new Date(end)
    start.setDate(start.getDate() - (53 * 7 - 1))

    // Adjust to start on Sunday (GitHub's week starts on Sunday)
    const startDayOfWeek = start.getDay()
    if (startDayOfWeek !== 0) {
      start.setDate(start.getDate() - startDayOfWeek)
    }

    console.log(`🗓️ Pattern date range: ${start.toISOString()} to ${end.toISOString()}`)

    // Generate commit dates based on pattern
    for (let week = 0; week < 53; week++) {
      for (let day = 0; day < 7; day++) {
        const intensity = pattern[day][week]
        if (intensity > 0) {
          const commitDate = new Date(start)
          commitDate.setDate(start.getDate() + (week * 7) + day)

          // Generate multiple commits for higher intensity
          const commitCount = this.intensityToCommitCount(intensity)
          for (let i = 0; i < commitCount; i++) {
            const commitTime = new Date(commitDate)
            // Spread commits throughout the day
            commitTime.setHours(9 + Math.floor(Math.random() * 10)) // 9 AM to 7 PM
            commitTime.setMinutes(Math.floor(Math.random() * 60))
            commitTime.setSeconds(Math.floor(Math.random() * 60))

            commitDates.push({
              date: new Date(commitTime),
              intensity: intensity,
              week: week,
              day: day
            })
          }
        }
      }
    }

    const sortedDates = commitDates.sort((a, b) => a.date - b.date)
    console.log(`📅 Generated ${sortedDates.length} commit dates from ${sortedDates[0]?.date.toISOString()} to ${sortedDates[sortedDates.length - 1]?.date.toISOString()}`)

    return sortedDates
  }

  // Convert intensity level to number of commits
  intensityToCommitCount(intensity) {
    switch (intensity) {
      case 1: return 1 + Math.floor(Math.random() * 2) // 1-2 commits
      case 2: return 3 + Math.floor(Math.random() * 2) // 3-4 commits
      case 3: return 5 + Math.floor(Math.random() * 3) // 5-7 commits
      case 4: return 8 + Math.floor(Math.random() * 5) // 8-12 commits
      default: return 1
    }
  }

  // Preview pattern without creating commits
  async previewPattern(text, options = {}) {
    try {
      const pattern = this.generateTextPattern(text, options)
      const commitDates = this.patternToCommitDates(pattern, options.endDate)

      return {
        success: true,
        pattern: pattern,
        commitDates: commitDates,
        stats: {
          totalCommits: commitDates.length,
          dateRange: {
            start: commitDates[0]?.date,
            end: commitDates[commitDates.length - 1]?.date
          },
          text: text.toUpperCase(),
          dimensions: {
            width: pattern[0].length,
            height: pattern.length
          }
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Generate pattern commits for a user
  async generatePatternCommits(clerkId, text, options = {}) {
    try {
      console.log('🎨 Starting pattern generation for:', clerkId, 'Text:', text)

      const user = await User.findOne({ clerkId })
      if (!user) {
        throw new Error('User not found')
      }

      if (user.plan !== 'premium') {
        throw new Error('Pattern generation is a premium feature')
      }

      const activeRepo = user.getActiveRepository()
      if (!activeRepo) {
        throw new Error('No active repository found')
      }

      // Ensure we have GitHub user info for proper commit attribution
      if (!user.githubEmail || !user.githubName) {
        console.log('🔍 Fetching GitHub user info for proper commit attribution...')
        try {
          const githubUserInfo = await githubService.getGitHubUserInfo(user.githubToken)
          if (githubUserInfo.success) {
            user.githubEmail = githubUserInfo.user.email || user.email
            user.githubName = githubUserInfo.user.name || user.githubUsername || `${user.firstName} ${user.lastName}`.trim()
            await user.save()
            console.log(`✅ Updated GitHub user info: ${user.githubName} <${user.githubEmail}>`)
          }
        } catch (error) {
          console.warn('⚠️ Could not fetch GitHub user info, using fallback values:', error.message)
        }
      }

      // Generate the pattern
      const pattern = this.generateTextPattern(text, options)
      const commitDates = this.patternToCommitDates(pattern, options.endDate)

      console.log(`🎨 Generated pattern with ${commitDates.length} commits`)

      let successCount = 0
      let failureCount = 0

      // Sort commits by date (oldest first) to maintain proper Git history
      const sortedCommitDates = commitDates.sort((a, b) => a.date - b.date)

      // Create commits for each date in chronological order
      for (const commitInfo of sortedCommitDates) {
        try {
          // Generate commit content
          const content = this.generatePatternCommitContent(text, commitInfo.date)
          const message = this.generatePatternCommitMessage(text, commitInfo.intensity)

          // Generate unique file path for each commit
          const timestamp = commitInfo.date.getTime()
          const randomId = Math.random().toString(36).substring(2, 8)
          const baseFileName = activeRepo.filePath.replace(/\.[^/.]+$/, '') || 'pattern'
          const extension = activeRepo.filePath.match(/\.[^/.]+$/)?.[0] || '.js'
          const uniqueFilePath = `patterns/${baseFileName}_${timestamp}_${randomId}${extension}`

          // Create commit record
          const commit = new Commit({
            userId: user._id,
            clerkId: user.clerkId,
            repository: {
              name: activeRepo.name,
              fullName: activeRepo.fullName,
              url: activeRepo.url
            },
            filePath: uniqueFilePath,
            commitMessage: message,
            content: content,
            contentType: 'pattern',
            type: 'pattern',
            scheduledFor: commitInfo.date,
            createdAt: commitInfo.date,
            metadata: {
              pattern: true,
              patternText: text,
              intensity: commitInfo.intensity,
              source: 'pattern-generator'
            }
          })

          await commit.save()

          // Execute the commit using GitHub API
          const [owner, repo] = commit.repository.fullName.split('/')

          // Prepare user info for commit attribution
          const userInfo = {
            githubName: user.githubName || user.githubUsername || `${user.firstName} ${user.lastName}`.trim(),
            githubEmail: user.githubEmail || user.email,
            name: user.githubName || `${user.firstName} ${user.lastName}`.trim(),
            email: user.githubEmail || user.email
          }

          const result = await githubService.createOrUpdateFile(
            user.githubToken,
            owner,
            repo,
            uniqueFilePath,
            commit.content,
            commit.commitMessage,
            null, // branch (use default)
            commitInfo.date, // Pass the specific date for the commit
            userInfo // Pass user info for proper commit attribution
          )

          if (result.success) {
            await commit.markAsSuccess(result.commit.sha, result.commit.url)
            successCount++
            console.log(`✅ Pattern commit created for ${commitInfo.date.toISOString()}`)
          } else if (result.recoverable) {
            // Handle recoverable errors (like non-fast-forward)
            console.warn(`⚠️ Recoverable error for ${commitInfo.date.toISOString()}: ${result.error}`)
            failureCount++
          } else {
            throw new Error('GitHub commit failed')
          }

        } catch (error) {
          console.error(`❌ Failed to create pattern commit for ${commitInfo.date.toISOString()}:`, error)
          failureCount++

          // Don't fail the entire operation for individual commit failures
          // Allow up to 20% failures for pattern generation (due to Git conflicts)
          if (failureCount > commitDates.length * 0.2) {
            throw new Error(`Too many commit failures: ${failureCount}/${commitDates.length}`)
          }
        }

        // Add delay to avoid rate limiting and reduce Git conflicts
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      console.log(`🎨 Pattern generation completed: ${successCount} success, ${failureCount} failures`)

      return {
        success: true,
        stats: {
          totalCommits: commitDates.length,
          successCount,
          failureCount,
          text: text.toUpperCase(),
          pattern: pattern
        }
      }

    } catch (error) {
      console.error('❌ Pattern generation failed:', error)
      throw error
    }
  }

  // Generate commit content for pattern commits
  generatePatternCommitContent(text, date) {
    const timestamp = date.toISOString()
    const dateStr = date.toLocaleDateString()
    const timeStr = date.toLocaleTimeString()
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' })
    const randomId = Math.random().toString(36).substring(2, 15)

    return `// Pattern commit for "${text.toUpperCase()}"
// Generated on ${dayOfWeek}, ${dateStr} at ${timeStr}
// Timestamp: ${timestamp}
// Commit ID: ${randomId}

const patternCommit_${randomId} = {
  id: "${randomId}",
  text: "${text.toUpperCase()}",
  date: "${dateStr}",
  time: "${timeStr}",
  dayOfWeek: "${dayOfWeek}",
  timestamp: "${timestamp}",
  type: "pattern-generation",
  purpose: "GitHub contribution graph pattern",
  coordinates: {
    x: ${Math.floor(Math.random() * 53)},
    y: ${Math.floor(Math.random() * 7)}
  },
  metadata: {
    generatedAt: "${new Date().toISOString()}",
    version: "1.0.0"
  }
};

// Pattern data for visualization
const patternData = {
  character: "${text.charAt(Math.floor(Math.random() * text.length))}",
  position: ${Math.floor(Math.random() * 100)},
  intensity: ${Math.floor(Math.random() * 4) + 1}
};

export { patternCommit_${randomId}, patternData };
export default patternCommit_${randomId};
`
  }

  // Generate commit message for pattern commits
  generatePatternCommitMessage(text, intensity) {
    const messages = [
      `feat: enhance ${text.toLowerCase()} implementation`,
      `docs: update ${text.toLowerCase()} documentation`,
      `style: improve ${text.toLowerCase()} styling`,
      `refactor: optimize ${text.toLowerCase()} code`,
      `fix: resolve ${text.toLowerCase()} issues`,
      `chore: maintain ${text.toLowerCase()} codebase`
    ]

    const intensityPrefixes = {
      1: 'minor: ',
      2: 'update: ',
      3: 'major: ',
      4: 'critical: '
    }

    const prefix = intensityPrefixes[intensity] || ''
    const baseMessage = messages[Math.floor(Math.random() * messages.length)]

    return prefix + baseMessage
  }

  // Get available templates
  getTemplates() {
    return Object.keys(this.templates).map(key => ({
      id: key,
      name: key,
      text: this.templates[key],
      preview: this.generateTextPattern(this.templates[key], { intensity: 2 })
    }))
  }

  // Validate pattern text
  validatePatternText(text) {
    const cleanText = text.toUpperCase().replace(/[^A-Z0-9 ]/g, '')
    const maxLength = Math.floor(53 / 6) // Approximate max characters that fit

    const errors = []

    if (!cleanText) {
      errors.push('Text cannot be empty')
    }

    if (cleanText.length > maxLength) {
      errors.push(`Text too long: maximum ${maxLength} characters, got ${cleanText.length}`)
    }

    const unsupportedChars = text.replace(/[A-Z0-9 ]/gi, '')
    if (unsupportedChars) {
      errors.push(`Unsupported characters: ${unsupportedChars}`)
    }

    return {
      valid: errors.length === 0,
      errors,
      cleanText
    }
  }
}

export const patternService = new PatternService()
export default patternService
