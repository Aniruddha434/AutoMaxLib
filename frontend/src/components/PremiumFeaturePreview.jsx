import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Button } from './ui/Button'
import { Badge } from './ui/badge'
import { Card, CardContent } from './ui/Card'
import { Crown, Sparkles, GitBranch, FileText, ArrowRight, Check } from 'lucide-react'

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${config.color}`}>
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                {config.title}
                <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-lg text-gray-600">
                {config.subtitle}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Feature Image Preview */}
          <Card className="overflow-hidden border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors">
            <CardContent className="p-0">
              <div className="relative group">
                <img
                  src={config.image}
                  alt={config.imageAlt}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    console.error('Failed to load premium preview image:', config.image)
                    e.target.style.display = 'none'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Badge className="bg-white/90 text-gray-800">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Premium Preview
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature Description */}
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              {config.description}
            </p>

            {/* Feature List */}
            <div className="grid md:grid-cols-2 gap-3">
              {config.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade CTA */}
          <Card className={`bg-gradient-to-r ${config.color} text-white`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Unlock Premium Features</h3>
                  <p className="text-white/90 mb-4">
                    Get access to {config.title.toLowerCase()} and all other premium features for just $6/month.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-white/80">
                    <span>✨ All premium features</span>
                    <span>🚀 Priority support</span>
                    <span>🔄 Cancel anytime</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={onUpgrade}
                    size="lg"
                    className="bg-white text-gray-900 hover:bg-gray-100 font-semibold"
                  >
                    Upgrade to Premium
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                    className="text-white/80 hover:text-white hover:bg-white/10"
                  >
                    Maybe Later
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PremiumFeaturePreview
