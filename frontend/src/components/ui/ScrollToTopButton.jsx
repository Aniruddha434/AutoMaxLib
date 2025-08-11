import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'
import { cn } from '../../utils/cn'

const ScrollToTopButton = ({ 
  showAfter = 300, 
  className = '',
  position = 'bottom-right',
  size = 'default'
}) => {
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

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 transform -translate-x-1/2',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  }

  const sizeClasses = {
    'small': 'w-10 h-10',
    'default': 'w-12 h-12',
    'large': 'w-14 h-14'
  }

  const iconSizes = {
    'small': 'w-4 h-4',
    'default': 'w-5 h-5',
    'large': 'w-6 h-6'
  }

  if (!isVisible) return null

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        'fixed z-50 bg-primary hover:bg-primary/90 text-primary-foreground',
        'rounded-full shadow-lg hover:shadow-xl transition-all duration-300',
        'flex items-center justify-center',
        'hover:scale-110 active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        positionClasses[position],
        sizeClasses[size],
        className
      )}
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      <ChevronUp className={cn('transition-transform duration-200', iconSizes[size])} />
    </button>
  )
}

export default ScrollToTopButton
