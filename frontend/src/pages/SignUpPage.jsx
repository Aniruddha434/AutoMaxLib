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
      // Main card styling
      card: 'shadow-none border-0 bg-transparent',
      headerTitle: 'hidden',
      headerSubtitle: 'hidden',

      // Primary button (Continue/Sign Up) - Better mobile sizing
      formButtonPrimary: 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full text-base sm:text-lg',

      // Social buttons (GitHub, Google, etc.) - Better mobile sizing
      socialButtonsBlockButton:
        'border-2 border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-md py-3 sm:py-4 px-4 w-full',
      socialButtonsBlockButtonText: 'text-gray-700 dark:text-gray-300 font-medium',

      // Form inputs - Better mobile sizing
      formFieldInput:
        'border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-lg sm:rounded-xl transition-all duration-200 py-3 sm:py-4 px-3 sm:px-4 text-base w-full',
      formFieldLabel: 'text-gray-700 dark:text-gray-300 font-semibold text-sm sm:text-base mb-2',

      // Links and text
      footerActionLink: 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold transition-colors duration-200',

      // Divider
      dividerLine: 'bg-gray-200 dark:bg-gray-600',
      dividerText: 'text-gray-500 dark:text-gray-400 text-sm font-medium',

      // OTP/Verification inputs
      otpCodeFieldInput:
        'border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center font-mono rounded-xl',
      verificationCodeField: 'space-x-3',
      verificationCodeFieldInput:
        'w-14 h-14 text-center border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-xl rounded-xl transition-all duration-200',

      // Hide Clerk branding
      footer: 'hidden',
      footerAction: 'hidden',
      footerActionText: 'hidden',
      footerActionLink: 'hidden',
    },
  }), [isDark])

  // Mobile Design
  const MobileDesign = () => (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Mobile Header */}
      <div className="flex-shrink-0 pt-12 pb-8 px-6 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-600 dark:bg-green-500 p-4 rounded-2xl shadow-lg">
            <GitBranch className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Create account
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Start your free trial today
        </p>
      </div>

      {/* Mobile Auth Card */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl px-6 py-8 relative flex flex-col items-center">
        {/* Handle bar */}
        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mb-8"></div>

        <div className="w-full max-w-sm mx-auto">
          {clerkError ? (
            <div className="text-center">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                <p className="text-red-600 dark:text-red-400 text-sm">{clerkError}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors duration-200 w-full"
              >
                Refresh Page
              </button>
            </div>
          ) : (
            <ClerkErrorBoundary>
              <SignUp
                appearance={{
                  ...clerkAppearance,
                  elements: {
                    ...clerkAppearance.elements,
                    // Mobile-specific overrides with centering
                    card: 'shadow-none border-0 bg-transparent w-full',
                    formButtonPrimary: 'bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 w-full text-base shadow-lg',
                    socialButtonsBlockButton: 'border-2 border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl py-4 px-4 w-full mb-3',
                    socialButtonsBlock: 'w-full',
                    formFieldInput: 'border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white rounded-xl py-4 px-4 text-base w-full',
                    formFieldLabel: 'text-gray-700 dark:text-gray-300 font-medium text-base mb-2',
                    dividerText: 'text-gray-500 dark:text-gray-400 text-sm text-center',
                    dividerLine: 'bg-gray-200 dark:bg-gray-600',
                    form: 'w-full',
                    // Hide Clerk branding completely
                    footer: 'hidden !important',
                    footerAction: 'hidden !important',
                    footerActionText: 'hidden !important',
                    footerActionLink: 'hidden !important',
                    footerPages: 'hidden !important',
                    footerPagesLink: 'hidden !important',
                  }
                }}
                signInUrl="/sign-in"
                routing="path"
                path="/sign-up"
              />
            </ClerkErrorBoundary>
          )}
        </div>

        {/* Mobile Footer */}
        <div className="text-center mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Already have an account?{' '}
            <Link
              to="/sign-in"
              className="text-green-600 dark:text-green-400 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )

  // Desktop Design
  const DesktopDesign = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-green-400/20 to-blue-400/20 dark:from-green-500/10 dark:to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 dark:from-purple-500/10 dark:to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-lg mx-auto relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <Logo variant="auth" size="xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Create your account
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Start automating your GitHub commits today - it's free!
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl shadow-gray-500/10 dark:shadow-black/20 p-8 relative">
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 dark:from-green-400/5 dark:to-blue-400/5 rounded-2xl"></div>

          <div className="relative z-10">
            {clerkError ? (
              <div className="text-center">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4">
                  <p className="text-red-600 dark:text-red-400 text-sm">{clerkError}</p>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors duration-200 w-full"
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

        {/* Desktop Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 dark:text-gray-400 text-base">
            Already have an account?{' '}
            <Link
              to="/sign-in"
              className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors duration-200"
            >
              Sign in here
            </Link>
          </p>
          <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-gray-400 dark:text-gray-500">
            <span>Free Trial</span>
            <span>•</span>
            <span>No Credit Card</span>
            <span>•</span>
            <span>Cancel Anytime</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Design - Hidden on SM and up */}
      <div className="sm:hidden">
        <MobileDesign />
      </div>

      {/* Desktop Design - Hidden on mobile */}
      <div className="hidden sm:block">
        <DesktopDesign />
      </div>
    </>
  )
}

export default SignUpPage
