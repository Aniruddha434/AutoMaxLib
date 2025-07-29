import mongoose from 'mongoose'

const commitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  clerkId: {
    type: String,
    required: true,
    index: true
  },
  repository: {
    name: String,
    fullName: String,
    url: String
  },
  filePath: {
    type: String,
    required: true
  },
  commitMessage: {
    type: String,
    required: true
  },
  commitSha: {
    type: String,
    default: null
  },
  commitUrl: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'retrying'],
    default: 'pending'
  },
  type: {
    type: String,
    enum: ['auto', 'manual', 'retry', 'backfill', 'pattern'],
    default: 'auto'
  },
  content: {
    type: String,
    default: null
  },
  contentType: {
    type: String,
    enum: ['timestamp', 'quote', 'ascii', 'custom', 'ai-generated', 'pattern'],
    default: 'timestamp'
  },
  error: {
    message: String,
    code: String,
    details: mongoose.Schema.Types.Mixed
  },
  retryCount: {
    type: Number,
    default: 0
  },
  maxRetries: {
    type: Number,
    default: 1
  },
  scheduledFor: {
    type: Date,
    default: null
  },
  executedAt: {
    type: Date,
    default: null
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    source: {
      type: String,
      enum: ['web', 'api', 'scheduler', 'pattern-generator'],
      default: 'scheduler'
    }
  }
}, {
  timestamps: true
})

// Indexes for better performance
commitSchema.index({ userId: 1, createdAt: -1 })
commitSchema.index({ clerkId: 1, createdAt: -1 })
commitSchema.index({ status: 1 })
commitSchema.index({ type: 1 })
commitSchema.index({ scheduledFor: 1 })
commitSchema.index({ 'repository.fullName': 1 })

// Virtual for commit age
commitSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt
})

// Method to check if commit can be retried
commitSchema.methods.canRetry = function() {
  return this.status === 'failed' && this.retryCount < this.maxRetries
}

// Method to mark as retrying
commitSchema.methods.markAsRetrying = function() {
  this.status = 'retrying'
  this.retryCount += 1
  return this.save()
}

// Method to mark as success
commitSchema.methods.markAsSuccess = function(commitSha, commitUrl) {
  this.status = 'success'
  this.commitSha = commitSha
  this.commitUrl = commitUrl
  this.executedAt = new Date()
  return this.save()
}

// Method to mark as failed
commitSchema.methods.markAsFailed = function(error) {
  this.status = 'failed'
  this.error = {
    message: error.message,
    code: error.code || 'UNKNOWN_ERROR',
    details: error.details || null
  }
  this.executedAt = new Date()
  return this.save()
}

// Static method to get user's recent commits
commitSchema.statics.getRecentCommits = function(clerkId, limit = 10) {
  return this.find({ clerkId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'firstName lastName email')
}

// Static method to get commit stats for analytics
commitSchema.statics.getCommitStats = function(clerkId, days = 30) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  return this.aggregate([
    {
      $match: {
        clerkId,
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          status: '$status'
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.date',
        total: { $sum: '$count' },
        success: {
          $sum: {
            $cond: [{ $eq: ['$_id.status', 'success'] }, '$count', 0]
          }
        },
        failed: {
          $sum: {
            $cond: [{ $eq: ['$_id.status', 'failed'] }, '$count', 0]
          }
        }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ])
}

export default mongoose.model('Commit', commitSchema)
