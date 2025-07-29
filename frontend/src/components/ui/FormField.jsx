import { forwardRef } from 'react'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

const FormField = forwardRef(({
  label,
  error,
  hint,
  required = false,
  type = 'text',
  className = '',
  labelClassName = '',
  inputClassName = '',
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  const baseInputClasses = `
    w-full px-4 py-3 rounded-xl border transition-all duration-200
    placeholder-neutral-400 dark:placeholder-neutral-500
    focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-900
    disabled:opacity-50 disabled:cursor-not-allowed
    ${Icon ? 'pl-12' : ''}
    ${isPassword || RightIcon ? 'pr-12' : ''}
  `

  const getInputClasses = () => {
    if (error) {
      return `${baseInputClasses} border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10 
              text-red-900 dark:text-red-100 focus:ring-red-500 focus:border-red-500`
    }
    
    if (isFocused) {
      return `${baseInputClasses} border-primary-500 bg-white dark:bg-neutral-800 
              text-neutral-900 dark:text-neutral-100 focus:ring-primary-500 focus:border-primary-500
              shadow-medium`
    }

    return `${baseInputClasses} border-neutral-300 dark:border-neutral-600 
            bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 
            hover:border-neutral-400 dark:hover:border-neutral-500
            focus:ring-primary-500 focus:border-primary-500 shadow-sm hover:shadow-medium`
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className={`block text-sm font-semibold text-neutral-700 dark:text-neutral-300 ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            <Icon className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          className={`${getInputClasses()} ${inputClassName}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {(isPassword || RightIcon) && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            {isPassword ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            ) : RightIcon ? (
              <button
                type="button"
                onClick={onRightIconClick}
                className="text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors"
                tabIndex={-1}
              >
                <RightIcon className="w-5 h-5" />
              </button>
            ) : null}
          </div>
        )}
      </div>
      
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {hint && !error && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {hint}
        </p>
      )}
    </div>
  )
})

FormField.displayName = 'FormField'

// Textarea variant
export const TextareaField = forwardRef(({
  label,
  error,
  hint,
  required = false,
  className = '',
  labelClassName = '',
  textareaClassName = '',
  rows = 4,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false)

  const baseTextareaClasses = `
    w-full px-4 py-3 rounded-xl border transition-all duration-200
    placeholder-neutral-400 dark:placeholder-neutral-500
    focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-900
    disabled:opacity-50 disabled:cursor-not-allowed resize-none
  `

  const getTextareaClasses = () => {
    if (error) {
      return `${baseTextareaClasses} border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10 
              text-red-900 dark:text-red-100 focus:ring-red-500 focus:border-red-500`
    }
    
    if (isFocused) {
      return `${baseTextareaClasses} border-primary-500 bg-white dark:bg-neutral-800 
              text-neutral-900 dark:text-neutral-100 focus:ring-primary-500 focus:border-primary-500
              shadow-medium`
    }

    return `${baseTextareaClasses} border-neutral-300 dark:border-neutral-600 
            bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 
            hover:border-neutral-400 dark:hover:border-neutral-500
            focus:ring-primary-500 focus:border-primary-500 shadow-sm hover:shadow-medium`
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className={`block text-sm font-semibold text-neutral-700 dark:text-neutral-300 ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        rows={rows}
        className={`${getTextareaClasses()} ${textareaClassName}`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {hint && !error && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {hint}
        </p>
      )}
    </div>
  )
})

TextareaField.displayName = 'TextareaField'

export default FormField
