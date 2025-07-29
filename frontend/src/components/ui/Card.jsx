import { forwardRef } from 'react'

const Card = forwardRef(({
  children,
  className = '',
  variant = 'default',
  interactive = false,
  padding = 'default',
  shadow = 'default',
  border = true,
  hover = false,
  ...props
}, ref) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900'
      case 'glass':
        return 'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl'
      case 'elevated':
        return 'bg-white dark:bg-neutral-800'
      case 'flat':
        return 'bg-neutral-50 dark:bg-neutral-800'
      default:
        return 'bg-white dark:bg-neutral-800'
    }
  }

  const getPaddingClasses = () => {
    switch (padding) {
      case 'none':
        return ''
      case 'sm':
        return 'p-4'
      case 'lg':
        return 'p-8'
      case 'xl':
        return 'p-10'
      default:
        return 'p-6'
    }
  }

  const getShadowClasses = () => {
    switch (shadow) {
      case 'none':
        return ''
      case 'sm':
        return 'shadow-soft'
      case 'lg':
        return 'shadow-floating'
      case 'glow':
        return 'shadow-glow'
      case 'elegant':
        return 'shadow-elegant'
      default:
        return 'shadow-elegant'
    }
  }

  const getBorderClasses = () => {
    if (!border) return ''
    return 'border border-neutral-200 dark:border-neutral-700'
  }

  const getInteractiveClasses = () => {
    if (!interactive && !hover) return ''

    const baseHover = 'transition-all duration-300'

    if (interactive) {
      return `${baseHover} hover:shadow-floating hover:scale-[1.02] hover:-translate-y-1 cursor-pointer active:scale-[0.98]`
    }

    if (hover) {
      return `${baseHover} hover:shadow-floating hover:-translate-y-1`
    }

    return baseHover
  }

  const classes = `
    rounded-2xl
    ${getVariantClasses()}
    ${getPaddingClasses()}
    ${getShadowClasses()}
    ${getBorderClasses()}
    ${getInteractiveClasses()}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  )
})

Card.displayName = 'Card'

// Card Header Component
export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`mb-6 ${className}`} {...props}>
    {children}
  </div>
)

// Card Title Component
export const CardTitle = ({ children, className = '', size = 'default', ...props }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-lg font-semibold'
      case 'lg':
        return 'text-2xl font-bold'
      case 'xl':
        return 'text-3xl font-bold'
      default:
        return 'text-xl font-bold'
    }
  }

  return (
    <h3 className={`${getSizeClasses()} text-neutral-900 dark:text-white ${className}`} {...props}>
      {children}
    </h3>
  )
}

// Card Description Component
export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-neutral-600 dark:text-neutral-300 ${className}`} {...props}>
    {children}
  </p>
)

// Card Content Component
export const CardContent = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
)

// Card Footer Component
export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700 ${className}`} {...props}>
    {children}
  </div>
)

// Stat Card Component
export const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendValue,
  color = 'primary',
  className = '',
  ...props 
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return {
          icon: 'from-green-500 to-emerald-600',
          badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
          trend: 'text-green-600 dark:text-green-400'
        }
      case 'blue':
        return {
          icon: 'from-blue-500 to-cyan-600',
          badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
          trend: 'text-blue-600 dark:text-blue-400'
        }
      case 'purple':
        return {
          icon: 'from-purple-500 to-violet-600',
          badge: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
          trend: 'text-purple-600 dark:text-purple-400'
        }
      case 'orange':
        return {
          icon: 'from-orange-500 to-amber-600',
          badge: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
          trend: 'text-orange-600 dark:text-orange-400'
        }
      default:
        return {
          icon: 'from-primary-500 to-primary-600',
          badge: 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
          trend: 'text-primary-600 dark:text-primary-400'
        }
    }
  }

  const colors = getColorClasses()

  return (
    <Card 
      className={`group hover:shadow-medium transition-all duration-300 hover:scale-[1.02] ${className}`} 
      {...props}
    >
      <div className="flex items-center justify-between mb-4">
        {Icon && (
          <div className={`w-12 h-12 bg-gradient-to-br ${colors.icon} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        )}
        {subtitle && (
          <div className={`text-xs font-medium px-2 py-1 rounded-full ${colors.badge}`}>
            {subtitle}
          </div>
        )}
      </div>
      
      <div>
        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
          {title}
        </p>
        <p className="text-3xl font-bold text-neutral-900 dark:text-white">
          {value}
        </p>
        {(trend || trendValue) && (
          <p className={`text-xs mt-1 ${colors.trend}`}>
            {trend} {trendValue}
          </p>
        )}
      </div>
    </Card>
  )
}

export default Card
export { Card }
