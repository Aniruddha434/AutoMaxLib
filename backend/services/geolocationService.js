import axios from 'axios'

class GeolocationService {
  constructor() {
    this.cache = new Map()
    this.cacheExpiry = 24 * 60 * 60 * 1000 // 24 hours
  }

  /**
   * Get country information from IP address
   * @param {string} ip - IP address
   * @returns {Object} Country information
   */
  async getCountryFromIP(ip) {
    // Skip localhost and private IPs
    if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
      return this.getDefaultCountry()
    }

    // Check cache first
    const cacheKey = `ip_${ip}`
    const cached = this.cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data
    }

    try {
      // Using ipapi.co for free IP geolocation (1000 requests/day)
      const response = await axios.get(`https://ipapi.co/${ip}/json/`, {
        timeout: 5000,
        headers: {
          'User-Agent': 'AutoMaxLib/1.0'
        }
      })

      const countryData = {
        country: response.data.country_name || 'Unknown',
        countryCode: response.data.country_code || 'US',
        currency: response.data.currency || 'USD',
        region: response.data.region || 'Unknown',
        city: response.data.city || 'Unknown',
        timezone: response.data.timezone || 'UTC'
      }

      // Cache the result
      this.cache.set(cacheKey, {
        data: countryData,
        timestamp: Date.now()
      })

      return countryData
    } catch (error) {
      console.warn('Failed to get geolocation data:', error.message)
      return this.getDefaultCountry()
    }
  }

  /**
   * Get country from request headers (fallback method)
   * @param {Object} req - Express request object
   * @returns {Object} Country information
   */
  getCountryFromHeaders(req) {
    // Check for Cloudflare country header
    if (req.headers['cf-ipcountry']) {
      return {
        country: this.getCountryName(req.headers['cf-ipcountry']),
        countryCode: req.headers['cf-ipcountry'],
        currency: this.getCurrencyForCountry(req.headers['cf-ipcountry']),
        region: 'Unknown',
        city: 'Unknown',
        timezone: 'UTC'
      }
    }

    // Check for other common headers
    const acceptLanguage = req.headers['accept-language']
    if (acceptLanguage) {
      const locale = acceptLanguage.split(',')[0].split('-')[1]
      if (locale && locale.length === 2) {
        return {
          country: this.getCountryName(locale.toUpperCase()),
          countryCode: locale.toUpperCase(),
          currency: this.getCurrencyForCountry(locale.toUpperCase()),
          region: 'Unknown',
          city: 'Unknown',
          timezone: 'UTC'
        }
      }
    }

    return this.getDefaultCountry()
  }

  /**
   * Get default country (fallback)
   * @returns {Object} Default country information
   */
  getDefaultCountry() {
    return {
      country: 'United States',
      countryCode: 'US',
      currency: 'USD',
      region: 'Unknown',
      city: 'Unknown',
      timezone: 'UTC'
    }
  }

  /**
   * Get currency for a country code
   * @param {string} countryCode - ISO country code
   * @returns {string} Currency code
   */
  getCurrencyForCountry(countryCode) {
    const currencyMap = {
      'US': 'USD', 'CA': 'CAD', 'GB': 'GBP', 'AU': 'AUD', 'NZ': 'NZD',
      'IN': 'INR', 'CN': 'CNY', 'JP': 'JPY', 'KR': 'KRW', 'SG': 'SGD',
      'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR', 'ES': 'EUR', 'NL': 'EUR',
      'BE': 'EUR', 'AT': 'EUR', 'PT': 'EUR', 'IE': 'EUR', 'FI': 'EUR',
      'GR': 'EUR', 'LU': 'EUR', 'MT': 'EUR', 'CY': 'EUR', 'SK': 'EUR',
      'SI': 'EUR', 'EE': 'EUR', 'LV': 'EUR', 'LT': 'EUR',
      'BR': 'BRL', 'MX': 'MXN', 'AR': 'ARS', 'CL': 'CLP', 'CO': 'COP',
      'PE': 'PEN', 'UY': 'UYU', 'PY': 'PYG', 'BO': 'BOB', 'EC': 'USD',
      'VE': 'VES', 'GY': 'GYD', 'SR': 'SRD', 'FK': 'FKP',
      'CH': 'CHF', 'NO': 'NOK', 'SE': 'SEK', 'DK': 'DKK', 'IS': 'ISK',
      'PL': 'PLN', 'CZ': 'CZK', 'HU': 'HUF', 'RO': 'RON', 'BG': 'BGN',
      'HR': 'HRK', 'RS': 'RSD', 'BA': 'BAM', 'MK': 'MKD', 'AL': 'ALL',
      'ME': 'EUR', 'XK': 'EUR', 'MD': 'MDL', 'UA': 'UAH', 'BY': 'BYN',
      'RU': 'RUB', 'TR': 'TRY', 'IL': 'ILS', 'SA': 'SAR', 'AE': 'AED',
      'QA': 'QAR', 'KW': 'KWD', 'BH': 'BHD', 'OM': 'OMR', 'JO': 'JOD',
      'LB': 'LBP', 'SY': 'SYP', 'IQ': 'IQD', 'IR': 'IRR', 'AF': 'AFN',
      'PK': 'PKR', 'BD': 'BDT', 'LK': 'LKR', 'MV': 'MVR', 'NP': 'NPR',
      'BT': 'BTN', 'MM': 'MMK', 'TH': 'THB', 'LA': 'LAK', 'KH': 'KHR',
      'VN': 'VND', 'MY': 'MYR', 'BN': 'BND', 'ID': 'IDR', 'PH': 'PHP',
      'TW': 'TWD', 'HK': 'HKD', 'MO': 'MOP', 'MN': 'MNT', 'KZ': 'KZT',
      'KG': 'KGS', 'TJ': 'TJS', 'UZ': 'UZS', 'TM': 'TMT',
      'ZA': 'ZAR', 'NG': 'NGN', 'KE': 'KES', 'GH': 'GHS', 'EG': 'EGP',
      'MA': 'MAD', 'TN': 'TND', 'DZ': 'DZD', 'LY': 'LYD', 'SD': 'SDG',
      'ET': 'ETB', 'UG': 'UGX', 'TZ': 'TZS', 'RW': 'RWF', 'BI': 'BIF',
      'DJ': 'DJF', 'SO': 'SOS', 'ER': 'ERN', 'SS': 'SSP', 'TD': 'XAF',
      'CF': 'XAF', 'CM': 'XAF', 'GQ': 'XAF', 'GA': 'XAF', 'CG': 'XAF',
      'AO': 'AOA', 'ZM': 'ZMW', 'ZW': 'ZWL', 'BW': 'BWP', 'SZ': 'SZL',
      'LS': 'LSL', 'MZ': 'MZN', 'MG': 'MGA', 'MU': 'MUR', 'SC': 'SCR',
      'KM': 'KMF', 'MW': 'MWK', 'NA': 'NAD'
    }
    return currencyMap[countryCode] || 'USD'
  }

  /**
   * Get country name from country code
   * @param {string} countryCode - ISO country code
   * @returns {string} Country name
   */
  getCountryName(countryCode) {
    const countryMap = {
      'US': 'United States', 'CA': 'Canada', 'GB': 'United Kingdom',
      'AU': 'Australia', 'NZ': 'New Zealand', 'IN': 'India',
      'DE': 'Germany', 'FR': 'France', 'IT': 'Italy', 'ES': 'Spain',
      'NL': 'Netherlands', 'BE': 'Belgium', 'CH': 'Switzerland',
      'NO': 'Norway', 'SE': 'Sweden', 'DK': 'Denmark', 'FI': 'Finland',
      'BR': 'Brazil', 'MX': 'Mexico', 'AR': 'Argentina', 'CL': 'Chile',
      'JP': 'Japan', 'KR': 'South Korea', 'CN': 'China', 'SG': 'Singapore',
      'HK': 'Hong Kong', 'TW': 'Taiwan', 'MY': 'Malaysia', 'TH': 'Thailand',
      'ID': 'Indonesia', 'PH': 'Philippines', 'VN': 'Vietnam',
      'ZA': 'South Africa', 'NG': 'Nigeria', 'KE': 'Kenya', 'EG': 'Egypt',
      'TR': 'Turkey', 'IL': 'Israel', 'SA': 'Saudi Arabia', 'AE': 'United Arab Emirates',
      'RU': 'Russia', 'UA': 'Ukraine', 'PL': 'Poland', 'CZ': 'Czech Republic'
    }
    return countryMap[countryCode] || 'Unknown'
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear()
  }
}

export default new GeolocationService()
