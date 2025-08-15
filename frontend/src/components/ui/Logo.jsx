import { Link } from 'react-router-dom'
import { GitBranch } from 'lucide-react'
import { cn } from '../../utils/cn'

const Logo = ({ 
  size = 'md', 
  variant = 'default',
  showText = true, 
  className,
  linkTo = '/',
  ...props 
}) => {
  const sizeClasses = {
    xs: {
      container: 'w-6 h-6',
      icon: 'h-3 w-3',
      text: 'text-sm font-semibold',
      spacing: 'space-x-1'
    },
    sm: {
      container: 'w-8 h-8',
      icon: 'h-4 w-4',
      text: 'text-base font-semibold',
      spacing: 'space-x-2'
    },
    md: {
      container: 'w-10 h-10',
      icon: 'h-5 w-5',
      text: 'text-lg font-semibold',
      spacing: 'space-x-2'
    },
    lg: {
      container: 'w-12 h-12',
      icon: 'h-6 w-6',
      text: 'text-xl font-bold',
      spacing: 'space-x-3'
    },
    xl: {
      container: 'w-16 h-16',
      icon: 'h-8 w-8',
      text: 'text-2xl font-bold',
      spacing: 'space-x-3'
    }
  }

  const variantClasses = {
    default: {
      container: 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm',
      icon: 'text-neutral-700 dark:text-neutral-300',
      text: 'text-foreground'
    },
    navbar: {
      container: 'bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/50 dark:border-neutral-700/50 rounded-lg',
      icon: 'text-neutral-600 dark:text-neutral-400',
      text: 'text-foreground'
    },
    footer: {
      container: 'bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-sm',
      icon: 'text-neutral-700 dark:text-neutral-300',
      text: 'text-foreground'
    },
    auth: {
      container: 'bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg backdrop-blur-sm',
      icon: 'text-blue-600 dark:text-blue-400',
      text: 'text-gray-900 dark:text-white font-bold'
    }
  }

  const sizes = sizeClasses[size]
  const variants = variantClasses[variant]

  const logoContent = (
    <div className={cn(
      'flex items-center group',
      sizes.spacing,
      className
    )} {...props}>
      <div className={cn(
        'flex items-center justify-center transition-all duration-300',
        sizes.container,
        variants.container,
        'group-hover:scale-105 transform group-hover:shadow-md',
        variant === 'auth' && 'group-hover:bg-neutral-100 dark:group-hover:bg-neutral-700/50'
      )}>
        <GitBranch className={cn(
          sizes.icon,
          variants.icon,
          'transition-all duration-300',
          'group-hover:scale-110'
        )} />
      </div>
      {showText && (
        <span className={cn(
          sizes.text,
          variants.text,
          'transition-colors duration-200',
          'group-hover:text-neutral-900 dark:group-hover:text-white'
        )}>
          AutoMaxLib
        </span>
      )}
    </div>
  )

  if (linkTo) {
    return (
      <Link to={linkTo} className="group">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}

export default Logo
