import { useState, useEffect } from 'react'
import { Sparkles, Eye, Zap, AlertTriangle, CheckCircle, Info, Crown, Lock } from 'lucide-react'
import { apiService } from '../services/apiService'
import { useUserData } from '../contexts/UserContext'
import { Link } from 'react-router-dom'
import PremiumFeaturePreview from './PremiumFeaturePreview'

const PatternGenerator = () => {
  const { userData, loading: userLoading, isPremium } = useUserData()
  const [text, setText] = useState('')
  const [intensity, setIntensity] = useState(3)
  const [alignment, setAlignment] = useState('center')
  const [spacing, setSpacing] = useState(1)
  const [showPremiumPreview, setShowPremiumPreview] = useState(false)
  const [endDate, setEndDate] = useState('')
  const [preview, setPreview] = useState(null)
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [validation, setValidation] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    if (isPremium) {
      loadTemplates()
    }
    // Set default end date to today
    setEndDate(new Date().toISOString().split('T')[0])
  }, [isPremium])

  useEffect(() => {
    if (text) {
      validateText()
    }
  }, [text])

  const loadTemplates = async () => {
    try {
      const response = await apiService.get('/pattern/templates')
      if (response.success) {
        setTemplates(response.templates)
      }
    } catch (error) {
      console.error('Failed to load templates:', error)
      if (error.status === 401) {
        console.log('User not authenticated')
      } else if (error.status === 403) {
        console.log('User does not have premium access')
      }
    }
  }

  const validateText = async () => {
    try {
      const response = await apiService.post('/pattern/validate', { text })
      if (response.success) {
        setValidation(response.validation)
      }
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const generatePreview = async () => {
    if (!text || !validation?.valid) return

    setLoading(true)
    try {
      const response = await apiService.post('/pattern/preview', {
        text,
        intensity,
        alignment,
        spacing,
        endDate: endDate ? new Date(endDate).toISOString() : undefined
      })

      if (response.success) {
        setPreview(response)
      } else {
        alert(response.error || 'Failed to generate preview')
      }
    } catch (error) {
      console.error('Preview failed:', error)
      alert('Failed to generate preview')
    } finally {
      setLoading(false)
    }
  }

  const generatePattern = async () => {
    if (!preview || generating) return

    setGenerating(true)
    try {
      const response = await apiService.post('/pattern/generate', {
        text,
        intensity,
        alignment,
        spacing,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        confirm: true
      })

      if (response.success) {
        alert(`Pattern generated successfully! Created ${response.stats.successCount} commits.`)
        setShowConfirmation(false)
        setPreview(null)
        setText('')
      } else {
        alert(response.message || 'Failed to generate pattern')
      }
    } catch (error) {
      console.error('Pattern generation failed:', error)
      alert('Failed to generate pattern')
    } finally {
      setGenerating(false)
    }
  }

  const useTemplate = (template) => {
    setText(template.text)
  }

  const renderPreview = () => {
    if (!preview) return null

    const { pattern, stats } = preview
    
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Pattern Preview
        </h3>
        
        {/* Pattern Grid */}
        <div className="mb-6">
          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg overflow-x-auto">
            <div className="flex gap-px" style={{ width: 'max-content' }}>
              {Array.from({ length: 53 }, (_, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-px">
                  {Array.from({ length: 7 }, (_, rowIndex) => {
                    const cell = pattern[rowIndex][colIndex]
                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`w-2 h-2 rounded-sm ${
                          cell === 0 ? 'bg-gray-200 dark:bg-gray-600' :
                          cell === 1 ? 'bg-green-200 dark:bg-green-800' :
                          cell === 2 ? 'bg-green-400 dark:bg-green-600' :
                          cell === 3 ? 'bg-green-600 dark:bg-green-400' :
                          'bg-green-800 dark:bg-green-200'
                        }`}
                        title={`Week ${colIndex + 1}, Day ${rowIndex + 1}, Intensity: ${cell}`}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground">
              {stats.totalCommits}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Commits
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground">
              {stats.text}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Pattern Text
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground">
              {stats.dimensions.width}×{stats.dimensions.height}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Dimensions
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground">
              53 weeks
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Time Range
            </div>
          </div>
        </div>

        {/* Date Range */}
        {stats.dateRange.start && (
          <div className="bg-neutral-50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 mb-6">
            <div className="flex items-center text-blue-800 dark:text-blue-200">
              <Info className="w-5 h-5 mr-2" />
              <span className="font-medium">Date Range</span>
            </div>
            <p className="text-blue-700 dark:text-blue-300 mt-1">
              From {new Date(stats.dateRange.start).toLocaleDateString()} to{' '}
              {new Date(stats.dateRange.end).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={() => setShowConfirmation(true)}
          disabled={generating}
          className="btn-primary w-full py-3 text-lg font-semibold"
        >
          {generating ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
              Generating Pattern...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Zap className="w-5 h-5 mr-2" />
              Generate Pattern
            </div>
          )}
        </button>
      </div>
    )
  }

  // Show loading state
  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  // Show premium required message for non-premium users
  if (!isPremium) {
    return (
      <>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              GitHub Pattern Generator
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Create stunning visual patterns in your GitHub contribution graph.
            </p>
          </div>

          {/* Premium Feature Preview Card */}
          <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-900/20 dark:to-neutral-800/20 border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden">
            {/* Preview Image */}
            <div className="relative">
              <img
                src="/patternEX.png"
                alt="GitHub contribution pattern example showing AUTOMAX text pattern"
                className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-4 right-4">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  Premium Preview
                </div>
              </div>
              <div className="absolute bottom-4 left-4">
                <div className="bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-lg">
                  <div className="text-sm font-medium">AUTOMAX Pattern</div>
                  <div className="text-xs text-gray-600">Custom GitHub contribution design</div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-800 rounded-full">
                  <Sparkles className="h-8 w-8 text-neutral-700 dark:text-neutral-300" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Premium Feature: GitHub Pattern Generator
              </h3>

              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                Create custom visual patterns in your GitHub contribution graph that spell out words, showcase your brand,
                and make your profile stand out to recruiters and employers.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-8 text-sm">
                <div className="flex items-center justify-center gap-2 text-neutral-700 dark:text-neutral-300">
                  <CheckCircle className="h-4 w-4" />
                  Custom text patterns
                </div>
                <div className="flex items-center justify-center gap-2 text-neutral-700 dark:text-neutral-300">
                  <CheckCircle className="h-4 w-4" />
                  Backfill historical data
                </div>
                <div className="flex items-center justify-center gap-2 text-neutral-700 dark:text-neutral-300">
                  <CheckCircle className="h-4 w-4" />
                  Smart scheduling
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowPremiumPreview(true)}
                  className="btn-outline px-6 py-3"
                >
                  <Eye className="h-5 w-5 mr-2" />
                  View Full Preview
                </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="card p-4">
              <Sparkles className="h-6 w-6 text-neutral-700 dark:text-neutral-300 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Custom Patterns</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Create any text pattern using letters and numbers</p>
            </div>
            <div className="card p-4">
              <Eye className="h-6 w-6 text-neutral-700 dark:text-neutral-300 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Live Preview</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">See exactly how your pattern will look</p>
            </div>
            <div className="card p-4">
              <Zap className="h-6 w-6 text-neutral-700 dark:text-neutral-300 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Smart Generation</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Automated commit creation with custom dates</p>
            </div>
          </div>

                <Link
                  to="/upgrade"
                  className="btn-primary px-6 py-3"
                >
                  <Crown className="h-5 w-5 mr-2" />
                  Upgrade to Premium
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Feature Preview Modal */}
        <PremiumFeaturePreview
          isOpen={showPremiumPreview}
          onClose={() => setShowPremiumPreview(false)}
          featureType="pattern"
          onUpgrade={() => {
            setShowPremiumPreview(false)
            window.location.href = '/upgrade'
          }}
        />
      </>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          GitHub Pattern Generator
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Create stunning visual patterns in your GitHub contribution graph.
          Perfect for showcasing your brand, skills, or promotional messages to recruiters and employers.
        </p>
      </div>

      {/* Templates */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Templates
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => useTemplate(template)}
              className="p-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors"
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      {/* Configuration */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Pattern Configuration
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Text Input */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pattern Text
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value.toUpperCase())}
              placeholder="Enter text (e.g., AUTOMAX, HIRE ME)"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={10}
            />
            {validation && (
              <div className="mt-2">
                {validation.valid ? (
                  <div className="flex items-center text-neutral-700 dark:text-neutral-300">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">Text is valid</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600 dark:text-red-400">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <div className="text-sm">
                      {validation.errors.map((error, index) => (
                        <div key={index}>{error}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Intensity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Intensity Level
            </label>
            <select
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={1}>Light (1-2 commits/day)</option>
              <option value={2}>Medium (3-4 commits/day)</option>
              <option value={3}>High (5-7 commits/day)</option>
              <option value={4}>Maximum (8-12 commits/day)</option>
            </select>
          </div>

          {/* Alignment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Alignment
            </label>
            <select
              value={alignment}
              onChange={(e) => setAlignment(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>

          {/* Spacing */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Letter Spacing
            </label>
            <select
              value={spacing}
              onChange={(e) => setSpacing(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={0}>None</option>
              <option value={1}>Normal</option>
              <option value={2}>Wide</option>
              <option value={3}>Extra Wide</option>
            </select>
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Pattern will end on this date and span 53 weeks backwards
            </p>
          </div>
        </div>

        {/* Preview Button */}
        <div className="mt-6">
          <button
            onClick={generatePreview}
            disabled={!text || !validation?.valid || loading}
            className="btn-outline w-full py-3 text-lg font-semibold"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-600 border-t-transparent mr-3"></div>
                Generating Preview...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Eye className="w-5 h-5 mr-2" />
                Preview Pattern
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Preview */}
      {renderPreview()}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center text-orange-600 dark:text-orange-400 mb-4">
              <AlertTriangle className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-semibold">Confirm Pattern Generation</h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This will create {preview?.stats.totalCommits} commits in your repository 
              spanning the last 53 weeks. This action cannot be undone.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={generatePattern}
                disabled={generating}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                {generating ? 'Generating...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatternGenerator
