// Performance optimization utilities

// Debounce function for performance optimization
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle function for scroll events
export const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Preload critical images
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// Preload multiple images
export const preloadImages = (srcArray) => {
  return Promise.all(srcArray.map(preloadImage))
}

// Critical resource hints
export const addResourceHints = () => {
  const head = document.head

  // DNS prefetch for external domains
  const dnsPrefetchDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://api.clerk.dev',
    'https://images.unsplash.com'
  ]

  dnsPrefetchDomains.forEach(domain => {
    const link = document.createElement('link')
    link.rel = 'dns-prefetch'
    link.href = domain
    head.appendChild(link)
  })

  // Preconnect to critical domains
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://api.clerk.dev'
  ]

  preconnectDomains.forEach(domain => {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = domain
    link.crossOrigin = 'anonymous'
    head.appendChild(link)
  })
}

// Optimize images for different screen sizes
export const getOptimizedImageUrl = (src, width, quality = 80) => {
  // If using a CDN like Cloudinary or similar, you can add optimization parameters
  // For now, return the original src
  return src
}

// Lazy load component with intersection observer
export const createLazyLoader = (callback, options = {}) => {
  const defaultOptions = {
    threshold: 0.1,
    rootMargin: '50px'
  }

  const observerOptions = { ...defaultOptions, ...options }

  return new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target)
      }
    })
  }, observerOptions)
}

// Performance monitoring
export const measurePerformance = (name, fn) => {
  return async (...args) => {
    const start = performance.now()
    const result = await fn(...args)
    const end = performance.now()
    
    console.log(`${name} took ${end - start} milliseconds`)
    
    // Send to analytics if needed
    if (window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: name,
        value: Math.round(end - start)
      })
    }
    
    return result
  }
}

// Critical CSS inlining helper
export const inlineCriticalCSS = (css) => {
  const style = document.createElement('style')
  style.textContent = css
  document.head.appendChild(style)
}

// Service Worker registration
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('SW registered: ', registration)
      return registration
    } catch (registrationError) {
      console.log('SW registration failed: ', registrationError)
    }
  }
}

// Web Vitals tracking
export const trackWebVitals = () => {
  if (typeof window !== 'undefined') {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log)
      getFID(console.log)
      getFCP(console.log)
      getLCP(console.log)
      getTTFB(console.log)
    })
  }
}

// Bundle size optimization - dynamic imports
export const loadComponentDynamically = (componentPath) => {
  return import(componentPath)
}

// Memory cleanup utilities
export const cleanupEventListeners = (element, events) => {
  events.forEach(({ event, handler }) => {
    element.removeEventListener(event, handler)
  })
}

// Optimize animations for performance
export const requestAnimationFrame = (callback) => {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || 
         window.mozRequestAnimationFrame || window.oRequestAnimationFrame || 
         window.msRequestAnimationFrame || function(callback) {
           window.setTimeout(callback, 1000 / 60)
         }
}

// Initialize performance optimizations
export const initPerformanceOptimizations = () => {
  // Add resource hints
  addResourceHints()
  
  // Register service worker
  registerServiceWorker()
  
  // Track web vitals
  trackWebVitals()
  
  // Preload critical images
  const criticalImages = [
    '/og-image.svg',
    '/logo.svg',
    '/favicon.svg'
  ]
  
  preloadImages(criticalImages).catch(console.error)
}
