import { forwardRef } from 'react'
import { cn } from '../../utils/cn'
import { Button } from './Button'
import { 
  FileX, 
  Search, 
  Plus, 
  RefreshCw, 
  AlertCircle, 
  Inbox,
  Database,
  Users,
  Settings,
  Zap
} from 'lucide-react'

const EmptyState = forwardRef(({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  onAction,
  secondaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  variant = 'default',
  size = 'md',
  className,
  ...props
}, ref) => {
  const variants = {
    default: {
      container: 'text-neutral-600 dark:text-neutral-400',
      icon: 'text-neutral-400 dark:text-neutral-500',
      title: 'text-neutral-900 dark:text-white',
      description: 'text-neutral-600 dark:text-neutral-400'
    },
    error: {
      container: 'text-red-600 dark:text-red-400',
      icon: 'text-red-400 dark:text-red-500',
      title: 'text-red-900 dark:text-red-100',
      description: 'text-red-600 dark:text-red-400'
    },
    success: {
      container: 'text-green-600 dark:text-green-400',
      icon: 'text-green-400 dark:text-green-500',
      title: 'text-green-900 dark:text-green-100',
      description: 'text-green-600 dark:text-green-400'
    },
    warning: {
      container: 'text-orange-600 dark:text-orange-400',
      icon: 'text-orange-400 dark:text-orange-500',
      title: 'text-orange-900 dark:text-orange-100',
      description: 'text-orange-600 dark:text-orange-400'
    }
  }

  const sizes = {
    sm: {
      container: 'py-8',
      icon: 'h-12 w-12',
      title: 'text-lg',
      description: 'text-sm',
      spacing: 'space-y-3'
    },
    md: {
      container: 'py-12',
      icon: 'h-16 w-16',
      title: 'text-xl',
      description: 'text-base',
      spacing: 'space-y-4'
    },
    lg: {
      container: 'py-16',
      icon: 'h-20 w-20',
      title: 'text-2xl',
      description: 'text-lg',
      spacing: 'space-y-6'
    }
  }

  const config = variants[variant]
  const sizeConfig = sizes[size]

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-center justify-center text-center max-w-md mx-auto',
        sizeConfig.container,
        sizeConfig.spacing,
        config.container,
        className
      )}
      {...props}
    >
      {Icon && (
        <div className="relative">
          <Icon className={cn(sizeConfig.icon, config.icon, 'animate-pulse')} />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 dark:to-black/10 rounded-full" />
        </div>
      )}

      {title && (
        <h3 className={cn('font-semibold', sizeConfig.title, config.title)}>
          {title}
        </h3>
      )}

      {description && (
        <p className={cn('leading-relaxed', sizeConfig.description, config.description)}>
          {description}
        </p>
      )}

      {(action || onAction) && (
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Button
            onClick={onAction}
            variant="primary"
            className="min-w-[120px]"
          >
            {actionLabel || 'Get Started'}
          </Button>

          {(secondaryAction || onSecondaryAction) && (
            <Button
              onClick={onSecondaryAction}
              variant="outline"
              className="min-w-[120px]"
            >
              {secondaryActionLabel || 'Learn More'}
            </Button>
          )}
        </div>
      )}

      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  )
})

EmptyState.displayName = 'EmptyState'

// Predefined Empty State Components
export const NoDataEmptyState = ({ onRefresh, ...props }) => (
  <EmptyState
    icon={Database}
    title="No data available"
    description="There's no data to display at the moment. Try refreshing or check back later."
    actionLabel="Refresh"
    onAction={onRefresh}
    {...props}
  />
)

export const NoResultsEmptyState = ({ onClear, searchTerm, ...props }) => (
  <EmptyState
    icon={Search}
    title="No results found"
    description={
      searchTerm 
        ? `No results found for "${searchTerm}". Try adjusting your search terms.`
        : "No results match your current filters. Try adjusting your criteria."
    }
    actionLabel="Clear filters"
    onAction={onClear}
    {...props}
  />
)

export const NoItemsEmptyState = ({ onCreate, itemType = "items", ...props }) => (
  <EmptyState
    icon={Plus}
    title={`No ${itemType} yet`}
    description={`You haven't created any ${itemType} yet. Get started by creating your first one.`}
    actionLabel={`Create ${itemType.slice(0, -1)}`}
    onAction={onCreate}
    {...props}
  />
)

export const ErrorEmptyState = ({ onRetry, error, ...props }) => (
  <EmptyState
    icon={AlertCircle}
    title="Something went wrong"
    description={error || "We encountered an error while loading your data. Please try again."}
    actionLabel="Try again"
    onAction={onRetry}
    variant="error"
    {...props}
  />
)

export const MaintenanceEmptyState = ({ ...props }) => (
  <EmptyState
    icon={Settings}
    title="Under maintenance"
    description="This feature is temporarily unavailable while we make improvements. Please check back soon."
    variant="warning"
    {...props}
  />
)

export const ComingSoonEmptyState = ({ ...props }) => (
  <EmptyState
    icon={Zap}
    title="Coming soon"
    description="This feature is currently in development. We'll notify you when it's ready!"
    variant="default"
    {...props}
  />
)

export const NoConnectionEmptyState = ({ onRetry, ...props }) => (
  <EmptyState
    icon={RefreshCw}
    title="Connection lost"
    description="Unable to connect to our servers. Please check your internet connection and try again."
    actionLabel="Retry"
    onAction={onRetry}
    variant="error"
    {...props}
  />
)

export const EmptyInboxState = ({ onCreate, ...props }) => (
  <EmptyState
    icon={Inbox}
    title="Your inbox is empty"
    description="All caught up! You have no new notifications or messages."
    variant="success"
    {...props}
  />
)

export const NoUsersEmptyState = ({ onInvite, ...props }) => (
  <EmptyState
    icon={Users}
    title="No team members"
    description="Your team is empty. Invite colleagues to start collaborating on projects."
    actionLabel="Invite members"
    onAction={onInvite}
    {...props}
  />
)

// Empty State with Illustration
export const IllustratedEmptyState = ({ 
  illustration, 
  illustrationAlt = "Empty state illustration",
  ...props 
}) => (
  <EmptyState
    {...props}
    icon={null}
    className={cn('space-y-6', props.className)}
  >
    {illustration && (
      <div className="w-48 h-48 mx-auto mb-6">
        <img 
          src={illustration} 
          alt={illustrationAlt}
          className="w-full h-full object-contain opacity-60 dark:opacity-40"
        />
      </div>
    )}
  </EmptyState>
)

export default EmptyState
export { EmptyState }
