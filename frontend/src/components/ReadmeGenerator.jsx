import { useState, useEffect } from 'react'
import { useUserData } from '../contexts/UserContext'
import profileService from '../services/profileService'
import { OrbitalLoader } from './ui/orbital-loader'
import {
  FileText,
  Download,
  Upload,
  Eye,
  Sparkles,
  User,
  Code,
  Globe,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react'

const ReadmeGenerator = () => {
  const { userData, isPremium } = useUserData()
  const [currentStep, setCurrentStep] = useState(1)
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState('professional')
  const [profileData, setProfileData] = useState(profileService.getDefaultProfileData())
  const [customSections, setCustomSections] = useState({})
  const [generatedReadme, setGeneratedReadme] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [validation, setValidation] = useState(null)
  const [usage, setUsage] = useState(null)
  const [creatingRepo, setCreatingRepo] = useState(false)
  const [repoExists, setRepoExists] = useState(null)

  useEffect(() => {
    loadTemplates()
    loadUsageInfo()

    // Set some default data if user data is available
    if (userData) {
      setProfileData(prev => ({
        ...prev,
        bio: prev.bio || 'Passionate developer building amazing applications',
        currentRole: prev.currentRole || 'Software Developer',
        skills: prev.skills.length > 0 ? prev.skills : ['JavaScript', 'React', 'Node.js'],
        socialLinks: {
          ...prev.socialLinks,
          linkedin: prev.socialLinks.linkedin || '',
          twitter: prev.socialLinks.twitter || '',
          website: prev.socialLinks.website || '',
          portfolio: prev.socialLinks.portfolio || ''
        }
      }))
    }
  }, [userData])

  const loadTemplates = async () => {
    try {
      const response = await profileService.getReadmeTemplates()
      setTemplates(response.templates)
    } catch (error) {
      console.error('Error loading templates:', error)
      setError('Failed to load templates')
    }
  }

  const loadUsageInfo = async () => {
    try {
      const response = await profileService.getReadmeHistory()
      setUsage(response.usage)
    } catch (error) {
      console.error('Error loading usage info:', error)
    }
  }

  const handleProfileDataChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSkillsChange = (skillsText) => {
    const skills = profileService.parseSkillsFromText(skillsText)
    handleProfileDataChange('skills', skills)
  }

  const addExperience = () => {
    setProfileData(prev => ({
      ...prev,
      experience: [...prev.experience, { role: '', company: '', duration: '', description: '' }]
    }))
  }

  const updateExperience = (index, field, value) => {
    setProfileData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const removeExperience = (index) => {
    setProfileData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }))
  }

  const addProject = () => {
    setProfileData(prev => ({
      ...prev,
      projects: [...prev.projects, { name: '', description: '', url: '', technologies: [] }]
    }))
  }

  const updateProject = (index, field, value) => {
    setProfileData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) => 
        i === index ? { ...proj, [field]: value } : proj
      )
    }))
  }

  const removeProject = (index) => {
    setProfileData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }))
  }

  const validateAndProceed = () => {
    const validation = profileService.validateProfileData(profileData)
    setValidation(validation)

    // Always proceed to preview, but show warnings
    setCurrentStep(3)
  }

  const generateReadme = async () => {
    if (!isPremium) {
      // Show simple validation message instead of large popup
      setError('README generation requires Premium. Upgrade to generate and download your professional README.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await profileService.generateReadme(
        profileData,
        selectedTemplate,
        customSections
      )

      setGeneratedReadme(response.readme)
      setUsage(response.usage)
      setCurrentStep(4)
    } catch (error) {
      console.error('Error generating README:', error)
      setError(error.message || 'Failed to generate README')
    } finally {
      setLoading(false)
    }
  }

  const createProfileRepository = async () => {
    setCreatingRepo(true)
    setError(null)

    try {
      const response = await profileService.createProfileRepository()

      if (response.alreadyExists) {
        alert('✅ Profile repository already exists!')
      } else {
        alert('🎉 GitHub profile repository created successfully!')
      }

      setRepoExists(true)
    } catch (error) {
      console.error('Error creating profile repository:', error)

      let errorMessage = 'Failed to create profile repository'
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      setError(errorMessage)
    } finally {
      setCreatingRepo(false)
    }
  }

  const deployToGitHub = async () => {
    if (!generatedReadme) return

    setLoading(true)
    setError(null)

    try {
      const response = await profileService.deployReadme(generatedReadme.id)
      alert('🎉 README deployed successfully to your GitHub profile!')
      setRepoExists(true)
      loadUsageInfo() // Refresh usage info
    } catch (error) {
      console.error('Error deploying README:', error)

      // Extract meaningful error message
      let errorMessage = 'Failed to deploy README'
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      setError(errorMessage)

      // Show hint if available
      if (error.response?.data?.hint) {
        setError(`${errorMessage}\n\n💡 ${error.response.data.hint}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const downloadReadme = async () => {
    if (!generatedReadme) return

    try {
      await profileService.downloadReadme(generatedReadme.id)
    } catch (error) {
      console.error('Error downloading README:', error)
      setError('Failed to download README')
    }
  }

  const loadSampleData = () => {
    setProfileData(profileService.getSampleProfileData())
  }

  // Remove the upfront blocking - let free users experience the workflow

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          GitHub README AI - Best AI README Generator for GitHub Profiles
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          The ultimate GitHub README AI tool for creating professional GitHub profile READMEs. Our advanced README AI generates stunning, customizable profiles that showcase your skills and attract employers.
        </p>
        
        {/* Free User Try-Before-Buy Message */}
        {!isPremium && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center">
              <Eye className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
              <div>
                <span className="text-gray-800 dark:text-gray-200 font-medium">
                  Try Before You Buy
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Experience the full workflow! Configure your profile, choose templates, and see previews. Upgrade only when you're ready to generate.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Usage Info */}
        {usage && isPremium && (
          <div className="mt-4 p-4 bg-neutral-50 dark:bg-neutral-900/20 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-800 dark:text-neutral-200">
                Monthly Usage: {usage.monthly}/5 generations
              </span>
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Total Generated: {usage.total}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[
            { step: 1, title: 'Template', icon: FileText },
            { step: 2, title: 'Profile Info', icon: User },
            { step: 3, title: 'Preview', icon: Eye },
            { step: 4, title: 'Generate', icon: Sparkles }
          ].map(({ step, title, icon: Icon }) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step 
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'border-gray-300 text-gray-400'
              }`}>
                {currentStep > step ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep >= step ? 'text-foreground' : 'text-gray-500'
              }`}>
                {title}
              </span>
              {step < 4 && (
                <div className={`w-16 h-0.5 ml-4 ${
                  currentStep > step ? 'bg-primary' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
              <p className="text-gray-800 dark:text-gray-200">{error}</p>
            </div>
            {error.includes('Premium') && (
              <button
                onClick={() => window.location.href = '/upgrade'}
                className="ml-4 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                Upgrade
              </button>
            )}
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="card">
        {/* Step 1: Template Selection */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Choose a Template
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedTemplate === template.id
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {template.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {template.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {template.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                className="btn-primary px-6 py-2"
              >
                Next: Profile Info
              </button>
            </div>
          </div>
        )}

        {/* Additional steps would be implemented here */}
        {/* This is a truncated version due to length constraints */}
        
        {currentStep === 2 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Profile Information
              </h2>
              <button
                onClick={loadSampleData}
                className="text-primary hover:opacity-80 text-sm font-medium"
              >
                Load Sample Data
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio *
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => handleProfileDataChange('bio', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Current Role & Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Role
                  </label>
                  <input
                    type="text"
                    value={profileData.currentRole}
                    onChange={(e) => handleProfileDataChange('currentRole', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => handleProfileDataChange('company', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Tech Corp"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => handleProfileDataChange('location', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., San Francisco, CA"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={profileData.skills.join(', ')}
                  onChange={(e) => handleSkillsChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., JavaScript, React, Node.js, Python"
                />
              </div>

              {/* Social Links */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Social Links
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="url"
                    value={profileData.socialLinks.linkedin || ''}
                    onChange={(e) => handleProfileDataChange('socialLinks', { ...profileData.socialLinks, linkedin: e.target.value })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="LinkedIn URL"
                  />
                  <input
                    type="url"
                    value={profileData.socialLinks.twitter || ''}
                    onChange={(e) => handleProfileDataChange('socialLinks', { ...profileData.socialLinks, twitter: e.target.value })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="Twitter URL"
                  />
                  <input
                    type="url"
                    value={profileData.socialLinks.website || ''}
                    onChange={(e) => handleProfileDataChange('socialLinks', { ...profileData.socialLinks, website: e.target.value })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="Website URL"
                  />
                  <input
                    type="url"
                    value={profileData.socialLinks.portfolio || ''}
                    onChange={(e) => handleProfileDataChange('socialLinks', { ...profileData.socialLinks, portfolio: e.target.value })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="Portfolio URL"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back
              </button>
              <button
                onClick={validateAndProceed}
                className="btn-primary px-6 py-2"
              >
                Next: Preview
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Preview Your Profile
            </h2>

            {/* Profile Summary */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Profile Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Template:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400 capitalize">{selectedTemplate}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Bio Length:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">{profileData.bio.length} characters</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Skills:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">{profileData.skills.length} skills</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Social Links:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    {Object.values(profileData.socialLinks).filter(link => link && link.trim().length > 0).length} links
                  </span>
                </div>
              </div>
            </div>

            {/* Validation Results */}
            {validation && (
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Profile Completeness: {validation.completeness}%
                  </span>
                </div>

                {validation.warnings.length > 0 && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                      Suggestions for improvement:
                    </h4>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                      {validation.warnings.map((warning, index) => (
                        <li key={index}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">
                <OrbitalLoader message="Generating your professional README..." />
              </div>
            ) : (
              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Back: Edit Profile
                </button>
                <button
                  onClick={generateReadme}
                  className="btn-primary px-6 py-2 flex items-center"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate README
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Generated README */}
        {currentStep === 4 && generatedReadme && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Your Generated README
              </h2>
              <div className="flex space-x-3">
                <button
                  onClick={downloadReadme}
                  className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
                <button
                  onClick={deployToGitHub}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Deploy to GitHub
                </button>
              </div>
            </div>

            {/* GitHub Profile Repository Info */}
            {userData?.githubUsername && (
              <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <Globe className="h-5 w-5 text-neutral-700 dark:text-neutral-300 mr-2 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1">
                        GitHub Profile Repository
                      </h4>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300">
                        {repoExists ? (
                          <>✅ Profile repository <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">{userData.githubUsername}</code> is ready for deployment!</>
                        ) : (
                          <>You need a repository named <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">{userData.githubUsername}</code> in your GitHub account.</>
                        )}
                      </p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                        This is a special repository that GitHub uses to display your profile README.
                      </p>
                    </div>
                  </div>

                  {!repoExists && (
                    <button
                      onClick={createProfileRepository}
                      disabled={creatingRepo}
                      className="flex items-center px-3 py-1.5 btn-primary text-sm ml-4"
                    >
                      {creatingRepo ? (
                        <>
                          <Loader className="animate-spin h-3 w-3 mr-1" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Code className="h-3 w-3 mr-1" />
                          Create Repository
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* README Preview */}
            <div className="card mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  README.md Preview
                </h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {generatedReadme.wordCount} words • {selectedTemplate} template
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">
                  {generatedReadme.content}
                </pre>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(3)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back: Preview
              </button>
              <button
                onClick={() => {
                  setCurrentStep(1)
                  setGeneratedReadme(null)
                }}
                className="btn-primary px-6 py-2"
              >
                Generate Another
              </button>
            </div>
          </div>
        )}
      </div>


    </div>
  )
}

export default ReadmeGenerator
