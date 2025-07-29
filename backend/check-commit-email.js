// Simple script to check what email would be used for commits
console.log('🔍 Checking commit email attribution...')

// Mock user data to test the logic
const mockUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  githubUsername: 'johndoe',
  githubEmail: null, // This would be null initially
  githubName: null   // This would be null initially
}

// Mock GitHub API response
const mockGitHubResponse = {
  success: true,
  user: {
    id: 12345,
    login: 'johndoe',
    name: 'John Doe',
    email: 'john.doe@github.com', // This is the key - the GitHub email
    avatar_url: 'https://github.com/avatar.jpg'
  }
}

console.log('\n📋 Current user data:')
console.log('  Name:', `${mockUser.firstName} ${mockUser.lastName}`)
console.log('  Email:', mockUser.email)
console.log('  GitHub Username:', mockUser.githubUsername)
console.log('  GitHub Email:', mockUser.githubEmail || 'Not set')
console.log('  GitHub Name:', mockUser.githubName || 'Not set')

console.log('\n🐙 GitHub API response:')
console.log('  Login:', mockGitHubResponse.user.login)
console.log('  Name:', mockGitHubResponse.user.name)
console.log('  Email:', mockGitHubResponse.user.email)

// Simulate the logic from patternService.js
const userInfo = {
  githubName: mockUser.githubName || mockUser.githubUsername || `${mockUser.firstName} ${mockUser.lastName}`.trim(),
  githubEmail: mockUser.githubEmail || mockUser.email,
  name: mockUser.githubName || `${mockUser.firstName} ${mockUser.lastName}`.trim(),
  email: mockUser.githubEmail || mockUser.email
}

console.log('\n📝 Commit attribution (BEFORE GitHub info update):')
console.log('  Author Name:', userInfo.githubName)
console.log('  Author Email:', userInfo.githubEmail)

// Simulate updating with GitHub info
if (mockGitHubResponse.success) {
  mockUser.githubEmail = mockGitHubResponse.user.email || mockUser.email
  mockUser.githubName = mockGitHubResponse.user.name || mockUser.githubUsername || `${mockUser.firstName} ${mockUser.lastName}`.trim()
  
  const updatedUserInfo = {
    githubName: mockUser.githubName,
    githubEmail: mockUser.githubEmail,
    name: mockUser.githubName,
    email: mockUser.githubEmail
  }
  
  console.log('\n✅ Commit attribution (AFTER GitHub info update):')
  console.log('  Author Name:', updatedUserInfo.githubName)
  console.log('  Author Email:', updatedUserInfo.githubEmail)
}

console.log('\n🎯 Key Points:')
console.log('1. The author email MUST match a verified email on the GitHub account')
console.log('2. GitHub contribution graph only counts commits with matching emails')
console.log('3. The email from GitHub API (/user endpoint) should be used')
console.log('4. If GitHub email is null, fallback to user\'s registered email')

console.log('\n🔧 Solution implemented:')
console.log('1. ✅ Added githubEmail and githubName fields to User model')
console.log('2. ✅ Updated GitHub service to accept userInfo parameter')
console.log('3. ✅ Modified pattern service to fetch and use GitHub user info')
console.log('4. ✅ Updated frontend to store GitHub email during connection')
