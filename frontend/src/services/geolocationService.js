class GeolocationService {
  constructor() {
    this.cache = new Map()
    this.cacheExpiry = 24 * 60 * 60 * 1000 // 24 hours
  }

  /**
   * Get user's location using browser geolocation API
   * @returns {Promise<Object>} Location data
   */
  async getBrowserLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null)
        return
      }

      const options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 24 * 60 * 60 * 1000 // 24 hours
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
        },
        (error) => {
          console.warn('Geolocation error:', error.message)
          resolve(null)
        },
        options
      )
    })
  }

  /**
   * Get user's timezone
   * @returns {string} Timezone identifier
   */
  getTimezone() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone
    } catch (error) {
      console.warn('Failed to get timezone:', error)
      return 'UTC'
    }
  }

  /**
   * Get user's locale
   * @returns {string} Locale identifier
   */
  getLocale() {
    try {
      return navigator.language || navigator.languages[0] || 'en-US'
    } catch (error) {
      console.warn('Failed to get locale:', error)
      return 'en-US'
    }
  }

  /**
   * Get country from locale
   * @returns {string|null} Country code
   */
  getCountryFromLocale() {
    try {
      const locale = this.getLocale()
      const parts = locale.split('-')
      if (parts.length > 1) {
        return parts[1].toUpperCase()
      }
      return null
    } catch (error) {
      console.warn('Failed to get country from locale:', error)
      return null
    }
  }

  /**
   * Get currency from locale
   * @returns {string} Currency code
   */
  getCurrencyFromLocale() {
    try {
      const locale = this.getLocale()
      const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD' // Default, will be overridden
      })
      
      // Try to get the currency from the locale
      const options = formatter.resolvedOptions()
      return options.currency || 'USD'
    } catch (error) {
      console.warn('Failed to get currency from locale:', error)
      return 'USD'
    }
  }

  /**
   * Detect user's location using multiple methods
   * @returns {Promise<Object>} Detected location information
   */
  async detectLocation() {
    const cacheKey = 'user_location'
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data
    }

    try {
      // Get basic browser information
      const timezone = this.getTimezone()
      const locale = this.getLocale()
      const countryFromLocale = this.getCountryFromLocale()
      
      // Try to get more precise location from browser
      const browserLocation = await this.getBrowserLocation()

      // Create location object
      const locationData = {
        timezone,
        locale,
        countryFromLocale,
        browserLocation,
        detectedAt: new Date().toISOString()
      }

      // Cache the result
      this.cache.set(cacheKey, {
        data: locationData,
        timestamp: Date.now()
      })

      return locationData
    } catch (error) {
      console.error('Error detecting location:', error)
      return {
        timezone: 'UTC',
        locale: 'en-US',
        countryFromLocale: null,
        browserLocation: null,
        detectedAt: new Date().toISOString()
      }
    }
  }

  /**
   * Get user's IP-based location from backend
   * @returns {Promise<Object>} Server-detected location
   */
  async getServerLocation() {
    try {
      const response = await fetch('/api/payment/pricing', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to get server location')
      }

      const data = await response.json()
      return data.location
    } catch (error) {
      console.error('Error getting server location:', error)
      return null
    }
  }

  /**
   * Get comprehensive location data combining client and server detection
   * @returns {Promise<Object>} Complete location information
   */
  async getCompleteLocation() {
    try {
      const [clientLocation, serverLocation] = await Promise.all([
        this.detectLocation(),
        this.getServerLocation()
      ])

      return {
        client: clientLocation,
        server: serverLocation,
        combined: {
          country: serverLocation?.country || 'Unknown',
          countryCode: serverLocation?.countryCode || clientLocation?.countryFromLocale || 'US',
          currency: serverLocation?.currency || 'USD',
          timezone: clientLocation?.timezone || serverLocation?.timezone || 'UTC',
          locale: clientLocation?.locale || 'en-US',
          city: serverLocation?.city || 'Unknown',
          region: serverLocation?.region || 'Unknown'
        }
      }
    } catch (error) {
      console.error('Error getting complete location:', error)
      return {
        client: null,
        server: null,
        combined: {
          country: 'United States',
          countryCode: 'US',
          currency: 'USD',
          timezone: 'UTC',
          locale: 'en-US',
          city: 'Unknown',
          region: 'Unknown'
        }
      }
    }
  }

  /**
   * Clear location cache
   */
  clearCache() {
    this.cache.clear()
  }

  /**
   * Format currency amount based on locale
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code
   * @param {string} locale - Locale for formatting
   * @returns {string} Formatted currency string
   */
  formatCurrency(amount, currency, locale = null) {
    try {
      const formatLocale = locale || this.getLocale()
      return new Intl.NumberFormat(formatLocale, {
        style: 'currency',
        currency: currency
      }).format(amount)
    } catch (error) {
      console.warn('Failed to format currency:', error)
      return `${currency} ${amount}`
    }
  }

  /**
   * Get currency symbol for a currency code
   * @param {string} currency - Currency code
   * @param {string} locale - Locale for symbol
   * @returns {string} Currency symbol
   */
  getCurrencySymbol(currency, locale = null) {
    try {
      const formatLocale = locale || this.getLocale()
      const formatter = new Intl.NumberFormat(formatLocale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })
      
      // Format a small amount and extract the symbol
      const formatted = formatter.format(0)
      return formatted.replace(/[\d\s,]/g, '')
    } catch (error) {
      console.warn('Failed to get currency symbol:', error)
      return currency
    }
  }
}

export const geolocationService = new GeolocationService()
export default geolocationService
