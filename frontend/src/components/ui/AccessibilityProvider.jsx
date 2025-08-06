import React, { createContext, useContext, useEffect, useState } from 'react'
import { useReducedMotion, useAnnouncer } from '../../hooks/useAccessibility'

const AccessibilityContext = createContext()

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}

export const AccessibilityProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    screenReader: false
  })

  const prefersReducedMotion = useReducedMotion()
  const announce = useAnnouncer()

  // Detect screen reader
  useEffect(() => {
    const detectScreenReader = () => {
      // Check for common screen reader indicators
      const hasScreenReader = 
        navigator.userAgent.includes('NVDA') ||
        navigator.userAgent.includes('JAWS') ||
        navigator.userAgent.includes('VoiceOver') ||
        window.speechSynthesis ||
        document.querySelector('[aria-live]') !== null

      setPreferences(prev => ({
        ...prev,
        screenReader: hasScreenReader
      }))
    }

    detectScreenReader()
  }, [])

  // Update reduced motion preference
  useEffect(() => {
    setPreferences(prev => ({
      ...prev,
      reducedMotion: prefersReducedMotion
    }))
  }, [prefersReducedMotion])

  // Apply accessibility preferences to document
  useEffect(() => {
    const root = document.documentElement

    if (preferences.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms')
      root.style.setProperty('--transition-duration', '0.01ms')
    } else {
      root.style.removeProperty('--animation-duration')
      root.style.removeProperty('--transition-duration')
    }

    if (preferences.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    if (preferences.largeText) {
      root.classList.add('large-text')
    } else {
      root.classList.remove('large-text')
    }
  }, [preferences])

  const updatePreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const value = {
    preferences,
    updatePreference,
    announce,
    prefersReducedMotion
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  )
}

// Skip Links Component
export const SkipLinks = ({ links = [] }) => {
  const [isVisible, setIsVisible] = useState(false)

  const defaultLinks = [
    { id: 'main-content', label: 'Skip to main content' },
    { id: 'navigation', label: 'Skip to navigation' },
    { id: 'footer', label: 'Skip to footer' }
  ]

  const allLinks = links.length > 0 ? links : defaultLinks

  const handleFocus = () => setIsVisible(true)
  const handleBlur = () => setIsVisible(false)

  const handleClick = (targetId) => {
    const target = document.getElementById(targetId)
    if (target) {
      target.focus()
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className={`skip-links ${isVisible ? 'visible' : ''}`}>
      {allLinks.map((link) => (
        <a
          key={link.id}
          href={`#${link.id}`}
          className="skip-link"
          onFocus={handleFocus}
          onBlur={handleBlur}
          onClick={(e) => {
            e.preventDefault()
            handleClick(link.id)
          }}
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}

// Live Region Component
export const LiveRegion = ({ 
  message, 
  priority = 'polite', 
  atomic = true,
  className = '',
  ...props 
}) => {
  return (
    <div
      aria-live={priority}
      aria-atomic={atomic}
      className={`sr-only ${className}`}
      {...props}
    >
      {message}
    </div>
  )
}

// Screen Reader Only Component
export const ScreenReaderOnly = ({ children, className = '', ...props }) => {
  return (
    <span className={`sr-only ${className}`} {...props}>
      {children}
    </span>
  )
}

// Focus Trap Component
export const FocusTrap = ({ children, active = true, className = '', ...props }) => {
  const containerRef = React.useRef(null)

  useEffect(() => {
    if (!active || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          e.preventDefault()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }, [active])

  return (
    <div ref={containerRef} className={className} {...props}>
      {children}
    </div>
  )
}

// Accessible Button Component
export const AccessibleButton = React.forwardRef(({
  children,
  onClick,
  disabled = false,
  ariaLabel,
  ariaDescribedBy,
  ariaExpanded,
  ariaPressed,
  className = '',
  ...props
}, ref) => {
  const { announce } = useAccessibility()

  const handleClick = (e) => {
    if (disabled) return
    
    onClick?.(e)
    
    // Announce button action for screen readers
    if (ariaLabel && announce) {
      announce(`${ariaLabel} activated`)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick(e)
    }
  }

  return (
    <button
      ref={ref}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-expanded={ariaExpanded}
      aria-pressed={ariaPressed}
      className={`focus-ring-primary ${className}`}
      {...props}
    >
      {children}
    </button>
  )
})

AccessibleButton.displayName = 'AccessibleButton'

export default AccessibilityProvider
