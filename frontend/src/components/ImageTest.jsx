import React from 'react'

const ImageTest = () => {
  const ASSETS_VER = import.meta.env.VITE_ASSETS_VERSION || '1'
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Image Test Page</h1>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Pattern Example Image</h2>
        <div className="border rounded-lg overflow-hidden max-w-2xl">
          <img 
            src={`/patternEX.png?v=${ASSETS_VER}` }
            alt="GitHub contribution pattern example"
            className="w-full h-auto"
            onError={(e) => {
              console.error('Failed to load pattern image:', e)
              e.target.style.display = 'none'
            }}
            onLoad={() => console.log('Pattern image loaded successfully')}
          />
        </div>
        <p className="text-sm text-gray-600">Path: /patternEX.png</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">README Example Image</h2>
        <div className="border rounded-lg overflow-hidden max-w-2xl">
          <img 
            src={`/ReadmiEX.png?v=${ASSETS_VER}` }
            alt="GitHub README example"
            className="w-full h-auto"
            onError={(e) => {
              console.error('Failed to load README image:', e)
              e.target.style.display = 'none'
            }}
            onLoad={() => console.log('README image loaded successfully')}
          />
        </div>
        <p className="text-sm text-gray-600">Path: /ReadmiEX.png</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Image Information</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p><strong>Pattern Image:</strong> Should show GitHub contribution pattern spelling "AUTOMAX"</p>
          <p><strong>README Image:</strong> Should show a professional GitHub profile README with stats and badges</p>
          <p><strong>Location:</strong> Both images should be in the public folder</p>
        </div>
      </div>
    </div>
  )
}

export default ImageTest
