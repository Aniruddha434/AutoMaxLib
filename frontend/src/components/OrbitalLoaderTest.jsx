import React from 'react';
import { OrbitalLoader } from './ui/orbital-loader';

// Simple test component to verify OrbitalLoader import and functionality
export default function OrbitalLoaderTest() {
  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          OrbitalLoader Import Test
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Testing if OrbitalLoader is properly imported and working
        </p>
      </div>

      {/* Basic Test */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Basic OrbitalLoader
        </h2>
        <OrbitalLoader />
      </div>

      {/* With Message Test */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          OrbitalLoader with Message
        </h2>
        <OrbitalLoader message="Import successful! 🎉" />
      </div>

      {/* Different Placements */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Different Message Placements
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Bottom</p>
            <OrbitalLoader message="Bottom" messagePlacement="bottom" />
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Top</p>
            <OrbitalLoader message="Top" messagePlacement="top" />
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Left</p>
            <OrbitalLoader message="Left" messagePlacement="left" />
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Right</p>
            <OrbitalLoader message="Right" messagePlacement="right" />
          </div>
        </div>
      </div>

      {/* Custom Size */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Custom Size
        </h2>
        <OrbitalLoader 
          message="Large loader" 
          className="w-24 h-24"
        />
      </div>

      <div className="text-center text-green-600 dark:text-green-400 font-semibold">
        ✅ OrbitalLoader successfully imported and working!
      </div>
    </div>
  );
}
