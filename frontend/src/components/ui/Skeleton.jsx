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

export const SkeletonDashboard = ({ className, ...props }) => (
  <div className={cn('space-y-6', className)} {...props}>
    {/* Header */}
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-48" />
      <SkeletonButton />
    </div>
    
    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} variant="card" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <SkeletonAvatar size="sm" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-6 w-16 mb-2" />
          <Skeleton className="h-3 w-20" />
        </Skeleton>
      ))}
    </div>
    
    {/* Main Content */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <SkeletonChart />
      </div>
      <div>
        <SkeletonCard />
      </div>
    </div>
  </div>
)

// Loading wrapper component
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
