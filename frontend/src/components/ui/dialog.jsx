import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

const DialogContext = createContext()

export const Dialog = ({ children, open, onOpenChange, modal = true }) => {
  const [isOpen, setIsOpen] = useState(open || false)

  useEffect(() => {
    setIsOpen(open || false)
  }, [open])

  const handleOpenChange = (newOpen) => {
    setIsOpen(newOpen)
    if (onOpenChange) {
      onOpenChange(newOpen)
    }
  }

  useEffect(() => {
    if (isOpen && modal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, modal])

  return (
    <DialogContext.Provider value={{ isOpen, onOpenChange: handleOpenChange, modal }}>
      {children}
    </DialogContext.Provider>
  )
}

export const DialogContent = ({
  children,
  className = '',
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  ...props
}) => {
  const { isOpen, onOpenChange, modal } = useContext(DialogContext)
  const contentRef = useRef(null)

  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onOpenChange(false)
    }
  }

  const handleKeyDown = (e) => {
    if (closeOnEscape && e.key === 'Escape') {
      onOpenChange(false)
    }
  }

  useEffect(() => {
    if (closeOnEscape && isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeOnEscape, isOpen])

  // Focus management
  useEffect(() => {
    if (isOpen && contentRef.current) {
      const focusableElements = contentRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements.length > 0) {
        focusableElements[0].focus()
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizes = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
    full: 'max-w-[95vw] max-h-[95vh]'
  }

  const dialogContent = (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'bg-black/50 backdrop-blur-sm',
        'animate-fade-in'
      )}
      onClick={handleBackdropClick}
    >
      <div
        ref={contentRef}
        className={cn(
          'relative bg-white dark:bg-neutral-800 rounded-2xl shadow-floating',
          'border border-neutral-200 dark:border-neutral-700',
          'w-full animate-scale-in',
          'max-h-[90vh] overflow-hidden flex flex-col',
          sizes[size],
          className
        )}
        role="dialog"
        aria-modal="true"
        {...props}
      >
        {showCloseButton && (
          <button
            onClick={() => onOpenChange(false)}
            className={cn(
              'absolute top-4 right-4 z-10 p-2 rounded-xl',
              'hover:bg-neutral-100 dark:hover:bg-neutral-700',
              'transition-all duration-200 hover:scale-110 transform',
              'focus:outline-none focus:ring-2 focus:ring-primary-500'
            )}
            aria-label="Close dialog"
          >
            <X className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          </button>
        )}
        {children}
      </div>
    </div>
  )

  return modal ? createPortal(dialogContent, document.body) : dialogContent
}

export const DialogHeader = ({ children, className = '', divider = false, ...props }) => {
  return (
    <div
      className={cn(
        'flex-shrink-0 p-6 pb-4',
        divider && 'border-b border-neutral-200 dark:border-neutral-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const DialogTitle = ({ children, className = '', ...props }) => {
  return (
    <h2
      className={cn(
        'text-xl font-semibold text-neutral-900 dark:text-white leading-tight',
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

export const DialogDescription = ({ children, className = '', ...props }) => {
  return (
    <p
      className={cn(
        'text-sm text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

export const DialogBody = ({ children, className = '', ...props }) => {
  return (
    <div
      className={cn(
        'flex-1 overflow-y-auto p-6 py-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const DialogFooter = ({
  children,
  className = '',
  divider = false,
  justify = 'end',
  ...props
}) => {
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
  }

  return (
    <div
      className={cn(
        'flex-shrink-0 p-6 pt-4 flex gap-3',
        divider && 'border-t border-neutral-200 dark:border-neutral-700',
        justifyClasses[justify],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
