import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

const Skeleton = forwardRef(({
  className,
  variant = 'default',
  animation = 'pulse',
  ...props
}, ref) => {
  const variants = {
    default: 'bg-neutral-200 dark:bg-neutral-700',
    light: 'bg-neutral-100 dark:bg-neutral-800',
    card: 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700'
  }

  const animations = {
    pulse: 'animate-pulse',
    shimmer: 'animate-shimmer',
    wave: 'animate-wave',
    none: ''
  }

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg',
        variants[variant],
        animations[animation],
        className
      )}
      {...props}
    />
  )
})

Skeleton.displayName = 'Skeleton'

// Predefined skeleton components for common use cases
export const SkeletonText = ({ lines = 1, className, ...props }) => (
  <div className={cn('space-y-2', className)} {...props}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        className={cn(
          'h-4',
          index === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
        )}
      />
    ))}
  </div>
)

export const SkeletonAvatar = ({ size = 'md', className, ...props }) => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  return (
    <Skeleton
      className={cn('rounded-full', sizes[size], className)}
      {...props}
    />
  )
}

export const SkeletonButton = ({ size = 'md', className, ...props }) => {
  const sizes = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-28'
  }

  return (
    <Skeleton
      className={cn('rounded-xl', sizes[size], className)}
      {...props}
    />
  )
}

export const SkeletonCard = ({ className, ...props }) => (
  <Skeleton
    variant="card"
    className={cn('p-6 space-y-4', className)}
    {...props}
  >
    <div className="flex items-center space-x-4">
      <SkeletonAvatar size="lg" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
    <SkeletonText lines={3} />
    <div className="flex space-x-2">
      <SkeletonButton size="sm" />
      <SkeletonButton size="sm" />
    </div>
  </Skeleton>
)

export const SkeletonTable = ({ rows = 5, columns = 4, className, ...props }) => (
  <div className={cn('space-y-3', className)} {...props}>
    {/* Header */}
    <div className="flex space-x-4">
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={index} className="h-4 flex-1" />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} className="h-8 flex-1" />
        ))}
      </div>
    ))}
  </div>
)

export const SkeletonList = ({ items = 5, showAvatar = true, className, ...props }) => (
  <div className={cn('space-y-4', className)} {...props}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4">
        {showAvatar && <SkeletonAvatar />}
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
)

export const SkeletonChart = ({ className, ...props }) => (
  <Skeleton
    variant="card"
    className={cn('p-6', className)}
    {...props}
  >
    <div className="space-y-4">
      <Skeleton className="h-6 w-1/3" />
      <div className="flex items-end space-x-2 h-32">
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton
            key={index}
            className="flex-1"
            style={{ height: `${Math.random() * 80 + 20}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between">
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton key={index} className="h-3 w-8" />
        ))}
      </div>
    </div>
  </Skeleton>
)

// Dashboard-specific skeleton components
export const SkeletonStatCard = ({ className, ...props }) => (
  <Skeleton
    variant="card"
    className={cn('p-4 space-y-3', className)}
    {...props}
  >
    {/* Header with icon and badge */}
    <div className="flex items-center justify-between">
      <Skeleton className="w-8 h-8 rounded-lg" />
      <Skeleton className="h-5 w-12 rounded-full" />
    </div>

    {/* Content */}
    <div className="space-y-1">
      <Skeleton className="h-3 w-20" />
      <div className="flex items-baseline gap-1">
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-3 w-8" />
      </div>
      <Skeleton className="h-3 w-24" />
    </div>
  </Skeleton>
)

export const SkeletonFeatureCard = ({ className, ...props }) => (
  <Skeleton
    variant="card"
    className={cn('p-6 space-y-4', className)}
    {...props}
  >
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-5 w-12 rounded-full" />
    </div>

    {/* Description */}
    <SkeletonText lines={2} />

    {/* Usage bar (optional) */}
    <div className="space-y-2">
      <div className="flex justify-between">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-8" />
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  </Skeleton>
)

export const SkeletonInsightCard = ({ className, ...props }) => (
  <Skeleton
    variant="card"
    className={cn('p-4 space-y-3', className)}
    {...props}
  >
    {/* Header */}
    <div className="flex items-center gap-2">
      <Skeleton className="w-8 h-8 rounded-lg" />
      <Skeleton className="h-4 w-20" />
    </div>

    {/* Content rows */}
    <div className="space-y-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex justify-between items-center">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
      <Skeleton className="h-1.5 w-full rounded-full" />
      <Skeleton className="h-3 w-32" />
    </div>
  </Skeleton>
)

export const SkeletonDashboard = ({ className, ...props }) => (
  <div className={cn('min-h-screen bg-gray-50 dark:bg-neutral-950', className)} {...props}>
    {/* Header */}
    <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-12 w-24 rounded-2xl" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-2 overflow-x-auto pb-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-24 rounded-xl flex-shrink-0" />
          ))}
        </div>
      </div>
    </div>

    {/* Main Content */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Stats Overview Header */}
        <div className="text-center space-y-2">
          <Skeleton className="h-6 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonStatCard key={index} />
          ))}
        </div>

        {/* Quick Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonInsightCard />
          <SkeletonInsightCard />
        </div>

        {/* Feature Categories */}
        <div className="space-y-12">
          {Array.from({ length: 3 }).map((_, categoryIndex) => (
            <div key={categoryIndex} className="space-y-6">
              {/* Category Header */}
              <div className="text-center space-y-2">
                <Skeleton className="h-8 w-48 mx-auto" />
                <Skeleton className="h-4 w-96 mx-auto" />
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: categoryIndex === 0 ? 4 : categoryIndex === 1 ? 3 : 2 }).map((_, featureIndex) => (
                  <SkeletonFeatureCard key={featureIndex} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tips Panel */}
        <Skeleton variant="card" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="w-5 h-5" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-start gap-2">
                <Skeleton className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </Skeleton>
      </div>
    </div>
  </div>
)

// Loading wrapper component
// Repository-specific skeleton components
export const SkeletonRepository = ({ className, ...props }) => (
  <Skeleton
    variant="card"
    className={cn('p-4 space-y-3', className)}
    {...props}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
    <SkeletonText lines={2} />
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <Skeleton className="w-3 h-3 rounded-full" />
          <Skeleton className="h-3 w-8" />
        </div>
        <div className="flex items-center space-x-1">
          <Skeleton className="w-3 h-3" />
          <Skeleton className="h-3 w-6" />
        </div>
      </div>
      <Skeleton className="h-8 w-20 rounded-lg" />
    </div>
  </Skeleton>
)

export const SkeletonRepositoryGrid = ({ count = 6, className, ...props }) => (
  <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)} {...props}>
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonRepository key={index} />
    ))}
  </div>
)

export const SkeletonBackfillForm = ({ className, ...props }) => (
  <Skeleton
    variant="card"
    className={cn('p-6 space-y-6', className)}
    {...props}
  >
    <div className="space-y-2">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-4 w-64" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>

    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <div className="flex space-x-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>

    <div className="flex space-x-3">
      <Skeleton className="h-10 w-32 rounded-lg" />
      <Skeleton className="h-10 w-24 rounded-lg" />
    </div>
  </Skeleton>
)

export const SkeletonWrapper = ({
  loading,
  skeleton,
  children,
  className,
  ...props
}) => {
  if (loading) {
    return (
      <div className={cn('animate-pulse', className)} {...props}>
        {skeleton}
      </div>
    )
  }

  return children
}

export default Skeleton
export { Skeleton }
