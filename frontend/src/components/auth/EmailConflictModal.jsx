import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useClerk } from '@clerk/clerk-react'

const EmailConflictModal = ({ isOpen, onClose, email, onRetry }) => {
  const navigate = useNavigate()
  const { signOut } = useClerk()

  const handleSignIn = async () => {
    try {
      await signOut()
      navigate('/sign-in')
    } catch (error) {
      console.error('Error signing out:', error)
      // Fallback to direct navigation
      navigate('/sign-in')
    }
  }

  const handleContactSupport = () => {
    // You can replace this with your actual support contact method
    window.open('mailto:support@automaxlib.online?subject=Email Conflict Issue&body=I am experiencing an email conflict with my account. Email: ' + email, '_blank')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900/40 rounded-full">
          <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
          Email Already in Use
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm text-center mb-4">
          The email address <strong>{email}</strong> is already associated with another account.
        </p>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            What you can do:
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Sign in to your existing account instead</li>
            <li>• Use a different email address to create a new account</li>
            <li>• Contact support if you believe this is an error</li>
          </ul>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={handleSignIn}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Sign In to Existing Account
          </button>
          
          <button
            onClick={onRetry}
            className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Try with Different Email
          </button>
          
          <button
            onClick={handleContactSupport}
            className="w-full bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            Contact Support
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default EmailConflictModal
