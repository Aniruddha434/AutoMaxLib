import React from 'react'

const badgeVariants = {
  default: 'bg-primary-600 text-white hover:bg-primary-700 shadow-soft',
  secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 shadow-soft',
  destructive: 'bg-error-500 text-white hover:bg-error-600 shadow-soft',
  outline: 'border border-primary-200 text-primary-700 hover:bg-primary-50 dark:border-primary-700 dark:text-primary-300 dark:hover:bg-primary-950/20',
  success: 'bg-accent-500 text-white hover:bg-accent-600 shadow-soft',
  warning: 'bg-warning-500 text-white hover:bg-warning-600 shadow-soft',
  info: 'bg-primary-500 text-white hover:bg-primary-600 shadow-soft',
  neutral: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
}

const badgeSizes = {
  sm: 'px-3 py-1 text-xs',
  default: 'px-4 py-1.5 text-sm',
  lg: 'px-5 py-2 text-base'
}

export const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'default',
  className = '', 
  ...props 
}) => {
  const variantClasses = badgeVariants[variant] || badgeVariants.default
  const sizeClasses = badgeSizes[size] || badgeSizes.default

  return (
    <span
      className={`inline-flex items-center font-medium rounded-2xl transition-all duration-200 hover:scale-105 transform ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
