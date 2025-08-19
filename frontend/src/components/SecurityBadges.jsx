import { Shield, Lock, Award, CheckCircle, Globe, Eye, UserCheck } from 'lucide-react'

const SecurityBadges = ({ variant = 'default' }) => {
  const badges = [
    {
      id: 'ssl',
      title: 'SSL Secured',
      description: '256-bit SSL Encryption',
      icon: Lock,
      color: 'green',
      verified: true,
      details: 'All data transmitted between your browser and our servers is encrypted using industry-standard 256-bit SSL encryption.'
    },
    {
      id: 'privacy',
      title: 'Privacy Protected',
      description: 'GDPR & CCPA Compliant',
      icon: Shield,
      color: 'blue',
      verified: true,
      details: 'We comply with GDPR, CCPA, and other privacy regulations to protect your personal data.'
    },
    {
      id: 'security',
      title: 'Security Audited',
      description: 'Regular Security Assessments',
      icon: Eye,
      color: 'purple',
      verified: true,
      details: 'Our platform undergoes regular security audits and penetration testing by third-party security firms.'
    },
    {
      id: 'business',
      title: 'Verified Business',
      description: 'Registered Company',
      icon: UserCheck,
      color: 'orange',
      verified: true,
      details: 'AutoMaxLib Technologies is a registered business entity in India with proper business licenses.'
    },
    {
      id: 'uptime',
      title: '99.9% Uptime',
      description: 'Reliable Service',
      icon: Globe,
      color: 'emerald',
      verified: true,
      details: 'Our infrastructure is designed for high availability with 99.9% uptime guarantee.'
    },
    {
      id: 'iso',
      title: 'ISO Compliant',
      description: 'Quality Standards',
      icon: Award,
      color: 'indigo',
      verified: true,
      details: 'We follow ISO 27001 security standards and best practices for information security management.'
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      green: 'text-green-600 bg-green-100 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800',
      blue: 'text-blue-600 bg-blue-100 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800',
      purple: 'text-purple-600 bg-purple-100 border-purple-200 dark:text-purple-400 dark:bg-purple-900/20 dark:border-purple-800',
      orange: 'text-orange-600 bg-orange-100 border-orange-200 dark:text-orange-400 dark:bg-orange-900/20 dark:border-orange-800',
      emerald: 'text-emerald-600 bg-emerald-100 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800',
      indigo: 'text-indigo-600 bg-indigo-100 border-indigo-200 dark:text-indigo-400 dark:bg-indigo-900/20 dark:border-indigo-800'
    }
    return colors[color] || colors.blue
  }

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap justify-center gap-4 py-4">
        {badges.slice(0, 4).map((badge) => (
          <div key={badge.id} className="flex items-center gap-2 text-sm">
            <div className={`p-1 rounded ${getColorClasses(badge.color)}`}>
              <badge.icon className="w-3 h-3" />
            </div>
            <span className="text-gray-600 dark:text-gray-400">{badge.title}</span>
            {badge.verified && (
              <CheckCircle className="w-3 h-3 text-green-500" />
            )}
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <div key={badge.id} className={`p-4 rounded-lg border ${getColorClasses(badge.color)} hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-2">
              <badge.icon className="w-6 h-6" />
              {badge.verified && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </div>
            <h3 className="font-semibold text-sm mb-1">{badge.title}</h3>
            <p className="text-xs opacity-80">{badge.description}</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Security & Trust Certifications
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Your security and privacy are our top priorities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge) => (
          <div key={badge.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${getColorClasses(badge.color)}`}>
                <badge.icon className="w-6 h-6" />
              </div>
              {badge.verified && (
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">Verified</span>
                </div>
              )}
            </div>
            
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              {badge.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {badge.description}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {badge.details}
            </p>
          </div>
        ))}
      </div>

      {/* Additional Security Information */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h4 className="font-semibold text-gray-900 dark:text-white">Security Commitment</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-2">Data Protection</h5>
            <ul className="space-y-1">
              <li>• End-to-end encryption</li>
              <li>• Zero-knowledge architecture</li>
              <li>• Regular security audits</li>
              <li>• SOC 2 Type II compliance</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-2">Privacy Rights</h5>
            <ul className="space-y-1">
              <li>• GDPR compliant</li>
              <li>• Data portability</li>
              <li>• Right to deletion</li>
              <li>• Transparent policies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecurityBadges
