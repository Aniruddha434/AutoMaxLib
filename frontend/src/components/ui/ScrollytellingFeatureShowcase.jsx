import React, { useState, useEffect, useRef, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ScrollytellingFeatureShowcase = forwardRef(({ features, title, subtitle }, ref) => {
  const ASSETS_VER = import.meta.env.VITE_ASSETS_VERSION || '1'
  const [activeFeature, setActiveFeature] = useState(0)
  const [imageLoaded, setImageLoaded] = useState({})
  const containerRef = useRef(null)
  const featureRefs = useRef([])
  const isScrolling = useRef(false)
  const lastScrollTime = useRef(0)
  const scrollTimeout = useRef(null)
  const isContinuousScrolling = useRef(false)

  // Map features to their corresponding images (exact order from LandingPage.jsx)
  const getFeatureImage = (index) => {
    const q = `?v=${ASSETS_VER}`
    const imageMap = {
      0: `/Feature_images/Auto_Commit_AI_Scheduling.png${q}`,
      1: `/Feature_images/Multi-Repository_Github_Tools.png${q}`,
      2: `/Feature_images/Github_README_AI.png${q}`,
      3: `/Feature_images/Contribution_Analytics.png${q}`,
      4: `/Feature_images/Enterprise_Security.png${q}`,
      5: `/Feature_images/Goal_Tracking.png${q}`,
      6: `/Feature_images/README_Generation.png${q}`,
    }
    return imageMap[index] || `/Feature_images/Auto_Commit_AI_Scheduling.png${q}`
  }

  // Preload images
  useEffect(() => {
    features.forEach((_, index) => {
      const img = new Image()
      img.src = getFeatureImage(index)
      img.onload = () => {
        setImageLoaded(prev => ({ ...prev, [index]: true }))
      }
    })
  }, [features])

  useEffect(() => {
    const observers = []

    featureRefs.current.forEach((featureRef, index) => {
      if (featureRef) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveFeature(index)
            }
          },
          {
            root: null,
            rootMargin: '-30% 0px -30% 0px',
            threshold: [0.3, 0.7]
          }
        )

        observer.observe(featureRef)
        observers.push(observer)
      }
    })

    // Scroll snap behavior for both wheel and keyboard
    const scrollToFeature = (index) => {
      if (featureRefs.current[index]) {
        featureRefs.current[index].scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }
    }

    const handleWheel = (e) => {
      const now = Date.now()
      const timeSinceLastScroll = now - lastScrollTime.current

      // Detect if user is continuously scrolling (fast) or deliberate scrolling (slow)
      if (timeSinceLastScroll < 150) {
        isContinuousScrolling.current = true
        // Allow normal scrolling for continuous/fast scrolling
        return
      }

      // For deliberate/slow scrolling, use snap behavior
      if (isScrolling.current) return

      e.preventDefault()
      isScrolling.current = true
      lastScrollTime.current = now
      isContinuousScrolling.current = false

      const direction = e.deltaY > 0 ? 1 : -1
      const nextIndex = Math.max(0, Math.min(features.length - 1, activeFeature + direction))

      if (nextIndex !== activeFeature) {
        scrollToFeature(nextIndex)
      }

      setTimeout(() => {
        isScrolling.current = false
      }, 800)
    }

    // Auto-snap when user stops scrolling
    const handleScroll = () => {
      if (isScrolling.current) return

      clearTimeout(scrollTimeout.current)

      scrollTimeout.current = setTimeout(() => {
        if (!isContinuousScrolling.current) return

        // Find the closest feature to current scroll position
        let closestIndex = 0
        let minDistance = Infinity

        featureRefs.current.forEach((ref, index) => {
          if (ref) {
            const rect = ref.getBoundingClientRect()
            const distance = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2)
            if (distance < minDistance) {
              minDistance = distance
              closestIndex = index
            }
          }
        })

        // Auto-snap to closest feature
        if (closestIndex !== activeFeature) {
          scrollToFeature(closestIndex)
        }

        isContinuousScrolling.current = false
      }, 500) // Wait 500ms after user stops scrolling
    }

    const handleKeyDown = (e) => {
      if (isScrolling.current) return

      let nextIndex = activeFeature

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        nextIndex = Math.min(features.length - 1, activeFeature + 1)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        nextIndex = Math.max(0, activeFeature - 1)
      } else {
        return
      }

      if (nextIndex !== activeFeature) {
        isScrolling.current = true
        scrollToFeature(nextIndex)

        setTimeout(() => {
          isScrolling.current = false
        }, 600)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false })
      window.addEventListener('scroll', handleScroll, { passive: true })
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      observers.forEach(observer => observer.disconnect())
      clearTimeout(scrollTimeout.current)
      if (container) {
        container.removeEventListener('wheel', handleWheel)
        window.removeEventListener('scroll', handleScroll)
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [activeFeature, features.length])

  return (
    <section ref={ref} className="bg-gray-50 py-16 md:py-32 dark:bg-transparent">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
            {title}
          </h2>
          <p className="text-lg text-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-[45%_55%] gap-12 lg:gap-16">
          {/* Content Column - Scrollable */}
          <div className="space-y-12 lg:space-y-[50vh]" ref={containerRef}>
            {features.map((feature, index) => (
              <div
                key={index}
                ref={el => featureRefs.current[index] = el}
                className={`transition-all duration-700 ease-in-out transform ${
                  activeFeature === index
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-30 scale-95 translate-y-4'
                }`}
              >
                <div className={`rounded-xl border bg-card text-card-foreground shadow-lg overflow-hidden transition-all duration-500 group p-8 ${
                  activeFeature === index
                    ? 'shadow-2xl border-primary-500/20 bg-primary-50/5 dark:bg-primary-950/10'
                    : 'hover:shadow-xl hover-glow'
                }`}>
                  <div className="flex items-start gap-6">
                    <div className={`relative flex aspect-square size-16 rounded-full border transition-all duration-500 flex-shrink-0 ${
                      activeFeature === index
                        ? 'border-primary-500 bg-primary-500/10 scale-110'
                        : 'border-muted group-hover:border-primary-500/50'
                    }`}>
                      <feature.icon className={`m-auto size-6 transition-all duration-500 ${
                        activeFeature === index
                          ? 'text-primary-600 scale-110'
                          : 'text-muted-foreground group-hover:text-primary-600'
                      }`} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-3 flex-1">
                      <h3 className={`text-2xl lg:text-3xl font-bold transition-all duration-500 ${
                        activeFeature === index
                          ? 'text-primary-600'
                          : 'text-foreground group-hover:text-primary-600'
                      }`}>
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Visual Column - Sticky */}
          <div className="lg:sticky lg:top-[20vh] lg:h-[60vh] order-first lg:order-last">
            <div className="relative w-full aspect-[3/2] bg-gray-100 dark:bg-gray-800 rounded-2xl border shadow-xl overflow-hidden">
              {/* Render all images with opacity transitions */}
              {features.map((feature, index) => (
                <motion.img
                  key={index}
                  src={getFeatureImage(index)}
                  alt={feature?.title || 'Feature preview'}
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: activeFeature === index ? 1 : 0,
                    scale: activeFeature === index ? 1 : 1.05
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    opacity: { duration: 0.4 },
                    scale: { duration: 0.6 }
                  }}
                  style={{
                    zIndex: activeFeature === index ? 2 : 1,
                    display: imageLoaded[index] ? 'block' : 'none'
                  }}
                  onError={(e) => {
                    console.error('Failed to load feature image:', getFeatureImage(index))
                    e.target.style.display = 'none'
                  }}
                />
              ))}

              {/* Loading fallback */}
              {!imageLoaded[activeFeature] && (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                  <div className="text-center p-8">
                    <div className={`w-24 h-24 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-gradient-to-r ${features[activeFeature]?.color || 'from-primary-500 to-secondary-500'}`}>
                      {React.createElement(features[activeFeature]?.icon, {
                        className: "w-12 h-12 text-white",
                        strokeWidth: 1.5
                      })}
                    </div>
                    <h4 className="text-xl font-semibold text-foreground mb-3">
                      {features[activeFeature]?.title}
                    </h4>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Loading preview...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

ScrollytellingFeatureShowcase.displayName = 'ScrollytellingFeatureShowcase'

export default ScrollytellingFeatureShowcase
