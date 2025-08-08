import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    default: ''
  },
  plan: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  subscriptionId: {
    type: String,
    default: null
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'inactive', 'cancelled'],
    default: 'inactive'
  },
  subscriptionExpiry: {
    type: Date,
    default: null
  },
  trialStartDate: {
    type: Date,
    default: Date.now
  },
  trialEndDate: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days from now
    }
  },
  githubToken: {
    type: String,
    default: null
  },
  githubUsername: {
    type: String,
    default: null
  },
  githubEmail: {
    type: String,
    default: null
  },
  githubName: {
    type: String,
    default: null
  },
  repositories: [{
    name: String,
    fullName: String,
    url: String,
    filePath: String,
    isActive: {
      type: Boolean,
      default: false
    },
    lastCommit: {
      type: Date,
      default: null
    }
  }],
  commitSettings: {
    time: {
      type: String,
      default: '10:00' // 10 AM IST for free users
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata'
    },
    messages: [{
      type: String,
      default: 'Daily update'
    }],
    customMessages: [{
      type: String
    }],
    enableAutoCommits: {
      type: Boolean,
      default: true
    },
    enableSmartContent: {
      type: Boolean,
      default: false
    },
    enableAIMessages: {
      type: Boolean,
      default: false
    }
  },
  preferences: {
    darkMode: {
      type: Boolean,
      default: false
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    publicProfile: {
      type: Boolean,
      default: false
    }
  },
  stats: {
    totalCommits: {
      type: Number,
      default: 0
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    lastCommitDate: {
      type: Date,
      default: null
    }
  },
  readmeGeneration: {
    generatedReadmes: [{
      id: {
        type: String,
        default: () => new Date().getTime().toString()
      },
      template: {
        type: String,
        enum: ['modern-visual', 'professional', 'creative', 'minimalist', 'developer-focused'],
        default: 'professional'
      },
      content: {
        type: String,
        required: true
      },
      profileData: {
        bio: String,
        currentRole: String,
        company: String,
        location: String,
        skills: [String],
        experience: [{
          role: String,
          company: String,
          duration: String,
          description: String
        }],
        projects: [{
          name: String,
          description: String,
          url: String,
          technologies: [String]
        }],
        socialLinks: {
          linkedin: String,
          twitter: String,
          website: String,
          portfolio: String
        }
      },
      customSections: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
      },
      generatedAt: {
        type: Date,
        default: Date.now
      },
      wordCount: {
        type: Number,
        default: 0
      },
      isDeployed: {
        type: Boolean,
        default: false
      },
      deployedAt: {
        type: Date,
        default: null
      }
    }],
    monthlyUsage: {
      type: Number,
      default: 0
    },
    lastUsageReset: {
      type: Date,
      default: Date.now
    },
    totalGenerations: {
      type: Number,
      default: 0
    }
  },
  repositoryReadmeGeneration: {
    generatedReadmes: [{
      id: {
        type: String,
        default: () => new Date().getTime().toString()
      },
      template: {
        type: String,
        enum: ['web-application', 'library-package', 'cli-tool', 'api-service', 'mobile-app', 'data-science', 'game-entertainment', 'educational'],
        default: 'web-application'
      },
      content: {
        type: String,
        required: true
      },
      repositoryData: {
        owner: String,
        name: String,
        fullName: String,
        description: String,
        language: String,
        languages: [String],
        topics: [String],
        license: String,
        homepage: String,
        size: Number,
        stargazersCount: Number,
        forksCount: Number,
        openIssuesCount: Number,
        defaultBranch: String
      },
      analysisData: {
        projectType: String,
        technologies: [String],
        frameworks: [String],
        buildTools: [String],
        packageManagers: [String],
        databases: [String],
        deploymentPlatforms: [String],
        mainFiles: [String],
        configFiles: [String],
        hasTests: Boolean,
        hasDocumentation: Boolean,
        hasCI: Boolean,
        estimatedComplexity: String,
        codeStructure: {
          type: mongoose.Schema.Types.Mixed,
          default: {}
        }
      },
      customSections: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
      },
      generatedAt: {
        type: Date,
        default: Date.now
      },
      wordCount: {
        type: Number,
        default: 0
      },
      isDeployed: {
        type: Boolean,
        default: false
      },
      deployedAt: {
        type: Date,
        default: null
      },
      deployedToRepository: {
        owner: String,
        name: String,
        branch: String
      }
    }],
    monthlyUsage: {
      type: Number,
      default: 0
    },
    lastUsageReset: {
      type: Date,
      default: Date.now
    },
    totalGenerations: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Indexes for better performance (unique indexes are already defined in schema)
userSchema.index({ plan: 1 })
userSchema.index({ 'repositories.isActive': 1 })

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`
})

// Method to check if user is premium
userSchema.methods.isPremium = function() {
  return this.plan === 'premium' &&
         this.subscriptionStatus === 'active' &&
         (!this.subscriptionExpiry || this.subscriptionExpiry > new Date())
}

// Method to check if user's trial period is active
userSchema.methods.isTrialActive = function() {
  if (this.plan !== 'free') {
    return false // Premium users don't have trial limitations
  }

  const now = new Date()
  return now <= this.trialEndDate
}

// Method to get remaining trial days
userSchema.methods.getTrialDaysRemaining = function() {
  if (this.plan !== 'free') {
    return 0 // Premium users don't have trial limitations
  }

  const now = new Date()
  const timeDiff = this.trialEndDate - now
  const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
  return Math.max(0, daysRemaining)
}

// Method to check if user can use auto commit feature
userSchema.methods.canUseAutoCommit = function() {
  return this.isPremium() || this.isTrialActive()
}

// Method to get active repository
userSchema.methods.getActiveRepository = function() {
  return this.repositories.find(repo => repo.isActive)
}

// Method to update commit stats
userSchema.methods.updateCommitStats = function() {
  this.stats.totalCommits += 1

  const today = new Date()
  const lastCommit = this.stats.lastCommitDate

  if (lastCommit) {
    const daysDiff = Math.floor((today - lastCommit) / (1000 * 60 * 60 * 24))

    if (daysDiff === 1) {
      // Consecutive day
      this.stats.currentStreak += 1
    } else if (daysDiff > 1) {
      // Streak broken
      this.stats.currentStreak = 1
    }
    // If daysDiff === 0, same day commit, don't change streak
  } else {
    // First commit
    this.stats.currentStreak = 1
  }

  // Update longest streak
  if (this.stats.currentStreak > this.stats.longestStreak) {
    this.stats.longestStreak = this.stats.currentStreak
  }

  this.stats.lastCommitDate = today
}

// Method to check if user can generate README (premium feature with limits)
userSchema.methods.canGenerateReadme = function() {
  if (!this.isPremium()) {
    return { canGenerate: false, reason: 'Premium feature only' }
  }

  // Reset monthly usage if needed
  const now = new Date()
  const lastReset = this.readmeGeneration.lastUsageReset
  const monthsDiff = (now.getFullYear() - lastReset.getFullYear()) * 12 + (now.getMonth() - lastReset.getMonth())

  if (monthsDiff >= 1) {
    this.readmeGeneration.monthlyUsage = 0
    this.readmeGeneration.lastUsageReset = now
  }

  // Check monthly limit (5 generations per month)
  const monthlyLimit = 5
  if (this.readmeGeneration.monthlyUsage >= monthlyLimit) {
    return {
      canGenerate: false,
      reason: `Monthly limit reached (${monthlyLimit} generations per month)`,
      usage: this.readmeGeneration.monthlyUsage,
      limit: monthlyLimit
    }
  }

  return {
    canGenerate: true,
    usage: this.readmeGeneration.monthlyUsage,
    limit: monthlyLimit,
    remaining: monthlyLimit - this.readmeGeneration.monthlyUsage
  }
}

// Method to add a generated README
userSchema.methods.addGeneratedReadme = function(readmeData) {
  // Increment usage counters
  this.readmeGeneration.monthlyUsage += 1
  this.readmeGeneration.totalGenerations += 1

  // Add the new README
  this.readmeGeneration.generatedReadmes.push(readmeData)

  // Keep only the last 10 READMEs to prevent excessive storage
  if (this.readmeGeneration.generatedReadmes.length > 10) {
    this.readmeGeneration.generatedReadmes = this.readmeGeneration.generatedReadmes.slice(-10)
  }

  return this.readmeGeneration.generatedReadmes[this.readmeGeneration.generatedReadmes.length - 1]
}

// Method to get latest README
userSchema.methods.getLatestReadme = function() {
  if (this.readmeGeneration.generatedReadmes.length === 0) {
    return null
  }
  return this.readmeGeneration.generatedReadmes[this.readmeGeneration.generatedReadmes.length - 1]
}

// Method to mark README as deployed
userSchema.methods.markReadmeAsDeployed = function(readmeId) {
  const readme = this.readmeGeneration.generatedReadmes.find(r => r.id === readmeId)
  if (readme) {
    readme.isDeployed = true
    readme.deployedAt = new Date()
    return true
  }
  return false
}

// Repository README Generation Methods

// Method to check if user can generate repository README (free users: 2 lifetime, premium: 10 per month)
userSchema.methods.canGenerateRepositoryReadme = function() {
  const now = new Date()

  if (!this.isPremium()) {
    // Free users: 2 lifetime repository README generations
    const freeUserLimit = 2
    const totalUsage = this.repositoryReadmeGeneration.totalGenerations || 0

    if (totalUsage >= freeUserLimit) {
      return {
        canGenerate: false,
        reason: `Free plan limit reached. You've used ${totalUsage} of ${freeUserLimit} lifetime repository README generations. Upgrade to Premium for unlimited monthly access.`,
        usage: totalUsage,
        limit: freeUserLimit,
        remaining: 0,
        isPremium: false,
        limitType: 'lifetime'
      }
    }

    return {
      canGenerate: true,
      usage: totalUsage,
      limit: freeUserLimit,
      remaining: freeUserLimit - totalUsage,
      isPremium: false,
      limitType: 'lifetime'
    }
  }

  // Premium users: 10 repository README generations per month
  // Reset monthly usage if needed
  const lastReset = this.repositoryReadmeGeneration.lastUsageReset
  const monthsDiff = (now.getFullYear() - lastReset.getFullYear()) * 12 + (now.getMonth() - lastReset.getMonth())

  if (monthsDiff >= 1) {
    this.repositoryReadmeGeneration.monthlyUsage = 0
    this.repositoryReadmeGeneration.lastUsageReset = now
  }

  // Check monthly limit for premium users
  const monthlyLimit = 10
  const monthlyUsage = this.repositoryReadmeGeneration.monthlyUsage || 0

  if (monthlyUsage >= monthlyLimit) {
    return {
      canGenerate: false,
      reason: `Monthly limit reached (${monthlyLimit} repository README generations per month)`,
      usage: monthlyUsage,
      limit: monthlyLimit,
      remaining: 0,
      isPremium: true,
      limitType: 'monthly'
    }
  }

  return {
    canGenerate: true,
    usage: monthlyUsage,
    limit: monthlyLimit,
    remaining: monthlyLimit - monthlyUsage,
    isPremium: true,
    limitType: 'monthly'
  }
}

