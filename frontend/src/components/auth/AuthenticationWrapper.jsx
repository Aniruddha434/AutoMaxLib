import { useEffect } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { useNavigate, useLocation } from 'react-router-dom'

/**
 * AuthenticationWrapper component to handle authentication state changes
 * and ensure proper navigation after sign-in/sign-up
 */
const AuthenticationWrapper = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Only proceed if Clerk has loaded
    if (!isLoaded) return

    const sessionId = Math.random().toString(36).substring(7)
    console.log(`[${sessionId}] AuthWrapper: Authentication state changed`, {
      isLoaded,
      isSignedIn,
      userId: user?.id,
      currentPath: location.pathname,
      timestamp: new Date().toISOString()
    })

    // Handle successful authentication
    if (isSignedIn && user) {
      console.log(`[${sessionId}] AuthWrapper: User authenticated successfully`, {
        userId: user.id,
        email: user.emailAddresses?.[0]?.emailAddress,
        firstName: user.firstName,
        currentPath: location.pathname
      })

      // If user is on sign-in or sign-up page, redirect to dashboard
      if (location.pathname === '/sign-in' || location.pathname === '/sign-up') {
        console.log(`[${sessionId}] AuthWrapper: Redirecting authenticated user to dashboard`)
        
        // Use a small delay to ensure all authentication state is settled
        setTimeout(() => {
          navigate('/dashboard', { replace: true })
        }, 200)
      }
    }

    // Handle sign-out
    if (isLoaded && !isSignedIn && user === null) {
      console.log(`[${sessionId}] AuthWrapper: User signed out`)
      
      // If user is on a protected route, redirect to home
      const protectedRoutes = ['/dashboard', '/settings', '/connect', '/upgrade', '/patterns', '/readme-generator']
      if (protectedRoutes.includes(location.pathname)) {
        console.log(`[${sessionId}] AuthWrapper: Redirecting signed-out user from protected route`)
        navigate('/', { replace: true })
      }
    }

  }, [isLoaded, isSignedIn, user, location.pathname, navigate])

  return children
}

export default AuthenticationWrapper
