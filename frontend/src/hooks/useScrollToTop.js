import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Hook to automatically scroll to top when component mounts or route changes
 * @param {Object} options - Configuration options
 * @param {boolean} options.onMount - Whether to scroll to top when component mounts (default: true)
 * @param {boolean} options.onRouteChange - Whether to scroll to top when route changes (default: false)
 * @param {string} options.behavior - Scroll behavior: 'smooth' or 'auto' (default: 'smooth')
 * @param {number} options.delay - Delay in milliseconds before scrolling (default: 0)
 * @param {number} options.top - Top position to scroll to (default: 0)
 */
export const useScrollToTop = (options = {}) => {
  const {
    onMount = true,
    onRouteChange = false,
    behavior = 'smooth',
    delay = 0,
    top = 0
  } = options

  const location = useLocation()

  const scrollToTop = () => {
    const scrollAction = () => {
      window.scrollTo({
        top,
        left: 0,
        behavior
      })
    }

    if (delay > 0) {
      setTimeout(scrollAction, delay)
    } else {
      scrollAction()
    }
  }

  // Scroll to top on component mount
  useEffect(() => {
    if (onMount) {
      scrollToTop()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll to top on route change
  useEffect(() => {
    if (onRouteChange) {
      scrollToTop()
    }
  }, [location.pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  return scrollToTop
}

/**
 * Hook to scroll to a specific element
 * @param {string} elementId - ID of the element to scroll to
 * @param {Object} options - Configuration options
 */
export const useScrollToElement = (elementId, options = {}) => {
  const {
    behavior = 'smooth',
    block = 'start',
    inline = 'nearest',
    offset = 0
  } = options

  const scrollToElement = () => {
    const element = document.getElementById(elementId)
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior
      })
    }
  }

  return scrollToElement
}

/**
 * Hook to create a smooth scroll to top button functionality
 * @param {number} showAfter - Show button after scrolling this many pixels (default: 300)
 */
export const useScrollToTopButton = (showAfter = 300) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > showAfter) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [showAfter])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return { isVisible, scrollToTop }
}

export default useScrollToTop
