import { useAuth } from '@clerk/clerk-react'
import { Navigate, useLocation } from 'react-router-dom'
import LoadingSpinner from '../ui/LoadingSpinner'

const ProtectedRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth()
  const location = useLocation()

  if (!isLoaded) {
    return <LoadingSpinner />
  }

  if (!isSignedIn) {
    // Redirect to sign-in page with return URL
    return <Navigate to="/sign-in" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
