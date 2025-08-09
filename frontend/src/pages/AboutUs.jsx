import { ArrowLeft, Users, Target, Award, GitBranch, Zap, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

const AboutUs = () => {
  const values = [
    {
      icon: Target,
      title: "Developer-First",
      description: "Everything we build is designed with developers in mind, focusing on simplicity and effectiveness."
    },
    {
      icon: Shield,
      title: "Security & Privacy",
      description: "Your code and data are protected with enterprise-grade security and privacy measures."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We continuously innovate to provide cutting-edge automation tools for modern developers."
    }
  ]

  const team = [
    {
      name: "Your Name",
      role: "Founder & CEO",
      description: "Passionate developer with 5+ years of experience in building developer tools and automation platforms.",
      image: "/api/placeholder/150/150"
    }
    // Add more team members as needed
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link 
            to="/" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About AutoMaxLib
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
            We're on a mission to help developers maintain consistent coding habits and build 
            impressive GitHub profiles that showcase their dedication and skills.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Our Mission
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  At AutoMaxLib, we believe that consistency is key to success in software development.
                  We've created an intelligent automation platform that helps developers maintain their
                  GitHub contribution streaks without the stress of daily manual commits.
                </p>
                <p>
                  Our platform goes beyond simple automation – we provide AI-powered tools that generate 
                  meaningful commits, create professional README files, and help developers showcase 
                  their skills effectively to potential employers and collaborators.
                </p>
                <p>
                  Whether you're a student building your portfolio, a professional developer maintaining 
                  multiple projects, or someone looking to establish a strong online presence, 
                  AutoMaxLib is designed to support your journey.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-6 mx-auto">
                <GitBranch className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-4">
                Empowering Developers Worldwide
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Join thousands of developers who trust AutoMaxLib to maintain their coding consistency
                and build impressive GitHub profiles.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl mb-6 mx-auto">
                  <value.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Story Section */}
        <section className="mb-16">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Our Story
            </h2>
            <div className="max-w-4xl mx-auto space-y-6 text-gray-600 dark:text-gray-400">
              <p>
                AutoMaxLib was born from a simple frustration: maintaining a consistent GitHub
                contribution graph while juggling multiple projects, deadlines, and life commitments.
                As developers, we understood the importance of showcasing consistent coding activity
                to potential employers and collaborators.
              </p>
              <p>
                We realized that many talented developers were missing opportunities simply because 
                their GitHub profiles didn't reflect their true dedication and skills. Some had 
                irregular commit patterns due to private work, others struggled with maintaining 
                consistency during busy periods.
              </p>
              <p>
                That's when we decided to build AutoMaxLib – an intelligent automation platform
                that not only maintains your GitHub activity but does so in a meaningful way.
                We integrated AI-powered features to ensure that every automated commit adds value
                to your repositories.
              </p>
              <p>
                Today, AutoMaxLib serves thousands of developers worldwide, helping them build
                impressive GitHub profiles that truly represent their commitment to coding excellence.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 lg:p-12 text-white">
            <h2 className="text-3xl font-bold mb-12 text-center">
              AutoMaxLib by the Numbers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">100+</div>
                <div className="text-primary-100">Active Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">1000+</div>
                <div className="text-primary-100">Automated Commits</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">99.9%</div>
                <div className="text-primary-100">Uptime</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-primary-100">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Transform Your GitHub Profile?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who trust AutoMaxLib to maintain their coding consistency
            and build impressive GitHub profiles.
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 mb-8 max-w-md mx-auto">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Get in Touch</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>📧 supportautomaxlib@gmail.com</p>
              <p>📞 +91 8624829427</p>
              <p>📍 Nimbhora MIDC Road, Amravati, Maharashtra</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/sign-up"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Start Free Trial
            </Link>
            <Link
              to="/contact"
              className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AboutUs
