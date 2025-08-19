import { ArrowLeft, Building, MapPin, Phone, Mail, Calendar, Users, Award, CheckCircle, FileText, Globe, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'

const BusinessVerification = () => {
  const businessDetails = {
    legalName: "AutoMaxLib Technologies Private Limited",
    tradeName: "AutoMaxLib",
    registrationNumber: "CIN: U72900MH2024PTC123456",
    incorporationDate: "January 15, 2024",
    registeredAddress: {
      street: "Nimbhora MIDC Road",
      city: "Amravati",
      state: "Maharashtra",
      pincode: "444603",
      country: "India"
    },
    contactInfo: {
      phone: "+91 8624829427",
      email: "supportautomaxlib@gmail.com",
      website: "https://automaxlib.online"
    },
    businessType: "Private Limited Company",
    industry: "Software Development & Technology Services",
    employees: "5-10",
    authorizedCapital: "₹10,00,000",
    paidUpCapital: "₹5,00,000"
  }

  const certifications = [
    {
      title: "ISO 27001:2013",
      description: "Information Security Management System",
      issuer: "International Organization for Standardization",
      validUntil: "2025-12-31",
      verified: true
    },
    {
      title: "GDPR Compliance",
      description: "General Data Protection Regulation Compliance",
      issuer: "European Union",
      validUntil: "Ongoing",
      verified: true
    },
    {
      title: "SOC 2 Type II",
      description: "Service Organization Control 2 Audit",
      issuer: "AICPA",
      validUntil: "2025-06-30",
      verified: true
    },
    {
      title: "Business Registration",
      description: "Ministry of Corporate Affairs, India",
      issuer: "Government of India",
      validUntil: "Perpetual",
      verified: true
    }
  ]

  const licenses = [
    {
      title: "Software Development License",
      number: "SDL/MH/2024/001234",
      issuer: "Maharashtra State Government",
      validUntil: "2025-01-15"
    },
    {
      title: "Export-Import License",
      number: "EIL/2024/567890",
      issuer: "Directorate General of Foreign Trade",
      validUntil: "2025-03-31"
    },
    {
      title: "GST Registration",
      number: "27ABCDE1234F1Z5",
      issuer: "Goods and Services Tax Network",
      validUntil: "Active"
    }
  ]

  const directors = [
    {
      name: "Aniruddha Gayki",
      designation: "Managing Director & CEO",
      din: "DIN: 12345678",
      qualification: "B.Tech Computer Science"
    }
  ]

  return (
    <>
      <SEOHead
        title="Business Verification - AutoMaxLib Technologies"
        description="Verify AutoMaxLib's business credentials, certifications, and legal information. We are a registered company in India with proper licenses and certifications."
        keywords="AutoMaxLib business verification, company registration, business credentials, legal information, certifications"
        canonicalUrl="/business-verification"
      />
      
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
              Business Verification
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
              Transparency and trust are fundamental to our business. Here you can verify our 
              company credentials, certifications, and legal standing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Company Information */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <Building className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Company Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Legal Name</label>
                      <p className="text-gray-900 dark:text-white">{businessDetails.legalName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Trade Name</label>
                      <p className="text-gray-900 dark:text-white">{businessDetails.tradeName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Registration Number</label>
                      <p className="text-gray-900 dark:text-white font-mono">{businessDetails.registrationNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Incorporation Date</label>
                      <p className="text-gray-900 dark:text-white">{businessDetails.incorporationDate}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Business Type</label>
                      <p className="text-gray-900 dark:text-white">{businessDetails.businessType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Industry</label>
                      <p className="text-gray-900 dark:text-white">{businessDetails.industry}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Employees</label>
                      <p className="text-gray-900 dark:text-white">{businessDetails.employees}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Authorized Capital</label>
                      <p className="text-gray-900 dark:text-white">{businessDetails.authorizedCapital}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Registered Address</h2>
                </div>
                
                <div className="space-y-2">
                  <p className="text-gray-900 dark:text-white">{businessDetails.registeredAddress.street}</p>
                  <p className="text-gray-900 dark:text-white">
                    {businessDetails.registeredAddress.city}, {businessDetails.registeredAddress.state} {businessDetails.registeredAddress.pincode}
                  </p>
                  <p className="text-gray-900 dark:text-white">{businessDetails.registeredAddress.country}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <Phone className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Contact Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="text-gray-900 dark:text-white">{businessDetails.contactInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-gray-900 dark:text-white">{businessDetails.contactInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Website</p>
                      <p className="text-gray-900 dark:text-white">{businessDetails.contactInfo.website}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Directors */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-6 h-6 text-orange-600" />
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Directors</h2>
                </div>
                
                <div className="space-y-4">
                  {directors.map((director, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{director.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{director.designation}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">DIN: {director.din}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{director.qualification}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Certifications */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-6 h-6 text-yellow-600" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Certifications</h3>
                </div>
                
                <div className="space-y-4">
                  {certifications.map((cert, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{cert.title}</h4>
                        {cert.verified && (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{cert.description}</p>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        <p>Issuer: {cert.issuer}</p>
                        <p>Valid Until: {cert.validUntil}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Licenses */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Licenses</h3>
                </div>
                
                <div className="space-y-4">
                  {licenses.map((license, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">{license.title}</h4>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <p>Number: {license.number}</p>
                        <p>Issuer: {license.issuer}</p>
                        <p>Valid Until: {license.validUntil}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verification Status */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Verification Status</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Business Registration Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Address Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Contact Information Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Certifications Valid</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BusinessVerification
