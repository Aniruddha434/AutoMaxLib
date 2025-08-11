import React, { useState, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { cn } from '../../utils/cn';

const AILoadingAnimation = ({
  message = 'AI is working...',
  subMessage = '',
  animatedMessages = null,
  size = 'default',
  className = '',
  fullScreen = true,
  backdrop = true,
  ...props
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [currentAnimatedMessage, setCurrentAnimatedMessage] = useState(message)

  // Handle animated messages
  useEffect(() => {
    if (!animatedMessages || animatedMessages.length === 0) {
      setCurrentAnimatedMessage(message)
      return
    }

    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % animatedMessages.length
        setCurrentAnimatedMessage(animatedMessages[nextIndex])
        return nextIndex
      })
    }, 2000) // Change message every 2 seconds

    // Set initial message
    setCurrentAnimatedMessage(animatedMessages[0])

    return () => clearInterval(interval)
  }, [animatedMessages, message])
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          animation: 'w-32 h-32',
          text: 'text-base',
          subText: 'text-sm',
          container: 'gap-4'
        }
      case 'lg':
        return {
          animation: 'w-56 h-56',
          text: 'text-2xl',
          subText: 'text-lg',
          container: 'gap-8'
        }
      case 'xl':
        return {
          animation: 'w-64 h-64',
          text: 'text-3xl',
          subText: 'text-xl',
          container: 'gap-10'
        }
      default:
        return {
          animation: 'w-48 h-48',
          text: 'text-xl',
          subText: 'text-base',
          container: 'gap-6'
        }
    }
  }

  const sizes = getSizeClasses()

  const content = (
    <div className={cn(
      'flex flex-col items-center justify-center text-center',
      sizes.container,
      className
    )} {...props}>
      {/* Lottie Animation */}
      <div className={cn('flex items-center justify-center mb-2', sizes.animation)}>
        <DotLottieReact
          src="https://lottie.host/780094ea-1051-4c28-847c-f93901dd1c07/p8UXevvXY5.lottie"
          loop
          autoplay
          className="w-full h-full drop-shadow-lg"
        />
      </div>

      {/* Animated Message with beautiful styling */}
      {currentAnimatedMessage && (
        <div className={cn(
          'font-bold text-white drop-shadow-lg mb-2 transition-all duration-500 ease-in-out',
          'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent',
          animatedMessages ? 'animate-fade-in' : 'animate-pulse',
          sizes.text
        )}>
          {currentAnimatedMessage}
        </div>
      )}

      {/* Sub Message with enhanced visibility */}
      {subMessage && (
        <div className={cn(
          'text-white/90 drop-shadow-md max-w-lg text-center leading-relaxed',
          'bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2',
          sizes.subText
        )}>
          {subMessage}
        </div>
      )}

      {/* Enhanced loading dots indicator */}
      <div className="flex space-x-2 mt-4">
        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce drop-shadow-sm"></div>
        <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce drop-shadow-sm" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-bounce drop-shadow-sm" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        backdrop && 'bg-black/30 backdrop-blur-sm'
      )}>
        {content}
      </div>
    )
  }

  return content
}

// Animated message sequences for different AI tasks
export const ANIMATED_MESSAGES = {
  ANALYZING_REPOSITORY: [
    "🔍 Scanning repository structure...",
    "📁 Analyzing file dependencies...",
    "🔧 Detecting frameworks and tools...",
    "📊 Examining code patterns...",
    "🏗️ Understanding project architecture...",
    "📋 Generating analysis report..."
  ],
  GENERATING_README: [
    "📝 Initializing README generation...",
    "🎯 Analyzing project features...",
    "📖 Writing installation instructions...",
    "💡 Creating usage examples...",
    "🔗 Adding documentation links...",
    "✨ Polishing final content..."
  ],
  GENERATING_PROFILE_README: [
    "✨ Crafting your profile story...",
    "🎨 Designing visual elements...",
    "🏆 Highlighting achievements...",
    "💼 Showcasing your skills...",
    "📈 Adding GitHub stats...",
    "🎉 Finalizing your profile..."
  ],
  GENERATING_ARCHITECTURE: [
    "🏗️ Mapping system components...",
    "🔄 Analyzing data flow...",
    "📐 Creating diagram structure...",
    "🎨 Designing visual layout...",
    "🔗 Connecting relationships...",
    "✅ Finalizing architecture..."
  ],
  DEPLOYING_TO_REPO: [
    "🚀 Preparing deployment...",
    "🔐 Authenticating with GitHub...",
    "📤 Uploading content...",
    "💾 Creating commit...",
    "🔄 Syncing changes...",
    "✅ Deployment complete!"
  ],
  GENERATING_PATTERN_PREVIEW: [
    "🎨 Analyzing pattern text...",
    "📐 Calculating grid dimensions...",
    "🔤 Converting text to pixels...",
    "📊 Mapping contribution intensity...",
    "🎯 Positioning pattern alignment...",
    "✨ Generating preview..."
  ],
  GENERATING_PATTERN_COMMITS: [
    "🎨 Initializing pattern generation...",
    "📅 Calculating commit dates...",
    "🔧 Preparing GitHub repository...",
    "💾 Creating pattern commits...",
    "📈 Building contribution graph...",
    "🎉 Pattern generation complete!"
  ],
  PROCESSING_REQUEST: [
    "⚡ Processing your request...",
    "🧠 AI is thinking...",
    "🔄 Analyzing data...",
    "💡 Generating solution...",
    "🎯 Optimizing results...",
    "✨ Almost ready..."
  ]
}

