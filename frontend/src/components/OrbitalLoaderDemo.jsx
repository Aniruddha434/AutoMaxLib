import React, { useState } from 'react';
import { OrbitalLoader } from './ui/orbital-loader';
import { Button } from './ui/Button';

export default function OrbitalLoaderDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [messagePlacement, setMessagePlacement] = useState('bottom');

  const handleStartLoading = () => {
    setIsLoading(true);
    // Simulate loading for 3 seconds
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          OrbitalLoader Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          A beautiful animated loading component with orbital rings
        </p>
      </div>

      {/* Basic Usage */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Basic Usage
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <OrbitalLoader />
        </div>
      </div>

      {/* With Message */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          With Message
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <OrbitalLoader message="Loading your data..." />
        </div>
      </div>

      {/* Different Message Placements */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Message Placement Options
        </h2>
        <div className="flex gap-2 mb-4">
          {['bottom', 'top', 'left', 'right'].map((placement) => (
            <Button
              key={placement}
              onClick={() => setMessagePlacement(placement)}
              variant={messagePlacement === placement ? 'primary' : 'secondary'}
              size="sm"
            >
              {placement}
            </Button>
          ))}
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <OrbitalLoader 
            message={`Message on ${messagePlacement}`}
            messagePlacement={messagePlacement}
          />
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Interactive Demo
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          {isLoading ? (
            <OrbitalLoader message="Processing your request..." />
          ) : (
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Click the button to see the loader in action
              </p>
              <Button onClick={handleStartLoading}>
                Start Loading
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Custom Styling */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Custom Styling
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <OrbitalLoader 
            className="w-24 h-24 text-blue-500"
            message="Custom sized loader"
          />
        </div>
      </div>

      {/* Usage Examples */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Usage Examples
        </h2>
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
{`// Basic usage
<OrbitalLoader />

// With message
<OrbitalLoader message="Loading..." />

// Custom placement
<OrbitalLoader 
  message="Processing..." 
  messagePlacement="right" 
/>

// Custom styling
<OrbitalLoader 
  className="w-24 h-24 text-blue-500"
  message="Custom loader"
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
}
