import { SignIn, useAuth } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import { GitBranch } from 'lucide-react'
import { useEffect, useState } from 'react'
import ClerkErrorBoundary from '../components/auth/ClerkErrorBoundary'

const SignInPage = () => {
  const { isLoaded, isSignedIn } = useAuth()
  const navigate = useNavigate()
  const [clerkError, setClerkError] = useState(null)

  // Handle successful authentication
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      console.log('SignInPage: User authenticated, redirecting to dashboard')
      // Use a small delay to ensure authentication state is fully settled
      setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 100)
    }
  }, [isLoaded, isSignedIn, navigate])

  // Handle Clerk loading errors
  useEffect(() => {
    if (isLoaded === false) {
      // Check if Clerk failed to load after a reasonable timeout
      const timeout = setTimeout(() => {
        if (!isLoaded) {
          setClerkError('Authentication service failed to load. Please refresh the page.')
        }
      }, 10000) // 10 second timeout

      return () => clearTimeout(timeout)
    }
  }, [isLoaded])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
          <GitBranch className="h-8 w-8 text-primary-600" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            AutoGitPilot
          </span>
        </Link>
        
        <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Sign in to your account to continue automating your GitHub commits
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {clerkError ? (
            <div className="text-center">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                <p className="text-red-600 dark:text-red-400 text-sm">{clerkError}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                Refresh Page
              </button>
            </div>
          ) : !isLoaded ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading authentication...</p>
            </div>
          ) : (
            <ClerkErrorBoundary>
              <SignIn
                appearance={{
                  elements: {
                    formButtonPrimary: 'bg-primary-600 hover:bg-primary-700 text-sm normal-case',
                    card: 'shadow-none',
                    headerTitle: 'hidden',
                    headerSubtitle: 'hidden',
                    socialButtonsBlockButton: 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
                    socialButtonsBlockButtonText: 'text-gray-600 dark:text-gray-300',
                    formFieldInput: 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500',
                    formFieldLabel: 'text-gray-700 dark:text-gray-300',
                    footerActionLink: 'text-primary-600 hover:text-primary-500',
                    // Specific styling for OTP inputs to prevent disappearing
                    otpCodeFieldInput: 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-center font-mono',
                    verificationCodeField: 'space-x-2',
                    verificationCodeFieldInput: 'w-12 h-12 text-center border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-lg'
                  }
                }}
                signUpUrl="/sign-up"
                afterSignInUrl="/dashboard"
                routing="path"
                path="/sign-in"
                redirectUrl="/dashboard"
              />
            </ClerkErrorBoundary>
          )}
        </div>
      </div>
    </div>
  )
}

export default SignInPage
