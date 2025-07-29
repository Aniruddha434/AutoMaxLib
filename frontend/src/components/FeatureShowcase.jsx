import React, { useState } from 'react'
import { Card, CardContent } from './ui/Card'
import { Button } from './ui/Button'
import { Badge } from './ui/badge'
import { Crown, GitBranch, FileText, ArrowRight, Sparkles } from 'lucide-react'
import PremiumFeaturePreview from './PremiumFeaturePreview'

const FeatureShowcase = ({ onUpgrade }) => {
  const [previewModal, setPreviewModal] = useState({ isOpen: false, featureType: null })

  const features = [
    {
      id: 'pattern',
      title: 'GitHub Contribution Patterns',
      description: 'Create stunning visual patterns in your GitHub contribution graph that spell out words, create designs, and showcase your coding dedication.',
      image: '/patternEX.png',
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
      image: '/ReadmiEX.png',
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
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Premium Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlock powerful tools to enhance your GitHub profile and showcase your coding journey like never before.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature) => {
              const IconComponent = feature.icon
              
              return (
                <Card 
                  key={feature.id}
                  className="group overflow-hidden border-2 hover:border-gray-300 transition-all duration-300 hover:shadow-xl cursor-pointer"
                  onClick={() => handleFeatureClick(feature.id)}
                >
                  <CardContent className="p-0">
                    {/* Image Section */}
                    <div className="relative overflow-hidden">
                      <img
                        src={feature.image}
                        alt={feature.imageAlt}
                        className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          console.error('Failed to load feature image:', feature.image)
                          e.target.style.display = 'none'
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      
                      {/* Premium Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      </div>

                      {/* Feature Icon */}
                      <div className="absolute bottom-4 left-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color} shadow-lg`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button 
                          size="lg" 
                          className="bg-white text-gray-900 hover:bg-gray-100 font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Preview Feature
                        </Button>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {feature.description}
                      </p>

                      {/* Benefits List */}
                      <ul className="space-y-2 mb-6">
                        {feature.benefits.slice(0, 3).map((benefit, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <div className="h-1.5 w-1.5 bg-green-500 rounded-full mr-3 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                        {feature.benefits.length > 3 && (
                          <li className="text-sm text-gray-500 italic">
                            + {feature.benefits.length - 3} more features...
                          </li>
                        )}
                      </ul>

                      {/* CTA Button */}
                      <Button 
                        className={`w-full bg-gradient-to-r ${feature.color} hover:opacity-90 text-white border-0 group-hover:shadow-lg transition-all duration-300`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleFeatureClick(feature.id)
                        }}
                      >
                        View Premium Preview
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full text-sm font-medium mb-4">
              <Crown className="h-4 w-4" />
              Limited Time: Get Premium for just $6/month
            </div>
            <div>
              <Button 
                size="lg" 
                onClick={onUpgrade}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8"
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
