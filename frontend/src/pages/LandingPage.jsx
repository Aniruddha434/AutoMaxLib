import { Link } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import ContributionGraph from '../components/ui/ContributionGraph'
import FeatureShowcase from '../components/FeatureShowcase'
import {
  GitBranch,
  Clock,
  Zap,
  Shield,
  BarChart3,
  Mail,
  Star,
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
  Eye,
  ChevronRight,
  Play,
  Github,
  Quote,
  Flame
} from 'lucide-react'

const LandingPage = () => {
  const { isSignedIn } = useAuth()

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
    { number: "10K+", label: "Active Developers", icon: Users },
    { number: "1M+", label: "Commits Generated", icon: GitBranch },
    { number: "99.9%", label: "Uptime Reliability", icon: Shield },
    { number: "365", label: "Days Automated", icon: Calendar }
  ]

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Senior Software Engineer",
      company: "TechFlow",
      content: "AutoMaxLib has been a game-changer for maintaining my coding consistency. The intelligent scheduling means I never have to worry about breaking my streak, even during busy periods.",
      avatar: "AC",
      rating: 5
    },
    {
      name: "Sarah Kim",
      role: "Full Stack Developer",
      company: "StartupLab",
      content: "As someone who juggles multiple projects, AutoMaxLib helps me maintain a professional profile that truly reflects my dedication to coding. The AI-generated content is surprisingly thoughtful.",
      avatar: "SK",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "DevOps Engineer",
      company: "CloudScale",
      content: "The analytics dashboard gives me insights into my coding patterns I never had before. It's not just about streaks—it's about building better habits.",
      avatar: "MR",
      rating: 5
    }
  ]

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "15-day free trial with auto-commits",
        "Daily auto-commit (10 AM IST)",
        "1 repository connection",
        "Basic commit messages",
        "7-day commit history",
        "Manual commit button",
        "Dark mode support"
      ],
      cta: "Start 15-Day Free Trial",
      popular: false
    },
    {
      name: "Premium",
      price: "$6",
      period: "per month",
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
      ],
      cta: "Start Premium Trial",
      popular: true
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-primary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-primary-950/20">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/20 dark:bg-primary-800/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-200/20 dark:bg-secondary-800/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-200/10 dark:bg-accent-800/5 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>

        <div className="relative container-custom py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="lg:text-left text-center space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary-100/80 dark:bg-primary-900/30 border border-primary-200/50 dark:border-primary-800/50 rounded-xl px-4 py-2 mb-6 backdrop-blur-sm shadow-elegant">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-primary-700 dark:text-primary-300">
                  ✨ Trusted by 10K+ developers worldwide
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight tracking-tight">
                Never Break Your{" "}
                <span className="gradient-text relative">
                  Coding Streak
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </span>{" "}
                Again
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-10 leading-relaxed font-body">
                AutoMaxLib intelligently maintains your contribution graph with meaningful commits,
                helping you build consistent coding habits and showcase your dedication to potential employers.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 lg:justify-start justify-center items-center mb-12">
                {isSignedIn ? (
                  <Link
                    to="/dashboard"
                    className="btn-primary text-base px-6 py-3 inline-flex items-center gap-2 group shadow-floating"
                  >
                    🚀 Go to Dashboard
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/sign-up"
                      className="btn-primary text-base px-6 py-3 inline-flex items-center gap-2 group shadow-floating"
                    >
                      🎯 Start Free Trial
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                      to="/sign-in"
                      className="btn-outline text-base px-6 py-3 inline-flex items-center gap-2 group"
                    >
                      <Play className="w-4 h-4" />
                      Watch Demo
                    </Link>
                </>
              )}
              </div>

              {/* Social Proof Stats */}
              <div className="grid grid-cols-2 gap-6 lg:gap-8">
                {stats.slice(0, 4).map((stat, index) => (
                  <div key={index} className="text-center lg:text-left">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mb-4 shadow-elegant">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Visual Element */}
            <div className="relative lg:block hidden">
              <div className="relative">
                {/* Main Visual Card */}
                <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-floating p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center">
                        <GitBranch className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-neutral-900 dark:text-white">GitHub Activity</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Consistent commits</p>
                      </div>
                    </div>
                    <ContributionGraph />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">365 day streak</span>
                      <div className="flex items-center gap-1">
                        <Flame className="w-4 h-4 text-secondary-500" />
                        <span className="text-sm font-semibold text-secondary-600 dark:text-secondary-400">On fire!</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-2xl shadow-glow-secondary animate-bounce-gentle flex items-center justify-center">
                  <Star className="w-8 h-8 text-white" />
                </div>

                <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl shadow-glow-accent animate-float flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>


      </section>

      {/* Features Section */}
      <section id="features" className="section bg-gradient-to-br from-neutral-50 to-primary-50/20 dark:from-neutral-900 dark:to-primary-950/10 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-200/10 dark:bg-secondary-800/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-200/10 dark:bg-accent-800/5 rounded-full blur-3xl"></div>

        <div className="container-custom relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary-100/80 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-xl px-4 py-2 mb-6 backdrop-blur-sm shadow-elegant">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold">✨ Powerful Features</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight">
              Everything You Need to{" "}
              <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed font-body">
              From intelligent automation to beautiful analytics, AutoMaxLib provides all the tools
              you need to maintain consistency and build a professional developer profile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative"
              >
                {/* Tilted Card Effect */}
                <div className={`card-feature transform transition-all duration-500 hover:scale-105 ${
                  index % 2 === 0 ? 'hover:rotate-1' : 'hover:-rotate-1'
                } relative overflow-hidden`}>
                  {/* Gradient Border */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-secondary-500/20 to-accent-500/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative bg-white dark:bg-neutral-800 rounded-2xl p-8 h-full">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 shadow-elegant group-hover:shadow-glow transition-all duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-sm font-body">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
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

      {/* Contribution Graph Comparison */}
      <section className="section bg-white dark:bg-neutral-900">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
              See the{" "}
              <span className="gradient-text">Transformation</span>
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed">
              Watch how AutoMaxLib transforms sparse, inconsistent contribution patterns
              into professional, reliable activity that catches recruiters' attention.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Before */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full px-4 py-2 mb-4">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-semibold">Before AutoMaxLib</span>
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                  Inconsistent Activity
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Sporadic commits that don't reflect your true dedication
                </p>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl p-6">
                <ContributionGraph type="before" animated={true} />

                <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-red-600">23</div>
                    <div className="text-sm text-neutral-500">Total Contributions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">3</div>
                    <div className="text-sm text-neutral-500">Longest Streak</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">12%</div>
                    <div className="text-sm text-neutral-500">Active Days</div>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 dark:text-red-400 text-sm">😔</span>
                  </div>
                  <div>
                    <p className="font-semibold text-red-800 dark:text-red-200 mb-1">
                      Recruiter's Perspective
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      "Inconsistent activity suggests unreliable work habits. This profile gets overlooked in our screening process."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* After */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full px-4 py-2 mb-4">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-semibold">After AutoMaxLib</span>
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                  Professional Consistency
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Reliable daily activity that showcases your commitment
                </p>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl p-6">
                <ContributionGraph type="after" animated={true} />

                <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">1,247</div>
                    <div className="text-sm text-neutral-500">Total Contributions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">365</div>
                    <div className="text-sm text-neutral-500">Longest Streak</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">94%</div>
                    <div className="text-sm text-neutral-500">Active Days</div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 dark:text-green-400 text-sm">🎯</span>
                  </div>
                  <div>
                    <p className="font-semibold text-green-800 dark:text-green-200 mb-1">
                      Recruiter's Perspective
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      "This level of consistency demonstrates discipline and reliability. This candidate gets priority consideration for our positions."
                    </p>
                  </div>
                </div>
              </div>
            </div>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="card group hover:shadow-glow animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section bg-white dark:bg-neutral-900">
        <div className="container-custom">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 rounded-full px-4 py-2 mb-6">
              <Award className="w-4 h-4" />
              <span className="text-sm font-semibold">Simple Pricing</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
              Choose Your{" "}
              <span className="gradient-text">Perfect Plan</span>
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed">
              Start with a 15-day free trial and upgrade when you're ready. No hidden fees, no surprises—just transparent pricing that grows with your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative card-interactive ${
                  plan.popular
                    ? 'ring-2 ring-primary-500 shadow-glow-lg'
                    : 'hover:ring-1 hover:ring-primary-200 dark:hover:ring-primary-800'
                } animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-medium">
                      ⭐ Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-5xl font-bold text-neutral-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-neutral-600 dark:text-neutral-400 ml-2 text-lg">
                      {plan.period}
                    </span>
                  </div>
                  {plan.popular && (
                    <div className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                      Save 40% with annual billing
                    </div>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-accent-600 dark:text-accent-400" />
                      </div>
                      <span className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={isSignedIn ? "/dashboard" : "/sign-up"}
                  className={`w-full text-center block ${
                    plan.popular
                      ? 'btn-primary text-lg py-4'
                      : 'btn-outline text-lg py-4'
                  } group`}
                >
                  <span className="flex items-center justify-center gap-2">
                    {plan.cta}
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </div>
            ))}
          </div>

          {/* Pricing Footer */}
          <div className="text-center mt-16">
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              All plans include our core features with no setup fees or hidden costs.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-neutral-500 dark:text-neutral-500">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Secure payment processing</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>24/7 customer support</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>Instant activation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-blue-600">
        <div className="container-custom section text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Transform Your{" "}
              <span className="text-blue-200">
                Developer Profile?
              </span>
            </h2>
            <p className="text-lg md:text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
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
            <div className="flex flex-wrap justify-center items-center gap-8 text-blue-200">
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
                <span className="text-sm">10K+ Happy Users</span>
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
