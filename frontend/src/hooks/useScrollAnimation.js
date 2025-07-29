import { useEffect, useRef } from 'react'

export const useScrollAnimation = (threshold = 0.1) => {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    const element = ref.current
    if (element) {
      element.classList.add('animate-on-scroll')
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [threshold])

  return ref
}

export const useStaggeredAnimation = (delay = 0) => {
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (element) {
      element.style.setProperty('--stagger', delay)
      element.classList.add('stagger-animation')
    }
  }, [delay])

  return ref
}
