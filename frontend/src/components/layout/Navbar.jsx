import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, UserButton } from '@clerk/clerk-react'
import { useTheme } from '../../contexts/ThemeContext'
import { Menu, X, Moon, Sun, GitBranch } from 'lucide-react'

const Navbar = () => {
  const { isSignedIn } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="sticky top-0 z-50 glass border-b border-neutral-200/50 dark:border-neutral-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center shadow-elegant group-hover:shadow-glow transition-all duration-300 group-hover:scale-105 transform">
              <GitBranch className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
              AutoMaxLib
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isSignedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="nav-link"
                >
                  Dashboard
                </Link>
                <Link
                  to="/connect"
                  className="nav-link"
                >
                  Connect
                </Link>
                <Link
                  to="/patterns"
                  className="nav-link"
                >
                  Patterns
                </Link>
                <Link
                  to="/readme-generator"
                  className="nav-link"
                >
                  README AI
                </Link>
                <Link
                  to="/settings"
                  className="nav-link"
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
              <div className="ml-3">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
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
              onClick={toggleMenu}
              className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all duration-200 hover:scale-105 transform shadow-soft"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              ) : (
                <Menu className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-neutral-200/50 dark:border-neutral-800/50 glass">
            <div className="flex flex-col space-y-1">
              {isSignedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    className="nav-link block"
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/connect"
                    className="nav-link block"
                    onClick={toggleMenu}
                  >
                    Connect
                  </Link>
                  <Link
                    to="/patterns"
                    className="nav-link block"
                    onClick={toggleMenu}
                  >
                    Patterns
                  </Link>
                  <Link
                    to="/readme-generator"
                    className="nav-link block"
                    onClick={toggleMenu}
                  >
                    README AI
                  </Link>
                  <Link
                    to="/settings"
                    className="nav-link block"
                    onClick={toggleMenu}
                  >
                    Settings
                  </Link>
                  <Link
                    to="/upgrade"
                    className="btn-primary mt-4 text-center block"
                    onClick={toggleMenu}
                  >
                    Upgrade
                  </Link>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800 mt-4">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8"
                        }
                      }}
                      afterSignOutUrl="/"
                    />
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/sign-in"
                    className="nav-link block"
                    onClick={toggleMenu}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/sign-up"
                    className="btn-primary mt-4 text-center block"
                    onClick={toggleMenu}
                  >
                    🚀 Let's Go!
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
