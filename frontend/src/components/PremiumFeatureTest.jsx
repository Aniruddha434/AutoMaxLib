import React, { useState } from 'react'
import { Button } from './ui/Button'
import { Card, CardContent, CardHeader } from './ui/Card'
import PremiumFeaturePreview from './PremiumFeaturePreview'
import FeatureShowcase from './FeatureShowcase'

const PremiumFeatureTest = () => {
  const [activeModal, setActiveModal] = useState(null)

  const openModal = (type) => {
    setActiveModal(type)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  const handleUpgrade = () => {
    alert('Upgrade button clicked! This would redirect to the upgrade page.')
    closeModal()
  }

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Premium Feature Preview Test
        </h1>
        <p className="text-xl text-gray-600">
          Test the premium feature preview components and modals
        </p>
      </div>

      {/* Manual Modal Triggers */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Manual Modal Tests</h2>
          <p className="text-gray-600">Click these buttons to test the premium preview modals directly</p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              onClick={() => openModal('pattern')}
              className="bg-green-500 hover:bg-green-600"
            >
              Test Pattern Preview Modal
            </Button>
            <Button 
              onClick={() => openModal('readme')}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Test README Preview Modal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feature Showcase Component */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Feature Showcase Component</h2>
          <p className="text-gray-600">This is the component that will be displayed on the home page</p>
        </CardHeader>
        <CardContent>
          <FeatureShowcase onUpgrade={handleUpgrade} />
        </CardContent>
      </Card>

      {/* Image Loading Test */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Image Loading Test</h2>
          <p className="text-gray-600">Verify that the example images are loading correctly</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Pattern Example</h3>
              <div className="border rounded-lg overflow-hidden">
                <img 
                  src="/patternEX.png" 
                  alt="Pattern example"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    console.error('Pattern image failed to load')
                    e.target.style.border = '2px solid red'
                    e.target.alt = 'Failed to load pattern image'
                  }}
                  onLoad={() => console.log('Pattern image loaded successfully')}
                />
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">README Example</h3>
              <div className="border rounded-lg overflow-hidden">
                <img 
                  src="/ReadmiEX.png" 
                  alt="README example"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    console.error('README image failed to load')
                    e.target.style.border = '2px solid red'
                    e.target.alt = 'Failed to load README image'
                  }}
                  onLoad={() => console.log('README image loaded successfully')}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Component Status */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Component Status</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>PremiumFeaturePreview component loaded</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>FeatureShowcase component loaded</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>UI components (Dialog, Button, Card, Badge) loaded</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Lucide React icons loaded</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium Feature Preview Modals */}
      <PremiumFeaturePreview
        isOpen={activeModal === 'pattern'}
        onClose={closeModal}
        featureType="pattern"
        onUpgrade={handleUpgrade}
      />

      <PremiumFeaturePreview
        isOpen={activeModal === 'readme'}
        onClose={closeModal}
        featureType="readme"
        onUpgrade={handleUpgrade}
      />
    </div>
  )
}

export default PremiumFeatureTest
