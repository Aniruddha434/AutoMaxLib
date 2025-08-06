import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

const LoadingSpinner = forwardRef(({
  size = 'md',
  text = 'Loading...',
  variant = 'primary',
  type = 'spinner',
  className,
  ...props
}, ref) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const variants = {
    primary: 'border-primary-200 dark:border-primary-800 border-t-primary-600',
    secondary: 'border-secondary-200 dark:border-secondary-800 border-t-secondary-600',
    white: 'border-white/30 border-t-white',
    neutral: 'border-neutral-200 dark:border-neutral-700 border-t-neutral-600'
  }

  const SpinnerComponent = () => {
    switch (type) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'rounded-full bg-current animate-pulse',
                  size === 'xs' ? 'w-1 h-1' :
                  size === 'sm' ? 'w-1.5 h-1.5' :
                  size === 'md' ? 'w-2 h-2' :
                  size === 'lg' ? 'w-3 h-3' : 'w-4 h-4'
                )}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.4s'
                }}
              />
            ))}
          </div>
        )

      case 'pulse':
        return (
          <div
            className={cn(
              'rounded-full bg-current animate-ping',
              sizeClasses[size]
            )}
          />
        )

      case 'bars':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  'bg-current animate-pulse',
                  size === 'xs' ? 'w-0.5 h-3' :
                  size === 'sm' ? 'w-0.5 h-4' :
                  size === 'md' ? 'w-1 h-6' :
                  size === 'lg' ? 'w-1 h-8' : 'w-1.5 h-10'
                )}
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '1.2s'
                }}
              />
            ))}
          </div>
        )

      default:
        return (
          <div
            className={cn(
              'animate-spin rounded-full border-4',
              sizeClasses[size],
              variants[variant]
            )}
          />
        )
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-center justify-center',
        !text ? 'p-4' : 'p-8',
        className
      )}
      {...props}
    >
      <div className={cn(
        variant === 'primary' ? 'text-primary-600' :
        variant === 'secondary' ? 'text-secondary-600' :
        variant === 'white' ? 'text-white' :
        'text-neutral-600 dark:text-neutral-400'
      )}>
        <SpinnerComponent />
      </div>

      {text && (
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
})

LoadingSpinner.displayName = 'LoadingSpinner'

// Inline spinner for buttons and small spaces
export const InlineSpinner = ({ size = 'sm', variant = 'primary', className, ...props }) => {
  const variants = {
    primary: 'border-primary-200 dark:border-primary-800 border-t-primary-600',
    secondary: 'border-secondary-200 dark:border-secondary-800 border-t-secondary-600',
    white: 'border-white/30 border-t-white',
    neutral: 'border-neutral-200 dark:border-neutral-700 border-t-neutral-600'
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2',
        size === 'xs' ? 'w-3 h-3' :
        size === 'sm' ? 'w-4 h-4' :
        size === 'md' ? 'w-5 h-5' : 'w-6 h-6',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

// Full page loading overlay
export const LoadingOverlay = ({
  text = 'Loading...',
  variant = 'primary',
  backdrop = true,
  className,
  ...props
}) => (
  <div
    className={cn(
      'fixed inset-0 z-50 flex items-center justify-center',
      backdrop && 'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm',
      className
    )}
    {...props}
  >
    <div className="text-center">
      <LoadingSpinner size="lg" variant={variant} text={text} />
    </div>
  </div>
)

export default LoadingSpinner
