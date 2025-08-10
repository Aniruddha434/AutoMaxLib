import { useEffect, useRef, useState } from 'react'
import { useUserData } from '../contexts/UserContext'
import { useToast } from '../components/ui/Toast'
import repositoryService from '../services/repositoryService'
import { Sparkles, Upload, Download, Copy, CheckCircle, AlertCircle, Eye, ExternalLink } from 'lucide-react'
import mermaid from 'mermaid'

const RepositoryArchitectureGenerator = () => {
  const { isPremium } = useUserData()
  const { addToast } = useToast()
  const [repositoryUrl, setRepositoryUrl] = useState('')
  const [repositoryData, setRepositoryData] = useState(repositoryService.getDefaultRepositoryData())
  const [analysisData, setAnalysisData] = useState(repositoryService.getDefaultAnalysisData())
  const [diagram, setDiagram] = useState(null)
  const [style, setStyle] = useState('flowchart')
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const [deploymentSuccess, setDeploymentSuccess] = useState(null)
  const [currentAction, setCurrentAction] = useState('')
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const svgContainerRef = useRef(null)

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'Arial, sans-serif',
      fontSize: 14,
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true
      }
    })
    console.log('Mermaid initialized')
  }, [])

  const validateAndAnalyze = async () => {
    setError(null)
    setDeploymentSuccess(null)
    const { isValid, errors } = repositoryService.validateRepositoryUrl(repositoryUrl)
    if (!isValid) {
      setError(errors[0] || 'Invalid repository URL')
      return
    }

    setAnalyzing(true)
    setCurrentAction('Analyzing repository structure and content...')
    try {
      // Force refresh token before analysis to avoid expiration
      if (!window.Clerk?.user) {
        setError('Please sign in to analyze repositories.')
        setAnalyzing(false)
        setCurrentAction('')
        return
      }

      const authToken = await window.Clerk?.session?.getToken({ skipCache: true })
      if (!authToken) {
        setError('Authentication required. Please sign in again.')
        setAnalyzing(false)
        setCurrentAction('')
        return
      }

      const result = await repositoryService.analyzeRepository(repositoryUrl)
      if (result?.success) {
        setRepositoryData(result.analysis.repositoryData)
        setAnalysisData(result.analysis.analysisData)
        setCurrentAction('')
        addToast({
          title: 'Analysis Complete',
          description: 'Repository analyzed successfully. Ready to generate architecture diagram.',
          variant: 'success'
        })
      } else {
        setError(result?.message || 'Failed to analyze repository')
      }
    } catch (e) {
      console.error('Analysis error:', e)
      if (e.status === 401 || e.error === 'CLERK_MIDDLEWARE_ERROR') {
        setError('Authentication failed. Please refresh the page and try again.')
      } else {
        setError(e.message || 'Failed to analyze repository')
      }
    } finally {
      setAnalyzing(false)
      setCurrentAction('')
    }
  }

  // Function to clean and validate Mermaid syntax
  const cleanMermaidCode = (code) => {
    if (!code) return code

    // Split into lines to preserve structure
    const lines = code.split('\n').map(line => {
      let cleaned = line.trim()

      // Fix node syntax: spaces in node names with brackets
      // Pattern: "API Gateway[Spring Boot]" -> "API_Gateway[\"Spring Boot\"]"
      cleaned = cleaned.replace(/([A-Za-z][A-Za-z\s]*[A-Za-z])\[([^\]]+)\]/g, (match, id, label) => {
        const cleanId = id.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')
        return `${cleanId}["${label}"]`
      })

      // Fix all node labels - remove problematic characters
      cleaned = cleaned.replace(/\[([^\]]*)\]/g, (match, content) => {
        // Remove quotes first if they exist
        let label = content.replace(/^["']|["']$/g, '')

        // Remove or replace problematic characters in labels
        const cleanLabel = label
          .replace(/[()]/g, '')  // Remove parentheses completely
          .replace(/['"]/g, '')  // Remove quotes
          .replace(/[{}]/g, '')  // Remove curly braces
          .replace(/[<>]/g, '')  // Remove angle brackets
          .trim()

        return `["${cleanLabel}"]`
      })

      // Fix simple arrows
      cleaned = cleaned.replace(/\s*-->\s*/g, ' --> ')
      cleaned = cleaned.replace(/\s*---\s*/g, ' --- ')

      return cleaned
    })

    return lines.filter(line => line.length > 0).join('\n')
  }

  const renderMermaid = async (mermaidCode) => {
    if (!svgContainerRef.current || !mermaidCode) {
      console.log('Missing container or mermaid code:', { container: !!svgContainerRef.current, code: !!mermaidCode })
      return
    }

    try {
      // Clean the Mermaid code before rendering
      const cleanedCode = cleanMermaidCode(mermaidCode)
      console.log('Original Mermaid code:', mermaidCode.substring(0, 200) + '...')
      console.log('Cleaned Mermaid code:', cleanedCode.substring(0, 200) + '...')

      const { svg } = await mermaid.render(`arch_${Date.now()}`, cleanedCode)
      console.log('Mermaid rendered successfully, SVG length:', svg.length)
      svgContainerRef.current.innerHTML = svg
    } catch (e) {
      console.error('Mermaid render error:', e)
      console.error('Failed code:', mermaidCode)

      // Try with a fallback simple diagram
      try {
        const fallbackDiagram = `graph TD
    A[Frontend] --> B[Backend]
    B --> C[Database]
    B --> D[External Services]

    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0`

        const { svg } = await mermaid.render(`arch_fallback_${Date.now()}`, fallbackDiagram)
        svgContainerRef.current.innerHTML = `
          <div class="text-orange-600 p-2 mb-4 bg-orange-50 rounded">
            ⚠️ Generated diagram had syntax errors. Showing simplified version.
          </div>
          ${svg}
        `
      } catch (fallbackError) {
        // Show error in the container
        svgContainerRef.current.innerHTML = `
          <div class="text-red-500 p-4 bg-red-50 rounded">
            <h4 class="font-semibold mb-2">Diagram Rendering Error</h4>
            <p class="text-sm mb-2">The generated Mermaid code contains syntax errors:</p>
            <code class="text-xs bg-red-100 p-2 rounded block">${e.message}</code>
            <details class="mt-2">
              <summary class="cursor-pointer text-sm">Show generated code</summary>
              <pre class="text-xs bg-gray-100 p-2 rounded mt-2 overflow-x-auto">${mermaidCode}</pre>
            </details>
          </div>
        `
      }
    }
  }

  const handleGenerateDiagram = async () => {
    setError(null)
    setDeploymentSuccess(null)
    setLoading(true)
    setCurrentAction('Generating architecture diagram with AI...')
    try {
      // Force refresh token before generation to avoid expiration
      if (!window.Clerk?.user) {
        setError('Please sign in to generate diagrams.')
        setLoading(false)
        setCurrentAction('')
        return
      }

      const authToken = await window.Clerk?.session?.getToken({ skipCache: true })
      if (!authToken) {
        setError('Authentication required. Please sign in again.')
        setLoading(false)
        setCurrentAction('')
        return
      }

      const resp = await repositoryService.generateRepositoryArchitecture(
        repositoryData,
        analysisData,
        style
      )
      if (resp?.success) {
        setDiagram(resp.diagram)
        setCurrentAction('Rendering diagram...')

        // Check if diagram actually has content
        if (!resp.diagram.mermaid || resp.diagram.mermaid.trim().length < 10) {
          setError('Generated diagram is empty or too short. Please try again.')
          setDiagram(null)
          return
        }

        try {
          await renderMermaid(resp.diagram.mermaid)
          setCurrentAction('')
          addToast({
            title: 'Diagram Generated',
            description: 'Architecture diagram generated and rendered successfully!',
            variant: 'success'
          })
        } catch (renderError) {
          console.error('Render error:', renderError)
          setError('Failed to render the generated diagram. The AI may have generated invalid Mermaid syntax. Try generating again.')
          // Keep the diagram data so user can see the raw code
          addToast({
            title: 'Rendering Failed',
            description: 'Diagram generated but failed to render. Try generating again.',
            variant: 'warning'
          })
        }
      } else {
        setError(resp?.message || 'Failed to generate architecture diagram')
      }
    } catch (e) {
      console.error('Generation error:', e)
      if (e.status === 401 || e.error === 'CLERK_MIDDLEWARE_ERROR') {
        setError('Authentication failed. Please refresh the page and try again.')
      } else {
        setError(e.message || 'Failed to generate architecture diagram')
      }
    } finally {
      setLoading(false)
      setCurrentAction('')
    }
  }

  const copyToClipboard = async () => {
    if (!diagram?.mermaid) return
    try {
      await navigator.clipboard.writeText(diagram.mermaid)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (_) {}
  }

  const downloadPNG = async () => {
    if (!svgContainerRef.current) {
      addToast({
        title: 'Download Failed',
        description: 'No diagram available to download.',
        variant: 'error'
      })
      return
    }

    const svgEl = svgContainerRef.current.querySelector('svg')
    if (!svgEl) {
      addToast({
        title: 'Download Failed',
        description: 'No diagram rendered to download.',
        variant: 'error'
      })
      return
    }

    try {
      setCurrentAction('Preparing download...')

      // Clone the SVG to avoid modifying the original
      const svgClone = svgEl.cloneNode(true)

      // Set explicit dimensions
      const svgRect = svgEl.getBoundingClientRect()
      const width = svgRect.width || 800
      const height = svgRect.height || 600

      svgClone.setAttribute('width', width)
      svgClone.setAttribute('height', height)
      svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

      // Convert SVG to data URL to avoid CORS issues
      const svgData = new XMLSerializer().serializeToString(svgClone)
      const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`

      // Create canvas and draw
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = width
      canvas.height = height

      // Fill white background
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)

      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height)

        // Convert to blob and download
        canvas.toBlob((blob) => {
          const a = document.createElement('a')
          a.href = URL.createObjectURL(blob)
          a.download = `architecture-${repositoryData.fullName?.replace('/', '-') || 'diagram'}.png`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(a.href)

          setCurrentAction('')
          addToast({
            title: 'Download Complete',
            description: 'Architecture diagram downloaded successfully!',
            variant: 'success'
          })
        }, 'image/png')
      }

      img.onerror = () => {
        setCurrentAction('')
        addToast({
          title: 'Download Failed',
          description: 'Failed to process diagram for download.',
          variant: 'error'
        })
      }

      img.src = svgDataUrl

    } catch (error) {
      setCurrentAction('')
      addToast({
        title: 'Download Failed',
        description: 'An error occurred while downloading the diagram.',
        variant: 'error'
      })
    }
  }

  const deployArchitecture = async () => {
    if (!diagram?.id) return
    const owner = repositoryData.owner
    const name = repositoryData.name
    if (!owner || !name) {
      setError('Repository owner/name missing. Please analyze from a GitHub URL first.')
      return
    }

    setDeploying(true)
    setError(null)
    setCurrentAction('Deploying architecture to repository...')

    try {
      // Force refresh token before deployment to avoid expiration
      if (!window.Clerk?.user) {
        setError('Please sign in to deploy to repositories.')
        setDeploying(false)
        setCurrentAction('')
        return
      }

      const authToken = await window.Clerk?.session?.getToken({ skipCache: true })
      if (!authToken) {
        setError('Authentication required. Please sign in again.')
        setDeploying(false)
        setCurrentAction('')
        return
      }

      const resp = await repositoryService.deployRepositoryArchitecture(diagram.id, {
        owner,
        name,
        branch: repositoryData.defaultBranch || 'main'
      })

      if (resp?.success) {
        setDeploymentSuccess({
          repository: `${owner}/${name}`,
          branch: repositoryData.defaultBranch || 'main',
          url: `https://github.com/${owner}/${name}`,
          deployedAt: new Date()
        })
        addToast({
          title: 'Deployment Successful',
          description: `Architecture deployed to ${owner}/${name}`,
          variant: 'success'
        })
      } else {
        setError(resp?.message || 'Failed to deploy architecture')
      }
    } catch (e) {
      console.error('Deployment error:', e)
      if (e.status === 401 || e.error === 'CLERK_MIDDLEWARE_ERROR') {
        setError('Authentication failed. Please refresh the page and try again.')
      } else {
        setError(e.message || 'Failed to deploy architecture')
      }
    } finally {
      setDeploying(false)
      setCurrentAction('')
    }
  }

  const viewInRepository = () => {
    if (deploymentSuccess?.url) {
      // Open the deployed architecture file in GitHub to show the rendered diagram
      const architectureUrl = `${deploymentSuccess.url}/blob/${deploymentSuccess.branch}/ARCHITECTURE.md`
      window.open(architectureUrl, '_blank', 'noopener,noreferrer')
      addToast({
        title: 'Opening Diagram',
        description: 'Opening deployed architecture diagram in repository...',
        variant: 'success'
      })
    } else if (diagram) {
      // Diagram exists but not deployed yet
      addToast({
        title: 'Deploy First',
        description: 'Please deploy the diagram to repository first to view it there.',
        variant: 'warning'
      })
    } else {
      addToast({
        title: 'No Diagram',
        description: 'Please generate an architecture diagram first.',
        variant: 'warning'
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Repository Architecture Diagram</h1>
          <p className="text-gray-600 dark:text-gray-400">Analyze your GitHub repository and generate a Mermaid system architecture diagram with AI.</p>
        </div>
      </div>

      {/* Step 1: Input */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">1) Enter GitHub Repository URL</h2>
        <div className="flex gap-3">
          <input
            type="url"
            placeholder="https://github.com/owner/repo"
            value={repositoryUrl}
            onChange={(e) => setRepositoryUrl(e.target.value)}
            className="input flex-1"
          />
          <button className="btn-outline" onClick={validateAndAnalyze} disabled={analyzing}>
            {analyzing ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>

      {/* Step 2: Options */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">2) Options</h2>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="style" value="flowchart" checked={style === 'flowchart'} onChange={() => setStyle('flowchart')} />
            <span>Flowchart</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="style" value="c4" checked={style === 'c4'} onChange={() => setStyle('c4')} />
            <span>C4-Style</span>
          </label>
        </div>
      </div>

      {/* Step 3: Generate */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">3) Generate Diagram</h2>
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Repository: <span className="font-medium text-gray-900 dark:text-white">{repositoryData.fullName || '—'}</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-gray-500">
              Style: <span className="capitalize font-medium">{style}</span>
            </span>
            {diagram && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                deploymentSuccess
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}>
                {deploymentSuccess ? '✓ Deployed' : '⚠ Not Deployed'}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              deploymentSuccess
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'btn-outline'
            }`}
            onClick={viewInRepository}
            disabled={!diagram}
            title={
              deploymentSuccess
                ? 'View deployed architecture diagram in repository'
                : diagram
                  ? 'Deploy first to view diagram in repository'
                  : 'Generate diagram first'
            }
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            {deploymentSuccess ? 'View in Repo' : 'View in Repo'}
          </button>
          <button
            className="btn-outline flex items-center"
            onClick={downloadPNG}
            disabled={!diagram || currentAction.includes('download')}
          >
            <Download className="w-4 h-4 mr-2" />
            {currentAction.includes('download') ? 'Downloading...' : 'Download PNG'}
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            onClick={deployArchitecture}
            disabled={!diagram || deploying}
          >
            <Upload className="w-4 h-4 mr-2" />
            {deploying ? 'Deploying...' : 'Deploy to Repo'}
          </button>
          <button
            className="btn-primary flex items-center"
            onClick={handleGenerateDiagram}
            disabled={loading || !repositoryData.fullName}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {loading ? 'Generating...' : 'Generate Architecture'}
          </button>
        </div>
        {error && (
          <div className="mt-4 flex items-center text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4 mr-2" /> {error}
          </div>
        )}
        {currentAction && (
          <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            {currentAction}
          </div>
        )}
        {deploymentSuccess && (
          <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-green-700 dark:text-green-300 font-medium">
                  Architecture deployed successfully!
                </div>
                <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Deployed to <span className="font-mono">{deploymentSuccess.repository}</span> on <span className="font-mono">{deploymentSuccess.branch}</span> branch
                </div>
                <div className="text-xs text-green-500 dark:text-green-500 mt-2">
                  File: ARCHITECTURE.md • Click "View in Repo" to see the rendered diagram
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => window.open(`${deploymentSuccess.url}/blob/${deploymentSuccess.branch}/ARCHITECTURE.md`, '_blank')}
                  className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 p-1 rounded hover:bg-green-100 dark:hover:bg-green-800/50 transition-colors"
                  title="View deployed file"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step 4: Output */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Architecture Diagram</h2>
          {diagram && (
            <div className="flex items-center gap-2">
              <button
                className="btn-outline flex items-center text-sm"
                onClick={copyToClipboard}
                title="Copy Mermaid source code"
              >
                {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy Mermaid'}
              </button>
            </div>
          )}
        </div>

        {!diagram && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
            <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Generate an architecture diagram to see it here
            </p>
          </div>
        )}

        {diagram && (
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 overflow-x-auto min-h-[300px] border border-gray-200 dark:border-gray-700 shadow-sm">
            <div ref={svgContainerRef} className="w-full h-full" />
          </div>
        )}
        {diagram && (
          <>
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400">Show Mermaid Source</summary>
              <pre className="bg-gray-50 dark:bg-gray-800 rounded p-4 text-sm overflow-x-auto whitespace-pre-wrap">{diagram.mermaid}</pre>
            </details>
          </>
        )}
      </div>

      {/* Note about rendering */}
      <div className="text-xs text-gray-500">
        Tip: You can also paste the Mermaid code into your README or mermaid.live.
      </div>
    </div>
  )
}

export default RepositoryArchitectureGenerator

