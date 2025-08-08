import React, { useState } from 'react';
import { OrbitalLoader } from './ui/orbital-loader';
import { Button } from './ui/Button';
import { Sparkles, Download, Upload } from 'lucide-react';

// Example of how to integrate OrbitalLoader into existing components
export default function OrbitalLoaderIntegrationExample() {
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [deploying, setDeploying] = useState(false);

  const simulateGeneration = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  const simulateAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 4000);
  };

  const simulateDeployment = () => {
    setDeploying(true);
    setTimeout(() => setDeploying(false), 2500);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          OrbitalLoader Integration Examples
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          See how OrbitalLoader can replace existing loading states in your components
        </p>
      </div>

      {/* README Generation Example */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          README Generation
        </h2>
        
        {loading ? (
          <div className="text-center py-8">
            <OrbitalLoader message="Generating your README..." />
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Click to see OrbitalLoader in README generation
            </p>
            <Button onClick={simulateGeneration} className="flex items-center">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate README
            </Button>
          </div>
        )}
      </div>

      {/* Repository Analysis Example */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Repository Analysis
        </h2>
        
        {analyzing ? (
          <div className="text-center py-8">
            <OrbitalLoader 
              message="Analyzing repository structure..." 
              messagePlacement="bottom"
            />
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Click to see OrbitalLoader in repository analysis
            </p>
            <Button onClick={simulateAnalysis} className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Analyze Repository
            </Button>
          </div>
        )}
      </div>

      {/* Deployment Example */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Deployment Process
        </h2>
        
        {deploying ? (
          <div className="text-center py-8">
            <OrbitalLoader 
              message="Deploying to repository..." 
              messagePlacement="right"
              className="w-20 h-20"
            />
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Click to see OrbitalLoader in deployment
            </p>
            <Button onClick={simulateDeployment} className="flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Deploy to Repository
            </Button>
          </div>
        )}
      </div>

      {/* Code Examples */}
      <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Integration Code Examples
        </h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Replace existing button loading state:
            </h3>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-x-auto">
{`// Before (using Loader icon)
{loading ? (
  <>
    <Loader className="h-4 w-4 mr-2 animate-spin" />
    Generating...
  </>
) : (
  <>
    <Sparkles className="h-4 w-4 mr-2" />
    Generate README
  </>
)}

// After (using OrbitalLoader for full loading state)
{loading ? (
  <OrbitalLoader message="Generating your README..." />
) : (
  <Button onClick={generateReadme}>
    <Sparkles className="h-4 w-4 mr-2" />
    Generate README
  </Button>
)}`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Replace LoadingSpinner component:
            </h3>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-x-auto">
{`// Before
<LoadingSpinner size="lg" text="Processing..." />

// After
<OrbitalLoader message="Processing..." className="w-20 h-20" />`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Full page loading overlay:
            </h3>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-x-auto">
{`// Create a full-page loading overlay
<div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
  <OrbitalLoader 
    message="Loading your dashboard..." 
    className="w-24 h-24"
  />
</div>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
