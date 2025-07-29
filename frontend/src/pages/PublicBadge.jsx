import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { GitBranch, Calendar, Zap, Star } from 'lucide-react'

const PublicBadge = () => {
  const { userId } = useParams()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        setLoading(true)
        // This would be an API call to get public profile data
        // For now, using mock data
        const mockData = {
          name: 'John Doe',
          currentStreak: 45,
          longestStreak: 67,
          totalCommits: 234,
          joinedDate: '2024-01-15',
          isPublic: true
        }
        
        setTimeout(() => {
          setUserData(mockData)
          setLoading(false)
        }, 1000)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchPublicProfile()
  }, [userId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !userData?.isPublic) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <GitBranch className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Profile Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This profile is either private or doesn't exist.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm mb-4">
            <GitBranch className="h-5 w-5 text-primary-600" />
            <span className="font-medium text-gray-900 dark:text-white">AutoGitPilot</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {userData.name}'s Coding Streak
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Powered by AutoGitPilot • Member since {new Date(userData.joinedDate).toLocaleDateString()}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mb-4">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {userData.currentStreak}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Current Streak</p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              🔥 Days in a row
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg mb-4">
              <Star className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {userData.longestStreak}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Longest Streak</p>
            <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
              🏆 Personal best
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg mb-4">
              <GitBranch className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {userData.totalCommits}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Total Commits</p>
            <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">
              📈 Automated commits
            </p>
          </div>
        </div>

        {/* Streak Visualization */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Commit Activity
          </h2>
          
          {/* Mock commit grid (like GitHub's contribution graph) */}
          <div className="grid grid-cols-7 gap-1 max-w-md mx-auto">
            {Array.from({ length: 49 }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-sm ${
                  Math.random() > 0.3
                    ? 'bg-green-500'
                    : Math.random() > 0.7
                    ? 'bg-green-300'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
                title={`Day ${i + 1}`}
              />
            ))}
          </div>
          
          <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
            <span>Less</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
            </div>
            <span>More</span>
          </div>
        </div>

        {/* Achievement Badge */}
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl shadow-lg p-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
            <Calendar className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Consistency Champion</h2>
          <p className="text-primary-100 mb-4">
            {userData.name} has maintained an impressive coding streak with AutoGitPilot
          </p>
          <div className="inline-flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-lg">
            <span className="text-sm font-medium">Powered by AutoGitPilot</span>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Want to automate your GitHub commits too?
          </p>
          <a
            href="/"
            className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            <GitBranch className="h-5 w-5" />
            <span>Start with AutoMaxLib</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default PublicBadge
