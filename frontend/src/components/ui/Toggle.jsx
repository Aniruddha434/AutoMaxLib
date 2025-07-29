import { forwardRef } from 'react'

const Toggle = forwardRef(({
  checked = false,
  onChange,
  disabled = false,
  size = 'default',
  color = 'primary',
  label,
  description,
  className = '',
  ...props
}, ref) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'w-8 h-5',
          thumb: 'w-3 h-3',
          translate: 'translate-x-3'
        }
      case 'lg':
        return {
          container: 'w-14 h-8',
          thumb: 'w-6 h-6',
          translate: 'translate-x-6'
        }
      default:
        return {
          container: 'w-11 h-6',
          thumb: 'w-4 h-4',
          translate: 'translate-x-5'
        }
    }
  }

  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return checked 
          ? 'bg-green-600 border-green-600' 
          : 'bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600'
      case 'blue':
        return checked 
          ? 'bg-blue-600 border-blue-600' 
          : 'bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600'
      case 'purple':
        return checked 
          ? 'bg-purple-600 border-purple-600' 
          : 'bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600'
      default:
        return checked 
          ? 'bg-primary-600 border-primary-600' 
          : 'bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600'
    }
  }

  const sizes = getSizeClasses()
  const colors = getColorClasses()

  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(!checked)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          relative inline-flex items-center border-2 rounded-full transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-neutral-900
          ${sizes.container}
          ${colors}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-medium'}
        `}
        {...props}
      >
        <span
          className={`
            inline-block bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out
            ${sizes.thumb}
            ${checked ? sizes.translate : 'translate-x-0.5'}
          `}
        />
      </button>
      
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                {label}
              </span>
              {disabled && (
                <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full font-medium">
                  Premium
                </span>
              )}
            </div>
          )}
          {description && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  )
})

Toggle.displayName = 'Toggle'

// Toggle Group Component for multiple related toggles
export const ToggleGroup = ({ children, className = '', title, description, ...props }) => (
  <div className={`space-y-4 ${className}`} {...props}>
    {(title || description) && (
      <div className="mb-6">
        {title && (
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {description}
          </p>
        )}
      </div>
    )}
    <div className="space-y-4">
      {children}
    </div>
  </div>
)

export default Toggle
