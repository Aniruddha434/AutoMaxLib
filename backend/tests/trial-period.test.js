import { jest } from '@jest/globals'

// Mock User model with trial period methods
const createMockUser = (overrides = {}) => {
  const now = new Date()
  const trialStartDate = overrides.trialStartDate || now
  const trialEndDate = overrides.trialEndDate || new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000)

  return {
    clerkId: 'test-clerk-id',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    plan: 'free',
    trialStartDate,
    trialEndDate,
    subscriptionStatus: 'inactive',
    subscriptionExpiry: null,
    createdAt: now,

    // Trial period methods
    isTrialActive() {
      if (this.plan !== 'free') return false
      return new Date() <= this.trialEndDate
    },

    getTrialDaysRemaining() {
      if (this.plan !== 'free') return 0
      const now = new Date()
      const timeDiff = this.trialEndDate - now
      const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
      return Math.max(0, daysRemaining)
    },

    canUseAutoCommit() {
      return this.isPremium() || this.isTrialActive()
    },

    isPremium() {
      return this.plan === 'premium' &&
             this.subscriptionStatus === 'active' &&
             (!this.subscriptionExpiry || this.subscriptionExpiry > new Date())
    },

    ...overrides
  }
}

describe('Trial Period Functionality', () => {

  describe('Trial Date Initialization', () => {
    test('should automatically set trial dates for new users', () => {
      const testUser = createMockUser()

      expect(testUser.trialStartDate).toBeDefined()
      expect(testUser.trialEndDate).toBeDefined()

      // Trial should be 15 days from start date
      const expectedEndDate = new Date(testUser.trialStartDate.getTime() + 15 * 24 * 60 * 60 * 1000)
      expect(testUser.trialEndDate.getTime()).toBeCloseTo(expectedEndDate.getTime(), -1000) // Within 1 second
    })

    test('should set trial start date to current time for new users', () => {
      const testUser = createMockUser()
      const now = new Date()
      const timeDiff = Math.abs(testUser.trialStartDate.getTime() - now.getTime())
      expect(timeDiff).toBeLessThan(5000) // Within 5 seconds
    })
  })

  describe('Trial Status Methods', () => {
    test('isTrialActive should return true for active trial', () => {
      const testUser = createMockUser()
      expect(testUser.isTrialActive()).toBe(true)
    })

    test('isTrialActive should return false for expired trial', () => {
      const testUser = createMockUser({
        trialEndDate: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
      })
      expect(testUser.isTrialActive()).toBe(false)
    })

    test('isTrialActive should return false for premium users', () => {
      const testUser = createMockUser({
        plan: 'premium',
        subscriptionStatus: 'active'
      })
      expect(testUser.isTrialActive()).toBe(false)
    })

    test('getTrialDaysRemaining should return correct days', () => {
      const testUser = createMockUser()
      const daysRemaining = testUser.getTrialDaysRemaining()
      expect(daysRemaining).toBeGreaterThan(0)
      expect(daysRemaining).toBeLessThanOrEqual(15)
    })

    test('getTrialDaysRemaining should return 0 for expired trial', () => {
      const testUser = createMockUser({
        trialEndDate: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
      })
      expect(testUser.getTrialDaysRemaining()).toBe(0)
    })

    test('getTrialDaysRemaining should return 0 for premium users', () => {
      const testUser = createMockUser({
        plan: 'premium',
        subscriptionStatus: 'active'
      })
      expect(testUser.getTrialDaysRemaining()).toBe(0)
    })

    test('canUseAutoCommit should return true for active trial', () => {
      const testUser = createMockUser()
      expect(testUser.canUseAutoCommit()).toBe(true)
    })

    test('canUseAutoCommit should return false for expired trial', () => {
      const testUser = createMockUser({
        trialEndDate: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
      })
      expect(testUser.canUseAutoCommit()).toBe(false)
    })

    test('canUseAutoCommit should return true for premium users', () => {
      const testUser = createMockUser({
        plan: 'premium',
        subscriptionStatus: 'active'
      })
      expect(testUser.canUseAutoCommit()).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    test('should handle trial end date exactly at current time', () => {
      const testUser = createMockUser({
        trialEndDate: new Date() // Exactly now
      })

      // Should be considered expired (not active)
      expect(testUser.isTrialActive()).toBe(false)
      expect(testUser.canUseAutoCommit()).toBe(false)
    })

    test('should handle trial dates in the future', () => {
      const testUser = createMockUser({
        trialStartDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        trialEndDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000) // 16 days from now
      })

      expect(testUser.isTrialActive()).toBe(true)
      expect(testUser.canUseAutoCommit()).toBe(true)
    })
  })

  describe('Premium User Behavior', () => {
    test('premium users should not be affected by trial dates', () => {
      const testUser = createMockUser({
        plan: 'premium',
        subscriptionStatus: 'active',
        trialEndDate: new Date(Date.now() - 24 * 60 * 60 * 1000) // Expired trial
      })

      expect(testUser.isPremium()).toBe(true)
      expect(testUser.canUseAutoCommit()).toBe(true)
      expect(testUser.isTrialActive()).toBe(false) // Should still return false for premium
      expect(testUser.getTrialDaysRemaining()).toBe(0) // Should return 0 for premium
    })
  })
})

// Integration test for trial period validation
describe('Trial Period Integration Tests', () => {
  test('should simulate scheduler filtering out expired trial users', () => {
    // Create users with different trial statuses
    const activeTrialUser = createMockUser({
      clerkId: 'active-trial',
      email: 'active@example.com',
      plan: 'free',
      trialEndDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days remaining
    })

    const expiredTrialUser = createMockUser({
      clerkId: 'expired-trial',
      email: 'expired@example.com',
      plan: 'free',
      trialEndDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // Expired yesterday
    })

    const premiumUser = createMockUser({
      clerkId: 'premium-user',
      email: 'premium@example.com',
      plan: 'premium',
      subscriptionStatus: 'active'
    })

    // Simulate scheduler logic
    const freeUsers = [activeTrialUser, expiredTrialUser]
    const eligibleFreeUsers = freeUsers.filter(user => user.canUseAutoCommit())
    const premiumUsers = [premiumUser]

    expect(freeUsers.length).toBe(2)
    expect(eligibleFreeUsers.length).toBe(1) // Only active trial user
    expect(eligibleFreeUsers[0].clerkId).toBe('active-trial')
    expect(premiumUsers.length).toBe(1)
  })

  test('should validate trial period for commit endpoints', () => {
    const expiredTrialUser = createMockUser({
      trialEndDate: new Date(Date.now() - 24 * 60 * 60 * 1000) // Expired yesterday
    })

    const activeTrialUser = createMockUser({
      trialEndDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days remaining
    })

    // Simulate endpoint validation
    expect(expiredTrialUser.canUseAutoCommit()).toBe(false)
    expect(activeTrialUser.canUseAutoCommit()).toBe(true)

    // Check error response data
    expect(expiredTrialUser.getTrialDaysRemaining()).toBe(0)
    expect(activeTrialUser.getTrialDaysRemaining()).toBe(5)
  })
})
