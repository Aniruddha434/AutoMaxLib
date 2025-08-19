import { Star, Quote, CheckCircle, Github, Linkedin, Twitter } from 'lucide-react'

const EnhancedTestimonials = ({ variant = 'default' }) => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Senior Full Stack Developer",
      company: "TechCorp Inc.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      content: "AutoMaxLib has completely transformed how I maintain my GitHub profile. The AI-generated READMEs are professional and comprehensive. I've seen a 40% increase in repository stars since using this tool.",
      verified: true,
      social: {
        github: "sarahchen",
        linkedin: "sarah-chen-dev"
      },
      date: "2024-12-15",
      project: "React Dashboard Library"
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      role: "DevOps Engineer",
      company: "CloudScale Solutions",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      content: "The repository architecture generator is incredible! It helped our team understand a complex microservices codebase in minutes instead of days. The diagrams are accurate and beautifully rendered.",
      verified: true,
      social: {
        github: "marcusrod",
        twitter: "marcus_devops"
      },
      date: "2024-12-10",
      project: "Microservices Platform"
    },
    {
      id: 3,
      name: "Emily Johnson",
      role: "Open Source Maintainer",
      company: "Independent Developer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      content: "As someone who maintains multiple open source projects, AutoMaxLib saves me hours every week. The auto-commit feature keeps my contribution graph green, and the README generator creates documentation that actually helps users.",
      verified: true,
      social: {
        github: "emilyjohnson",
        twitter: "emily_codes"
      },
      date: "2024-12-08",
      project: "Vue.js Component Library"
    },
    {
      id: 4,
      name: "David Kim",
      role: "Software Architect",
      company: "StartupXYZ",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      content: "The AI understands project structure better than I expected. Generated a perfect README for our complex monorepo that would have taken me days to write manually. Highly recommended for any serious developer.",
      verified: true,
      social: {
        github: "davidkim",
        linkedin: "david-kim-architect"
      },
      date: "2024-12-05",
      project: "E-commerce Platform"
    },
    {
      id: 5,
      name: "Priya Patel",
      role: "Frontend Developer",
      company: "DesignTech",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      content: "Love how AutoMaxLib makes my GitHub profile look professional. The contribution streak feature is a game-changer for maintaining consistency. My profile went from amateur to professional overnight!",
      verified: true,
      social: {
        github: "priyapatel",
        twitter: "priya_frontend"
      },
      date: "2024-12-01",
      project: "React Native App"
    },
    {
      id: 6,
      name: "Alex Thompson",
      role: "Backend Developer",
      company: "DataFlow Inc.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      content: "The architecture diagrams feature is phenomenal. It helped us document our entire system architecture automatically. Perfect for onboarding new team members and technical documentation.",
      verified: true,
      social: {
        github: "alexthompson",
        linkedin: "alex-thompson-dev"
      },
      date: "2024-11-28",
      project: "Data Processing Pipeline"
    }
  ]

  const stats = [
    { label: "Happy Developers", value: "1,000+" },
    { label: "READMEs Generated", value: "5,000+" },
    { label: "Average Rating", value: "4.9/5" },
    { label: "Countries", value: "50+" }
  ]

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (variant === 'compact') {
    return (
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Featured Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.slice(0, 2).map((testimonial) => (
            <div key={testimonial.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    {testimonial.verified && (
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                </div>
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Trusted by Developers Worldwide
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Join thousands of developers who use AutoMaxLib to create professional GitHub profiles 
          and maintain consistent coding habits.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {stat.value}
            </div>
            <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    {testimonial.verified && (
                      <CheckCircle className="w-4 h-4 text-blue-500" title="Verified User" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{testimonial.company}</p>
                </div>
              </div>
              <Quote className="w-6 h-6 text-gray-300 dark:text-gray-600" />
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {testimonial.rating}.0
              </span>
            </div>

            {/* Content */}
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              "{testimonial.content}"
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-500">
                {formatDate(testimonial.date)}
              </div>
              <div className="flex items-center gap-2">
                {testimonial.social.github && (
                  <a
                    href={`https://github.com/${testimonial.social.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {testimonial.social.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${testimonial.social.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-600"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {testimonial.social.twitter && (
                  <a
                    href={`https://twitter.com/${testimonial.social.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-400"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Project Tag */}
            {testimonial.project && (
              <div className="mt-3">
                <span className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                  {testimonial.project}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Join Our Community of Successful Developers
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Start building your professional GitHub presence today
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Get Started Free
          </button>
          <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            View More Reviews
          </button>
        </div>
      </div>
    </div>
  )
}

export default EnhancedTestimonials
