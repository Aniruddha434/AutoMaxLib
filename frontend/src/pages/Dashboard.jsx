import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useUserData } from '../contexts/UserContext'
import { userService } from '../services/userService'
import { githubService } from '../services/githubService'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import TrialStatus from '../components/TrialStatus'
import Progress from '../components/ui/Progress'
import {
  GitBranch,
  Clock,
  Zap,
  Calendar,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  XCircle,
  Crown,
  Star,
  GitFork,
  TrendingUp,
  Settings,
  Mail,
  BarChart3,
  Users,
  Globe,
  Flame,
  Award,
  Sparkles
} from 'lucide-react'
  const AnimatedNumber = ({ value, duration = 800 }) => {
    const [display, setDisplay] = useState(0)

    useEffect(() => {
      const start = display
      const end = Number(value) || 0
      const startTime = performance.now()
      const frame = (now) => {
        const t = Math.min((now - startTime) / duration, 1)
        const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t // easeInOut
        const current = Math.round(start + (end - start) * eased)
        setDisplay(current)
        if (t < 1) requestAnimationFrame(frame)
      }
      requestAnimationFrame(frame)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return <span>{display.toLocaleString()}</span>
  }

const Dashboard = () => {
  const { userData, loading: userLoading, isPremium, updateUserData } = useUserData()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [committing, setCommitting] = useState(false)
  const [commitSuccess, setCommitSuccess] = useState(false)
  const [repositories, setRepositories] = useState([])
  const [loadingRepos, setLoadingRepos] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [backfillSettings, setBackfillSettings] = useState({
    startDate: '',
    endDate: '',
    frequency: 'daily', // daily, random, custom
    timeRange: { start: '09:00', end: '18:00' },
    commitTypes: ['feature', 'fix', 'docs', 'style', 'refactor'],
    generateContent: true
  })
  const [backfillProgress, setBackfillProgress] = useState(null)
  const [generatingCommits, setGeneratingCommits] = useState(false)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const data = await userService.getDashboardData()
        setDashboardData(data)
        setError(null)

        // Fetch additional data for premium users
        if (isPremium && userData?.githubToken) {
          await fetchRepositories()
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (userData) {
      fetchDashboardData()
    }
  }, [userData, isPremium])

  const fetchRepositories = async () => {
    if (!userData?.githubToken) return

    try {
      setLoadingRepos(true)
      const data = await githubService.getUserRepositories(userData.githubToken)
      setRepositories(data.repositories || [])
    } catch (err) {
      console.error('Error fetching repositories:', err)
    } finally {
      setLoadingRepos(false)
    }
  }



  const handleManualCommit = async () => {
    try {
      setCommitting(true)
      setError(null)

      // Trigger manual commit
      await githubService.triggerManualCommit()

      setCommitSuccess(true)

      // Refresh dashboard data to show the new commit
      const data = await userService.getDashboardData()
      setDashboardData(data)

      // Hide success message after 3 seconds
      setTimeout(() => setCommitSuccess(false), 3000)

    } catch (err) {
      console.error('Error triggering manual commit:', err)
      setError(err.message)
    } finally {
      setCommitting(false)
    }
  }

  const handleBackfillCommits = async () => {
    if (!isPremium) {
      setError('Past commit generation is a premium feature')
      return
    }

    if (!dashboardData?.activeRepository) {
      setError('Please connect a repository first')
      return
    }

    if (!backfillSettings.startDate || !backfillSettings.endDate) {
      setError('Please select start and end dates')
      return
    }

    try {
      setGeneratingCommits(true)
      setError(null)
      setBackfillProgress({ current: 0, total: 0, status: 'Calculating...' })

      // Calculate date range
      const startDate = new Date(backfillSettings.startDate)
      const endDate = new Date(backfillSettings.endDate)
      const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))

      if (daysDiff > 365) {
        setError('Maximum backfill period is 365 days')
        return
      }

      setBackfillProgress({ current: 0, total: daysDiff, status: 'Generating commits...' })

      // Get the auth token from Clerk
      const token = await window.Clerk?.session?.getToken()

      if (!token) {
        throw new Error('Authentication token not available. Please sign in again.')
      }

      // Call the backfill API
      const response = await fetch('/api/commit/backfill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          repositoryId: dashboardData.activeRepository.id,
          startDate: backfillSettings.startDate,
          endDate: backfillSettings.endDate,
          settings: backfillSettings,
          force: true  // Allow overwriting existing backfill commits
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to generate past commits')
      }

      const result = await response.json()

      setBackfillProgress({
        current: daysDiff,
        total: daysDiff,
        status: `Successfully generated ${result.commitsCreated} commits!`
      })

      // Refresh dashboard data
      const data = await userService.getDashboardData()
      setDashboardData(data)

    } catch (err) {
      console.error('Error generating past commits:', err)
      setError(`Failed to generate commits: ${err.message}`)
      setBackfillProgress({ current: 0, total: 0, status: 'Failed' })
    } finally {
      setGeneratingCommits(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-950/20 dark:to-secondary-950/20 rounded-2xl p-8 border border-primary-200/50 dark:border-primary-800/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
              Welcome back, {userData?.firstName || 'Developer'}! 👋
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-300">
              Your coding consistency is looking great. Keep up the momentum!
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group bg-white dark:bg-neutral-800 rounded-2xl shadow-soft hover:shadow-medium p-6 border border-neutral-200 dark:border-neutral-700 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <GitBranch className="h-6 w-6 text-white" />
            </div>
            <div className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 px-2 py-1 rounded-full">
              Total
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Total Commits</p>
            <p className="text-3xl font-bold text-neutral-900 dark:text-white">
              <AnimatedNumber value={dashboardData?.user?.stats?.totalCommits || 0} />
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              +{Math.floor(Math.random() * 20) + 5} this week
            </p>
          </div>
        </div>

        <div className="group bg-white dark:bg-neutral-800 rounded-2xl shadow-soft hover:shadow-medium p-6 border border-neutral-200 dark:border-neutral-700 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <div className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
              Active
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Current Streak</p>
            <p className="text-3xl font-bold text-neutral-900 dark:text-white">
              <AnimatedNumber value={dashboardData?.user?.stats?.currentStreak || 0} />
              <span className="text-lg font-normal text-neutral-500 ml-1">days</span>
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              🔥 Keep it going!
            </p>
          </div>
        </div>

        <div className="group bg-white dark:bg-neutral-800 rounded-2xl shadow-soft hover:shadow-medium p-6 border border-neutral-200 dark:border-neutral-700 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-full">
              Record
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Longest Streak</p>
            <p className="text-3xl font-bold text-neutral-900 dark:text-white">
              <AnimatedNumber value={dashboardData?.user?.stats?.longestStreak || 0} />
              <span className="text-lg font-normal text-neutral-500 ml-1">days</span>
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              🏆 Personal best
            </p>
          </div>
        </div>

        <div className="group bg-white dark:bg-neutral-800 rounded-2xl shadow-soft hover:shadow-medium p-6 border border-neutral-200 dark:border-neutral-700 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
              Next
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Next Commit</p>
            <p className="text-3xl font-bold text-neutral-900 dark:text-white">
              {dashboardData?.nextCommitTime || '10:00'}
              <span className="text-lg font-normal text-neutral-500 ml-1">IST</span>
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              ⏰ In {Math.floor(Math.random() * 8) + 1} hours
            </p>
          </div>
        </div>
      </div>

      {/* Repository Status and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Repository Status */}
        <div className="lg:col-span-2">
          <div className="card p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Connected Repository
              </h2>
              <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Active
              </div>
            </div>

            {dashboardData?.activeRepository ? (
              <div className="space-y-6">
                {/* Repository Header */}
                <div className="group bg-gradient-to-br from-neutral-50 to-primary-50/30 dark:from-neutral-800 dark:to-primary-950/30 rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/50 hover:shadow-medium transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <GitBranch className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">
                          {dashboardData.activeRepository.name}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 font-mono bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded">
                          {dashboardData.activeRepository.filePath}
                        </p>
                      </div>
                    </div>
                    <a
                      href={dashboardData.activeRepository.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white dark:bg-neutral-700 rounded-xl flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:shadow-medium transition-all duration-300 hover:scale-110"
                      title="View on GitHub"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>
                </div>

                {/* Enhanced Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-neutral-700 rounded-xl p-6 border border-neutral-200 dark:border-neutral-600 shadow-sm hover:shadow-medium transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                        <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
                        Scheduled
                      </div>
                    </div>
                    <h4 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
                      Next Commit
                    </h4>
                    {userData?.commitSettings?.enableAutoCommits !== false ? (
                      <>
                        <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                          {dashboardData.nextCommitTime} IST
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                          Automated daily commit
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          Disabled
                        </p>
                        <p className="text-xs text-orange-500 dark:text-orange-400 mt-2">
                          Auto commits are disabled
                        </p>
                      </>
                    )}
                  </div>

                  <div className="bg-white dark:bg-neutral-700 rounded-xl p-6 border border-neutral-200 dark:border-neutral-600 shadow-sm hover:shadow-medium transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        dashboardData.todayCommit
                          ? 'bg-green-100 dark:bg-green-900/30'
                          : 'bg-orange-100 dark:bg-orange-900/30'
                      }`}>
                        {dashboardData.todayCommit ? (
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        )}
                      </div>
                      <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                        dashboardData.todayCommit
                          ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
                          : 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30'
                      }`}>
                        {dashboardData.todayCommit ? 'Complete' : 'Pending'}
                      </div>
                    </div>
                    <h4 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
                      Today's Status
                    </h4>
                    <p className={`text-2xl font-bold ${
                      dashboardData.todayCommit
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-orange-600 dark:text-orange-400'
                    }`}>
                      {dashboardData.todayCommit ? 'Completed' : 'Pending'}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                      {dashboardData.todayCommit ? '✅ Commit successful' : '⏳ Waiting for commit'}
                    </p>
                  </div>
                </div>

                {/* Enhanced Action Section */}
                <div className="pt-6 border-t border-neutral-200 dark:border-neutral-600">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {!dashboardData.todayCommit ? (
                      <button
                        onClick={handleManualCommit}
                        disabled={committing}
                        className="btn-primary flex-1 py-3 px-6 text-base font-semibold"
                      >
                        {committing ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                            Triggering Commit...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Zap className="w-5 h-5 mr-2" />
                            Commit Now
                          </div>
                        )}
                      </button>
                    ) : (
                      <div className="flex-1 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
                        <div className="flex items-center justify-center text-green-600 dark:text-green-400">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          <span className="font-semibold">Today's commit completed!</span>
                        </div>
                      </div>
                    )}

                    <Link
                      to="/settings"
                      className="btn-secondary flex items-center justify-center px-6 py-3 text-base font-semibold"
                    >
                      <Settings className="w-5 h-5 mr-2" />
                      Settings
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Repository Connected
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Connect your GitHub repository to start automating commits
                </p>
                <Link to="/connect" className="btn-primary">
                  Connect Repository
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Commits */}
        <div>
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Recent Commits
            </h2>

            {dashboardData?.recentCommits?.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentCommits.map((commit) => (
                  <div key={commit.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    {getStatusIcon(commit.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {commit.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(commit.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {commit.commitUrl && (
                      <a
                        href={commit.commitUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No commits yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderRepositoriesTab = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            GitHub Repositories
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isPremium ? 'Manage multiple repositories' : 'Connect your first repository'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchRepositories}
            disabled={loadingRepos}
            className="btn-outline"
          >
            {loadingRepos ? 'Refreshing...' : 'Refresh'}
          </button>
          <Link to="/connect" className="btn-primary">
            Add Repository
          </Link>
        </div>
      </div>

      {/* Connected Repositories */}
      {userData?.repositories?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Connected Repositories
            </h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {userData.repositories.map((repo, index) => (
              <div key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${repo.isActive ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                      <GitBranch className={`h-5 w-5 ${repo.isActive ? 'text-green-600' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {repo.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        File: {repo.filePath}
                      </p>
                      {repo.isActive && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mt-1">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Repositories */}
      {repositories.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Available Repositories
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {isPremium ? 'Select additional repositories to automate' : 'Upgrade to Premium to connect multiple repositories'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            {repositories.slice(0, isPremium ? repositories.length : 6).map((repo) => (
              <div key={repo.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-primary-500 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <GitBranch className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {repo.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {repo.description || 'No description'}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      {repo.stars || 0}
                    </div>
                    <div className="flex items-center">
                      <GitFork className="h-4 w-4 mr-1" />
                      {repo.forks || 0}
                    </div>
                    {repo.language && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                        {repo.language}
                      </span>
                    )}
                  </div>
                  <button
                    className={`text-sm px-3 py-1 rounded-lg ${
                      isPremium || !userData?.repositories?.length
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!isPremium && userData?.repositories?.length > 0}
                  >
                    {isPremium || !userData?.repositories?.length ? 'Connect' : 'Premium'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!isPremium && repositories.length > 6 && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {repositories.length - 6} more repositories available
              </p>
              <Link to="/upgrade" className="btn-primary">
                Upgrade to Premium
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!userData?.repositories?.length && repositories.length === 0 && (
        <div className="text-center py-12">
          <GitBranch className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Repositories Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Connect your GitHub account to see your repositories
          </p>
          <Link to="/connect" className="btn-primary">
            Connect GitHub
          </Link>
        </div>
      )}
    </div>
  )



  const renderBackfillTab = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Past Commit Generation
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Backfill your GitHub history with automated commits
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-lg">
          <Crown className="h-4 w-4" />
          <span className="text-sm font-medium">Premium Feature</span>
        </div>
      </div>

      {/* Warning Notice */}
      <div className="bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800 dark:text-amber-200">
              Important Notice
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              This feature generates commits for past dates to build your GitHub contribution history.
              Use responsibly and ensure it complies with your organization's policies.
            </p>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Settings Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Backfill Configuration
          </h3>

          <div className="space-y-6">
            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={backfillSettings.startDate}
                  onChange={(e) => setBackfillSettings(prev => ({ ...prev, startDate: e.target.value }))}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={backfillSettings.endDate}
                  onChange={(e) => setBackfillSettings(prev => ({ ...prev, endDate: e.target.value }))}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Commit Frequency
              </label>
              <select
                value={backfillSettings.frequency}
                onChange={(e) => setBackfillSettings(prev => ({ ...prev, frequency: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="daily">Daily (1 commit per day)</option>
                <option value="random">Random (0-3 commits per day)</option>
                <option value="workdays">Workdays only (Mon-Fri)</option>
                <option value="custom">Custom pattern</option>
              </select>
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={backfillSettings.timeRange.start}
                  onChange={(e) => setBackfillSettings(prev => ({
                    ...prev,
                    timeRange: { ...prev.timeRange, start: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={backfillSettings.timeRange.end}
                  onChange={(e) => setBackfillSettings(prev => ({
                    ...prev,
                    timeRange: { ...prev.timeRange, end: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Commit Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Commit Types
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['feature', 'fix', 'docs', 'style', 'refactor', 'test'].map((type) => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={backfillSettings.commitTypes.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setBackfillSettings(prev => ({
                            ...prev,
                            commitTypes: [...prev.commitTypes, type]
                          }))
                        } else {
                          setBackfillSettings(prev => ({
                            ...prev,
                            commitTypes: prev.commitTypes.filter(t => t !== type)
                          }))
                        }
                      }}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* AI Content Generation */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  AI Content Generation
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Generate realistic commit messages and file changes
                </p>
              </div>
              <input
                type="checkbox"
                checked={backfillSettings.generateContent}
                onChange={(e) => setBackfillSettings(prev => ({ ...prev, generateContent: e.target.checked }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Preview & Actions */}
        <div className="space-y-6">
          {/* Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Preview
            </h3>

            {backfillSettings.startDate && backfillSettings.endDate ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Date Range:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(backfillSettings.startDate).toLocaleDateString()} - {new Date(backfillSettings.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {Math.ceil((new Date(backfillSettings.endDate) - new Date(backfillSettings.startDate)) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Frequency:</span>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {backfillSettings.frequency}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Time Range:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {backfillSettings.timeRange.start} - {backfillSettings.timeRange.end}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Estimated commits:</span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {backfillSettings.frequency === 'daily'
                      ? Math.ceil((new Date(backfillSettings.endDate) - new Date(backfillSettings.startDate)) / (1000 * 60 * 60 * 24))
                      : backfillSettings.frequency === 'random'
                      ? Math.ceil((new Date(backfillSettings.endDate) - new Date(backfillSettings.startDate)) / (1000 * 60 * 60 * 24)) * 1.5
                      : 'Variable'
                    } commits
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Select start and end dates to see preview
              </p>
            )}
          </div>

          {/* Progress */}
          {backfillProgress && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Generation Progress
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {backfillProgress.current} / {backfillProgress.total}
                  </span>
                </div>

                <Progress
                  value={backfillProgress.current}
                  max={backfillProgress.total}
                  size="md"
                  variant="primary"
                  showValue
                />

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {backfillProgress.status}
                </p>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleBackfillCommits}
            disabled={generatingCommits || !backfillSettings.startDate || !backfillSettings.endDate || !dashboardData?.activeRepository}
            className="btn-primary w-full"
          >
            {generatingCommits ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Generating Commits...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Past Commits
              </div>
            )}
          </button>

          {/* Repository Info */}
          {dashboardData?.activeRepository && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <GitBranch className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Target Repository
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {dashboardData.activeRepository.name}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features List */}
      <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-primary-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          ✨ What's Included
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Realistic commit timestamps</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>AI-generated commit messages</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Varied commit types (feature, fix, docs)</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Customizable frequency patterns</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Realistic file changes</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Progress tracking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSettingsTab = () => (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Customize your AutoGitPilot experience
        </p>
      </div>

      {/* Quick Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Commit Schedule */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Commit Schedule
            </h3>
            {!isPremium && (
              <Crown className="h-5 w-5 text-yellow-500" />
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Commit Time
              </label>
              <input
                type="time"
                value={dashboardData?.nextCommitTime || '10:00'}
                onChange={() => {}} // Read-only for now
                disabled={!isPremium}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isPremium
                    ? 'border-gray-300 dark:border-gray-600'
                    : 'border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600'
                } dark:bg-gray-700 dark:text-white`}
              />
              {!isPremium && (
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  Premium feature - Fixed at 10:00 AM IST for free users
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Email Notifications
              </span>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  onChange={() => {}} // Read-only for now
                  disabled={!isPremium}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                {!isPremium && (
                  <Crown className="h-4 w-4 text-yellow-500" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Repository Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Repository Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Active Repository
              </label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <GitBranch className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-900 dark:text-white">
                  {dashboardData?.activeRepository?.name || 'No repository connected'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Smart Content Generation
              </span>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  onChange={() => {}} // Read-only for now
                  disabled={!isPremium}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                {!isPremium && (
                  <Crown className="h-4 w-4 text-yellow-500" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                AI-Generated Messages
              </span>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  onChange={() => {}} // Read-only for now
                  disabled={!isPremium}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                {!isPremium && (
                  <Crown className="h-4 w-4 text-yellow-500" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/settings"
          className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors"
        >
          <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
            <Settings className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              Advanced Settings
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Detailed configuration options
            </p>
          </div>
        </Link>

        <Link
          to="/connect"
          className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors"
        >
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <GitBranch className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              GitHub Connection
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage repository connections
            </p>
          </div>
        </Link>

        {isPremium && (
          <Link
            to="/patterns"
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-xl shadow-sm border border-purple-200 dark:border-purple-700 hover:border-purple-400 transition-colors"
          >
            <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
              <Sparkles className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                Pattern Generator
              </h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Create visual patterns in your contribution graph
              </p>
            </div>
            <div className="ml-auto">
              <Crown className="h-4 w-4 text-yellow-500" />
            </div>
          </Link>
        )}

        {!isPremium && (
          <Link
            to="/upgrade"
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 rounded-xl shadow-sm border border-yellow-200 dark:border-yellow-700 hover:border-yellow-400 transition-colors"
          >
            <div className="p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg">
              <Crown className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                Upgrade to Premium
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Unlock all features
              </p>
            </div>
          </Link>
        )}
      </div>

      {/* Account Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Account Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {userData?.firstName} {userData?.lastName}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {userData?.email}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Plan
              </label>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isPremium
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {isPremium ? 'Premium' : 'Free'}
                </span>
                {isPremium && (
                  <Crown className="h-4 w-4 text-yellow-500" />
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Member Since
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (userLoading || loading) {
    return <LoadingSpinner text="Loading dashboard..." />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Error Loading Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'repositories', name: 'Repositories', icon: GitBranch },
    { id: 'backfill', name: 'Past Commits', icon: Clock, premium: true },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/20 dark:from-neutral-950 dark:to-primary-950/10">
      {/* Header */}
      <div className="glass border-b border-neutral-200/50 dark:border-neutral-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                Welcome back, <span className="gradient-text">{dashboardData?.user?.name?.split(' ')[0] || 'Developer'}</span> 👋
              </h1>
              <p className="text-base text-neutral-600 dark:text-neutral-400 font-body">
                Manage your GitHub automation and track your coding progress
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {isPremium && (
                <div className="flex items-center space-x-3 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-6 py-3 rounded-2xl shadow-elegant">
                  <Crown className="h-5 w-5" />
                  <span className="font-bold">Premium</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 overflow-x-auto pb-4">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              const isDisabled = tab.premium && !isPremium

              return (
                <button
                  key={tab.id}
                  onClick={() => !isDisabled && setActiveTab(tab.id)}
                  disabled={isDisabled}
                  className={`flex items-center space-x-3 py-3 px-6 rounded-2xl font-medium text-sm whitespace-nowrap transition-all duration-200 transform hover:scale-105 ${
                    isActive

                      ? 'bg-primary-600 text-white shadow-glow'
                      : isDisabled
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                  {tab.premium && !isPremium && (
                    <Crown className="h-4 w-4 text-orange-500" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom section">

        {/* Success/Error Messages */}
        {commitSuccess && (
          <div className="mb-8 p-6 bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-2xl shadow-elegant">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-accent-600 dark:text-accent-400 mr-3" />
              <p className="text-accent-800 dark:text-accent-200 font-medium">✨ Manual commit triggered successfully!</p>
            </div>
          </div>
        )}

        {/* Trial Status Banner */}
        <TrialStatus userData={userData} />
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button onClick={handleManualCommit} className="btn-primary btn-state">
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-5 h-5" />
              {committing ? 'Triggering Commit...' : 'Commit Now'}
            </div>
          </button>
          <Link to="/connect" className="btn-outline btn-state flex items-center justify-center gap-2">
            <GitBranch className="w-5 h-5" />
            Connect Repo
          </Link>
          <Link to="/settings" className="btn-secondary btn-state flex items-center justify-center gap-2">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </div>

        {error && (
          <div className="mb-8 p-6 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-2xl shadow-elegant">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-error-600 dark:text-error-400 mr-3" />
              <p className="text-error-800 dark:text-error-200 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'repositories' && renderRepositoriesTab()}
        {activeTab === 'backfill' && isPremium && renderBackfillTab()}
        {/* Tips Panel */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Tips to Improve Your Graph</h3>
            <TrendingUp className="w-5 h-5 text-primary-600" />
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-neutral-700 dark:text-neutral-300">
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5" /> Connect more repositories to diversify activity</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5" /> Enable AI messages for richer commit logs</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5" /> Try past commit generation to fill gaps (Premium)</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5" /> Keep a consistent daily window (e.g., 9AM–6PM)</li>
          </ul>
        </div>
        {activeTab === 'settings' && renderSettingsTab()}





      </div>
    </div>
  )
}

export default Dashboard
