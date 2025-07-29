import { createContext, useContext, useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { userService } from '../services/userService'

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

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoaded) {
        return
      }

      if (!user) {
        setLoading(false)
        setUserData(null)
        setError(null)
        return
      }

      try {
        setLoading(true)
        setError(null)

        console.log('UserContext: Fetching data for user:', user.id)

        // First try to sync/create user
        const syncedUser = await userService.syncUser({
          email: user.emailAddresses[0]?.emailAddress || 'unknown@example.com',
          firstName: user.firstName || 'User',
          lastName: user.lastName || 'Name'
        })

        console.log('UserContext: User synced:', syncedUser)

        // Then get full profile
        const data = await userService.getUserProfile()
        console.log('UserContext: Profile data:', data)
        setUserData(data)
      } catch (err) {
        console.error('UserContext: Error fetching user data:', err)
        setError(err.message)

        // If user doesn't exist, try to create them
        if (err.message.includes('not found') || err.message.includes('Unauthenticated')) {
          try {
            const newUser = await userService.createUser({
              clerkId: user.id,
              email: user.emailAddresses[0]?.emailAddress,
              firstName: user.firstName,
              lastName: user.lastName,
              plan: 'free'
            })
            setUserData(newUser)
            setError(null)
          } catch (createErr) {
            console.error('Error creating user:', createErr)
            setError(createErr.message)
          }
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user, isLoaded])

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

  return (
    <UserContext.Provider value={{
      userData,
      loading,
      error,
      updateUserData,
      refreshUserData,
      isPremium: userData?.plan === 'premium'
    }}>
      {children}
    </UserContext.Provider>
  )
}
