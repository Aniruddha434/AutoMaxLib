import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../server.js'
import geolocationService from '../services/geolocationService.js'
import currencyService from '../services/currencyService.js'
import pricingService from '../services/pricingService.js'

describe('International Payment System', () => {
  describe('GeolocationService', () => {
    it('should detect country from IP address', async () => {
      const result = await geolocationService.getCountryFromIP('8.8.8.8')
      expect(result).toHaveProperty('country')
      expect(result).toHaveProperty('countryCode')
      expect(result).toHaveProperty('currency')
    })

    it('should return default country for localhost', async () => {
      const result = await geolocationService.getCountryFromIP('127.0.0.1')
      expect(result.countryCode).toBe('US')
      expect(result.currency).toBe('USD')
    })

    it('should get currency for country code', () => {
      expect(geolocationService.getCurrencyForCountry('IN')).toBe('INR')
      expect(geolocationService.getCurrencyForCountry('US')).toBe('USD')
      expect(geolocationService.getCurrencyForCountry('DE')).toBe('EUR')
      expect(geolocationService.getCurrencyForCountry('GB')).toBe('GBP')
    })
  })

  describe('CurrencyService', () => {
    it('should convert USD to other currencies', () => {
      const usdPrice = 6
      
      const inrPrice = currencyService.convertPrice(usdPrice, 'INR', 'IN')
      expect(inrPrice).toBeGreaterThan(0)
      expect(inrPrice).toBeLessThan(usdPrice) // Should be less due to PPP adjustment
      
      const eurPrice = currencyService.convertPrice(usdPrice, 'EUR')
      expect(eurPrice).toBeGreaterThan(0)
      expect(eurPrice).toBeLessThan(usdPrice) // EUR is stronger than USD
    })

    it('should format prices correctly', () => {
      expect(currencyService.formatPrice(100, 'USD')).toBe('$100.00')
      expect(currencyService.formatPrice(100, 'EUR')).toBe('€100.00')
      expect(currencyService.formatPrice(100, 'INR')).toBe('₹100')
      expect(currencyService.formatPrice(100, 'JPY')).toBe('¥100')
    })

    it('should get pricing for different currencies', () => {
      const usdPricing = currencyService.getPricingForCurrency('USD')
      expect(usdPricing.monthly.price).toBe(6)
      expect(usdPricing.yearly.price).toBe(60)
      
      const inrPricing = currencyService.getPricingForCurrency('INR', 'IN')
      expect(inrPricing.monthly.price).toBeLessThan(usdPricing.monthly.price * 83) // PPP adjustment
    })

    it('should support all major currencies', () => {
      const currencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD', 'SGD']
      currencies.forEach(currency => {
        expect(currencyService.isCurrencySupported(currency)).toBe(true)
        const info = currencyService.getCurrencyInfo(currency)
        expect(info).toHaveProperty('symbol')
        expect(info).toHaveProperty('position')
        expect(info).toHaveProperty('decimals')
      })
    })
  })

  describe('PricingService', () => {
    it('should get payment methods for different countries', () => {
      const indiaMethods = pricingService.getPaymentMethodsForCountry('IN')
      expect(indiaMethods.card).toBe(true)
      expect(indiaMethods.upi).toBe(true)
      expect(indiaMethods.netbanking).toBe(true)
      
      const usMethods = pricingService.getPaymentMethodsForCountry('US')
      expect(usMethods.card).toBe(true)
      expect(usMethods.upi).toBe(false)
      expect(usMethods.netbanking).toBe(false)
      
      const euMethods = pricingService.getPaymentMethodsForCountry('DE')
      expect(euMethods.card).toBe(true)
      expect(euMethods.upi).toBe(false)
    })

    it('should validate Razorpay supported currencies', () => {
      expect(pricingService.isRazorpaySupportedCurrency('USD')).toBe(true)
      expect(pricingService.isRazorpaySupportedCurrency('EUR')).toBe(true)
      expect(pricingService.isRazorpaySupportedCurrency('INR')).toBe(true)
      expect(pricingService.isRazorpaySupportedCurrency('XYZ')).toBe(false)
    })

    it('should provide fallback currencies', () => {
      expect(pricingService.getFallbackCurrency('THB', 'TH')).toBe('USD')
      expect(pricingService.getFallbackCurrency('INR', 'IN')).toBe('INR')
      expect(pricingService.getFallbackCurrency('PLN', 'PL')).toBe('EUR')
    })
  })

  describe('API Endpoints', () => {
    describe('GET /api/payment/pricing', () => {
      it('should return pricing for US users', async () => {
        const response = await request(app)
          .get('/api/payment/pricing')
          .set('X-Forwarded-For', '8.8.8.8') // Google DNS (US)
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body.pricing).toHaveProperty('currency')
        expect(response.body.pricing).toHaveProperty('monthly')
        expect(response.body.pricing).toHaveProperty('yearly')
        expect(response.body.location).toHaveProperty('countryCode')
        expect(response.body.paymentMethods).toHaveProperty('card')
      })

      it('should return pricing for Indian users', async () => {
        const response = await request(app)
          .get('/api/payment/pricing')
          .set('CF-IPCountry', 'IN')
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body.pricing.currency).toBe('INR')
        expect(response.body.location.countryCode).toBe('IN')
        expect(response.body.paymentMethods.upi).toBe(true)
        expect(response.body.paymentMethods.netbanking).toBe(true)
      })

      it('should return pricing for European users', async () => {
        const response = await request(app)
          .get('/api/payment/pricing')
          .set('CF-IPCountry', 'DE')
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body.pricing.currency).toBe('EUR')
        expect(response.body.location.countryCode).toBe('DE')
        expect(response.body.paymentMethods.card).toBe(true)
        expect(response.body.paymentMethods.upi).toBe(false)
      })

      it('should handle unknown countries gracefully', async () => {
        const response = await request(app)
          .get('/api/payment/pricing')
          .set('CF-IPCountry', 'XX')
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body.pricing).toHaveProperty('currency')
        expect(response.body.location).toHaveProperty('countryCode')
      })
    })

    describe('POST /api/payment/create-order', () => {
      const mockAuthMiddleware = (req, res, next) => {
        req.auth = { userId: 'test-user-id' }
        next()
      }

      beforeEach(() => {
        // Mock auth middleware for testing
        app.use('/api/payment/create-order', mockAuthMiddleware)
      })

      it('should create order with international pricing', async () => {
        const response = await request(app)
          .post('/api/payment/create-order')
          .set('CF-IPCountry', 'US')
          .send({
            amount: 6,
            planId: 'premium_monthly'
          })
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body.order).toHaveProperty('id')
        expect(response.body.order).toHaveProperty('currency')
        expect(response.body.pricingConfig).toHaveProperty('currency')
        expect(response.body.pricingConfig).toHaveProperty('paymentMethods')
      })

      it('should create order with Indian pricing', async () => {
        const response = await request(app)
          .post('/api/payment/create-order')
          .set('CF-IPCountry', 'IN')
          .send({
            amount: 125,
            planId: 'premium_monthly'
          })
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body.pricingConfig.currency).toBe('INR')
        expect(response.body.pricingConfig.paymentMethods.upi).toBe(true)
      })

      it('should validate required fields', async () => {
        await request(app)
          .post('/api/payment/create-order')
          .send({})
          .expect(400)
      })
    })
  })

  describe('Currency Formatting', () => {
    const testCases = [
      { amount: 6, currency: 'USD', expected: '$6.00' },
      { amount: 125, currency: 'INR', expected: '₹125' },
      { amount: 5.1, currency: 'EUR', expected: '€5.10' },
      { amount: 4.5, currency: 'GBP', expected: '£4.50' },
      { amount: 8, currency: 'CAD', expected: 'C$8.00' },
      { amount: 8, currency: 'AUD', expected: 'A$8.00' },
      { amount: 660, currency: 'JPY', expected: '¥660' },
      { amount: 8, currency: 'SGD', expected: 'S$8.00' }
    ]

    testCases.forEach(({ amount, currency, expected }) => {
      it(`should format ${amount} ${currency} as ${expected}`, () => {
        const formatted = currencyService.formatPrice(amount, currency)
        expect(formatted).toBe(expected)
      })
    })
  })

  describe('Regional Pricing Adjustments', () => {
    it('should apply PPP adjustments correctly', () => {
      const basePrice = 6 // USD

      // India should get 25% of USD price
      const indiaPrice = currencyService.convertPrice(basePrice, 'INR', 'IN')
      const expectedIndiaUSD = basePrice * 0.25
      const expectedIndiaINR = expectedIndiaUSD * 83 // Approximate exchange rate
      expect(indiaPrice).toBeCloseTo(expectedIndiaINR, 0)

      // Brazil should get 70% of USD price
      const brazilPrice = currencyService.convertPrice(basePrice, 'BRL', 'BR')
      const expectedBrazilUSD = basePrice * 0.70
      const expectedBrazilBRL = expectedBrazilUSD * 5 // Approximate exchange rate
      expect(brazilPrice).toBeCloseTo(expectedBrazilBRL, 0)

      // US should get full price
      const usPrice = currencyService.convertPrice(basePrice, 'USD', 'US')
      expect(usPrice).toBe(basePrice)
    })
  })

  describe('Error Handling', () => {
    it('should handle geolocation service failures', async () => {
      // Mock a failed IP lookup
      const result = await geolocationService.getCountryFromIP('invalid-ip')
      expect(result).toHaveProperty('countryCode')
      expect(result.countryCode).toBe('US') // Should fallback to US
    })

    it('should handle unsupported currencies', () => {
      const pricing = currencyService.getPricingForCurrency('XYZ')
      expect(pricing.currency).toBe('XYZ')
      expect(pricing.monthly.price).toBeGreaterThan(0)
    })

    it('should handle missing pricing data gracefully', async () => {
      const mockReq = {
        headers: {},
        connection: { remoteAddress: null }
      }
      
      const result = await pricingService.getPricingForUser(mockReq)
      expect(result.success).toBe(true)
      expect(result.pricing).toHaveProperty('currency')
    })
  })
})
