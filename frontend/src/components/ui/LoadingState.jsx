import { Loader2, Sparkles } from 'lucide-react'

const LoadingState = ({ 
  size = 'default', 
  text = 'Loading...', 
  variant = 'spinner',
  className = '',
  fullScreen = false 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          spinner: 'w-4 h-4',
          text: 'text-sm',
          container: 'gap-2'
        }
      case 'lg':
        return {
          spinner: 'w-8 h-8',
          text: 'text-lg',
          container: 'gap-4'
        }
      case 'xl':
        return {
          spinner: 'w-12 h-12',
          text: 'text-xl',
          container: 'gap-6'
        }
      default:
        return {
          spinner: 'w-6 h-6',
          text: 'text-base',
          container: 'gap-3'
        }
    }
  }

  const sizes = getSizeClasses()

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )
      case 'pulse':
        return (
          <div className={`${sizes.spinner} bg-primary-600 rounded-full animate-pulse`}></div>
        )
      case 'sparkles':
        return (
          <Sparkles className={`${sizes.spinner} text-primary-600 animate-spin`} />
        )
      default:
        return (
          <Loader2 className={`${sizes.spinner} text-primary-600 animate-spin`} />
        )
    }
  }

  const content = (
    <div className={`flex flex-col items-center justify-center ${sizes.container} ${className}`}>
      {renderSpinner()}
      {text && (
        <p className={`${sizes.text} font-medium text-neutral-600 dark:text-neutral-400 text-center`}>
          {text}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    )
  }

  return content
}

// Skeleton Loading Components
export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-white dark:bg-neutral-800 rounded-2xl shadow-soft p-6 border border-neutral-200 dark:border-neutral-700 ${className}`}>
    <div className="animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-700 rounded-xl"></div>
        <div className="flex-1">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
        <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6"></div>
        <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-4/6"></div>
      </div>
    </div>
  </div>
)

export const SkeletonStat = ({ className = '' }) => (
  <div className={`bg-white dark:bg-neutral-800 rounded-2xl shadow-soft p-6 border border-neutral-200 dark:border-neutral-700 ${className}`}>
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-700 rounded-xl"></div>
        <div className="w-16 h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
      </div>
      <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3 mb-2"></div>
      <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3"></div>
    </div>
  </div>
)

export const SkeletonTable = ({ rows = 5, className = '' }) => (
  <div className={`bg-white dark:bg-neutral-800 rounded-2xl shadow-soft border border-neutral-200 dark:border-neutral-700 overflow-hidden ${className}`}>
    <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
      <div className="animate-pulse">
        <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4"></div>
      </div>
    </div>
    <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="p-6">
          <div className="animate-pulse flex items-center space-x-4">
            <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
              <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
            </div>
            <div className="w-20 h-6 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

// Loading Overlay for specific sections
export const LoadingOverlay = ({ children, loading, text = 'Loading...', className = '' }) => (
  <div className={`relative ${className}`}>
    {children}
    {loading && (
      <div className="absolute inset-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
        <LoadingState text={text} />
      </div>
    )}
  </div>
)

export default LoadingState
