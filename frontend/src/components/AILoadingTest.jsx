import React, { useState } from 'react';
import AILoadingAnimation, { 
  RepositoryAnalysisLoader, 
  ReadmeGenerationLoader, 
  ProfileReadmeGenerationLoader, 
  ArchitectureGenerationLoader, 
  DeploymentLoader 
} from './ui/AILoadingAnimation';

const AILoadingTest = () => {
  const [activeLoader, setActiveLoader] = useState(null);

  const loaders = [
    { name: 'Repository Analysis', component: RepositoryAnalysisLoader },
    { name: 'README Generation', component: ReadmeGenerationLoader },
    { name: 'Profile README Generation', component: ProfileReadmeGenerationLoader },
    { name: 'Architecture Generation', component: ArchitectureGenerationLoader },
    { name: 'Deployment', component: DeploymentLoader },
    { 
      name: 'Custom Loading', 
      component: () => (
        <AILoadingAnimation 
          message="Custom AI Task" 
          subMessage="This is a custom AI loading animation with your Lottie animation!"
        />
      )
    }
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        AI Loading Animation Test
      </h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {loaders.map((loader, index) => (
          <button
            key={index}
            onClick={() => setActiveLoader(index)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Test {loader.name}
          </button>
        ))}
        <button
          onClick={() => setActiveLoader(null)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Close All
        </button>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Instructions:</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Click any button above to test the corresponding AI loading animation</li>
          <li>The animation should appear centered on screen with a backdrop</li>
          <li>Each animation uses the Lottie animation you provided</li>
          <li>Different animations have contextual messages for different AI tasks</li>
          <li>Click "Close All" to dismiss any active animation</li>
        </ul>
      </div>

      {/* Render active loader */}
      {activeLoader !== null && (
        <div className="relative">
          {React.createElement(loaders[activeLoader].component)}
        </div>
      )}
    </div>
  );
};

export default AILoadingTest;
