import { useEffect, useState, useCallback } from 'react'

// Hook for managing focus
export const useFocusManagement = () => {
  const [focusedElement, setFocusedElement] = useState(null)

  const trapFocus = useCallback((containerElement) => {
    if (!containerElement) return

    const focusableElements = containerElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    containerElement.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      containerElement.removeEventListener('keydown', handleTabKey)
    }
  }, [])

  const restoreFocus = useCallback(() => {
    if (focusedElement) {
      focusedElement.focus()
      setFocusedElement(null)
    }
  }, [focusedElement])

  const saveFocus = useCallback(() => {
    setFocusedElement(document.activeElement)
  }, [])

  return { trapFocus, restoreFocus, saveFocus }
}

// Hook for keyboard navigation
export const useKeyboardNavigation = (items, options = {}) => {
  const {
    loop = true,
    orientation = 'vertical',
    onSelect,
    disabled = false
  } = options

  const [activeIndex, setActiveIndex] = useState(-1)

  const handleKeyDown = useCallback((e) => {
    if (disabled || !items.length) return

    const isVertical = orientation === 'vertical'
    const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight'
    const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft'

    switch (e.key) {
      case nextKey:
        e.preventDefault()
        setActiveIndex(prev => {
          const next = prev + 1
          return next >= items.length ? (loop ? 0 : prev) : next
        })
        break

      case prevKey:
        e.preventDefault()
        setActiveIndex(prev => {
          const next = prev - 1
          return next < 0 ? (loop ? items.length - 1 : prev) : next
        })
        break

      case 'Home':
        e.preventDefault()
        setActiveIndex(0)
        break

      case 'End':
        e.preventDefault()
        setActiveIndex(items.length - 1)
        break

      case 'Enter':
      case ' ':
        e.preventDefault()
        if (activeIndex >= 0 && onSelect) {
          onSelect(items[activeIndex], activeIndex)
        }
        break

      case 'Escape':
        setActiveIndex(-1)
        break
    }
  }, [items, activeIndex, loop, orientation, onSelect, disabled])

  return { activeIndex, setActiveIndex, handleKeyDown }
}

// Hook for reduced motion preferences
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

// Hook for screen reader announcements
export const useAnnouncer = () => {
  const [announcer, setAnnouncer] = useState(null)

  useEffect(() => {
    const element = document.createElement('div')
    element.setAttribute('aria-live', 'polite')
    element.setAttribute('aria-atomic', 'true')
    element.style.position = 'absolute'
    element.style.left = '-10000px'
    element.style.width = '1px'
    element.style.height = '1px'
    element.style.overflow = 'hidden'
    
    document.body.appendChild(element)
    setAnnouncer(element)

    return () => {
      if (element.parentNode) {
        element.parentNode.removeChild(element)
      }
    }
  }, [])

  const announce = useCallback((message, priority = 'polite') => {
    if (!announcer) return

    announcer.setAttribute('aria-live', priority)
    announcer.textContent = message

    // Clear after announcement
    setTimeout(() => {
      announcer.textContent = ''
    }, 1000)
  }, [announcer])

  return announce
}

// Hook for color contrast checking
export const useColorContrast = () => {
  const checkContrast = useCallback((foreground, background) => {
    // Simple contrast ratio calculation
    const getLuminance = (color) => {
      const rgb = color.match(/\d+/g)
      if (!rgb) return 0

      const [r, g, b] = rgb.map(c => {
        c = parseInt(c) / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })

      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    const l1 = getLuminance(foreground)
    const l2 = getLuminance(background)
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)

    return {
      ratio,
      aa: ratio >= 4.5,
      aaa: ratio >= 7,
      aaLarge: ratio >= 3,
      aaaLarge: ratio >= 4.5
    }
  }, [])

  return { checkContrast }
}

// Hook for managing ARIA attributes
export const useAriaAttributes = (initialAttributes = {}) => {
  const [attributes, setAttributes] = useState(initialAttributes)

  const updateAttribute = useCallback((key, value) => {
    setAttributes(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  const removeAttribute = useCallback((key) => {
    setAttributes(prev => {
      const newAttributes = { ...prev }
      delete newAttributes[key]
      return newAttributes
    })
  }, [])

  const toggleAttribute = useCallback((key, trueValue = 'true', falseValue = 'false') => {
    setAttributes(prev => ({
      ...prev,
      [key]: prev[key] === trueValue ? falseValue : trueValue
    }))
  }, [])

  return {
    attributes,
    updateAttribute,
    removeAttribute,
    toggleAttribute,
    setAttributes
  }
}

// Hook for managing live regions
export const useLiveRegion = (initialMessage = '', priority = 'polite') => {
  const [message, setMessage] = useState(initialMessage)
  const [regionPriority, setRegionPriority] = useState(priority)

  const announce = useCallback((newMessage, newPriority = regionPriority) => {
    setMessage('')
    setTimeout(() => {
      setRegionPriority(newPriority)
      setMessage(newMessage)
    }, 100)
  }, [regionPriority])

  const clear = useCallback(() => {
    setMessage('')
  }, [])

  return {
    message,
    priority: regionPriority,
    announce,
    clear,
    setMessage,
    setPriority: setRegionPriority
  }
}

// Hook for skip links
export const useSkipLinks = (links = []) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeLink, setActiveLink] = useState(-1)

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
      setIsVisible(true)
      setActiveLink(0)
    }
  }, [])

  const handleSkipLinkClick = useCallback((targetId) => {
    const target = document.getElementById(targetId)
    if (target) {
      target.focus()
      target.scrollIntoView({ behavior: 'smooth' })
    }
    setIsVisible(false)
    setActiveLink(-1)
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return {
    isVisible,
    activeLink,
    setActiveLink,
    handleSkipLinkClick,
    setIsVisible
  }
}
