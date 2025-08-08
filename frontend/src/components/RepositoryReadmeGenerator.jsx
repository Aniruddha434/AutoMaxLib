import { useState, useEffect } from 'react'
import { useUserData } from '../contexts/UserContext'
import repositoryService from '../services/repositoryService'
import PremiumFeaturePreview from './PremiumFeaturePreview'
import {
  FileText,
  Download,
  Upload,
  Eye,
  Sparkles,
  Search,
  Code,
  Globe,
  AlertCircle,
  CheckCircle,
  Loader,
  Crown,
  GitBranch,
  Star,
  GitFork,
  Package
} from 'lucide-react'

const RepositoryReadmeGenerator = () => {
  const { userData, isPremium } = useUserData()
  const [currentStep, setCurrentStep] = useState(1)
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState('web-application')
  const [repositoryUrl, setRepositoryUrl] = useState('')
  const [repositoryData, setRepositoryData] = useState(repositoryService.getDefaultRepositoryData())
  const [analysisData, setAnalysisData] = useState(repositoryService.getDefaultAnalysisData())
  const [customSections, setCustomSections] = useState({})
  const [generatedReadme, setGeneratedReadme] = useState(null)
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState(null)
  const [urlValidation, setUrlValidation] = useState(null)
  const [usage, setUsage] = useState(null)
  const [limits, setLimits] = useState(null)


  useEffect(() => {
    loadTemplates()
    loadUsageInfo()
  }, [])

  const loadTemplates = async () => {
    try {
      const response = await repositoryService.getRepositoryReadmeTemplates()
      setTemplates(response.templates || [])
    } catch (error) {
      console.error('Error loading repository templates:', error)
      setError('Failed to load templates')
    }
  }

  const loadUsageInfo = async () => {
    try {
      const response = await repositoryService.getRepositoryReadmeHistory()
      setUsage(response.usage || { monthly: 0, total: 0 })
      setLimits(response.limits || null)
    } catch (error) {
      console.error('Error loading usage info:', error)
    }
  }

  const validateRepositoryUrl = (url) => {
    const validation = repositoryService.validateRepositoryUrl(url)
    setUrlValidation(validation)
    return validation.isValid
  }

  const analyzeRepository = async () => {
    if (!validateRepositoryUrl(repositoryUrl)) {
      return
    }

    // Check if user can generate (for both free and premium users)
    if (limits && !limits.canGenerate) {
      setError(limits.reason || 'Generation limit reached')
      return
    }

    setAnalyzing(true)
    setError(null)

    try {
      const response = await repositoryService.analyzeRepository(repositoryUrl)
      console.log('Analysis response:', response) // Debug log

      if (response.success && response.analysis) {
        setRepositoryData(response.analysis.repositoryData)
        setAnalysisData(response.analysis.analysisData)
        setCurrentStep(2)
      } else {
        setError('Failed to analyze repository: Invalid response')
      }
    } catch (error) {
      console.error('Error analyzing repository:', error)
      setError(error.message || 'Failed to analyze repository')
    } finally {
      setAnalyzing(false)
    }
  }

  const generateReadme = async () => {
    // Check if user can generate (for both free and premium users)
    if (limits && !limits.canGenerate) {
      setError(limits.reason || 'Generation limit reached')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await repositoryService.generateRepositoryReadme(
        repositoryData,
        analysisData,
        selectedTemplate,
        customSections
      )

      setGeneratedReadme(response.readme)
      setUsage(response.usage)
      setLimits(response.limits)
      setCurrentStep(4)
    } catch (error) {
      console.error('Error generating repository README:', error)
      setError(error.message || 'Failed to generate repository README')
    } finally {
      setLoading(false)
    }
  }

  const downloadReadme = async () => {
    if (!generatedReadme) return

    try {
      await repositoryService.downloadRepositoryReadme(generatedReadme.id)
    } catch (error) {
      console.error('Error downloading README:', error)
      setError('Failed to download README')
    }
  }

  const deployReadme = async () => {
    if (!generatedReadme || !repositoryData) return

    setLoading(true)
    setError(null)

    try {
      const targetRepository = {
        owner: repositoryData.owner,
        name: repositoryData.name,
        branch: repositoryData.defaultBranch || 'main'
      }

      const response = await repositoryService.deployRepositoryReadme(
        generatedReadme.id,
        targetRepository
      )

      if (response.success) {
        setGeneratedReadme(prev => ({
          ...prev,
          isDeployed: true,
          deployedAt: new Date()
        }))
      }
    } catch (error) {
      console.error('Error deploying README:', error)
      setError(error.message || 'Failed to deploy README')
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          AI-Powered Repository README Generator
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Analyze your repository and generate a comprehensive README.md with AI assistance
        </p>
        
        {/* Usage Info */}
        {usage && limits && (
          <div className="mt-4 p-4 bg-neutral-50 dark:bg-neutral-900/20 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              {limits.isPremium ? (
                <>
                  <span className="text-sm text-neutral-800 dark:text-neutral-200">
                    Monthly Usage: {limits.usage}/{limits.limit} repository README generations
                  </span>
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    Resets monthly • Total Generated: {usage.total}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-sm text-neutral-800 dark:text-neutral-200">
                    Free Plan: {limits.usage}/{limits.limit} lifetime repository README generations
                  </span>
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    {limits.remaining > 0 ? `${limits.remaining} remaining` : 'Limit reached'}
                  </span>
                </>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    limits.remaining === 0 ? 'bg-red-500' :
                    limits.remaining <= 1 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(limits.usage / limits.limit) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700 dark:text-red-300">{error}</span>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[
            { step: 1, title: 'Repository', icon: Search },
            { step: 2, title: 'Analysis', icon: Code },
            { step: 3, title: 'Template', icon: FileText },
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

      {/* Free User Messaging */}
      {!isPremium && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Package className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <div>
                <span className="text-blue-800 dark:text-blue-200 font-medium">
                  Free Plan: {limits?.remaining || 2} repository README generations remaining
                </span>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  {limits?.remaining > 0
                    ? "Try our repository README generator for free!"
                    : "You've used all your free generations. Upgrade for unlimited access."
                  }
                </p>
              </div>
            </div>
            {limits?.remaining === 0 && (
              <button
                onClick={() => window.open('/pricing', '_blank')}
                className="btn-primary text-sm"
              >
                <Crown className="h-4 w-4 mr-1" />
                Upgrade
              </button>
            )}
          </div>
        </div>
      )}

      {/* Premium User Badge */}
      {isPremium && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <div className="flex items-center">
            <Crown className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
            <span className="text-purple-800 dark:text-purple-200">
              Premium Plan: {limits?.remaining || 0} repository README generations remaining this month
            </span>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="card">
        {/* Step 1: Repository URL Input */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Enter Repository URL
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  value={repositoryUrl}
                  onChange={(e) => {
                    setRepositoryUrl(e.target.value)
                    if (e.target.value) {
                      validateRepositoryUrl(e.target.value)
                    } else {
                      setUrlValidation(null)
                    }
                  }}
                  placeholder="https://github.com/owner/repository"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
                
                {/* URL Validation */}
                {urlValidation && (
                  <div className="mt-2">
                    {urlValidation.errors.length > 0 && (
                      <div className="text-red-600 dark:text-red-400 text-sm">
                        {urlValidation.errors.map((error, index) => (
                          <div key={index} className="flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {error}
                          </div>
                        ))}
                      </div>
                    )}
                    {urlValidation.warnings.length > 0 && (
                      <div className="text-yellow-600 dark:text-yellow-400 text-sm">
                        {urlValidation.warnings.map((warning, index) => (
                          <div key={index} className="flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {warning}
                          </div>
                        ))}
                      </div>
                    )}
                    {urlValidation.isValid && (
                      <div className="text-green-600 dark:text-green-400 text-sm flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Valid repository URL
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  How it works:
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Enter your GitHub repository URL</li>
                  <li>• AI analyzes your code structure and technologies</li>
                  <li>• Choose from project-specific README templates</li>
                  <li>• Generate and deploy your professional README</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => {
                  console.log('Current state:', {
                    repositoryUrl,
                    repositoryData,
                    analysisData,
                    currentStep,
                    urlValidation
                  })
                }}
                className="btn-secondary text-xs"
              >
                Debug State
              </button>
              {limits && !limits.canGenerate ? (
                <div className="flex flex-col items-end space-y-2">
                  <div className="text-sm text-red-600 dark:text-red-400 text-right">
                    {limits.reason}
                  </div>
                  {!isPremium && (
                    <button
                      onClick={() => window.open('/pricing', '_blank')}
                      className="btn-primary flex items-center"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Premium
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={analyzeRepository}
                  disabled={!repositoryUrl || !urlValidation?.isValid || analyzing}
                  className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {analyzing ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing Repository...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Analyze Repository
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Repository Analysis */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Repository Analysis
            </h2>

            {/* Repository Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <GitBranch className="h-5 w-5 mr-2" />
                  Repository Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Name:</span>
                    <span className="font-medium">{repositoryData?.fullName || 'Loading...'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Language:</span>
                    <span className="font-medium">{repositoryData?.language || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Stars:</span>
                    <span className="font-medium flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      {repositoryService.formatNumber(repositoryData?.stargazersCount || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Forks:</span>
                    <span className="font-medium flex items-center">
                      <GitFork className="h-4 w-4 mr-1" />
                      {repositoryService.formatNumber(repositoryData?.forksCount || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Size:</span>
                    <span className="font-medium">{repositoryService.formatFileSize(repositoryData?.size || 0)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  Technical Analysis
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Project Type:</span>
                    <span className="font-medium flex items-center">
                      {repositoryService.getProjectTypeIcon(analysisData?.projectType || 'web-application')}
                      <span className="ml-1">{analysisData?.projectType || 'Analyzing...'}</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Complexity:</span>
                    <span className={`font-medium px-2 py-1 rounded text-xs ${
                      (analysisData?.estimatedComplexity || 'moderate') === 'simple' ? 'bg-green-100 text-green-800' :
                      (analysisData?.estimatedComplexity || 'moderate') === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {analysisData?.estimatedComplexity || 'moderate'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Has Tests:</span>
                    <span className="font-medium">{analysisData?.hasTests ? '✅ Yes' : '❌ No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Has CI:</span>
                    <span className="font-medium">{analysisData?.hasCI ? '✅ Yes' : '❌ No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Files:</span>
                    <span className="font-medium">{analysisData?.codeStructure?.totalFiles || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Technologies */}
            {analysisData?.technologies && analysisData.technologies.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {analysisData.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Frameworks */}
            {analysisData?.frameworks && analysisData.frameworks.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Frameworks</h3>
                <div className="flex flex-wrap gap-2">
                  {analysisData.frameworks.map((framework, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm"
                    >
                      {framework}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {repositoryData?.description && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Description</h3>
                <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  {repositoryData.description}
                </p>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(1)}
                className="btn-secondary"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="btn-primary"
              >
                Choose Template
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Template Selection */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Choose a Template
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`cursor-pointer border-2 rounded-lg p-6 transition-all ${
                    selectedTemplate === template.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">
                      {repositoryService.getProjectTypeIcon(template.id)}
                    </span>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {template.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {template.description}
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">
                      Features:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {template.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(2)}
                className="btn-secondary"
              >
                Back
              </button>
              {limits && !limits.canGenerate ? (
                <div className="flex flex-col items-end space-y-2">
                  <div className="text-sm text-red-600 dark:text-red-400 text-right">
                    {limits.reason}
                  </div>
                  {!isPremium && (
                    <button
                      onClick={() => window.open('/pricing', '_blank')}
                      className="btn-primary flex items-center"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Premium
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={generateReadme}
                  disabled={loading}
                  className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Generating README...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate README
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Generated README */}
        {currentStep === 4 && generatedReadme && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Your Generated Repository README
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {generatedReadme.wordCount} words
                </span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">
                  {generatedReadme.template}
                </span>
              </div>
            </div>

            {/* README Preview */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono">
                {generatedReadme.content}
              </pre>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={downloadReadme}
                className="btn-secondary flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download README
              </button>

              <button
                onClick={deployReadme}
                disabled={loading || generatedReadme.isDeployed}
                className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Deploying...
                  </>
                ) : generatedReadme.isDeployed ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Deployed
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Deploy to Repository
                  </>
                )}
              </button>
            </div>

            {/* Deployment Info */}
            {generatedReadme.isDeployed && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-green-700 dark:text-green-300">
                    README successfully deployed to {repositoryData.fullName}
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => {
                  setCurrentStep(1)
                  setRepositoryUrl('')
                  setRepositoryData(repositoryService.getDefaultRepositoryData())
                  setAnalysisData(repositoryService.getDefaultAnalysisData())
                  setGeneratedReadme(null)
                  setError(null)
                }}
                className="btn-secondary"
              >
                Generate Another
              </button>

              <a
                href={`https://github.com/${repositoryData.fullName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center"
              >
                <Globe className="h-4 w-4 mr-2" />
                View Repository
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RepositoryReadmeGenerator
