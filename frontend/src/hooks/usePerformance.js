import { useEffect, useState, useCallback, useRef, useMemo } from 'react'

// Hook for lazy loading images
export const useLazyImage = (src, options = {}) => {
  const [imageSrc, setImageSrc] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const imgRef = useRef(null)

  const { threshold = 0.1, rootMargin = '50px' } = options

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src)
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [src, threshold, rootMargin])

  useEffect(() => {
    if (!imageSrc) return

    const img = new Image()
    img.onload = () => setIsLoaded(true)
    img.onerror = () => setIsError(true)
    img.src = imageSrc
  }, [imageSrc])

  return { imgRef, imageSrc, isLoaded, isError }
}

// Hook for debouncing values
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Hook for throttling functions
export const useThrottle = (callback, delay) => {
  const lastRun = useRef(Date.now())

  return useCallback((...args) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args)
      lastRun.current = Date.now()
    }
  }, [callback, delay])
}

// Hook for intersection observer
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [entry, setEntry] = useState(null)
  const elementRef = useRef(null)

  const { threshold = 0, rootMargin = '0px', root = null } = options

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        setEntry(entry)
      },
      { threshold, rootMargin, root }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [threshold, rootMargin, root])

  return { elementRef, isIntersecting, entry }
}

// Hook for virtual scrolling
export const useVirtualScroll = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0)

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    )

    return {
      startIndex,
      endIndex,
      items: items.slice(startIndex, endIndex),
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight
    }
  }, [items, itemHeight, containerHeight, scrollTop])

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop)
  }, [])

  return { visibleItems, handleScroll }
}

// Hook for measuring element dimensions
export const useMeasure = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const elementRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setDimensions({ width, height })
    })

    resizeObserver.observe(element)

    return () => resizeObserver.disconnect()
  }, [])

  return { elementRef, dimensions }
}

// Hook for preloading resources
export const usePreload = (resources = []) => {
  const [loadedResources, setLoadedResources] = useState(new Set())
  const [failedResources, setFailedResources] = useState(new Set())

  useEffect(() => {
    const preloadResource = (resource) => {
      return new Promise((resolve, reject) => {
        if (resource.type === 'image') {
          const img = new Image()
          img.onload = () => resolve(resource.src)
          img.onerror = () => reject(resource.src)
          img.src = resource.src
        } else if (resource.type === 'script') {
          const script = document.createElement('script')
          script.onload = () => resolve(resource.src)
          script.onerror = () => reject(resource.src)
          script.src = resource.src
          document.head.appendChild(script)
        } else if (resource.type === 'style') {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.onload = () => resolve(resource.src)
          link.onerror = () => reject(resource.src)
          link.href = resource.src
          document.head.appendChild(link)
        }
      })
    }

    const preloadAll = async () => {
      for (const resource of resources) {
        try {
          await preloadResource(resource)
          setLoadedResources(prev => new Set([...prev, resource.src]))
        } catch (src) {
          setFailedResources(prev => new Set([...prev, src]))
        }
      }
    }

    preloadAll()
  }, [resources])

  return { loadedResources, failedResources }
}

// Hook for idle callback
export const useIdleCallback = (callback, options = {}) => {
  const { timeout = 5000 } = options
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(
        () => callbackRef.current(),
        { timeout }
      )
      return () => window.cancelIdleCallback(id)
    } else {
      // Fallback for browsers without requestIdleCallback
      const id = setTimeout(() => callbackRef.current(), 0)
      return () => clearTimeout(id)
    }
  }, [timeout])
}

// Hook for performance monitoring
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    fps: 0
  })

  const measureRenderTime = useCallback((name, fn) => {
    const start = performance.now()
    const result = fn()
    const end = performance.now()
    
    setMetrics(prev => ({
      ...prev,
      renderTime: end - start
    }))

    return result
  }, [])

  const measureMemoryUsage = useCallback(() => {
    if (performance.memory) {
      setMetrics(prev => ({
        ...prev,
        memoryUsage: performance.memory.usedJSHeapSize / 1024 / 1024 // MB
      }))
    }
  }, [])

  const measureFPS = useCallback(() => {
    let frames = 0
    let lastTime = performance.now()

    const countFrames = () => {
      frames++
      const currentTime = performance.now()
      
      if (currentTime >= lastTime + 1000) {
        setMetrics(prev => ({
          ...prev,
          fps: Math.round((frames * 1000) / (currentTime - lastTime))
        }))
        frames = 0
        lastTime = currentTime
      }
      
      requestAnimationFrame(countFrames)
    }

    requestAnimationFrame(countFrames)
  }, [])

  return {
    metrics,
    measureRenderTime,
    measureMemoryUsage,
    measureFPS
  }
}

// Hook for optimized event listeners
export const useOptimizedEventListener = (eventName, handler, element = window, options = {}) => {
  const { passive = true, capture = false, throttle = 0, debounce = 0 } = options
  const handlerRef = useRef(handler)

  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    const targetElement = element?.current || element
    if (!targetElement?.addEventListener) return

    let optimizedHandler = (...args) => handlerRef.current(...args)

    if (throttle > 0) {
      let lastCall = 0
      optimizedHandler = (...args) => {
        const now = Date.now()
        if (now - lastCall >= throttle) {
          lastCall = now
          handlerRef.current(...args)
        }
      }
    } else if (debounce > 0) {
      let timeoutId
      optimizedHandler = (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => handlerRef.current(...args), debounce)
      }
    }

    targetElement.addEventListener(eventName, optimizedHandler, {
      passive,
      capture
    })

    return () => {
      targetElement.removeEventListener(eventName, optimizedHandler, {
        capture
      })
    }
  }, [eventName, element, passive, capture, throttle, debounce])
}
