import geolocationService from './geolocationService.js'
import currencyService from './currencyService.js'

class PricingService {
  constructor() {
    // Payment method configurations by region
    this.paymentMethods = {
      // India - Full local payment support
      'IN': {
        card: true,
        netbanking: true,
        wallet: true,
        upi: true,
        emi: false,
        paylater: false
      },
      // United States - Cards and digital wallets
      'US': {
        card: true,
        netbanking: false,
        wallet: false,
        upi: false,
        emi: false,
        paylater: false
      },
      // European Union - Cards primarily
      'EU': {
        card: true,
        netbanking: false,
        wallet: false,
        upi: false,
        emi: false,
        paylater: false
      },
      // Default international - Cards only
      'INTERNATIONAL': {
        card: true,
        netbanking: false,
        wallet: false,
        upi: false,
        emi: false,
        paylater: false
      }
    }

    // EU countries for payment method grouping
    this.euCountries = [
      'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PT', 'IE', 'FI',
      'GR', 'LU', 'MT', 'CY', 'SK', 'SI', 'EE', 'LV', 'LT'
    ]
  }

  /**
   * Get pricing and payment configuration for a user's location
   * @param {Object} req - Express request object
   * @returns {Object} Complete pricing and payment configuration
   */
  async getPricingForUser(req) {
    try {
      // Get user's location
      const userIP = this.getUserIP(req)
      let locationData

      // Try IP-based geolocation first
      if (userIP) {
        locationData = await geolocationService.getCountryFromIP(userIP)
      } else {
        // Fallback to headers
        locationData = geolocationService.getCountryFromHeaders(req)
      }

      // Get pricing for user's currency
      const pricing = currencyService.getPricingForCurrency(
        locationData.currency,
        locationData.countryCode
      )

      // Get payment methods for user's region
      const paymentMethods = this.getPaymentMethodsForCountry(locationData.countryCode)

      // Get Razorpay configuration
      const razorpayConfig = this.getRazorpayConfig(locationData.countryCode, locationData.currency)

      return {
        success: true,
        location: locationData,
        pricing,
        paymentMethods,
        razorpayConfig
      }
    } catch (error) {
      console.error('Error getting pricing for user:', error)
      
      // Return default configuration on error
      return this.getDefaultPricing()
    }
  }

  /**
   * Get default pricing configuration (fallback)
   * @returns {Object} Default pricing configuration
   */
  getDefaultPricing() {
    const defaultLocation = geolocationService.getDefaultCountry()
    const pricing = currencyService.getPricingForCurrency('USD', 'US')
    const paymentMethods = this.getPaymentMethodsForCountry('US')
    const razorpayConfig = this.getRazorpayConfig('US', 'USD')

    return {
      success: true,
      location: defaultLocation,
      pricing,
      paymentMethods,
      razorpayConfig
    }
  }

  /**
   * Get payment methods configuration for a country
   * @param {string} countryCode - ISO country code
   * @returns {Object} Payment methods configuration
   */
  getPaymentMethodsForCountry(countryCode) {
    // India gets full local payment support
    if (countryCode === 'IN') {
      return this.paymentMethods['IN']
    }
    
    // EU countries get EU configuration
    if (this.euCountries.includes(countryCode)) {
      return this.paymentMethods['EU']
    }
    
    // US gets US configuration
    if (countryCode === 'US') {
      return this.paymentMethods['US']
    }
    
    // Everyone else gets international configuration
    return this.paymentMethods['INTERNATIONAL']
  }

  /**
   * Get Razorpay configuration for a country and currency
   * @param {string} countryCode - ISO country code
   * @param {string} currency - Currency code
   * @returns {Object} Razorpay configuration
   */
  getRazorpayConfig(countryCode, currency) {
    const config = {
      currency,
      theme: {
        color: '#3B82F6'
      },
      modal: {
        backdropClose: false,
        escape: true,
        handleback: true,
        confirm_close: true,
        ondismiss: () => {
          console.log('Payment modal dismissed')
        }
      }
    }

    // India-specific configuration
    if (countryCode === 'IN') {
      config.config = {
        display: {
          language: 'en',
          preferences: {
            show_default_blocks: true
          }
        }
      }
    }

    // International configuration
    else {
      config.config = {
        display: {
          language: 'en',
          preferences: {
            show_default_blocks: true
          }
        }
      }
    }

    return config
  }

  /**
   * Get user's IP address from request
   * @param {Object} req - Express request object
   * @returns {string|null} User's IP address
   */
  getUserIP(req) {
    // Check various headers for the real IP
    const forwarded = req.headers['x-forwarded-for']
    const realIP = req.headers['x-real-ip']
    const cfConnectingIP = req.headers['cf-connecting-ip']
    
    if (cfConnectingIP) {
      return cfConnectingIP
    }
    
    if (forwarded) {
      return forwarded.split(',')[0].trim()
    }
    
    if (realIP) {
      return realIP
    }
    
    return req.connection?.remoteAddress || req.socket?.remoteAddress || null
  }

  /**
   * Validate currency for Razorpay
   * @param {string} currency - Currency code
   * @returns {boolean} Whether currency is supported by Razorpay
   */
  isRazorpaySupportedCurrency(currency) {
    // Razorpay supported currencies (as of 2024)
    const supportedCurrencies = [
      'INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SGD', 'AED', 'MYR'
    ]
    
    return supportedCurrencies.includes(currency)
  }

  /**
   * Get fallback currency if current currency is not supported by Razorpay
   * @param {string} currency - Original currency
   * @param {string} countryCode - Country code
   * @returns {string} Fallback currency
   */
  getFallbackCurrency(currency, countryCode) {
    if (this.isRazorpaySupportedCurrency(currency)) {
      return currency
    }

    // Regional fallbacks
    if (countryCode === 'IN') return 'INR'
    if (this.euCountries.includes(countryCode)) return 'EUR'
    if (countryCode === 'GB') return 'GBP'
    if (countryCode === 'AU' || countryCode === 'NZ') return 'AUD'
    if (countryCode === 'CA') return 'CAD'
    if (countryCode === 'SG') return 'SGD'
    if (['AE', 'SA', 'QA', 'KW', 'BH', 'OM'].includes(countryCode)) return 'AED'
    if (countryCode === 'MY') return 'MYR'
    
    // Default fallback
    return 'USD'
  }

  /**
   * Get complete pricing configuration with fallback currency
   * @param {Object} req - Express request object
   * @returns {Object} Complete pricing configuration with Razorpay-compatible currency
   */
  async getCompatiblePricingForUser(req) {
    const pricingData = await this.getPricingForUser(req)
    
    if (!pricingData.success) {
      return pricingData
    }

    const originalCurrency = pricingData.pricing.currency
    const countryCode = pricingData.location.countryCode
    
    // Check if we need to use a fallback currency for Razorpay
    const razorpayCurrency = this.getFallbackCurrency(originalCurrency, countryCode)
    
    if (razorpayCurrency !== originalCurrency) {
      console.log(`Using fallback currency ${razorpayCurrency} instead of ${originalCurrency} for Razorpay compatibility`)
      
      // Get pricing in the fallback currency
      const fallbackPricing = currencyService.getPricingForCurrency(razorpayCurrency, countryCode)
      
      // Update the configuration
      pricingData.pricing = fallbackPricing
      pricingData.razorpayConfig.currency = razorpayCurrency
      pricingData.originalCurrency = originalCurrency
      pricingData.fallbackUsed = true
    }

    return pricingData
  }
}

export default new PricingService()
