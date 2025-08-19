import { Link } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { 
  FileText, 
  Zap, 
  Shield, 
  Users, 
  Award,
  ArrowRight,
  CheckCircle,
  Star,
  Github,
  Code,
  Layers,
  Target
} from 'lucide-react'
import SEOHead from '../../components/SEOHead'

const RepositoryReadmeGeneratorLanding = () => {
  const { isSignedIn } = useAuth()

  const features = [
    {
      icon: Code,
      title: "Repository Analysis",
      description: "Deep analysis of your repository structure, dependencies, and codebase to generate accurate documentation."
    },
    {
      icon: Layers,
      title: "Template Selection",
      description: "Choose from specialized templates for web apps, libraries, CLI tools, APIs, and more."
    },
    {
      icon: Target,
      title: "Custom Sections",
      description: "Add custom sections and tailor the README to your specific project needs."
    },
    {
      icon: Zap,
      title: "Instant Generation",
      description: "Generate comprehensive README files in seconds with our advanced AI technology."
    }
  ]

  const templates = [
    "Web Application",
    "Library/Package",
    "CLI Tool",
    "API Service",
    "Mobile App",
    "Data Science",
    "Game/Entertainment",
    "Educational"
  ]

  const benefits = [
    "Professional documentation in minutes",
    "Improved project discoverability",
    "Attract more contributors and users",
    "Follow documentation best practices",
    "SEO-optimized for GitHub search",
    "Multiple export formats"
  ]

  return (
    <>
      <SEOHead
        title="Repository README Generator - AI-Powered GitHub Documentation"
        description="Generate professional README files for your GitHub repositories with AI. Analyze code structure, select templates, and create comprehensive documentation instantly."
        keywords="repository README generator, GitHub README generator, repository documentation AI, GitHub documentation generator, README creator, repository README AI"
        canonicalUrl="/repository-readme-generator"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Repository README Generator",
          "description": "AI-powered tool for generating professional repository README files",
          "url": "https://automaxlib.online/repository-readme-generator",
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        }}
      />
      
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-green-600 rounded-full">
                  <FileText className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Repository <span className="text-green-600">README Generator</span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
                Create professional README files for your GitHub repositories with AI-powered analysis. 
                Generate comprehensive documentation that showcases your projects effectively.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  to={isSignedIn ? "/repository-readme-generator" : "/sign-up?redirect=/repository-readme-generator"}
                  className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Generate Repository README
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                
                <Link
                  to="/about"
                  className="inline-flex items-center px-8 py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Learn More
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Secure Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">Instant Results</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">500+ Repositories</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span className="text-sm">Free Trial</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Intelligent Repository Analysis
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Our AI analyzes your repository structure, dependencies, and code to generate 
                accurate and comprehensive README documentation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                      <feature.icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Templates Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Specialized Templates
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Choose from templates optimized for different project types
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {templates.map((template, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {template}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Professional Documentation Made Easy
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                  Transform your repositories with professional README files that attract 
                  contributors, users, and showcase your work effectively.
                </p>
                
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-900 rounded-lg p-8 shadow-lg">
                <div className="text-center mb-6">
                  <Github className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Repository Processing
                  </h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">File Structure</span>
                    <span className="text-green-500">✓ Scanned</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Dependencies</span>
                    <span className="text-green-500">✓ Analyzed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Template Match</span>
                    <span className="text-green-500">✓ Selected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">README Generation</span>
                    <span className="text-blue-500">⚡ Processing...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-green-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Create Professional READMEs?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Join developers worldwide who trust our AI to create amazing repository documentation
            </p>
            <Link
              to={isSignedIn ? "/repository-readme-generator" : "/sign-up?redirect=/repository-readme-generator"}
              className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FileText className="w-5 h-5 mr-2" />
              Start Generating READMEs
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}

export default RepositoryReadmeGeneratorLanding
