import { forwardRef, useState } from 'react'
import { cn } from '../../utils/cn'

const Button = forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  children,
  disabled,
  loading,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  ripple = true,
  ...props
}, ref) => {
  const [isPressed, setIsPressed] = useState(false)

  const handleMouseDown = () => setIsPressed(true)
  const handleMouseUp = () => setIsPressed(false)
  const handleMouseLeave = () => setIsPressed(false)

  const baseClasses = `
    relative inline-flex items-center justify-center font-medium
    transition-all duration-300 ease-out focus:outline-none
    focus-visible:ring-2 focus-visible:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    disabled:transform-none disabled:hover:scale-100
    overflow-hidden group
    ${fullWidth ? 'w-full' : ''}
    ${isPressed ? 'scale-95' : 'hover:scale-105 active:scale-95'}
  `

  const variants = {
    primary: `
      bg-gradient-to-r from-primary-600 to-primary-700
      hover:from-primary-700 hover:to-primary-800
      text-white focus-visible:ring-primary-500
      shadow-elegant hover:shadow-glow
      before:absolute before:inset-0 before:bg-white/20
      before:translate-x-[-100%] before:transition-transform
      before:duration-500 hover:before:translate-x-0
    `,
    secondary: `
      bg-gradient-to-r from-secondary-500 to-secondary-600
      hover:from-secondary-600 hover:to-secondary-700
      text-white focus-visible:ring-secondary-500
      shadow-elegant hover:shadow-glow-secondary
      before:absolute before:inset-0 before:bg-white/20
      before:translate-x-[-100%] before:transition-transform
      before:duration-500 hover:before:translate-x-0
    `,
    outline: `
      border-2 border-primary-300 dark:border-primary-600
      bg-transparent hover:bg-primary-50 dark:hover:bg-primary-950/20
      text-primary-700 dark:text-primary-300
      focus-visible:ring-primary-500 hover:border-primary-500
      hover:shadow-soft
    `,
    ghost: `
      bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800
      text-neutral-700 dark:text-neutral-300
      focus-visible:ring-neutral-500 hover:shadow-soft
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-red-700
      hover:from-red-700 hover:to-red-800
      text-white focus-visible:ring-red-500
      shadow-elegant hover:shadow-lg
      before:absolute before:inset-0 before:bg-white/20
      before:translate-x-[-100%] before:transition-transform
      before:duration-500 hover:before:translate-x-0
    `,
    success: `
      bg-gradient-to-r from-accent-600 to-accent-700
      hover:from-accent-700 hover:to-accent-800
      text-white focus-visible:ring-accent-500
      shadow-elegant hover:shadow-glow-accent
      before:absolute before:inset-0 before:bg-white/20
      before:translate-x-[-100%] before:transition-transform
      before:duration-500 hover:before:translate-x-0
    `,
    glass: `
      bg-white/10 dark:bg-white/5 backdrop-blur-xl
      border border-white/20 dark:border-white/10
      text-neutral-900 dark:text-white
      hover:bg-white/20 dark:hover:bg-white/10
      focus-visible:ring-white/50 shadow-elegant
    `
  }

  const sizes = {
    xs: 'px-3 py-1.5 text-xs rounded-lg gap-1',
    sm: 'px-4 py-2 text-sm rounded-xl gap-2',
    md: 'px-6 py-3 text-sm rounded-2xl gap-2',
    lg: 'px-8 py-4 text-base rounded-2xl gap-3',
    xl: 'px-10 py-5 text-lg rounded-2xl gap-3'
  }

  const iconSizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6'
  }

  const LoadingSpinner = () => (
    <svg
      className={`animate-spin ${iconSizes[size]}`}
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <LoadingSpinner />
          <span className="relative z-10">Loading...</span>
        </>
      )
    }

    const iconElement = icon && (
      <span className={`relative z-10 ${iconSizes[size]}`}>
        {icon}
      </span>
    )

    const textElement = (
      <span className="relative z-10">{children}</span>
    )

    if (!icon) return textElement

    return iconPosition === 'right' ? (
      <>
        {textElement}
        {iconElement}
      </>
    ) : (
      <>
        {iconElement}
        {textElement}
      </>
    )
  }

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={disabled || loading}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      aria-busy={loading}
      {...props}
    >
      {renderContent()}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
export { Button }
