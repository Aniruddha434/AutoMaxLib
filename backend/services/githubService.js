import axios from 'axios'

class GitHubService {
  constructor() {
    this.baseURL = 'https://api.github.com'
    this.branchCache = new Map() // Cache for default branches
  }

  // Create axios instance with auth
  createClient(token) {
    return axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'AutoGitPilot/1.0'
      }
    })
  }

  // Verify GitHub token and get user info
  async verifyToken(token) {
    try {
      const client = this.createClient(token)
      const response = await client.get('/user')

      return {
        valid: true,
        user: {
          id: response.data.id,
          login: response.data.login,
          name: response.data.name,
          email: response.data.email,
          avatar_url: response.data.avatar_url,
          public_repos: response.data.public_repos,
          followers: response.data.followers,
          following: response.data.following
        }
      }
    } catch (error) {
      return {
        valid: false,
        error: error.response?.data?.message || 'Invalid token'
      }
    }
  }

  // Get GitHub user info (for existing tokens)
  async getGitHubUserInfo(token) {
    try {
      const client = this.createClient(token)
      const response = await client.get('/user')

      return {
        success: true,
        user: {
          id: response.data.id,
          login: response.data.login,
          name: response.data.name,
          email: response.data.email,
          avatar_url: response.data.avatar_url
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get user info'
      }
    }
  }

  // Get user repositories
  async getUserRepositories(token, page = 1, per_page = 30) {
    try {
      const client = this.createClient(token)
      const response = await client.get('/user/repos', {
        params: {
          sort: 'updated',
          direction: 'desc',
          page,
          per_page,
          type: 'owner' // Only repos owned by user
        }
      })

      return {
        success: true,
        repositories: response.data.map(repo => ({
          id: repo.id,
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description,
          url: repo.html_url,
          cloneUrl: repo.clone_url,
          private: repo.private,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language,
          updatedAt: repo.updated_at,
          createdAt: repo.created_at,
          defaultBranch: repo.default_branch
        })),
        pagination: {
          page,
          per_page,
          total: parseInt(response.headers['x-ratelimit-remaining']) || 0
        }
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch repositories')
    }
  }

  // Get repository details
  async getRepository(token, owner, repo) {
    try {
      const client = this.createClient(token)
      const response = await client.get(`/repos/${owner}/${repo}`)
      
      return {
        success: true,
        repository: {
          id: response.data.id,
          name: response.data.name,
          fullName: response.data.full_name,
          description: response.data.description,
          url: response.data.html_url,
          private: response.data.private,
          stars: response.data.stargazers_count,
          forks: response.data.forks_count,
          language: response.data.language,
          updatedAt: response.data.updated_at,
          defaultBranch: response.data.default_branch
        }
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Repository not found')
    }
  }

  // Get repository default branch with caching
  async getDefaultBranch(token, owner, repo) {
    const cacheKey = `${owner}/${repo}`

    // Check cache first
    if (this.branchCache.has(cacheKey)) {
      return this.branchCache.get(cacheKey)
    }

    try {
      const repoInfo = await this.getRepository(token, owner, repo)
      const defaultBranch = repoInfo.repository.defaultBranch

      // Cache the result
      this.branchCache.set(cacheKey, defaultBranch)
      console.log(`📋 Cached default branch for ${owner}/${repo}: ${defaultBranch}`)

      return defaultBranch
    } catch (error) {
      console.warn(`⚠️ Could not get default branch for ${owner}/${repo}, falling back to 'main'`)
      // Cache the fallback too
      this.branchCache.set(cacheKey, 'main')
      return 'main'
    }
  }

  // Check if file exists in repository
  async checkFileExists(token, owner, repo, path, branch = null) {
    try {
      // Auto-detect default branch if not provided
      if (!branch) {
        branch = await this.getDefaultBranch(token, owner, repo)
      }

      const client = this.createClient(token)
      const response = await client.get(`/repos/${owner}/${repo}/contents/${path}`, {
        params: { ref: branch }
      })

      return {
        exists: true,
        sha: response.data.sha,
        content: Buffer.from(response.data.content, 'base64').toString('utf8'),
        size: response.data.size,
        branch: branch
      }
    } catch (error) {
      if (error.response?.status === 404) {
        return { exists: false, branch: branch }
      }
      throw new Error(error.response?.data?.message || 'Failed to check file')
    }
  }

  // Create or update file in repository
  async createOrUpdateFile(token, owner, repo, path, content, message, branch = null, customDate = null, userInfo = null) {
    try {
      // Auto-detect default branch if not provided
      if (!branch) {
        branch = await this.getDefaultBranch(token, owner, repo)
      }

      console.log(`🔄 Creating/updating file in ${owner}/${repo} on branch: ${branch}`)

      const client = this.createClient(token)

      // Check if file exists to get SHA
      const fileCheck = await this.checkFileExists(token, owner, repo, path, branch)

      // If custom date is provided, use Git Data API for backdated commits
      if (customDate) {
        return await this.createCommitWithCustomDate(token, owner, repo, path, content, message, branch, customDate, fileCheck, userInfo)
      }

      const data = {
        message,
        content: Buffer.from(content).toString('base64'),
        branch
      }

      // If file exists, include SHA for update
      if (fileCheck.exists) {
        data.sha = fileCheck.sha
        console.log(`📝 Updating existing file: ${path}`)
      } else {
        console.log(`📄 Creating new file: ${path}`)
      }

      const response = await client.put(`/repos/${owner}/${repo}/contents/${path}`, data)

      return {
        success: true,
        commit: {
          sha: response.data.commit.sha,
          url: response.data.commit.html_url,
          message: response.data.commit.message,
          author: response.data.commit.author,
          date: response.data.commit.author.date
        },
        content: response.data.content,
        branch: branch
      }
    } catch (error) {
      console.error(`❌ GitHub API Error for ${owner}/${repo}:`, error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to create/update file')
    }
  }

  // Create commit with custom date using Git Data API
  async createCommitWithCustomDate(token, owner, repo, path, content, message, branch, customDate, fileCheck, userInfo = null) {
    try {
      const client = this.createClient(token)

      // Get the current branch reference
      const branchRef = await client.get(`/repos/${owner}/${repo}/git/ref/heads/${branch}`)
      const currentCommitSha = branchRef.data.object.sha

      // Get the current commit to get the tree
      const currentCommit = await client.get(`/repos/${owner}/${repo}/git/commits/${currentCommitSha}`)
      const currentTreeSha = currentCommit.data.tree.sha

      // Create a new blob for the file content
      const blobResponse = await client.post(`/repos/${owner}/${repo}/git/blobs`, {
        content: Buffer.from(content).toString('base64'),
        encoding: 'base64'
      })

      // Create a new tree with the updated file
      const treeData = {
        base_tree: currentTreeSha,
        tree: [{
          path: path,
          mode: '100644',
          type: 'blob',
          sha: blobResponse.data.sha
        }]
      }

      const treeResponse = await client.post(`/repos/${owner}/${repo}/git/trees`, treeData)

      // Use user's GitHub info if provided, otherwise fall back to defaults
      const authorName = userInfo?.githubName || userInfo?.name || 'AutoGit Pattern Generator'
      const authorEmail = userInfo?.githubEmail || userInfo?.email || 'autogit@pattern.generator'

      // Create the commit with custom date - use current commit as parent
      const commitData = {
        message: message,
        tree: treeResponse.data.sha,
        parents: [currentCommitSha],
        author: {
          name: authorName,
          email: authorEmail,
          date: customDate.toISOString()
        },
        committer: {
          name: authorName,
          email: authorEmail,
          date: customDate.toISOString()
        }
      }

      const commitResponse = await client.post(`/repos/${owner}/${repo}/git/commits`, commitData)

      // Update the branch reference to point to the new commit
      // Use force update to handle non-fast-forward updates
      await client.patch(`/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
        sha: commitResponse.data.sha,
        force: true
      })

      console.log(`✅ Created backdated commit for ${customDate.toISOString()}`)

      return {
        success: true,
        commit: {
          sha: commitResponse.data.sha,
          url: commitResponse.data.html_url,
          message: commitResponse.data.message,
          author: commitResponse.data.author,
          date: commitResponse.data.author.date
        },
        branch: branch
      }

    } catch (error) {
      console.error(`❌ Failed to create commit with custom date:`, error.response?.data || error.message)

      // If it's a non-fast-forward error, we can continue with other commits
      if (error.response?.data?.message?.includes('fast forward')) {
        console.warn(`⚠️ Non-fast-forward error for ${customDate.toISOString()}, continuing...`)
        return {
          success: false,
          error: 'Non-fast-forward error',
          recoverable: true
        }
      }

      throw new Error(error.response?.data?.message || 'Failed to create commit with custom date')
    }
  }

  // Get commit history for repository
  async getCommitHistory(token, owner, repo, path = null, limit = 10) {
    try {
      const client = this.createClient(token)
      const params = {
        per_page: limit,
        page: 1
      }
      
      if (path) {
        params.path = path
      }
      
      const response = await client.get(`/repos/${owner}/${repo}/commits`, { params })
      
      return {
        success: true,
        commits: response.data.map(commit => ({
          sha: commit.sha,
          message: commit.commit.message,
          author: {
            name: commit.commit.author.name,
            email: commit.commit.author.email,
            date: commit.commit.author.date
          },
          url: commit.html_url,
          stats: commit.stats
        }))
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch commit history')
    }
  }

  // Get repository statistics
  async getRepositoryStats(token, owner, repo) {
    try {
      const client = this.createClient(token)
      
      // Get basic repo info
      const repoResponse = await client.get(`/repos/${owner}/${repo}`)
      
      // Get commit activity (last year)
      let commitActivity = []
      try {
        const activityResponse = await client.get(`/repos/${owner}/${repo}/stats/commit_activity`)
        commitActivity = activityResponse.data || []
      } catch (err) {
        console.warn('Could not fetch commit activity:', err.message)
      }
      
      return {
        success: true,
        stats: {
          stars: repoResponse.data.stargazers_count,
          forks: repoResponse.data.forks_count,
          watchers: repoResponse.data.watchers_count,
          size: repoResponse.data.size,
          language: repoResponse.data.language,
          openIssues: repoResponse.data.open_issues_count,
          updatedAt: repoResponse.data.updated_at,
          commitActivity
        }
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch repository stats')
    }
  }

  // Clear branch cache (useful for testing or when repository settings change)
  clearBranchCache(owner = null, repo = null) {
    if (owner && repo) {
      const cacheKey = `${owner}/${repo}`
      this.branchCache.delete(cacheKey)
      console.log(`🗑️ Cleared branch cache for ${owner}/${repo}`)
    } else {
      this.branchCache.clear()
      console.log(`🗑️ Cleared all branch cache`)
    }
  }

  // Create a new repository
  async createRepository(token, name, description = '', isPrivate = false, autoInit = true) {
    try {
      const client = this.createClient(token)

      const data = {
        name: name,
        description: description,
        private: isPrivate,
        auto_init: autoInit,
        has_issues: true,
        has_projects: false,
        has_wiki: false
      }

      console.log(`🔨 Creating repository: ${name}`)
      const response = await client.post('/user/repos', data)

      return {
        success: true,
        repository: {
          id: response.data.id,
          name: response.data.name,
          fullName: response.data.full_name,
          description: response.data.description,
          private: response.data.private,
          htmlUrl: response.data.html_url,
          cloneUrl: response.data.clone_url,
          defaultBranch: response.data.default_branch,
          createdAt: response.data.created_at
        }
      }
    } catch (error) {
      console.error(`❌ Failed to create repository ${name}:`, error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to create repository')
    }
  }

  // Create GitHub profile repository (special repository for profile README)
  async createProfileRepository(token, username) {
    try {
      const description = `Hi there 👋 This is my GitHub profile repository!`

      console.log(`🌟 Creating GitHub profile repository for ${username}`)

      const result = await this.createRepository(
        token,
        username, // Repository name must match username
        description,
        false, // Must be public for profile README to work
        true // Auto-initialize with README
      )

      if (result.success) {
        console.log(`✅ GitHub profile repository created: ${result.repository.htmlUrl}`)

        // Create an initial README.md with basic content
        const initialReadme = `# Hi there 👋

Welcome to my GitHub profile! This repository was created automatically by AutoGitPilot.

## About Me
I'm a developer who loves to code and build amazing things!

## 🔧 Technologies & Tools
- Programming Languages
- Frameworks & Libraries
- Tools & Platforms

## 📊 GitHub Stats
![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=radical)

## 📫 How to reach me
- GitHub: [@${username}](https://github.com/${username})

---
⭐️ From [${username}](https://github.com/${username})
`

        // Update the README with initial content
        try {
          await this.createOrUpdateFile(
            token,
            username,
            username,
            'README.md',
            initialReadme,
            'Initialize profile README'
          )
          console.log(`✅ Initial README.md created for profile repository`)
        } catch (readmeError) {
          console.warn(`⚠️ Could not create initial README:`, readmeError.message)
          // Don't fail the whole operation if README creation fails
        }
      }

      return result
    } catch (error) {
      console.error(`❌ Failed to create profile repository for ${username}:`, error.message)
      throw error
    }
  }

  // Validate repository access and branch
  async validateRepositoryAccess(token, owner, repo) {
    try {
      const repoInfo = await this.getRepository(token, owner, repo)
      const defaultBranch = repoInfo.repository.defaultBranch

      console.log(`✅ Repository ${owner}/${repo} is accessible, default branch: ${defaultBranch}`)

      return {
        success: true,
        repository: repoInfo.repository,
        defaultBranch: defaultBranch
      }
    } catch (error) {
      console.error(`❌ Repository ${owner}/${repo} validation failed:`, error.message)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Generate smart content for commits
  generateSmartContent(type = 'timestamp') {
    const now = new Date()

    switch (type) {
      case 'timestamp':
        return `Updated: ${now.toISOString()}`

      case 'quote':
        const quotes = [
          "The only way to do great work is to love what you do. - Steve Jobs",
          "Innovation distinguishes between a leader and a follower. - Steve Jobs",
          "Code is like humor. When you have to explain it, it's bad. - Cory House",
          "First, solve the problem. Then, write the code. - John Johnson",
          "Experience is the name everyone gives to their mistakes. - Oscar Wilde"
        ]
        return quotes[Math.floor(Math.random() * quotes.length)]

      case 'ascii':
        const ascii = [
          "  ╔══════════════════════════════════════╗\n  ║            Daily Update              ║\n  ╚══════════════════════════════════════╝",
          "  ┌─────────────────────────────────────┐\n  │         Keep the streak alive!         │\n  └─────────────────────────────────────────┘",
          "  ★ ☆ ★ ☆ ★ Daily Commit ★ ☆ ★ ☆ ★"
        ]
        return ascii[Math.floor(Math.random() * ascii.length)]

      default:
        return `Daily update - ${now.toDateString()}`
    }
  }
}

export default new GitHubService()
