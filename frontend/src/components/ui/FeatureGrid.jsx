import { 
  Sparkles, 
  GitBranch, 
  FileText, 
  Network, 
  Zap, 
  Settings, 
  BarChart3, 
  Crown,
  Users,
  Bell,
  CreditCard,
  Code
} from 'lucide-react'
import FeatureCard from './FeatureCard'

const FeatureGrid = ({ 
  userData, 
  dashboardData, 
  onManualCommit, 
  committing = false 
}) => {
  // Calculate usage data from userData
  const getReadmeUsage = () => {
    if (!userData?.readmeGeneration?.generatedReadmes) return null
    return {
      current: userData.readmeGeneration.generatedReadmes.length,
      limit: userData.subscription?.plan === 'premium' ? 10 : 2
    }
  }

  const getRepositoryReadmeUsage = () => {
    if (!userData?.repositoryReadmeGeneration?.generatedReadmes) return null
    return {
      current: userData.repositoryReadmeGeneration.generatedReadmes.length,
      limit: userData.subscription?.plan === 'premium' ? 10 : 2
    }
  }

  const getArchitectureUsage = () => {
    if (!userData?.architectureDiagramGeneration?.generatedDiagrams) return null
    return {
      current: userData.architectureDiagramGeneration.generatedDiagrams.length,
      limit: userData.subscription?.plan === 'premium' ? Infinity : 5
    }
  }

  const isPremium = userData?.subscription?.plan === 'premium'
  const hasConnectedRepo = dashboardData?.activeRepository

  const featureCategories = [
    {
      title: "AI-Powered Tools",
      description: "Generate content with advanced AI",
      features: [
        {
          title: "Profile README",
          description: "Create stunning GitHub profile READMEs with AI assistance",
          icon: FileText,
          href: "/readme-generator",
          gradient: "from-purple-500 to-pink-500",
          usage: getReadmeUsage(),
          status: getReadmeUsage()?.current >= getReadmeUsage()?.limit ? 'limited' : 'available'
        },
        {
          title: "Repository README",
          description: "Generate professional repository documentation",
          icon: FileText,
          href: "/repository-readme-generator",
          gradient: "from-blue-500 to-cyan-500",
          usage: getRepositoryReadmeUsage(),
          status: getRepositoryReadmeUsage()?.current >= getRepositoryReadmeUsage()?.limit ? 'limited' : 'available'
        },
        {
          title: "Architecture Diagrams",
          description: "Visualize your project structure with AI-generated diagrams",
          icon: Network,
          href: "/repository-architecture-generator",
          gradient: "from-green-500 to-emerald-500",
          usage: getArchitectureUsage(),
          status: getArchitectureUsage()?.current >= getArchitectureUsage()?.limit ? 'limited' : 'available'
        },
        {
          title: "Commit Patterns",
          description: "Generate intelligent commit message patterns",
          icon: Code,
          href: "/patterns",
          gradient: "from-amber-500 to-orange-500",
          premium: !isPremium,
          status: isPremium ? 'available' : 'premium'
        }
      ]
    },
    {
      title: "Repository Management",
      description: "Manage your GitHub repositories and automation",
      features: [
        {
          title: "Connect Repository",
          description: "Link your GitHub repositories for automated commits",
          icon: GitBranch,
          href: "/connect",
          gradient: "from-indigo-500 to-purple-500",
          status: hasConnectedRepo ? 'connected' : 'available',
          badge: hasConnectedRepo ? 'Connected' : null
        },
        {
          title: "Manual Commit",
          description: "Trigger an immediate commit to maintain your streak",
          icon: Zap,
          onClick: onManualCommit,
          gradient: "from-red-500 to-pink-500",
          loading: committing,
          disabled: !hasConnectedRepo,
          status: hasConnectedRepo ? 'available' : 'disabled'
        },
        {
          title: "Auto-Commit Settings",
          description: "Configure automated commit schedules and preferences",
          icon: Settings,
          href: "/settings",
          gradient: "from-gray-500 to-slate-500",
          status: 'available'
        }
      ]
    },
    {
      title: "Account & Settings",
      description: "Manage your account and subscription",
      features: [
        {
          title: "Profile Settings",
          description: "Update your profile information and preferences",
          icon: Settings,
          href: "/settings",
          gradient: "from-slate-500 to-gray-500",
          status: 'available'
        },
        {
          title: "Upgrade to Premium",
          description: "Unlock unlimited features and advanced capabilities",
          icon: Crown,
          href: "/upgrade",
          gradient: "from-purple-500 to-pink-500",
          premium: true,
          status: isPremium ? 'connected' : 'premium',
          badge: isPremium ? 'Premium' : null
        }
      ]
    }
  ]

  return (
    <div className="space-y-12">
      {featureCategories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="space-y-6">
          {/* Category Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              {category.title}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              {category.description}
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.features.map((feature, featureIndex) => (
              <FeatureCard
                key={featureIndex}
                {...feature}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default FeatureGrid
