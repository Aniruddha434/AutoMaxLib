import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth, UserButton } from '@clerk/clerk-react'
import { useTheme } from '../../contexts/ThemeContext'
import { Menu, X, Moon, Sun, GitBranch, ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'
import Logo from '../ui/Logo'

const Navbar = () => {
  const { isSignedIn } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleToggleMenu = () => setIsMenuOpen(!isMenuOpen)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const isActiveRoute = (path) => location.pathname === path

  return (
    <nav className={cn(
      'sticky top-0 z-50 transition-all duration-300',
      'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border',
      isScrolled && 'shadow-sm'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo variant="navbar" size="sm" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isSignedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className={cn(
                    'nav-link',
                    isActiveRoute('/dashboard') && 'nav-link-active'
                  )}
                >
                  Dashboard
                </Link>
                <Link
                  to="/connect"
                  className={cn(
                    'nav-link',
                    isActiveRoute('/connect') && 'nav-link-active'
                  )}
                >
                  Connect
                </Link>
                <Link
                  to="/patterns"
                  className={cn(
                    'nav-link',
                    isActiveRoute('/patterns') && 'nav-link-active'
                  )}
                >
                  Patterns
                </Link>
                <Link
                  to="/readme-generator"
                  className={cn(
                    'nav-link',
                    isActiveRoute('/readme-generator') && 'nav-link-active'
                  )}
                >
                  Profile README
                </Link>
                <Link
                  to="/repository-readme-generator"
                  className={cn(
                    'nav-link',
                    isActiveRoute('/repository-readme-generator') && 'nav-link-active'
                  )}
                >
                  Repo README
                </Link>
                <Link
                  to="/repository-architecture-generator"
                  className={cn(
                    'nav-link',
                    isActiveRoute('/repository-architecture-generator') && 'nav-link-active'
                  )}
                >
                  Repo Architecture
                </Link>
                <Link
                  to="/settings"
                  className={cn(
                    'nav-link',
                    isActiveRoute('/settings') && 'nav-link-active'
                  )}
                >
                  Settings
                </Link>
                <Link
                  to="/upgrade"
                  className="ml-4 btn-primary"
                >
                  Upgrade
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  className="nav-link"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="ml-4 btn-primary"
                >
                  🚀 Let's Go!
                </Link>
              </>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="ml-4 p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all duration-200 hover:scale-105 transform shadow-soft"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-secondary-500" />
              ) : (
                <Moon className="h-4 w-4 text-primary-600" />
              )}
            </button>

            {/* User Button */}
            {isSignedIn && (
              <div className="ml-3 relative">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                      // Pin popover to top-right via custom class (CSS in index.css)
                      userButtonPopoverCard: "navbar-user-popover",
                      userButtonPopoverActionButton: "text-left"
                    }
                  }}
                  userProfileMode="modal"
                  afterSignOutUrl="/"
                />
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all duration-200 hover:scale-105 transform shadow-soft"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-secondary-500" />
              ) : (
                <Moon className="h-4 w-4 text-primary-600" />
              )}
            </button>

            <button
              onClick={handleToggleMenu}
              className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all duration-200 hover:scale-105 transform shadow-soft"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <div className="relative w-5 h-5">
                <span className={cn(
                  'absolute block h-0.5 w-5 bg-neutral-600 dark:bg-neutral-400 transition-all duration-300',
                  isMenuOpen ? 'rotate-45 top-2' : 'top-1'
                )} />
                <span className={cn(
                  'absolute block h-0.5 w-5 bg-neutral-600 dark:bg-neutral-400 transition-all duration-300 top-2',
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                )} />
                <span className={cn(
                  'absolute block h-0.5 w-5 bg-neutral-600 dark:bg-neutral-400 transition-all duration-300',
                  isMenuOpen ? '-rotate-45 top-2' : 'top-3'
                )} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          'md:hidden overflow-hidden transition-all duration-300 ease-out',
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        )}>
          <div className="py-6 border-t border-neutral-200/50 dark:border-neutral-800/50 glass">
            <div className="flex flex-col space-y-1">
              {isSignedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    className={cn(
                      'nav-link block transform transition-all duration-200',
                      isActiveRoute('/dashboard') && 'nav-link-active'
                    )}
                    onClick={handleToggleMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/connect"
                    className={cn(
                      'nav-link block transform transition-all duration-200',
                      isActiveRoute('/connect') && 'nav-link-active'
                    )}
                    onClick={handleToggleMenu}
                  >
                    Connect
                  </Link>
                  <Link
                    to="/patterns"
                    className={cn(
                      'nav-link block transform transition-all duration-200',
                      isActiveRoute('/patterns') && 'nav-link-active'
                    )}
                    onClick={handleToggleMenu}
                  >
                    Patterns
                  </Link>
                  <Link
                    to="/readme-generator"
                    className={cn(
                      'nav-link block transform transition-all duration-200',
                      isActiveRoute('/readme-generator') && 'nav-link-active'
                    )}
                    onClick={handleToggleMenu}
                  >
                    Profile README
                  </Link>
                  <Link
                    to="/repository-readme-generator"
                    className={cn(
                      'nav-link block transform transition-all duration-200',
                      isActiveRoute('/repository-readme-generator') && 'nav-link-active'
                    )}
                    onClick={handleToggleMenu}
                  >
                    Repo README
                  </Link>
                  <Link
                    to="/repository-architecture-generator"
                    className={cn(
                      'nav-link block transform transition-all duration-200',
                      isActiveRoute('/repository-architecture-generator') && 'nav-link-active'
                    )}
                    onClick={handleToggleMenu}
                  >
                    Repo Architecture
                  </Link>
                  <Link
                    to="/settings"
                    className={cn(
                      'nav-link block transform transition-all duration-200',
                      isActiveRoute('/settings') && 'nav-link-active'
                    )}
                    onClick={handleToggleMenu}
                  >
                    Settings
                  </Link>
                  <Link
                    to="/upgrade"
                    className="btn-primary mt-4 text-center block"
                    onClick={handleToggleMenu}
                  >
                    Upgrade
                  </Link>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800 mt-4 relative">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8",
                          // Use same pinned class on mobile
                          userButtonPopoverCard: "navbar-user-popover",
                          userButtonPopoverActionButton: "text-left"
                        }
                      }}
                      userProfileMode="modal"
                      afterSignOutUrl="/"
                    />
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/sign-in"
                    className="nav-link block"
                    onClick={handleToggleMenu}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/sign-up"
                    className="btn-primary mt-4 text-center block"
                    onClick={handleToggleMenu}
                  >
                    🚀 Let's Go!
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
