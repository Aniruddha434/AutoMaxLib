import { Link } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { useEffect, useRef, useState } from 'react'
import FeatureShowcase from '../components/FeatureShowcase'
import { PricingCard } from '../components/ui/pricing'
import { CircularTestimonials } from '../components/ui/circular-testimonials'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import {
  GitBranch,
  Clock,
  Zap,
  Shield,
  BarChart3,
  Mail,
  Check,
  ArrowRight,
  Calendar,
  TrendingUp,
  Users,
  Sparkles,
  Target,
  Code2,
  Activity,
  Award,
  Briefcase,
  ChevronRight,
  Play,
  Github,
  Quote,
  Flame,
  FileText,
  ExternalLink
} from 'lucide-react'

const LandingPage = () => {
  const { isSignedIn } = useAuth()
  const [repositoryUrl, setRepositoryUrl] = useState('')
  const [validationError, setValidationError] = useState('')

  // Scroll animation refs
  const heroRef = useScrollAnimation()
  const featuresRef = useScrollAnimation()
  const premiumRef = useScrollAnimation()
  const benefitsRef = useScrollAnimation()
  const testimonialsRef = useScrollAnimation()
  const pricingRef = useScrollAnimation()
  const ctaRef = useScrollAnimation()

  const features = [
    {
      icon: Clock,
      title: "Smart Scheduling",
      description: "Set your perfect commit times and let AutoMaxLib maintain your streak while you focus on what matters most.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: GitBranch,
      title: "Multi-Repository Support",
      description: "Connect unlimited repositories and manage them all from one elegant dashboard with intelligent automation.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Sparkles,
      title: "AI-Powered Content",
      description: "Generate meaningful commits with advanced AI that understands your coding patterns and project context.",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: Activity,
      title: "Contribution Analytics",
      description: "Track your coding consistency with beautiful visualizations and insights that help you stay motivated.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Your code and data are protected with bank-level encryption and industry-leading security practices.",
      color: "from-red-500 to-rose-500"
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Set coding goals, track milestones, and celebrate achievements as you build consistent development habits.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Get detailed insights into your coding patterns, streak statistics, and productivity trends with beautiful charts.",
      color: "from-teal-500 to-cyan-500"
    },
    {
      icon: Mail,
      title: "Smart Notifications",
      description: "Receive intelligent email alerts about your streaks, achievements, and important repository updates.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: FileText,
      title: "README Generation",
      description: "Create professional GitHub profile and repository READMEs with AI-powered content and modern templates.",
      color: "from-violet-500 to-purple-500"
    }
  ]

  const benefits = [
    {
      icon: Briefcase,
      title: "Professional Credibility",
      description: "A consistent green contribution graph signals reliability and dedication to potential employers."
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Stand out in the competitive tech market with a profile that demonstrates your commitment to coding."
    },
    {
      icon: Users,
      title: "Developer Community",
      description: "Join a community of developers who understand the importance of consistent coding habits."
    }
  ]

  const stats = [
    { number: "100+", label: "Active Developers", icon: Users },
    { number: "1000+", label: "Commits Generated", icon: GitBranch },
    { number: "99.9%", label: "Uptime Reliability", icon: Shield },
    { number: "365", label: "Days Automated", icon: Calendar }
  ]

  const testimonials = [
    {
      quote: "AutoMaxLib has been a game-changer for maintaining my coding consistency. The intelligent scheduling means I never have to worry about breaking my streak, even during busy periods.",
      name: "Aniruddha Gayki",
      designation: "Senior Software Engineer",
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      quote: "As someone who juggles multiple projects, AutoMaxLib helps me maintain a professional profile that truly reflects my dedication to coding. The AI-generated content is surprisingly thoughtful.",
      name: "Lucky More",
      designation: "Full Stack Developer",
      src: "https://images.unsplash.com/photo-1628749528992-f5702133b686?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D"
    },
    {
      quote: "The analytics dashboard gives me insights into my coding patterns I never had before. It's not just about streaks—it's about building better habits and professional growth.",
      name: "Anand Harle",
      designation: "DevOps Engineer",
      src: "https://images.unsplash.com/photo-1524267213992-b76e8577d046?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  ]

  const pricingPlans = [
    {
      name: "Free",
      title: "Free",
      price: "$0",
      period: "15 days",
      description: "Perfect for testing the automated commit experience",
      buttonText: "Start 15-Day Free Trial",
      buttonVariant: "outline",
      cta: "Start 15-Day Free Trial",
      popular: false,
      features: [
        "15-day free trial with auto-commits",
        "Daily auto-commit (10 AM IST)",
        "1 repository connection",
        "Basic commit messages",
        "7-day commit history",
        "Manual commit button",
        "Dark mode support"
      ]
    },
    {
      name: "Premium",
      title: "Premium",
      price: "$6",
      period: "per month",
      description: "For developers serious about consistency",
      buttonText: "Start Premium Trial",
      buttonVariant: "default",
      cta: "Start Premium Trial",
      highlight: true,
      popular: true,
      features: [
        "Custom commit scheduling",
        "Multiple repositories",
        "AI-generated commit messages",
        "AI-Powered Profile README Generation",
        "Smart file generation",
        "Past commit generation",
        "Email notifications",
        "Full analytics dashboard",
        "GitHub OAuth support",
        "Priority support"
      ]
    }
  ]

  const handleRepositoryReadmeGeneration = () => {
    // Clear previous errors
    setValidationError('')

    if (!repositoryUrl.trim()) {
      setValidationError('Please enter a valid repository URL')
      return
    }

    // Validate GitHub URL format
    const githubUrlPattern = /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/?$/
    if (!githubUrlPattern.test(repositoryUrl.trim())) {
      setValidationError('Please enter a valid GitHub repository URL (e.g., https://github.com/username/repository)')
      return
    }

    // Redirect to repository README generator with the URL
    const encodedUrl = encodeURIComponent(repositoryUrl.trim())
    if (isSignedIn) {
      window.location.href = `/repository-readme?url=${encodedUrl}`
    } else {
      window.location.href = `/sign-up?redirect=/repository-readme&url=${encodedUrl}`
    }
  }

  const handleRepositoryUrlChange = (e) => {
    setRepositoryUrl(e.target.value)
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError('')
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="bg-gray-50 py-16 md:py-32 dark:bg-transparent">
        <div className="mx-auto max-w-3xl lg:max-w-5xl px-6">
          <div className="text-center space-y-8">
            {/* Main Headline */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 dark:text-white leading-tight animate-fade-in-up">
              Never Break Your Coding Streak Again
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              AutoMaxLib intelligently maintains your contribution graph with meaningful commits,
              helping you build consistent coding habits and showcase your dedication to potential employers.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {isSignedIn ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 hover-glow px-8 py-4"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/sign-up"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 hover-glow px-8 py-4 group"
                  >
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/sign-in"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:scale-105 hover-glow-secondary px-8 py-4 group"
                  >
                    <Play className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                    Watch Demo
                  </Link>
                </>
              )}
            </div>

            {/* Social Proof Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              {stats.slice(0, 4).map((stat, index) => (
                <div
                  key={index}
                  className="text-center transform transition-all duration-300 hover:scale-105 animate-fade-in-up"
                  style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                >
                  <div className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-1 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="bg-gray-50 py-16 md:py-32 dark:bg-transparent">
        <div className="mx-auto max-w-3xl lg:max-w-5xl px-6">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-foreground max-w-2xl mx-auto">
              From intelligent automation to beautiful analytics, AutoMaxLib provides all the tools
              you need to maintain consistency and build a professional developer profile.
            </p>
          </div>

          <div className="grid grid-cols-6 gap-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="col-span-full sm:col-span-3 lg:col-span-2 animate-fade-in-up"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300 hover-glow group">
                  <div className="p-6 pt-6">
                    <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5 mb-6 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="m-auto size-5 group-hover:text-primary-600 transition-colors duration-300" strokeWidth={1} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium transition group-hover:text-primary-600">
                        {feature.title}
                      </h3>
                      <p className="text-foreground text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Repository README Generation Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-transparent">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-6">
              Generate Professional Repository READMEs
            </h2>
            <p className="text-lg text-foreground max-w-2xl mx-auto mb-8">
              Transform your GitHub repositories with AI-powered README generation.
              Simply paste your repository URL and get a professional, comprehensive README in seconds.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label htmlFor="repo-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Repository URL
                </label>
                <input
                  id="repo-url"
                  type="url"
                  value={repositoryUrl}
                  onChange={handleRepositoryUrlChange}
                  placeholder="https://github.com/username/repository"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ${
                    validationError
                      ? 'border-red-500 dark:border-red-400'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {validationError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {validationError}
                  </p>
                )}
              </div>
              <button
                onClick={handleRepositoryReadmeGeneration}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 hover-glow px-6 py-3"
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate
                <ExternalLink className="w-3 h-3 ml-2" />
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-black dark:text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI-Powered Analysis</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically analyzes your repository structure, technologies, and dependencies
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-black dark:text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Professional Templates</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose from multiple templates designed for different project types
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-black dark:text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Instant Generation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get a complete, professional README in seconds with deployment options
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Features Showcase */}
      <FeatureShowcase
        onUpgrade={() => {
          if (isSignedIn) {
            window.location.href = '/dashboard'
          } else {
            window.location.href = '/sign-up'
          }
        }}
      />

      {/* Benefits Section */}
      <section className="section bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-950/20 dark:to-secondary-950/20">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
              Why Consistency{" "}
              <span className="gradient-text">Matters</span>
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed">
              A consistent contribution graph isn't just about streaks—it's about building
              a professional reputation that opens doors to new opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-neutral-800 rounded-2xl shadow-soft mb-6 group-hover:shadow-medium group-hover:scale-110 transition-all duration-300">
                  <benefit.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                  {benefit.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Testimonials Section */}
      <section className="section bg-gradient-to-br from-neutral-50 to-primary-50/30 dark:from-neutral-900 dark:to-primary-950/30">
        <div className="container-custom">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full px-4 py-2 mb-6">
              <Quote className="w-4 h-4" />
              <span className="text-sm font-semibold">What Developers Say</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
              Loved by{" "}
              <span className="gradient-text">Developers</span>
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed">
              Join thousands of developers who've transformed their coding consistency
              and professional presence with AutoMaxLib.
            </p>
          </div>

          <CircularTestimonials
            testimonials={testimonials}
            autoplay={true}
            autoplayInterval={6000}
            colors={{
              name: "rgb(10, 10, 10)",
              designation: "rgb(115, 115, 115)",
              testimony: "rgb(64, 64, 64)",
              arrowBackground: "rgb(59, 130, 246)",
              arrowForeground: "rgb(255, 255, 255)",
              arrowHoverBackground: "rgb(37, 99, 235)",
            }}
            fontSizes={{
              name: "24px",
              designation: "16px",
              quote: "18px",
            }}
            className="animate-fade-in-up"
          />
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} className="py-16 md:py-32" id="pricing">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto flex max-w-3xl flex-col text-left md:text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-full px-3 py-1.5 mb-4 mx-auto animate-fade-in-up">
              <Award className="w-3 h-3" />
              <span className="text-xs font-medium">Simple Pricing</span>
            </div>
            <h2 className="mb-2 text-2xl font-semibold md:mb-3 lg:mb-4 lg:text-3xl text-slate-900 dark:text-slate-100 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Plans made for every developer
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm lg:text-base mb-4 md:mb-6 lg:mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              Start managing your coding consistency in one place. Upgrade anytime as your needs grow.
            </p>
          </div>

          <div className="rounded-lg flex flex-col justify-between border border-slate-200 dark:border-slate-700 p-1 bg-slate-50/50 dark:bg-slate-900/50 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex flex-col gap-3 md:flex-row">
              {pricingPlans.map((plan, index) => (
                <PricingCard
                  key={index}
                  title={plan.title}
                  price={`${plan.price} / ${plan.period}`}
                  description={plan.description}
                  buttonText={plan.buttonText}
                  buttonVariant={plan.buttonVariant}
                  highlight={plan.highlight}
                  popular={plan.popular}
                  features={plan.features}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${0.8 + index * 0.2}s` }}
                />
              ))}
            </div>
          </div>

          {/* Pricing Footer */}
          <div className="text-center mt-12">
            <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
              All plans include our core features with no setup fees or hidden costs.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-slate-500 dark:text-slate-500">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3 h-3" />
                <span>Secure payment processing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3 h-3" />
                <span>24/7 customer support</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3" />
                <span>Instant activation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gray-50 dark:bg-transparent">
        <div className="container-custom section text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Ready to Transform Your{" "}
              <span className="gradient-text">
                Developer Profile?
              </span>
            </h2>
            <p className="text-lg md:text-xl text-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of developers who've already elevated their coding consistency
              and professional presence with AutoMaxLib. Start your journey today.
            </p>

            {!isSignedIn && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link
                  to="/sign-up"
                  className="bg-white text-blue-700 hover:bg-gray-50 font-medium py-3 px-6 rounded-md transition-colors duration-150 text-base inline-flex items-center gap-2 group"
                >
                  Start 15-Day Free Trial
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/sign-in"
                  className="border border-white/30 text-white hover:bg-white/10 font-medium py-3 px-6 rounded-md transition-colors duration-150 text-base inline-flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  Sign In
                </Link>
              </div>
            )}

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span className="text-sm">Instant Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">100+ Happy Users</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span className="text-sm">30-Day Guarantee</span>
              </div>
            </div>
          </div>
        </div>


      </section>
    </div>
  )
}

export default LandingPage
