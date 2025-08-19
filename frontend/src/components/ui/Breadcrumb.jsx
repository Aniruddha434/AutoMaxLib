import { forwardRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '../../utils/cn'

const Breadcrumb = forwardRef(({
  items = [],
  separator,
  showHome = true,
  className,
  ...props
}, ref) => {
  const defaultSeparator = <ChevronRight className="h-4 w-4 text-neutral-400" />

  const renderSeparator = () => {
    if (separator === null) return null
    return separator || defaultSeparator
  }

  const allItems = showHome 
    ? [{ label: 'Home', href: '/', icon: Home }, ...items]
    : items

  if (allItems.length === 0) return null

  return (
    <nav
      ref={ref}
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-2 text-sm', className)}
      {...props}
    >
      <ol className="flex items-center space-x-2">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1
          const IconComponent = item.icon

          return (
            <li key={index} className="flex items-center space-x-2">
              {index > 0 && (
                <span className="flex-shrink-0" aria-hidden="true">
                  {renderSeparator()}
                </span>
              )}
              
              <div className="flex items-center space-x-1">
                {IconComponent && (
                  <IconComponent className="h-4 w-4 text-neutral-500" />
                )}
                
                {isLast ? (
                  <span 
                    className="font-medium text-neutral-900 dark:text-white"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : item.href ? (
                  <Link
                    to={item.href}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 hover:underline"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-neutral-600 dark:text-neutral-400">
                    {item.label}
                  </span>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
})

Breadcrumb.displayName = 'Breadcrumb'

// Breadcrumb Item Component
export const BreadcrumbItem = forwardRef(({
  children,
  href,
  isCurrentPage = false,
  icon,
  className,
  ...props
}, ref) => {
  const IconComponent = icon

  const content = (
    <div className="flex items-center space-x-1">
      {IconComponent && (
        <IconComponent className="h-4 w-4 text-neutral-500" />
      )}
      <span>{children}</span>
    </div>
  )

  if (isCurrentPage) {
    return (
      <span
        ref={ref}
        className={cn('font-medium text-neutral-900 dark:text-white', className)}
        aria-current="page"
        {...props}
      >
        {content}
      </span>
    )
  }

  if (href) {
    return (
      <Link
        ref={ref}
        to={href}
        className={cn(
          'text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 hover:underline',
          className
        )}
        {...props}
      >
        {content}
      </Link>
    )
  }

  return (
    <span
      ref={ref}
      className={cn('text-neutral-600 dark:text-neutral-400', className)}
      {...props}
    >
      {content}
    </span>
  )
})

BreadcrumbItem.displayName = 'BreadcrumbItem'

// Breadcrumb Separator Component
export const BreadcrumbSeparator = ({ children, className, ...props }) => (
  <span
    className={cn('text-neutral-400', className)}
    aria-hidden="true"
    {...props}
  >
    {children || <ChevronRight className="h-4 w-4" />}
  </span>
)

// Auto Breadcrumb Hook - generates breadcrumbs from current route
export const useAutoBreadcrumb = (customLabels = {}) => {
  const location = useLocation()
  const pathSegments = location.pathname.split('/').filter(Boolean)

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/')
    const label = customLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
    
    return {
      label,
      href,
      key: href
    }
  })

  return breadcrumbItems
}

// Page Header with Breadcrumb Component
export const PageHeader = ({
  title,
  description,
  breadcrumbItems = [],
  actions,
  className,
  ...props
}) => (
  <div className={cn('mb-8', className)} {...props}>
    {breadcrumbItems.length > 0 && (
      <Breadcrumb items={breadcrumbItems} className="mb-4" />
    )}
    
    <div className="flex items-start justify-between">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            {description}
          </p>
        )}
      </div>
      
      {actions && (
        <div className="ml-4 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  </div>
)

export default Breadcrumb
export { Breadcrumb }
