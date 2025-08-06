import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

const Progress = forwardRef(({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'primary',
  showValue = false,
  animated = true,
  striped = false,
  className,
  ...props
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const sizes = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-6'
  }

  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600',
    secondary: 'bg-gradient-to-r from-secondary-500 to-secondary-600',
    success: 'bg-gradient-to-r from-green-500 to-green-600',
    warning: 'bg-gradient-to-r from-orange-500 to-orange-600',
    error: 'bg-gradient-to-r from-red-500 to-red-600',
    info: 'bg-gradient-to-r from-blue-500 to-blue-600'
  }

  const backgroundVariants = {
    primary: 'bg-primary-100 dark:bg-primary-900/20',
    secondary: 'bg-secondary-100 dark:bg-secondary-900/20',
    success: 'bg-green-100 dark:bg-green-900/20',
    warning: 'bg-orange-100 dark:bg-orange-900/20',
    error: 'bg-red-100 dark:bg-red-900/20',
    info: 'bg-blue-100 dark:bg-blue-900/20'
  }

  return (
    <div className="w-full">
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-full',
          sizes[size],
          backgroundVariants[variant],
          className
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        {...props}
      >
        <div
          className={cn(
            'h-full transition-all duration-500 ease-out rounded-full',
            variants[variant],
            animated && 'transition-all duration-500 ease-out',
            striped && 'bg-stripes',
            percentage === 100 && 'shadow-glow'
          )}
          style={{ width: `${percentage}%` }}
        >
          {striped && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          )}
        </div>
        
        {animated && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/4 animate-shimmer" />
        )}
      </div>
      
      {showValue && (
        <div className="flex justify-between items-center mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          <span>{Math.round(percentage)}%</span>
          <span>{value} / {max}</span>
        </div>
      )}
    </div>
  )
})

Progress.displayName = 'Progress'

// Circular Progress Component
export const CircularProgress = forwardRef(({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'primary',
  showValue = false,
  strokeWidth,
  className,
  ...props
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  const sizes = {
    xs: { width: 24, height: 24, stroke: 2 },
    sm: { width: 32, height: 32, stroke: 2 },
    md: { width: 48, height: 48, stroke: 3 },
    lg: { width: 64, height: 64, stroke: 4 },
    xl: { width: 96, height: 96, stroke: 6 }
  }

  const sizeConfig = sizes[size]
  const radius = (sizeConfig.width - (strokeWidth || sizeConfig.stroke)) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const variants = {
    primary: 'stroke-primary-600',
    secondary: 'stroke-secondary-600',
    success: 'stroke-green-600',
    warning: 'stroke-orange-600',
    error: 'stroke-red-600',
    info: 'stroke-blue-600'
  }

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        ref={ref}
        width={sizeConfig.width}
        height={sizeConfig.height}
        className="transform -rotate-90"
        {...props}
      >
        {/* Background circle */}
        <circle
          cx={sizeConfig.width / 2}
          cy={sizeConfig.height / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth || sizeConfig.stroke}
          fill="none"
          className="text-neutral-200 dark:text-neutral-700"
        />
        {/* Progress circle */}
        <circle
          cx={sizeConfig.width / 2}
          cy={sizeConfig.height / 2}
          r={radius}
          strokeWidth={strokeWidth || sizeConfig.stroke}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn(
            'transition-all duration-500 ease-out',
            variants[variant]
          )}
        />
      </svg>
      
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-neutral-900 dark:text-white">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  )
})

CircularProgress.displayName = 'CircularProgress'

// Step Progress Component
export const StepProgress = ({ steps, currentStep, variant = 'primary', className }) => {
  const variants = {
    primary: {
      active: 'bg-primary-600 border-primary-600 text-white',
      completed: 'bg-primary-600 border-primary-600 text-white',
      pending: 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 text-neutral-500 dark:text-neutral-400',
      line: 'bg-primary-600'
    },
    secondary: {
      active: 'bg-secondary-600 border-secondary-600 text-white',
      completed: 'bg-secondary-600 border-secondary-600 text-white',
      pending: 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 text-neutral-500 dark:text-neutral-400',
      line: 'bg-secondary-600'
    }
  }

  const config = variants[variant]

  return (
    <div className={cn('flex items-center', className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isActive = index === currentStep
        const isPending = index > currentStep

        return (
          <div key={step.id || index} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-300',
                  isCompleted && config.completed,
                  isActive && config.active,
                  isPending && config.pending
                )}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              {step.label && (
                <span className="mt-2 text-xs text-center text-neutral-600 dark:text-neutral-400">
                  {step.label}
                </span>
              )}
            </div>
            
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-4 bg-neutral-200 dark:bg-neutral-700 relative">
                <div
                  className={cn(
                    'h-full transition-all duration-500',
                    isCompleted ? config.line : 'bg-transparent'
                  )}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Progress
export { Progress }
