import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Button } from './ui/Button'
import { Badge } from './ui/badge'
import { Card, CardContent } from './ui/Card'
import { Crown, GitBranch, FileText, ArrowRight, CheckCircle2, Star, Zap, Shield } from 'lucide-react'

const PremiumFeaturePreview = ({ 
  isOpen, 
  onClose, 
  featureType, // 'pattern' or 'readme'
  onUpgrade 
}) => {
  const featureConfig = {
    pattern: {
      title: 'GitHub Contribution Patterns',
      subtitle: 'Create stunning visual patterns in your GitHub contribution graph',
      image: '/patternEX.png',
      imageAlt: 'GitHub contribution pattern example showing AUTOMAX text pattern',
      description: 'Transform your GitHub profile with eye-catching contribution patterns that spell out words, create designs, and showcase your dedication to coding.',
      features: [
        'Custom text patterns (AUTOMAX, HIREME, etc.)',
        'Artistic designs and shapes',
        'Backfill historical contributions',
        'Smart scheduling for realistic patterns',
        'Multiple pattern templates',
        'Preview before applying'
      ],
      icon: GitBranch,
      color: 'from-green-500 to-emerald-600'
    },
    readme: {
      title: 'AI-Powered README Generation',
      subtitle: 'Generate professional GitHub profile READMEs with AI assistance',
      image: '/ReadmiEX.png',
      imageAlt: 'Professional GitHub README example with modern design and statistics',
      description: 'Create stunning, professional GitHub profile READMEs that showcase your skills, projects, and personality with AI-powered content generation.',
      features: [
        'Multiple professional templates',
        'AI-generated content and descriptions',
        'GitHub statistics integration',
        'Technology badges and icons',
        'Social media integration',
        '5 generations per month'
      ],
      icon: FileText,
      color: 'from-blue-500 to-indigo-600'
    }
  }

  const config = featureConfig[featureType] || featureConfig.pattern
  const IconComponent = config.icon

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0" showCloseButton={false}>
        {/* Custom Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors duration-200"
          aria-label="Close dialog"
        >
          <ArrowRight className="h-5 w-5 rotate-45" />
        </button>

        <DialogHeader className="px-8 pt-8 pb-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${config.color} shadow-lg`}>
              <IconComponent className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <DialogTitle className="text-3xl font-bold text-neutral-900 dark:text-white">
                  {config.title}
                </DialogTitle>
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 px-3 py-1">
                  <Crown className="h-3 w-3 mr-1.5" />
                  Premium
                </Badge>
              </div>
              <DialogDescription className="text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {config.subtitle}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-0 pb-8 space-y-8">
          {/* Feature Image Preview */}
          <div className="overflow-hidden rounded-lg">
            <CardContent className="p-0">
              <div className="relative group overflow-hidden rounded-lg">
                <img
                  src={config.image}
                  alt={config.imageAlt}
                  className="w-full h-auto block rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                  onError={(e) => {
                    console.error('Failed to load premium preview image:', config.image)
                    e.target.style.display = 'none'
                  }}
                />


              </div>
            </CardContent>
          </div>

          {/* Feature Description */}
          <div className="px-6 space-y-6">
            <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
              {config.description}
            </p>

            {/* Feature List */}
            <div className="grid md:grid-cols-2 gap-4">
              {config.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200">
                  <div className="flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400" />
                  </div>
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade CTA */}
          <div className="px-6">
            <Card className={`bg-gradient-to-br ${config.color} text-white shadow-xl border-0 overflow-hidden relative`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <CardContent className="px-6 py-8 sm:px-8 sm:py-10 relative">
              <div className="flex flex-col gap-6">
                {/* Text/content at top */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                      <Crown className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold tracking-tight">Unlock Premium Features</h3>
                  </div>
                  <p className="text-white/95 text-base leading-relaxed">
                    Get access to {config.title.toLowerCase()} and all other premium features for just <span className="font-bold">$6/month</span>.
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-3">
                    <div className="flex items-center gap-2 text-white/90 whitespace-nowrap">
                      <Star className="h-4 w-4" />
                      <span>All premium features</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/90 whitespace-nowrap">
                      <Zap className="h-4 w-4" />
                      <span>Priority support</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/90 whitespace-nowrap">
                      <Shield className="h-4 w-4" />
                      <span>Cancel anytime</span>
                    </div>
                  </div>
                </div>
                {/* Buttons at bottom */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
                  <Button
                    onClick={onUpgrade}
                    size="lg"
                    className="w-full sm:w-auto bg-neutral-900 text-white hover:bg-neutral-800 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 text-base"
                  >
                    Upgrade to Premium
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                    className="w-full sm:w-auto text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    Maybe Later
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PremiumFeaturePreview