// Static fallback messages
export const AI_MESSAGES = {
  ANALYZING_REPOSITORY: {
    message: '🔍 Analyzing Repository',
    subMessage: 'AI is diving deep into your codebase...'
  },
  GENERATING_README: {
    message: '📝 Crafting README',
    subMessage: 'AI is writing comprehensive documentation...'
  },
  GENERATING_PROFILE_README: {
    message: '✨ Building Profile',
    subMessage: 'AI is creating your impressive profile...'
  },
  GENERATING_ARCHITECTURE: {
    message: '🏗️ Designing Architecture',
    subMessage: 'AI is analyzing your project structure...'
  },
  DEPLOYING_TO_REPO: {
    message: '🚀 Deploying to GitHub',
    subMessage: 'AI is securely uploading content...'
  },
  PROCESSING_REQUEST: {
    message: '⚡ Processing Request',
    subMessage: 'AI is working on your request...'
  },
  GENERATING_PATTERN_PREVIEW: {
    message: '🎨 Creating Pattern Preview',
    subMessage: 'AI is designing your contribution pattern...'
  },
  GENERATING_PATTERN_COMMITS: {
    message: '🎨 Generating Pattern',
    subMessage: 'AI is creating commits for your pattern...'
  }
}

// Convenience components for specific AI tasks with animated messages
export const RepositoryAnalysisLoader = (props) => (
  <AILoadingAnimation
    {...AI_MESSAGES.ANALYZING_REPOSITORY}
    animatedMessages={ANIMATED_MESSAGES.ANALYZING_REPOSITORY}
    {...props}
  />
)

export const ReadmeGenerationLoader = (props) => (
  <AILoadingAnimation
    {...AI_MESSAGES.GENERATING_README}
    animatedMessages={ANIMATED_MESSAGES.GENERATING_README}
    {...props}
  />
)

export const ProfileReadmeGenerationLoader = (props) => (
  <AILoadingAnimation
    {...AI_MESSAGES.GENERATING_PROFILE_README}
    animatedMessages={ANIMATED_MESSAGES.GENERATING_PROFILE_README}
    {...props}
  />
)

export const ArchitectureGenerationLoader = (props) => (
  <AILoadingAnimation
    {...AI_MESSAGES.GENERATING_ARCHITECTURE}
    animatedMessages={ANIMATED_MESSAGES.GENERATING_ARCHITECTURE}
    {...props}
  />
)

export const DeploymentLoader = (props) => (
  <AILoadingAnimation
    {...AI_MESSAGES.DEPLOYING_TO_REPO}
    animatedMessages={ANIMATED_MESSAGES.DEPLOYING_TO_REPO}
    {...props}
  />
)

export const PatternPreviewLoader = (props) => (
  <AILoadingAnimation
    {...AI_MESSAGES.GENERATING_PATTERN_PREVIEW}
    animatedMessages={ANIMATED_MESSAGES.GENERATING_PATTERN_PREVIEW}
    {...props}
  />
)

export const PatternGenerationLoader = (props) => (
  <AILoadingAnimation
    {...AI_MESSAGES.GENERATING_PATTERN_COMMITS}
    animatedMessages={ANIMATED_MESSAGES.GENERATING_PATTERN_COMMITS}
    {...props}
  />
)

export default AILoadingAnimation
