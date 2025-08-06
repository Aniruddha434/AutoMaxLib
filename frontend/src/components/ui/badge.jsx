import React, { forwardRef } from 'react'
import { cn } from '../../utils/cn'

const Badge = forwardRef(({
  children,
  variant = 'default',
  size = 'default',
  shape = 'rounded',
  dot = false,
  icon,
  removable = false,
  onRemove,
  className = '',
  ...props
}, ref) => {
  const badgeVariants = {
    default: 'bg-primary-600 text-white hover:bg-primary-700 shadow-soft',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 shadow-soft',
    destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-soft',
    outline: 'border border-primary-200 text-primary-700 hover:bg-primary-50 dark:border-primary-700 dark:text-primary-300 dark:hover:bg-primary-950/20',
    success: 'bg-green-500 text-white hover:bg-green-600 shadow-soft',
    warning: 'bg-orange-500 text-white hover:bg-orange-600 shadow-soft',
    info: 'bg-blue-500 text-white hover:bg-blue-600 shadow-soft',
    neutral: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700',
    ghost: 'bg-transparent text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800',
    gradient: 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-glow'
  }

  const badgeSizes = {
    xs: 'px-2 py-0.5 text-xs gap-1',
    sm: 'px-3 py-1 text-xs gap-1',
    default: 'px-4 py-1.5 text-sm gap-2',
    lg: 'px-5 py-2 text-base gap-2'
  }

  const shapes = {
    rounded: 'rounded-2xl',
    square: 'rounded-lg',
    pill: 'rounded-full'
  }

  const iconSizes = {
    xs: 'h-3 w-3',
    sm: 'h-3 w-3',
    default: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  const variantClasses = badgeVariants[variant] || badgeVariants.default
  const sizeClasses = badgeSizes[size] || badgeSizes.default
  const shapeClasses = shapes[shape] || shapes.rounded

  const handleRemove = (e) => {
    e.stopPropagation()
    onRemove?.(e)
  }

  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center font-medium transition-all duration-200 hover:scale-105 transform relative',
        variantClasses,
        sizeClasses,
        shapeClasses,
        className
      )}
      {...props}
    >
      {dot && (
        <span className="w-2 h-2 bg-current rounded-full mr-2 animate-pulse" />
      )}

      {icon && (
        <span className={cn('flex-shrink-0', iconSizes[size])}>
          {icon}
        </span>
      )}

      <span className="flex-1">{children}</span>

      {removable && (
        <button
          onClick={handleRemove}
          className="ml-1 flex-shrink-0 hover:bg-black/10 rounded-full p-0.5 transition-colors"
          aria-label="Remove badge"
        >
          <svg className={iconSizes[size]} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </span>
  )
})

Badge.displayName = 'Badge'

// Status Badge Component
export const StatusBadge = ({ status, className, ...props }) => {
  const statusConfig = {
    online: { variant: 'success', dot: true, children: 'Online' },
    offline: { variant: 'neutral', dot: true, children: 'Offline' },
    away: { variant: 'warning', dot: true, children: 'Away' },
    busy: { variant: 'destructive', dot: true, children: 'Busy' },
    active: { variant: 'success', children: 'Active' },
    inactive: { variant: 'neutral', children: 'Inactive' },
    pending: { variant: 'warning', children: 'Pending' },
    completed: { variant: 'success', children: 'Completed' },
    failed: { variant: 'destructive', children: 'Failed' },
    draft: { variant: 'neutral', children: 'Draft' },
    published: { variant: 'success', children: 'Published' }
  }

  const config = statusConfig[status] || { variant: 'neutral', children: status }

  return (
    <Badge
      className={className}
      {...config}
      {...props}
    />
  )
}

// Notification Badge Component
export const NotificationBadge = ({ count, max = 99, className, ...props }) => {
  if (!count || count <= 0) return null

  const displayCount = count > max ? `${max}+` : count.toString()

  return (
    <Badge
      variant="destructive"
      size="xs"
      shape="pill"
      className={cn('absolute -top-1 -right-1 min-w-[1.25rem] h-5 flex items-center justify-center', className)}
      {...props}
    >
      {displayCount}
    </Badge>
  )
}

export { Badge }
export default Badge
