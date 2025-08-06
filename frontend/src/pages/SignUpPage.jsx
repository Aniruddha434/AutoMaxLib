import { SignUp, useAuth } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import { GitBranch } from 'lucide-react'
import { useEffect } from 'react'

const SignUpPage = () => {
  const { isLoaded, isSignedIn } = useAuth()
  const navigate = useNavigate()

  // Handle successful authentication
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      console.log('SignUpPage: User authenticated, redirecting to dashboard')
      // Use a small delay to ensure authentication state is fully settled
      setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 100)
    }
  }, [isLoaded, isSignedIn, navigate])

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
          Create your account
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Start automating your GitHub commits today - it's free!
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <SignUp
            appearance={{
              elements: {
                formButtonPrimary: 'bg-primary-600 hover:bg-primary-700 text-sm normal-case',
                card: 'shadow-none',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
                socialButtonsBlockButtonText: 'text-gray-600 dark:text-gray-300',
                formFieldInput: 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white',
                formFieldLabel: 'text-gray-700 dark:text-gray-300',
                footerActionLink: 'text-primary-600 hover:text-primary-500'
              }
            }}
            signInUrl="/sign-in"
            afterSignUpUrl="/dashboard"
            routing="path"
            path="/sign-up"
            redirectUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
