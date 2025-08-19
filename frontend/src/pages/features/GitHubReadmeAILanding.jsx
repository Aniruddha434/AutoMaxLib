import { Link } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { 
  Sparkles, 
  FileText, 
  Zap, 
  Shield, 
  Users, 
  Award,
  ArrowRight,
  CheckCircle,
  Star,
  Github,
  Bot,
  Wand2
} from 'lucide-react'
import SEOHead from '../../components/SEOHead'
import { seoData } from '../../utils/seoData'

const GitHubReadmeAILanding = () => {
  const { isSignedIn } = useAuth()

  const features = [
    {
      icon: Bot,
      title: "AI-Powered Generation",
      description: "Advanced AI analyzes your repository and generates professional README files tailored to your project."
    },
    {
      icon: Wand2,
      title: "Smart Templates",
      description: "Choose from multiple templates optimized for different project types and industries."
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Generate comprehensive README files in seconds, not hours of manual writing."
    },
    {
      icon: Shield,
      title: "Professional Quality",
      description: "Get README files that follow best practices and industry standards."
    }
  ]

  const benefits = [
    "Save hours of documentation time",
    "Improve project discoverability",
    "Attract more contributors",
    "Professional presentation",
    "SEO-optimized content",
    "Multiple format support"
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Full Stack Developer",
      content: "AutoMaxLib's README AI saved me hours of work. The generated documentation is professional and comprehensive.",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      role: "Open Source Maintainer",
      content: "The AI understands my project structure perfectly. Best README generator I've used.",
      rating: 5
    },
    {
      name: "Emily Johnson",
      role: "DevOps Engineer",
      content: "Incredible tool! Generated a perfect README for my complex microservices project.",
      rating: 5
    }
  ]

  return (
    <>
      <SEOHead
        title="GitHub README AI Generator - Best AI-Powered README Creator"
        description="Create professional GitHub README files with our advanced AI generator. Analyze repositories, generate documentation, and improve project discoverability with intelligent README creation."
        keywords="GitHub README AI, README AI generator, AI README creator, GitHub documentation generator, repository README AI, automated README generation, GitHub README maker"
        canonicalUrl="/github-readme-ai"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "GitHub README AI Generator",
          "description": "AI-powered tool for generating professional GitHub README files",
          "url": "https://automaxlib.online/github-readme-ai",
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
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-blue-600 rounded-full">
                  <Bot className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                GitHub README <span className="text-blue-600">AI Generator</span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
                Transform your repositories with AI-powered README generation. Create professional, 
                comprehensive documentation that attracts contributors and showcases your projects.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  to={isSignedIn ? "/github-readme-ai" : "/sign-up?redirect=/github-readme-ai"}
                  className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate README with AI
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
                  <span className="text-sm">Secure & Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">Instant Generation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">1000+ Developers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span className="text-sm">Free to Start</span>
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
                Powerful AI Features
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Our advanced AI analyzes your repository structure, code, and dependencies to create 
                perfect README documentation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                      <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
                  Why Choose Our README AI?
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                  Stop spending hours writing documentation. Let our AI create professional, 
                  comprehensive README files that make your projects shine.
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
                    Repository Analysis
                  </h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Code Structure</span>
                    <span className="text-green-500">✓ Analyzed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Dependencies</span>
                    <span className="text-green-500">✓ Detected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Project Type</span>
                    <span className="text-green-500">✓ Identified</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Documentation</span>
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
                Loved by Developers
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                See what developers are saying about our README AI
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
        <section className="py-20 bg-blue-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Create Amazing READMEs?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of developers using AI to create professional documentation
            </p>
            <Link
              to={isSignedIn ? "/github-readme-ai" : "/sign-up?redirect=/github-readme-ai"}
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Generating READMEs
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}

export default GitHubReadmeAILanding
