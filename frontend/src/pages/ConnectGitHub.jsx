import { useState, useEffect } from 'react'
import { useUserData } from '../contexts/UserContext'
import { githubService } from '../services/githubService'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { 
  GitBranch, 
  Key, 
  ExternalLink, 
  Check, 
  AlertCircle,
  Star,
  GitFork
} from 'lucide-react'

const ConnectGitHub = () => {
  const { userData, updateUserData, isPremium } = useUserData()
  const [step, setStep] = useState(1)
  const [token, setToken] = useState('')
  const [repositories, setRepositories] = useState([])
  const [selectedRepo, setSelectedRepo] = useState(null)
  const [filePath, setFilePath] = useState('daily-update.md')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (userData?.githubToken) {
      setToken(userData.githubToken)
      if (userData.repositories?.length > 0) {
        setStep(3)
        setRepositories(userData.repositories)
        const activeRepo = userData.repositories.find(repo => repo.isActive)
        if (activeRepo) {
          setSelectedRepo(activeRepo)
          setFilePath(activeRepo.filePath)
        }
      } else {
        setStep(2)
        fetchRepositories(userData.githubToken)
      }
    }
  }, [userData])

  const fetchRepositories = async (githubToken) => {
    try {
      setLoading(true)
      setError(null)
      const data = await githubService.getUserRepositories(githubToken)
      setRepositories(data.repositories)
      setStep(2)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleTokenSubmit = async (e) => {
    e.preventDefault()
    if (!token.trim()) {
      setError('Please enter a GitHub token')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // Verify token
      const verification = await githubService.verifyToken(token)
      if (!verification.valid) {
        throw new Error(verification.error)
      }

      // Update user with token and GitHub info
      await updateUserData({
        githubToken: token,
        githubUsername: verification.user.login,
        githubEmail: verification.user.email || null, // Handle null email
        githubName: verification.user.name || null    // Handle null name
      })

      // Fetch repositories
      await fetchRepositories(token)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRepositorySelect = (repo) => {
    setSelectedRepo(repo)
    setStep(3)
  }

  const handleSaveConfiguration = async () => {
    if (!selectedRepo || !filePath.trim()) {
      setError('Please select a repository and enter a file path')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Update user configuration
      const updatedRepos = repositories.map(repo => ({
        ...repo,
        isActive: repo.id === selectedRepo.id,
        filePath: repo.id === selectedRepo.id ? filePath : repo.filePath
      }))

      await updateUserData({
        repositories: updatedRepos
      })

      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading && step === 1) {
    return <LoadingSpinner text="Loading GitHub connection..." />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <GitBranch className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Connect GitHub Repository
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect your GitHub account to start automating commits
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              3
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700 dark:text-red-200">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-green-700 dark:text-green-200">
                GitHub repository connected successfully! Your automated commits will start tomorrow.
              </p>
            </div>
          </div>
        )}

        {/* Step 1: GitHub Token */}
        {step === 1 && (
          <div className="card max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <Key className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Enter GitHub Personal Access Token
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                We need a GitHub token to access your repositories and create commits
              </p>
            </div>

            <form onSubmit={handleTokenSubmit} className="space-y-4">
              <div>
                <label className="label">GitHub Personal Access Token</label>
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className="input"
                  required
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Need a token? 
                  <a 
                    href="https://github.com/settings/tokens/new" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 ml-1"
                  >
                    Create one here <ExternalLink className="h-3 w-3 inline" />
                  </a>
                </p>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Verifying...' : 'Connect GitHub'}
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Required Permissions:
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
                <li>• repo (Full control of private repositories)</li>
                <li>• user:email (Access to user email addresses)</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 2: Select Repository */}
        {step === 2 && (
          <div className="card">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Select Repository
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Choose the repository where you want to automate commits
                {!isPremium && (
                  <span className="block text-sm text-orange-600 dark:text-orange-400 mt-1">
                    Free plan: 1 repository only
                  </span>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {repositories.map((repo) => (
                <div
                  key={repo.id}
                  onClick={() => handleRepositorySelect(repo)}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary-500 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {repo.name}
                    </h3>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                  
                  {repo.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {repo.description}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      {repo.stars}
                    </div>
                    <div className="flex items-center">
                      <GitFork className="h-4 w-4 mr-1" />
                      {repo.forks}
                    </div>
                    {repo.language && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                        {repo.language}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Configure File Path */}
        {step === 3 && selectedRepo && (
          <div className="card max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Configure Commit Settings
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Set up the file path and finalize your configuration
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Selected Repository
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedRepo.fullName}
                </p>
              </div>

              <div>
                <label className="label">File Path</label>
                <input
                  type="text"
                  value={filePath}
                  onChange={(e) => setFilePath(e.target.value)}
                  placeholder="daily-update.md"
                  className="input"
                  required
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  The file that will be updated with each automated commit
                </p>
              </div>

              <button 
                onClick={handleSaveConfiguration}
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConnectGitHub
