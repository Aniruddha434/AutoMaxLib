import { Link } from 'react-router-dom'
import { GitBranch, Heart, Github, Twitter, Mail, ExternalLink } from 'lucide-react'
import { cn } from '../../utils/cn'
import Logo from '../ui/Logo'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const productLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Pricing', href: '/upgrade' },
    { label: 'Features', href: '/#features' },
    { label: 'README AI', href: '/readme-generator' },
    { label: 'Patterns', href: '/patterns' }
  ]

  const supportLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Refund Policy', href: '/refund-policy' }
  ]

  const socialLinks = [
    {
      label: 'GitHub',
      href: 'https://github.com',
      icon: Github
    },
    {
      label: 'Twitter',
      href: 'https://twitter.com',
      icon: Twitter
    },
    {
      label: 'Email',
      href: 'mailto:support@automaxlib.online',
      icon: Mail
    }
  ]

  return (
    <footer className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 border-t border-neutral-200 dark:border-neutral-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6">
              <Logo variant="footer" size="lg" />
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md leading-relaxed text-lg">
              The intelligent way to maintain your coding consistency and build a professional
              developer profile that stands out to employers and peers.
            </p>
            <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-6">
              Made with <Heart className="h-4 w-4 mx-1 text-secondary-500 animate-pulse" /> for developers worldwide
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="p-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200 hover:scale-110 transform shadow-soft hover:shadow-elegant"
                    aria-label={social.label}
                  >
                    <IconComponent className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-6 flex items-center">
              Product
              <div className="ml-2 w-8 h-0.5 bg-gradient-to-r from-primary-500 to-transparent"></div>
            </h3>
            <ul className="space-y-4">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="group flex items-center text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.label}
                    </span>
                    {link.href.startsWith('http') && (
                      <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-6 flex items-center">
              Support
              <div className="ml-2 w-8 h-0.5 bg-gradient-to-r from-secondary-500 to-transparent"></div>
            </h3>
            <ul className="space-y-4">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="group flex items-center text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                © {currentYear} AutoMaxLib. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 text-xs text-neutral-400">
                <span>Powered by AI</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-xs text-neutral-400">
                Status: <span className="text-green-500">All systems operational</span>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
