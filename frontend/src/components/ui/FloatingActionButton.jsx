import { forwardRef, useState } from 'react'
import { cn } from '../../utils/cn'
import { Plus, X } from 'lucide-react'

const FloatingActionButton = forwardRef(({
  icon: Icon = Plus,
  onClick,
  className,
  variant = 'primary',
  size = 'md',
  position = 'bottom-right',
  tooltip,
  children,
  ...props
}, ref) => {
  const [showTooltip, setShowTooltip] = useState(false)

  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-glow hover:shadow-glow-lg',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white shadow-glow-secondary',
    accent: 'bg-accent-600 hover:bg-accent-700 text-white shadow-glow-accent',
    neutral: 'bg-neutral-600 hover:bg-neutral-700 text-white shadow-elegant',
    white: 'bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 shadow-elegant'
  }

  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  }

  const iconSizes = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-7 w-7'
  }

  const positions = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-20 right-6',
    'top-left': 'fixed top-20 left-6'
  }

  const handleMouseEnter = () => setShowTooltip(true)
  const handleMouseLeave = () => setShowTooltip(false)

  return (
    <div className="relative">
      <button
        ref={ref}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'rounded-full flex items-center justify-center',
          'transition-all duration-300 ease-out',
          'hover:scale-110 active:scale-95 transform',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
          'z-50',
          positions[position],
          sizes[size],
          variants[variant],
          className
        )}
        aria-label={tooltip || 'Floating action button'}
        {...props}
      >
        <Icon className={cn('transition-transform duration-200', iconSizes[size])} />
      </button>

      {/* Tooltip */}
      {tooltip && showTooltip && (
        <div className={cn(
          'absolute z-50 px-3 py-2 text-sm text-white bg-neutral-900 dark:bg-neutral-700 rounded-lg shadow-lg',
          'transition-all duration-200 transform',
          'pointer-events-none whitespace-nowrap',
          position.includes('right') ? 'right-full mr-3' : 'left-full ml-3',
          position.includes('bottom') ? 'bottom-0' : 'top-0'
        )}>
          {tooltip}
          <div className={cn(
            'absolute w-2 h-2 bg-neutral-900 dark:bg-neutral-700 transform rotate-45',
            position.includes('right') ? 'right-[-4px]' : 'left-[-4px]',
            position.includes('bottom') ? 'bottom-3' : 'top-3'
          )} />
        </div>
      )}
    </div>
  )
})

FloatingActionButton.displayName = 'FloatingActionButton'

// Speed Dial FAB Component
export const SpeedDialFAB = forwardRef(({
  mainIcon: MainIcon = Plus,
  actions = [],
  onMainClick,
  className,
  variant = 'primary',
  size = 'md',
  position = 'bottom-right',
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    setIsOpen(!isOpen)
    onMainClick?.()
  }

  const handleActionClick = (action) => {
    action.onClick?.()
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Action Buttons */}
      {isOpen && actions.map((action, index) => {
        const ActionIcon = action.icon
        const offset = (index + 1) * 60

        return (
          <FloatingActionButton
            key={action.label}
            icon={ActionIcon}
            onClick={() => handleActionClick(action)}
            tooltip={action.label}
            variant="white"
            size="sm"
            className={cn(
              'transition-all duration-300 ease-out',
              position.includes('bottom') ? `bottom-[${offset + 24}px]` : `top-[${offset + 80}px]`,
              position.includes('right') ? 'right-6' : 'left-6',
              'animate-scale-in'
            )}
            style={{
              animationDelay: `${index * 50}ms`,
              [position.includes('bottom') ? 'bottom' : 'top']: `${offset + (position.includes('bottom') ? 24 : 80)}px`
            }}
          />
        )
      })}

      {/* Main FAB */}
      <FloatingActionButton
        ref={ref}
        icon={isOpen ? X : MainIcon}
        onClick={handleToggle}
        variant={variant}
        size={size}
        position={position}
        className={cn(
          'z-50',
          isOpen && 'rotate-45',
          className
        )}
        {...props}
      />
    </div>
  )
})

SpeedDialFAB.displayName = 'SpeedDialFAB'

// Notification FAB Component
export const NotificationFAB = forwardRef(({
  count = 0,
  maxCount = 99,
  showZero = false,
  ...props
}, ref) => {
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString()
  const shouldShow = showZero || count > 0

  return (
    <div className="relative">
      <FloatingActionButton ref={ref} {...props} />
      
      {shouldShow && (
        <div className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center px-1 shadow-lg animate-pulse">
          {displayCount}
        </div>
      )}
    </div>
  )
})

NotificationFAB.displayName = 'NotificationFAB'

// Progress FAB Component
export const ProgressFAB = forwardRef(({
  progress = 0,
  showProgress = true,
  strokeWidth = 3,
  ...props
}, ref) => {
  const radius = 28 - strokeWidth
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative">
      <FloatingActionButton ref={ref} {...props} />
      
      {showProgress && (
        <svg
          className="absolute inset-0 w-full h-full transform -rotate-90"
          viewBox="0 0 56 56"
        >
          <circle
            cx="28"
            cy="28"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-white/20"
          />
          <circle
            cx="28"
            cy="28"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-white transition-all duration-300"
          />
        </svg>
      )}
    </div>
  )
})

ProgressFAB.displayName = 'ProgressFAB'

export default FloatingActionButton
export { FloatingActionButton }
