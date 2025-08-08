import { useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import authTokenService from '../services/authTokenService'

const AuthDebug = () => {
  const { isSignedIn, user, getToken } = useAuth()
  const [debugInfo, setDebugInfo] = useState(null)
  const [loading, setLoading] = useState(false)

  const checkAuthStatus = async () => {
    setLoading(true)
    try {
      const info = {
        isSignedIn,
        userId: user?.id,
        clerkLoaded: !!window.Clerk,
        sessionExists: !!window.Clerk?.session,
        authServiceAuthenticated: authTokenService.isAuthenticated(),
      }

      // Try to get token from Clerk directly
      try {
        const clerkToken = await getToken()
        info.clerkToken = {
          available: !!clerkToken,
          length: clerkToken?.length,
          prefix: clerkToken?.substring(0, 20) + '...'
        }
      } catch (error) {
        info.clerkTokenError = error.message
      }

      // Try to get token from auth service
      try {
        const serviceToken = await authTokenService.getToken()
        info.serviceToken = {
          available: !!serviceToken,
          length: serviceToken?.length,
          prefix: serviceToken?.substring(0, 20) + '...'
        }
      } catch (error) {
        info.serviceTokenError = error.message
      }

      setDebugInfo(info)
    } catch (error) {
      setDebugInfo({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const forceTokenRefresh = async () => {
    setLoading(true)
    try {
      await authTokenService.forceRefresh()
      await checkAuthStatus()
    } catch (error) {
      setDebugInfo({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Authentication Debug</h3>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={checkAuthStatus}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          {loading ? 'Checking...' : 'Check Auth Status'}
        </button>
        
        <button
          onClick={forceTokenRefresh}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Force Token Refresh
        </button>
      </div>

      {debugInfo && (
        <div className="bg-white p-4 rounded border">
          <pre className="text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default AuthDebug
