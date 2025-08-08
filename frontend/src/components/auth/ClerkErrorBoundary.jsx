import React from 'react'

class ClerkErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console and any error reporting service
    console.error('Clerk Error Boundary caught an error:', error, errorInfo)
    
    // You can also log the error to an error reporting service here
    if (window.errorLogger) {
      window.errorLogger.logError(error, { context: 'ClerkErrorBoundary', ...errorInfo })
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  handleRefresh = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/40 rounded-full">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                Authentication Error
              </h3>

              <p className="text-red-600 dark:text-red-400 text-sm mb-4">
                There was a problem loading the authentication system. This might be due to:
              </p>

              <ul className="text-left text-red-600 dark:text-red-400 text-sm mb-6 space-y-1">
                <li>• Network connectivity issues</li>
                <li>• Temporary service unavailability</li>
                <li>• Browser compatibility problems</li>
                <li>• Ad blockers or security extensions</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Try Again
              </button>

              <button
                onClick={this.handleRefresh}
                className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium py-2.5 px-4 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              >
                Refresh Page
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
              If the problem persists, please try disabling browser extensions or contact support.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ClerkErrorBoundary
