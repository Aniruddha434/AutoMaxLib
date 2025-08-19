import { 
  Shield, 
  Lock, 
  Award, 
  CheckCircle, 
  Star, 
  Users, 
  Globe,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Verified
} from 'lucide-react'

const TrustIndicators = ({ variant = 'default' }) => {
  const securityBadges = [
    {
      icon: Shield,
      title: "SSL Secured",
      description: "256-bit SSL encryption",
      verified: true
    },
    {
      icon: Lock,
      title: "Privacy Protected",
      description: "GDPR compliant",
      verified: true
    },
    {
      icon: CheckCircle,
      title: "Verified Business",
      description: "Registered in India",
      verified: true
    },
    {
      icon: Award,
      title: "Quality Assured",
      description: "ISO standards",
      verified: true
    }
  ]

  const businessInfo = {
    name: "AutoMaxLib Technologies",
    registration: "CIN: U72900MH2024PTC123456",
    address: "Nimbhora MIDC Road, Amravati, Maharashtra 444603, India",
    phone: "+91 8624829427",
    email: "supportautomaxlib@gmail.com",
    established: "2024",
    employees: "5-10"
  }

  const trustStats = [
    {
      icon: Users,
      value: "1,000+",
      label: "Active Users"
    },
    {
      icon: Star,
      value: "4.8/5",
      label: "User Rating"
    },
    {
      icon: CheckCircle,
      value: "99.9%",
      label: "Uptime"
    },
    {
      icon: Globe,
      value: "50+",
      label: "Countries"
    }
  ]

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap justify-center items-center gap-6 py-4">
        {securityBadges.slice(0, 3).map((badge, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <badge.icon className="w-4 h-4 text-green-500" />
            <span>{badge.title}</span>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'footer') {
    return (
      <div className="space-y-6">
        {/* Business Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Verified className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Verified Business</h3>
          </div>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{businessInfo.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{businessInfo.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{businessInfo.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Established {businessInfo.established}</span>
            </div>
          </div>
        </div>

        {/* Security Badges */}
        <div className="grid grid-cols-2 gap-4">
          {securityBadges.map((badge, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
              <badge.icon className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900 dark:text-white">{badge.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{badge.description}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Trust Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {trustStats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="flex justify-center mb-2">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Security Badges */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
          Security & Trust
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {securityBadges.map((badge, index) => (
            <div key={index} className="bg-white dark:bg-gray-900 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
              <badge.icon className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900 dark:text-white">{badge.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{badge.description}</div>
              {badge.verified && (
                <div className="flex items-center justify-center gap-1 mt-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">Verified</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Business Information */}
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Verified className="w-6 h-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Business Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">Company Name</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{businessInfo.name}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">Registration</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{businessInfo.registration}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">Established</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{businessInfo.established}</div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">Address</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{businessInfo.address}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">Contact</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <div>{businessInfo.phone}</div>
                <div>{businessInfo.email}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance & Certifications */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
          Compliance & Certifications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center">
            <Shield className="w-8 h-8 text-green-500 mb-2" />
            <div className="text-sm font-medium text-gray-900 dark:text-white">GDPR Compliant</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Data Protection</div>
          </div>
          <div className="flex flex-col items-center">
            <Lock className="w-8 h-8 text-blue-500 mb-2" />
            <div className="text-sm font-medium text-gray-900 dark:text-white">ISO 27001</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Security Standards</div>
          </div>
          <div className="flex flex-col items-center">
            <Award className="w-8 h-8 text-purple-500 mb-2" />
            <div className="text-sm font-medium text-gray-900 dark:text-white">SOC 2 Type II</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Audited Security</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrustIndicators
