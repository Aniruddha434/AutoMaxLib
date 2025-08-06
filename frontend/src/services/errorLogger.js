class ErrorLogger {
  constructor() {
    this.isProduction = import.meta.env.PROD
    this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    this.maxRetries = 3
    this.retryDelay = 1000
  }

  async logError(type, errorData) {
    // Always log to console
    console.error(`[ErrorLogger] ${type}:`, errorData)

    // In production, also try to send to backend
    if (this.isProduction && this.apiBaseUrl) {
      try {
        await this.sendToBackend(type, errorData)
      } catch (err) {
        console.error('[ErrorLogger] Failed to send error to backend:', err)
      }
    }

    // Store in localStorage for debugging
    this.storeLocally(type, errorData)
  }

  async sendToBackend(type, errorData, retryCount = 0) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/monitoring/client-error`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          error: errorData,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          sessionId: this.getSessionId()
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      if (retryCount < this.maxRetries) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * (retryCount + 1)))
        return this.sendToBackend(type, errorData, retryCount + 1)
      }
      throw error
    }
  }

  storeLocally(type, errorData) {
    try {
      const errors = this.getStoredErrors()
      errors.push({
        type,
        error: errorData,
        timestamp: new Date().toISOString()
      })

      // Keep only last 50 errors
      if (errors.length > 50) {
        errors.splice(0, errors.length - 50)
      }

      localStorage.setItem('app_errors', JSON.stringify(errors))
    } catch (err) {
      console.error('[ErrorLogger] Failed to store error locally:', err)
    }
  }

  getStoredErrors() {
    try {
      const stored = localStorage.getItem('app_errors')
      return stored ? JSON.parse(stored) : []
    } catch (err) {
      return []
    }
  }

  clearStoredErrors() {
    try {
      localStorage.removeItem('app_errors')
    } catch (err) {
      console.error('[ErrorLogger] Failed to clear stored errors:', err)
    }
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('error_session_id')
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15)
      sessionStorage.setItem('error_session_id', sessionId)
    }
    return sessionId
  }

  // Method to get error summary for debugging
  getErrorSummary() {
    const errors = this.getStoredErrors()
    const summary = {
      total: errors.length,
      byType: {},
      recent: errors.slice(-10)
    }

    errors.forEach(error => {
      summary.byType[error.type] = (summary.byType[error.type] || 0) + 1
    })

    return summary
  }
}

// Create global instance
const errorLogger = new ErrorLogger()

// Make it available globally for error boundary and other components
if (typeof window !== 'undefined') {
  window.errorLogger = errorLogger
}

export default errorLogger
