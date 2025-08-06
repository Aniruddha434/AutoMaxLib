import { useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUserData } from '../../contexts/UserContext'

/**
 * AuthDebugger component for debugging authentication flow issues
 * Only shows in development mode or when debug=true is in URL
 */
const AuthDebugger = () => {
  const { isLoaded, isSignedIn, sessionId } = useAuth()
  const { user } = useUser()
  const { userData, loading, error, authStateReady } = useUserData()
  const location = useLocation()
  const navigate = useNavigate()
  const [debugLogs, setDebugLogs] = useState([])
  const [isVisible, setIsVisible] = useState(false)

  // Check if debug mode should be enabled
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const isDev = import.meta.env.DEV
    const debugParam = urlParams.get('debug') === 'true'
    const debugAuth = urlParams.get('debug-auth') === 'true'
    
    setIsVisible(isDev || debugParam || debugAuth)
  }, [location.search])

  // Log authentication state changes
  useEffect(() => {
    if (!isVisible) return

    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      isLoaded,
      isSignedIn,
      sessionId,
      userId: user?.id,
      userEmail: user?.emailAddresses?.[0]?.emailAddress,
      userData: userData ? { id: userData.id, email: userData.email } : null,
      loading,
      error,
      authStateReady,
      currentPath: location.pathname,
      search: location.search
    }

    setDebugLogs(prev => [...prev.slice(-9), logEntry]) // Keep last 10 logs

    console.log('🔍 Auth Debug:', logEntry)
  }, [isLoaded, isSignedIn, sessionId, user, userData, loading, error, authStateReady, location, isVisible])

  // Handle authentication flow debugging
  useEffect(() => {
    if (!isVisible || !isLoaded) return

    const sessionId = Math.random().toString(36).substring(7)
    
    // Log authentication flow events
    if (isSignedIn && user && !userData && !loading) {
      console.warn(`[${sessionId}] 🚨 Auth Debug: User signed in but userData not loaded`, {
        userId: user.id,
        userEmail: user.emailAddresses?.[0]?.emailAddress,
        authStateReady,
        currentPath: location.pathname
      })
    }

    if (isSignedIn && user && userData && location.pathname === '/sign-in') {
      console.log(`[${sessionId}] 🔄 Auth Debug: Authenticated user on sign-in page, should redirect`, {
        userId: user.id,
        currentPath: location.pathname,
        shouldRedirectTo: '/dashboard'
      })
    }

    if (!isSignedIn && location.pathname === '/dashboard') {
      console.log(`[${sessionId}] 🔄 Auth Debug: Unauthenticated user on dashboard, should redirect`, {
        currentPath: location.pathname,
        shouldRedirectTo: '/'
      })
    }
  }, [isLoaded, isSignedIn, user, userData, loading, authStateReady, location.pathname, isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-md z-50 text-xs">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-yellow-400">🔍 Auth Debug</h3>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-1">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-gray-400">Loaded:</span>
            <span className={isLoaded ? 'text-green-400' : 'text-red-400'}>
              {isLoaded ? ' ✓' : ' ✗'}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Signed In:</span>
            <span className={isSignedIn ? 'text-green-400' : 'text-red-400'}>
              {isSignedIn ? ' ✓' : ' ✗'}
            </span>
          </div>
          <div>
            <span className="text-gray-400">User Data:</span>
            <span className={userData ? 'text-green-400' : 'text-red-400'}>
              {userData ? ' ✓' : ' ✗'}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Auth Ready:</span>
            <span className={authStateReady ? 'text-green-400' : 'text-red-400'}>
              {authStateReady ? ' ✓' : ' ✗'}
            </span>
          </div>
        </div>

        {user && (
          <div className="mt-2 p-2 bg-gray-800 rounded">
            <div className="text-gray-400">User:</div>
            <div className="text-xs">{user.emailAddresses?.[0]?.emailAddress}</div>
            <div className="text-xs text-gray-500">ID: {user.id?.substring(0, 8)}...</div>
          </div>
        )}

        {error && (
          <div className="mt-2 p-2 bg-red-900 rounded">
            <div className="text-red-400">Error:</div>
            <div className="text-xs">{error}</div>
          </div>
        )}

        <div className="mt-2 p-2 bg-gray-800 rounded">
          <div className="text-gray-400">Path:</div>
          <div className="text-xs">{location.pathname}</div>
        </div>

        {loading && (
          <div className="mt-2 text-yellow-400 text-center">
            Loading user data...
          </div>
        )}

        <div className="mt-2">
          <button
            onClick={() => {
              console.log('🔍 Auth Debug - Full State:', {
                isLoaded,
                isSignedIn,
                sessionId,
                user,
                userData,
                loading,
                error,
                authStateReady,
                location: location.pathname,
                debugLogs
              })
            }}
            className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
          >
            Log Full State
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthDebugger
