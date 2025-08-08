import { Crown, Sparkles, CheckCircle, ArrowRight, X } from 'lucide-react'

const UpgradePrompt = ({ 
  isOpen, 
  onClose, 
  onUpgrade, 
  featureType = 'feature',
  featureName = 'Premium Feature',
  description = 'This is a premium feature that requires an upgrade.',
  benefits = [],
  ctaText = 'Upgrade to Premium'
}) => {
  if (!isOpen) return null

  const defaultBenefits = [
    'Unlimited generations',
    'Priority support',
    'Advanced customization',
    'Export capabilities'
  ]

  const displayBenefits = benefits.length > 0 ? benefits : defaultBenefits

  const featureConfigs = {
    readme: {
      title: 'Complete Your README Generation',
      subtitle: 'You\'ve experienced the power of our AI README generator!',
      description: 'You\'ve successfully configured your profile and seen the preview. To generate and download your professional README, upgrade to Premium.',
      benefits: [
        'Generate unlimited profile READMEs',
        'Access to all premium templates',
        'AI-powered content optimization',
        'One-click GitHub deployment',
        'Download in multiple formats',
        'Priority customer support'
      ],
      icon: Sparkles,
      gradient: 'from-blue-500 to-purple-600'
    },
    pattern: {
      title: 'Generate Your GitHub Pattern',
      subtitle: 'You\'ve designed the perfect contribution pattern!',
      description: 'You\'ve configured your pattern and seen the preview. To generate the actual commits and create your pattern, upgrade to Premium.',
      benefits: [
        'Generate unlimited GitHub patterns',
        'Custom text and designs',
        'Smart commit scheduling',
        'Historical backfill capability',
        'Multiple pattern templates',
        'Advanced customization options'
      ],
      icon: Crown,
      gradient: 'from-green-500 to-blue-600'
    },
    default: {
      title: `Complete Your ${featureName}`,
      subtitle: 'You\'ve experienced our premium feature!',
      description: description,
      benefits: displayBenefits,
      icon: Sparkles,
      gradient: 'from-purple-500 to-pink-600'
    }
  }

  const config = featureConfigs[featureType] || featureConfigs.default
  const IconComponent = config.icon

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header with gradient */}
        <div className={`bg-gradient-to-r ${config.gradient} p-6 text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center mb-3">
            <div className="p-2 bg-white/20 rounded-lg mr-3">
              <IconComponent className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{config.title}</h3>
              <p className="text-white/90 text-sm">{config.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {config.description}
          </p>

          {/* Benefits */}
          <div className="space-y-3 mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wide">
              What you'll get with Premium:
            </h4>
            {config.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Pricing hint */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <div className="flex items-center text-yellow-800 dark:text-yellow-200">
              <Crown className="h-4 w-4 mr-2" />
              <span className="font-medium text-sm">Starting at just $6/month</span>
            </div>
            <p className="text-yellow-700 dark:text-yellow-300 text-xs mt-1">
              Cancel anytime • 30-day money-back guarantee
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors font-medium"
            >
              Maybe Later
            </button>
            <button
              onClick={onUpgrade}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-medium flex items-center justify-center"
            >
              <Crown className="h-4 w-4 mr-2" />
              {ctaText}
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpgradePrompt
