import { SignUp, useAuth } from '@clerk/clerk-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { GitBranch } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import ClerkErrorBoundary from '../components/auth/ClerkErrorBoundary'
import { useTheme } from '../contexts/ThemeContext'
import Logo from '../components/ui/Logo'

const SignUpPage = () => {
  const { isLoaded, isSignedIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [clerkError, setClerkError] = useState(null)

  // Handle successful authentication
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const redirectTo = location.state?.from?.pathname || '/dashboard'
      console.log('SignUpPage: User authenticated, redirecting to', redirectTo)
      // Use a small delay to ensure authentication state is fully settled
      setTimeout(() => {
        navigate(redirectTo, { replace: true })
      }, 100)
    }
  }, [isLoaded, isSignedIn, navigate, location.state])

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

  const { isDark } = useTheme()

  const clerkAppearance = useMemo(() => ({
    colorScheme: isDark ? 'dark' : 'light',
    variables: isDark
      ? {
          colorBackground: '#0f172a', // slate-900
          colorText: '#e2e8f0', // slate-200
          colorInputBackground: '#1e293b', // slate-800
          colorInputText: '#f1f5f9', // slate-100
          colorInputBorder: '#475569', // slate-600
          colorPrimary: '#4f46e5', // indigo-600
          colorPrimaryHover: '#4338ca', // indigo-700
          colorDanger: '#ef4444', // red-500
          borderRadius: '0.5rem',
          fontFamily: '"Inter", "Poppins", sans-serif',
        }
      : {
          colorBackground: '#ffffff',
          colorText: '#0f172a', // slate-900
          colorInputBackground: '#ffffff',
          colorInputText: '#0f172a', // slate-900
          colorInputBorder: '#cbd5e1', // slate-300
          colorPrimary: '#4f46e5', // indigo-600
          colorPrimaryHover: '#4338ca', // indigo-700
          colorDanger: '#dc2626', // red-600
          borderRadius: '0.5rem',
          fontFamily: '"Inter", "Poppins", sans-serif',
        },
    elements: {
      formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm hover:shadow-md',
      card: 'shadow-none border-0',
      headerTitle: 'hidden',
      headerSubtitle: 'hidden',
      socialButtonsBlockButton:
        'border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-all duration-200 hover:shadow-sm',
      socialButtonsBlockButtonText: 'text-slate-600 dark:text-slate-300 font-medium',
      formFieldInput:
        'border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md transition-colors duration-200',
      formFieldLabel: 'text-slate-700 dark:text-slate-300 font-medium text-sm',
      footerActionLink: 'text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200',
      dividerLine: 'bg-slate-200 dark:bg-slate-700',
      dividerText: 'text-slate-500 dark:text-slate-400 text-sm',
      otpCodeFieldInput:
        'border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center font-mono rounded-md',
      verificationCodeField: 'space-x-2',
      verificationCodeFieldInput:
        'w-12 h-12 text-center border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-lg rounded-md',
    },
  }), [isDark])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-400/10 dark:bg-indigo-400/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <Logo variant="auth" size="xl" />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Create your account
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Start automating your GitHub commits today - it's free!
          </p>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white dark:bg-slate-800 py-8 px-6 shadow-xl border border-slate-200 dark:border-slate-700 sm:rounded-xl sm:px-10 backdrop-blur-sm">
          {clerkError ? (
            <div className="text-center">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                <p className="text-red-600 dark:text-red-400 text-sm">{clerkError}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Refresh Page
              </button>
            </div>
          ) : (
            <ClerkErrorBoundary>
              <SignUp
                appearance={clerkAppearance}
                signInUrl="/sign-in"
                routing="path"
                path="/sign-up"
              />
            </ClerkErrorBoundary>
          )}
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
