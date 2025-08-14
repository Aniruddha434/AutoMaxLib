class CurrencyService {
  constructor() {
    // Base prices in USD (our reference currency)
    this.basePrices = {
      monthly: 6,   // $6 USD per month
      yearly: 60    // $60 USD per year (2 months free)
    }

    // Exchange rates (updated periodically - in production, use a real-time API)
    this.exchangeRates = {
      'USD': 1.00,     // Base currency
      'EUR': 0.85,     // Euro
      'GBP': 0.73,     // British Pound
      'CAD': 1.25,     // Canadian Dollar
      'AUD': 1.35,     // Australian Dollar
      'NZD': 1.45,     // New Zealand Dollar
      'INR': 83.00,    // Indian Rupee
      'JPY': 110.00,   // Japanese Yen
      'KRW': 1200.00,  // South Korean Won
      'CNY': 7.20,     // Chinese Yuan
      'SGD': 1.35,     // Singapore Dollar
      'HKD': 7.80,     // Hong Kong Dollar
      'TWD': 28.50,    // Taiwan Dollar
      'MYR': 4.20,     // Malaysian Ringgit
      'THB': 33.00,    // Thai Baht
      'IDR': 14500.00, // Indonesian Rupiah
      'PHP': 50.00,    // Philippine Peso
      'VND': 23000.00, // Vietnamese Dong
      'BRL': 5.00,     // Brazilian Real
      'MXN': 18.00,    // Mexican Peso
      'ARS': 350.00,   // Argentine Peso
      'CLP': 800.00,   // Chilean Peso
      'COP': 4000.00,  // Colombian Peso
      'PEN': 3.70,     // Peruvian Sol
      'CHF': 0.92,     // Swiss Franc
      'NOK': 9.50,     // Norwegian Krone
      'SEK': 9.80,     // Swedish Krona
      'DKK': 6.30,     // Danish Krone
      'PLN': 3.90,     // Polish Zloty
      'CZK': 22.00,    // Czech Koruna
      'HUF': 320.00,   // Hungarian Forint
      'RON': 4.20,     // Romanian Leu
      'BGN': 1.66,     // Bulgarian Lev
      'HRK': 6.40,     // Croatian Kuna
      'RSD': 100.00,   // Serbian Dinar
      'TRY': 18.50,    // Turkish Lira
      'ILS': 3.20,     // Israeli Shekel
      'SAR': 3.75,     // Saudi Riyal
      'AED': 3.67,     // UAE Dirham
      'QAR': 3.64,     // Qatari Riyal
      'KWD': 0.30,     // Kuwaiti Dinar
      'BHD': 0.38,     // Bahraini Dinar
      'OMR': 0.38,     // Omani Rial
      'JOD': 0.71,     // Jordanian Dinar
      'LBP': 1500.00,  // Lebanese Pound
      'PKR': 280.00,   // Pakistani Rupee
      'BDT': 85.00,    // Bangladeshi Taka
      'LKR': 200.00,   // Sri Lankan Rupee
      'NPR': 132.00,   // Nepalese Rupee
      'ZAR': 15.00,    // South African Rand
      'NGN': 460.00,   // Nigerian Naira
      'KES': 110.00,   // Kenyan Shilling
      'GHS': 6.00,     // Ghanaian Cedi
      'EGP': 15.50,    // Egyptian Pound
      'MAD': 9.20,     // Moroccan Dirham
      'TND': 2.80,     // Tunisian Dinar
      'DZD': 135.00,   // Algerian Dinar
      'RUB': 75.00,    // Russian Ruble
      'UAH': 27.00,    // Ukrainian Hryvnia
      'BYN': 2.50      // Belarusian Ruble
    }

    // Currency symbols and formatting
    this.currencyInfo = {
      'USD': { symbol: '$', position: 'before', decimals: 2 },
      'EUR': { symbol: '€', position: 'before', decimals: 2 },
      'GBP': { symbol: '£', position: 'before', decimals: 2 },
      'CAD': { symbol: 'C$', position: 'before', decimals: 2 },
      'AUD': { symbol: 'A$', position: 'before', decimals: 2 },
      'NZD': { symbol: 'NZ$', position: 'before', decimals: 2 },
      'INR': { symbol: '₹', position: 'before', decimals: 0 },
      'JPY': { symbol: '¥', position: 'before', decimals: 0 },
      'KRW': { symbol: '₩', position: 'before', decimals: 0 },
      'CNY': { symbol: '¥', position: 'before', decimals: 2 },
      'SGD': { symbol: 'S$', position: 'before', decimals: 2 },
      'HKD': { symbol: 'HK$', position: 'before', decimals: 2 },
      'TWD': { symbol: 'NT$', position: 'before', decimals: 0 },
      'MYR': { symbol: 'RM', position: 'before', decimals: 2 },
      'THB': { symbol: '฿', position: 'before', decimals: 2 },
      'IDR': { symbol: 'Rp', position: 'before', decimals: 0 },
      'PHP': { symbol: '₱', position: 'before', decimals: 2 },
      'VND': { symbol: '₫', position: 'after', decimals: 0 },
      'BRL': { symbol: 'R$', position: 'before', decimals: 2 },
      'MXN': { symbol: '$', position: 'before', decimals: 2 },
      'ARS': { symbol: '$', position: 'before', decimals: 2 },
      'CLP': { symbol: '$', position: 'before', decimals: 0 },
      'COP': { symbol: '$', position: 'before', decimals: 0 },
      'PEN': { symbol: 'S/', position: 'before', decimals: 2 },
      'CHF': { symbol: 'CHF', position: 'before', decimals: 2 },
      'NOK': { symbol: 'kr', position: 'after', decimals: 2 },
      'SEK': { symbol: 'kr', position: 'after', decimals: 2 },
      'DKK': { symbol: 'kr', position: 'after', decimals: 2 },
      'PLN': { symbol: 'zł', position: 'after', decimals: 2 },
      'CZK': { symbol: 'Kč', position: 'after', decimals: 2 },
      'HUF': { symbol: 'Ft', position: 'after', decimals: 0 },
      'RON': { symbol: 'lei', position: 'after', decimals: 2 },
      'BGN': { symbol: 'лв', position: 'after', decimals: 2 },
      'HRK': { symbol: 'kn', position: 'after', decimals: 2 },
      'RSD': { symbol: 'дин', position: 'after', decimals: 2 },
      'TRY': { symbol: '₺', position: 'before', decimals: 2 },
      'ILS': { symbol: '₪', position: 'before', decimals: 2 },
      'SAR': { symbol: 'ر.س', position: 'before', decimals: 2 },
      'AED': { symbol: 'د.إ', position: 'before', decimals: 2 },
      'QAR': { symbol: 'ر.ق', position: 'before', decimals: 2 },
      'KWD': { symbol: 'د.ك', position: 'before', decimals: 3 },
      'BHD': { symbol: 'د.ب', position: 'before', decimals: 3 },
      'OMR': { symbol: 'ر.ع', position: 'before', decimals: 3 },
      'JOD': { symbol: 'د.ا', position: 'before', decimals: 3 },
      'LBP': { symbol: 'ل.ل', position: 'before', decimals: 0 },
      'PKR': { symbol: '₨', position: 'before', decimals: 0 },
      'BDT': { symbol: '৳', position: 'before', decimals: 0 },
      'LKR': { symbol: '₨', position: 'before', decimals: 2 },
      'NPR': { symbol: '₨', position: 'before', decimals: 0 },
      'ZAR': { symbol: 'R', position: 'before', decimals: 2 },
      'NGN': { symbol: '₦', position: 'before', decimals: 2 },
      'KES': { symbol: 'KSh', position: 'before', decimals: 2 },
      'GHS': { symbol: '₵', position: 'before', decimals: 2 },
      'EGP': { symbol: '£', position: 'before', decimals: 2 },
      'MAD': { symbol: 'د.م', position: 'before', decimals: 2 },
      'TND': { symbol: 'د.ت', position: 'before', decimals: 3 },
      'DZD': { symbol: 'د.ج', position: 'before', decimals: 2 },
      'RUB': { symbol: '₽', position: 'after', decimals: 2 },
      'UAH': { symbol: '₴', position: 'before', decimals: 2 },
      'BYN': { symbol: 'Br', position: 'after', decimals: 2 }
    }

    // Regional pricing adjustments (multipliers for purchasing power parity)
    this.regionalAdjustments = {
      'IN': 0.25,  // 25% of USD price for India
      'PK': 0.30,  // 30% for Pakistan
      'BD': 0.30,  // 30% for Bangladesh
      'LK': 0.35,  // 35% for Sri Lanka
      'NP': 0.30,  // 30% for Nepal
      'NG': 0.40,  // 40% for Nigeria
      'KE': 0.45,  // 45% for Kenya
      'GH': 0.40,  // 40% for Ghana
      'EG': 0.50,  // 50% for Egypt
      'ZA': 0.60,  // 60% for South Africa
      'BR': 0.70,  // 70% for Brazil
      'MX': 0.75,  // 75% for Mexico
      'AR': 0.60,  // 60% for Argentina
      'CL': 0.80,  // 80% for Chile
      'CO': 0.65,  // 65% for Colombia
      'PE': 0.70,  // 70% for Peru
      'PH': 0.50,  // 50% for Philippines
      'ID': 0.45,  // 45% for Indonesia
      'MY': 0.70,  // 70% for Malaysia
      'TH': 0.65,  // 65% for Thailand
      'VN': 0.40,  // 40% for Vietnam
      'CN': 0.60,  // 60% for China
      'TR': 0.65,  // 65% for Turkey
      'RU': 0.55,  // 55% for Russia
      'UA': 0.45,  // 45% for Ukraine
      'PL': 0.75,  // 75% for Poland
      'CZ': 0.80,  // 80% for Czech Republic
      'HU': 0.75,  // 75% for Hungary
      'RO': 0.70,  // 70% for Romania
      'BG': 0.65   // 65% for Bulgaria
    }
  }

  /**
   * Convert price from USD to target currency
   * @param {number} usdPrice - Price in USD
   * @param {string} targetCurrency - Target currency code
   * @param {string} countryCode - Country code for regional adjustments
   * @returns {number} Converted price
   */
  convertPrice(usdPrice, targetCurrency, countryCode = null) {
    if (!this.exchangeRates[targetCurrency]) {
      console.warn(`Exchange rate not found for ${targetCurrency}, using USD`)
      return usdPrice
    }

    let adjustedPrice = usdPrice

    // Apply regional pricing adjustment if available
    if (countryCode && this.regionalAdjustments[countryCode]) {
      adjustedPrice = usdPrice * this.regionalAdjustments[countryCode]
    }

    // Convert to target currency
    const convertedPrice = adjustedPrice * this.exchangeRates[targetCurrency]

    // Round to appropriate decimal places
    const currencyInfo = this.currencyInfo[targetCurrency]
    const decimals = currencyInfo ? currencyInfo.decimals : 2
    
    return Math.round(convertedPrice * Math.pow(10, decimals)) / Math.pow(10, decimals)
  }

  /**
   * Get pricing for all plans in a specific currency
   * @param {string} currency - Currency code
   * @param {string} countryCode - Country code for regional adjustments
   * @returns {Object} Pricing object with all plans
   */
  getPricingForCurrency(currency, countryCode = null) {
    const monthlyPrice = this.convertPrice(this.basePrices.monthly, currency, countryCode)
    const yearlyPrice = this.convertPrice(this.basePrices.yearly, currency, countryCode)
    const currencyInfo = this.currencyInfo[currency] || this.currencyInfo['USD']

    return {
      currency,
      currencyInfo,
      monthly: {
        id: 'premium_monthly',
        name: 'Premium Monthly',
        price: monthlyPrice,
        period: 'month',
        description: 'Perfect for individual developers'
      },
      yearly: {
        id: 'premium_yearly',
        name: 'Premium Yearly',
        price: yearlyPrice,
        period: 'year',
        description: 'Best value - 2 months free!',
        discount: '17% off'
      }
    }
  }

  /**
   * Format price with currency symbol
   * @param {number} price - Price amount
   * @param {string} currency - Currency code
   * @returns {string} Formatted price string
   */
  formatPrice(price, currency) {
    const currencyInfo = this.currencyInfo[currency] || this.currencyInfo['USD']
    const formattedPrice = price.toLocaleString('en-US', {
      minimumFractionDigits: currencyInfo.decimals,
      maximumFractionDigits: currencyInfo.decimals
    })

    if (currencyInfo.position === 'before') {
      return `${currencyInfo.symbol}${formattedPrice}`
    } else {
      return `${formattedPrice} ${currencyInfo.symbol}`
    }
  }

  /**
   * Get supported currencies
   * @returns {Array} Array of supported currency codes
   */
  getSupportedCurrencies() {
    return Object.keys(this.exchangeRates)
  }

  /**
   * Check if currency is supported
   * @param {string} currency - Currency code
   * @returns {boolean} Whether currency is supported
   */
  isCurrencySupported(currency) {
    return this.exchangeRates.hasOwnProperty(currency)
  }

  /**
   * Get currency info
   * @param {string} currency - Currency code
   * @returns {Object} Currency information
   */
  getCurrencyInfo(currency) {
    return this.currencyInfo[currency] || this.currencyInfo['USD']
  }

  /**
   * Update exchange rates (for future real-time updates)
   * @param {Object} newRates - New exchange rates
   */
  updateExchangeRates(newRates) {
    this.exchangeRates = { ...this.exchangeRates, ...newRates }
  }
}

export default new CurrencyService()
