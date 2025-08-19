import { Link } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { 
  Network, 
  Zap, 
  Shield, 
  Users, 
  Award,
  ArrowRight,
  CheckCircle,
  Star,
  Github,
  Layers,
  Eye,
  Download
} from 'lucide-react'
import SEOHead from '../../components/SEOHead'

const RepositoryArchitectureGeneratorLanding = () => {
  const { isSignedIn } = useAuth()

  const features = [
    {
      icon: Network,
      title: "System Architecture",
      description: "Generate comprehensive system architecture diagrams from your repository structure and code analysis."
    },
    {
      icon: Layers,
      title: "Component Mapping",
      description: "Automatically identify and map relationships between different components and modules."
    },
    {
      icon: Eye,
      title: "Visual Diagrams",
      description: "Create beautiful Mermaid diagrams that visualize your system architecture clearly."
    },
    {
      icon: Download,
      title: "Export Options",
      description: "Save diagrams as images or markdown files directly to your repository."
    }
  ]

  const benefits = [
    "Understand complex codebases instantly",
    "Onboard new team members faster",
    "Document system architecture automatically",
    "Identify potential improvements",
    "Create technical documentation",
    "Visualize dependencies and relationships"
  ]

  const testimonials = [
    {
      name: "Alex Thompson",
      role: "Software Architect",
      content: "The architecture diagrams helped our team understand a legacy codebase in minutes instead of days.",
      rating: 5
    },
    {
      name: "Maria Garcia",
      role: "Tech Lead",
      content: "Perfect for documenting microservices architecture. The AI understands complex relationships.",
      rating: 5
    },
    {
      name: "David Kim",
      role: "Senior Developer",
      content: "Incredible tool for visualizing system architecture. Saved us hours of manual diagramming.",
      rating: 5
    }
  ]

  return (
    <>
      <SEOHead
        title="Architecture Generator - AI System Diagrams"
        description="Generate system architecture diagrams from GitHub repos with AI. Visualize code structure and dependencies automatically."
        keywords="repository architecture generator, system architecture AI, code architecture diagrams, GitHub architecture generator, system design AI, architecture visualization"
        canonicalUrl="/repository-architecture-generator"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Repository Architecture Generator",
          "description": "AI-powered tool for generating system architecture diagrams from repositories",
          "url": "https://automaxlib.online/repository-architecture-generator",
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
        <section className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-purple-600 rounded-full">
                  <Network className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Repository <span className="text-purple-600">Architecture Generator</span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
                Visualize your codebase with AI-generated system architecture diagrams. 
                Understand complex repositories, document system design, and onboard teams faster.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  to={isSignedIn ? "/repository-architecture-generator" : "/sign-up?redirect=/repository-architecture-generator"}
                  className="inline-flex items-center px-8 py-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Network className="w-5 h-5 mr-2" />
                  Generate Architecture Diagram
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
                  <span className="text-sm">Instant Diagrams</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">300+ Projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span className="text-sm">Free to Try</span>
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
                Advanced Architecture Analysis
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Our AI analyzes your repository structure, dependencies, and code relationships 
                to generate comprehensive system architecture diagrams.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                      <feature.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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

        {/* Benefits Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Visualize Complex Systems
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                  Transform complex codebases into clear, understandable architecture diagrams 
                  that help teams collaborate and understand system design.
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
                  <Network className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Architecture Analysis
                  </h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Code Structure</span>
                    <span className="text-green-500">✓ Mapped</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Dependencies</span>
                    <span className="text-green-500">✓ Traced</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Components</span>
                    <span className="text-green-500">✓ Identified</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Diagram</span>
                    <span className="text-blue-500">⚡ Generating...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Trusted by Development Teams
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                See how teams use our architecture generator to understand complex systems
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Visualize Your Architecture?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Join teams worldwide who use our AI to understand and document their systems
            </p>
            <Link
              to={isSignedIn ? "/repository-architecture-generator" : "/sign-up?redirect=/repository-architecture-generator"}
              className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Network className="w-5 h-5 mr-2" />
              Generate Architecture Diagram
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}

export default RepositoryArchitectureGeneratorLanding
