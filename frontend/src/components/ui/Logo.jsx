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
      container: 'bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl',
      icon: 'text-white',
      text: 'text-foreground'
    },
    navbar: {
      container: 'bg-primary rounded-lg',
      icon: 'text-primary-foreground',
      text: 'text-foreground'
    },
    footer: {
      container: 'bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl shadow-elegant',
      icon: 'text-white',
      text: 'text-gradient-primary'
    },
    auth: {
      container: 'bg-indigo-100 dark:bg-indigo-900/30 rounded-lg',
      icon: 'text-indigo-600 dark:text-indigo-400',
      text: 'text-slate-900 dark:text-slate-100'
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
        'group-hover:scale-110 transform',
        variant === 'footer' && 'group-hover:shadow-glow',
        variant === 'auth' && 'group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50'
      )}>
        <GitBranch className={cn(
          sizes.icon,
          variants.icon,
          'transition-transform duration-300',
          variant === 'footer' && 'group-hover:rotate-12'
        )} />
      </div>
      {showText && (
        <span className={cn(
          sizes.text,
          variants.text,
          'transition-colors duration-200',
          variant === 'auth' && 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
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
