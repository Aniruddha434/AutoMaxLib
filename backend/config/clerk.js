import { createClerkClient } from '@clerk/clerk-sdk-node'

// Initialize Clerk client with environment variables
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
})

// Verify Clerk configuration
if (!process.env.CLERK_SECRET_KEY) {
  console.error('❌ CLERK_SECRET_KEY is not configured')
  throw new Error('CLERK_SECRET_KEY environment variable is required')
}

if (!process.env.CLERK_WEBHOOK_SECRET) {
  console.error('❌ CLERK_WEBHOOK_SECRET is not configured')
  throw new Error('CLERK_WEBHOOK_SECRET environment variable is required')
}

console.log('✅ Clerk client initialized successfully')

export { clerkClient }
export default clerkClient
