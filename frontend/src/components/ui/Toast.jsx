import React, { useState, useEffect, forwardRef, useContext } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../utils/cn'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

// Toast Context and Provider
const ToastContext = React.createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = (toast) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { id, ...toast }
    setToasts(prev => [...prev, newToast])

    // Auto remove after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration || 5000)
    }

    return id
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const removeAllToasts = () => {
    setToasts([])
  }

  return (
    <ToastContext.Provider value={{ addToast, removeToast, removeAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

// Toast Container
const ToastContainer = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null

  return createPortal(
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => onRemove(toast.id)}
          style={{
            animationDelay: `${index * 100}ms`
          }}
        />
      ))}
    </div>,
    document.body
  )
}

// Individual Toast Component
const Toast = forwardRef(({
  title,
  description,
  variant = 'default',
  action,
  onClose,
  className,
  ...props
}, ref) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose?.()
    }, 300)
  }

  const variants = {
    default: {
      container: 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700',
      icon: null,
      iconColor: ''
    },
    success: {
      container: 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-600 dark:text-green-400'
    },
    error: {
      container: 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800',
      icon: AlertCircle,
      iconColor: 'text-red-600 dark:text-red-400'
    },
    warning: {
      container: 'bg-orange-50 dark:bg-orange-950/50 border-orange-200 dark:border-orange-800',
      icon: AlertTriangle,
      iconColor: 'text-orange-600 dark:text-orange-400'
    },
    info: {
      container: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800',
      icon: Info,
      iconColor: 'text-blue-600 dark:text-blue-400'
    }
  }

  const config = variants[variant]
  const IconComponent = config.icon

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex items-start gap-3 p-4 rounded-2xl border shadow-elegant backdrop-blur-sm',
        'transform transition-all duration-300 ease-out',
        isVisible && !isExiting ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95',
        isExiting && 'translate-x-full opacity-0 scale-95',
        config.container,
        className
      )}
      {...props}
    >
      {IconComponent && (
        <div className={cn('flex-shrink-0 mt-0.5', config.iconColor)}>
          <IconComponent className="h-5 w-5" />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        {title && (
          <div className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
            {title}
          </div>
        )}
        {description && (
          <div className="text-sm text-neutral-600 dark:text-neutral-300">
            {description}
          </div>
        )}
        {action && (
          <div className="mt-3">
            {action}
          </div>
        )}
      </div>

      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-200"
        aria-label="Close notification"
      >
        <X className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
      </button>
    </div>
  )
})

Toast.displayName = 'Toast'

// Convenience functions
export const toast = {
  success: (title, description, options = {}) => {
    const { addToast } = useToast()
    return addToast({ title, description, variant: 'success', ...options })
  },
  error: (title, description, options = {}) => {
    const { addToast } = useToast()
    return addToast({ title, description, variant: 'error', ...options })
  },
  warning: (title, description, options = {}) => {
    const { addToast } = useToast()
    return addToast({ title, description, variant: 'warning', ...options })
  },
  info: (title, description, options = {}) => {
    const { addToast } = useToast()
    return addToast({ title, description, variant: 'info', ...options })
  },
  default: (title, description, options = {}) => {
    const { addToast } = useToast()
    return addToast({ title, description, variant: 'default', ...options })
  }
}

export default Toast
export { Toast, ToastContainer }
