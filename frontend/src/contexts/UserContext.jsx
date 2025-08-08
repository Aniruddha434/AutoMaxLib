import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { userService } from '../services/userService'
import EmailConflictModal from '../components/auth/EmailConflictModal'

const UserContext = createContext()

export const useUserData = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserData must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const { user, isLoaded } = useUser()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [authStateReady, setAuthStateReady] = useState(false)
  const [emailConflict, setEmailConflict] = useState(null)

  useEffect(() => {
    let isMounted = true
    let retryTimeout = null
    const isFetchingRef = useRef(false)

    const fetchUserData = async () => {
      if (!isLoaded) {
        return
      }

      if (!user) {
        if (isMounted) {
          setLoading(false)
          setUserData(null)
          setError(null)
          setRetryCount(0)
          setAuthStateReady(true) // Mark auth state as ready even when no user
        }
        return
      }

      const sessionId = Math.random().toString(36).substring(7)

      try {
        if (isFetchingRef.current) {
          console.log(`[${sessionId}] UserContext: Fetch already in progress, skipping duplicate call`)
          return
        }
        isFetchingRef.current = true

        if (isMounted) {
          setLoading(true)
          setError(null)
        }
        console.log(`[${sessionId}] UserContext: Starting user data fetch for:`, {
          userId: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          attempt: retryCount + 1
        })

        // First try to sync/create user
        const userData = {
          email: user.emailAddresses[0]?.emailAddress || 'unknown@example.com',
          firstName: user.firstName || 'User',
          lastName: user.lastName || 'Name'
        }

        console.log(`[${sessionId}] UserContext: Attempting user sync...`)
        const syncedUser = await userService.syncUser(userData)
        console.log(`[${sessionId}] UserContext: User synced successfully:`, syncedUser)

        // Then get full profile
        console.log(`[${sessionId}] UserContext: Fetching full profile...`)
        const data = await userService.getUserProfile()
        console.log(`[${sessionId}] UserContext: Profile data received:`, data)

        if (isMounted) {
          setUserData(data)
          setRetryCount(0) // Reset retry count on success
          setAuthStateReady(true) // Mark auth state as ready
          setLoading(false) // Ensure loading is false
        }

        console.log(`[${sessionId}] UserContext: User data fetch completed successfully`)
      } catch (err) {
        console.error(`[${sessionId}] UserContext: Error fetching user data:`, {
          message: err.message,
          status: err.status,
          code: err.code,
          requestId: err.requestId,
          stack: err.stack,
          attempt: retryCount + 1,
          type: err.type
        })

        if (!isMounted) return

        // Handle email conflict errors specifically
        if (err.type === 'EMAIL_CONFLICT') {
          console.log(`[${sessionId}] UserContext: Email conflict detected`)
          setEmailConflict({
            email: err.email,
            message: err.message
          })
          setLoading(false)
          return
        }

        // Enhanced error handling with retry logic
        const shouldRetry = retryCount < 3 && (
          err.status >= 500 ||
          err.message.includes('Network') ||
          err.message.includes('timeout')
        )

        if (shouldRetry) {
          console.log(`[${sessionId}] UserContext: Retrying in ${(retryCount + 1) * 2} seconds...`)
          setRetryCount(prev => prev + 1)
          retryTimeout = setTimeout(() => {
            if (isMounted) {
              fetchUserData()
            }
          }, (retryCount + 1) * 2000)
          return
        }

        setError(`Authentication failed: ${err.message}`)

        // Enhanced fallback logic
        if (err.status === 401 || err.code === 'CLERK_AUTH_ERROR' || err.message.includes('Authentication')) {
          console.log(`[${sessionId}] UserContext: Authentication error detected, checking Clerk session...`)

          // Check if Clerk session is still valid
          try {
            if (window.Clerk?.session) {
              const token = await window.Clerk.session.getToken()
              if (!token) {
                console.error(`[${sessionId}] UserContext: No Clerk token available`)
                setError('Session expired. Please sign in again.')
                // Redirect to sign-in after a delay
                setTimeout(() => {
                  if (isMounted) {
                    window.location.href = '/sign-in'
                  }
                }, 2000)
                return
              }
            }
          } catch (clerkErr) {
            console.error(`[${sessionId}] UserContext: Clerk session check failed:`, clerkErr)
            setError('Authentication service unavailable. Please try again.')
            return
          }
        }

        // If user doesn't exist, try to create them
        if (err.message.includes('not found') || err.message.includes('User not found') || err.status === 404) {
          console.log(`[${sessionId}] UserContext: User not found, attempting to create...`)
          try {
            const newUser = await userService.createUser({
              clerkId: user.id,
              email: user.emailAddresses[0]?.emailAddress,
              firstName: user.firstName,
              lastName: user.lastName,
              plan: 'free'
            })
            console.log(`[${sessionId}] UserContext: User created successfully:`, newUser)
            if (isMounted) {
              setUserData(newUser)
              setError(null)
            }
          } catch (createErr) {
            console.error(`[${sessionId}] UserContext: Error creating user:`, createErr)
            if (isMounted) {
              setError(`Failed to create user account: ${createErr.message}`)
            }
          }
        } else if (err.status >= 500) {
          setError('Server temporarily unavailable. Please try again in a few moments.')
        }
      } finally {
        isFetchingRef.current = false
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchUserData()

    // Cleanup function
    return () => {
      isMounted = false
      if (retryTimeout) {
        clearTimeout(retryTimeout)
      }
    }
  }, [user, isLoaded, retryCount])

  const updateUserData = async (updates) => {
    try {
      const updatedUser = await userService.updateUser(updates)
      setUserData(updatedUser)
      return updatedUser
    } catch (err) {
      console.error('Error updating user:', err)
      throw err
    }
  }

  const refreshUserData = async () => {
    if (!user) return

    try {
      setLoading(true)
      const data = await userService.getUserProfile()
      setUserData(data)
      setError(null)
    } catch (err) {
      console.error('Error refreshing user data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailConflictClose = () => {
    setEmailConflict(null)
  }

  const handleEmailConflictRetry = () => {
    setEmailConflict(null)
    setRetryCount(0)
    // This will trigger the user to go through the sign-up process again
    // with a different email address
  }

  return (
    <UserContext.Provider value={{
      userData,
      loading,
      error,
      authStateReady,
      updateUserData,
      refreshUserData,
      isPremium: userData?.plan === 'premium'
    }}>
      {children}
      <EmailConflictModal
        isOpen={!!emailConflict}
        onClose={handleEmailConflictClose}
        onRetry={handleEmailConflictRetry}
        email={emailConflict?.email}
      />
    </UserContext.Provider>
  )
}