// Method to add a generated repository README
userSchema.methods.addGeneratedRepositoryReadme = function(readmeData) {
  // Increment usage counters
  this.repositoryReadmeGeneration.monthlyUsage += 1
  this.repositoryReadmeGeneration.totalGenerations += 1

  // Add the new README
  this.repositoryReadmeGeneration.generatedReadmes.push(readmeData)

  // Keep only the last 15 repository READMEs to prevent excessive storage
  if (this.repositoryReadmeGeneration.generatedReadmes.length > 15) {
    this.repositoryReadmeGeneration.generatedReadmes = this.repositoryReadmeGeneration.generatedReadmes.slice(-15)
  }

  return this.repositoryReadmeGeneration.generatedReadmes[this.repositoryReadmeGeneration.generatedReadmes.length - 1]
}

// Method to get latest repository README
userSchema.methods.getLatestRepositoryReadme = function() {
  if (this.repositoryReadmeGeneration.generatedReadmes.length === 0) {
    return null
  }
  return this.repositoryReadmeGeneration.generatedReadmes[this.repositoryReadmeGeneration.generatedReadmes.length - 1]
}

// Method to mark repository README as deployed
userSchema.methods.markRepositoryReadmeAsDeployed = function(readmeId, deploymentInfo) {
  const readme = this.repositoryReadmeGeneration.generatedReadmes.find(r => r.id === readmeId)
  if (readme) {
    readme.isDeployed = true
    readme.deployedAt = new Date()
    if (deploymentInfo) {
      readme.deployedToRepository = deploymentInfo
    }
    return true
  }
  return false
}

// Method to get repository README by ID
userSchema.methods.getRepositoryReadmeById = function(readmeId) {
  return this.repositoryReadmeGeneration.generatedReadmes.find(r => r.id === readmeId)
}

export default mongoose.model('User', userSchema)
