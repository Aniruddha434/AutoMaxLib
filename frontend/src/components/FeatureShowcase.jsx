import React, { useState } from 'react'
import { Card, CardContent } from './ui/Card'
import { Button } from './ui/Button'
import { Badge } from './ui/badge'
import { Crown, GitBranch, FileText, ArrowRight, Sparkles } from 'lucide-react'
import PremiumFeaturePreview from './PremiumFeaturePreview'

const FeatureShowcase = ({ onUpgrade }) => {
  const ASSETS_VER = import.meta.env.VITE_ASSETS_VERSION || '1'
  const [previewModal, setPreviewModal] = useState({ isOpen: false, featureType: null })

  const features = [
    {
      id: 'pattern',
      title: 'GitHub Contribution Patterns',
      description: 'Create stunning visual patterns in your GitHub contribution graph that spell out words, create designs, and showcase your coding dedication.',
      image: `/patternEX.png?v=${ASSETS_VER}`,
      imageAlt: 'GitHub contribution pattern example showing AUTOMAX text pattern',
      icon: GitBranch,
      isPremium: true,
      color: 'from-green-500 to-emerald-600',
      benefits: [
        'Custom text patterns (AUTOMAX, HIREME, etc.)',
        'Artistic designs and shapes',
        'Backfill historical contributions',
        'Smart scheduling for realistic patterns'
      ]
    },
    {
      id: 'readme',
      title: 'AI-Powered README Generation',
      description: 'Generate professional GitHub profile READMEs with AI assistance, featuring modern templates, statistics, and personalized content.',
      image: `/ReadmiEX.png?v=${ASSETS_VER}`,
      imageAlt: 'Professional GitHub README example with modern design and statistics',
      icon: FileText,
      isPremium: true,
      color: 'from-blue-500 to-indigo-600',
      benefits: [
        'Multiple professional templates',
        'AI-generated content and descriptions',
        'GitHub statistics integration',
        'Technology badges and social media integration'
      ]
    }
  ]

  const handleFeatureClick = (featureType) => {
    setPreviewModal({ isOpen: true, featureType })
  }

  const closePreview = () => {
    setPreviewModal({ isOpen: false, featureType: null })
  }

  return (
    <>
      <section className="bg-gray-50 py-16 md:py-32 dark:bg-transparent">
        <div className="mx-auto max-w-3xl lg:max-w-5xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
              Premium Features
            </h2>
            <p className="text-lg text-foreground max-w-2xl mx-auto">
              Unlock powerful tools to enhance your GitHub profile and showcase your coding journey like never before.
            </p>
          </div>

          <div className="grid grid-cols-6 gap-3">
            {features.map((feature) => {
              const IconComponent = feature.icon

              return (
                <Card
                  key={feature.id}
                  className="col-span-full lg:col-span-3 overflow-hidden cursor-pointer transition"
                  onClick={() => handleFeatureClick(feature.id)}
                >
                  <CardContent className="p-6 pt-6">
                    <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5 mb-6">
                      <IconComponent className="m-auto size-5" strokeWidth={1} />
                    </div>
                    <div className="space-y-2 mb-6">
                      <h3 className="text-lg font-medium transition">
                        {feature.title}
                      </h3>
                      <p className="text-foreground text-sm">
                        {feature.description}
                      </p>
                    </div>

                    {/* Benefits List */}
                    <ul className="space-y-1 mb-6">
                      {feature.benefits.slice(0, 3).map((benefit, index) => (
                        <li key={index} className="flex items-center text-sm text-muted-foreground">
                          <div className="h-1 w-1 bg-current rounded-full mr-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>

                    <Button
                      variant="default"
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleFeatureClick(feature.id)
                      }}
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      View Premium Preview
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Limited Time: Get Premium for just $6/month
              </p>
              <Button
                size="lg"
                onClick={onUpgrade}
              >
                Upgrade to Premium
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Feature Preview Modal */}
      <PremiumFeaturePreview
        isOpen={previewModal.isOpen}
        onClose={closePreview}
        featureType={previewModal.featureType}
        onUpgrade={() => {
          closePreview()
          onUpgrade()
        }}
      />
    </>
  )
}

export default FeatureShowcase
