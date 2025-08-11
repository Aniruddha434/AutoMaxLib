import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { 
  Crown, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Zap,
  ArrowRight
} from 'lucide-react'

const FeatureCard = ({
  title,
  description,
  icon: Icon,
  href,
  onClick,
  status = 'available', // available, connected, limited, premium, disabled
  usage = null, // { current: 2, limit: 5 } or null
  premium = false,
  gradient = 'from-blue-500 to-cyan-500',
  className = '',
  disabled = false,
  loading = false,
  badge = null,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()

  const handleNavigation = (url) => {
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // Small delay to ensure smooth scroll starts before navigation
    setTimeout(() => {
      navigate(url)
    }, 100)
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'limited':
        return <AlertCircle className="w-4 h-4 text-amber-500" />
      case 'premium':
        return <Crown className="w-4 h-4 text-purple-500" />
      case 'disabled':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Connected'
      case 'limited':
        return usage ? `${usage.current}/${usage.limit} used` : 'Limited'
      case 'premium':
        return 'Premium'
      case 'disabled':
        return 'Unavailable'
      default:
        return 'Available'
    }
  }

  const isClickable = !disabled && !loading && (href || onClick)
  
  const cardContent = (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800',
        'bg-white dark:bg-neutral-900 transition-all duration-300 ease-out',
        'hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20',
        isClickable && 'cursor-pointer hover:-translate-y-1',
        disabled && 'opacity-60 cursor-not-allowed',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={!disabled && onClick ? onClick : href ? () => handleNavigation(href) : undefined}
      {...props}
    >
      {/* Gradient Background */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300',
        gradient,
        isHovered && isClickable && 'opacity-5'
      )} />
      
      {/* Premium Badge */}
      {premium && (
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            <Crown className="w-3 h-3" />
            Pro
          </div>
        </div>
      )}

      {/* Custom Badge */}
      {badge && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-2 py-1 rounded-full text-xs font-medium">
            {badge}
          </div>
        </div>
      )}

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300',
            `bg-gradient-to-br ${gradient}`,
            isHovered && isClickable && 'scale-110'
          )}>
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Icon className="w-6 h-6 text-white" />
            )}
          </div>
          
          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
              {getStatusText()}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
            {title}
          </h3>
          
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {description}
          </p>

          {/* Usage Bar */}
          {usage && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-500">
                <span>Usage</span>
                <span>{usage.current}/{usage.limit}</span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                <div 
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    usage.current >= usage.limit 
                      ? 'bg-red-500' 
                      : usage.current / usage.limit > 0.8 
                        ? 'bg-amber-500' 
                        : 'bg-green-500'
                  )}
                  style={{ width: `${Math.min((usage.current / usage.limit) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Arrow */}
        {isClickable && (
          <div className="absolute bottom-4 right-4">
            <ArrowRight className={cn(
              'w-4 h-4 text-neutral-400 transition-all duration-300',
              isHovered && 'text-neutral-600 dark:text-neutral-300 translate-x-1'
            )} />
          </div>
        )}
      </div>
    </div>
  )

  return cardContent
}

export default FeatureCard
