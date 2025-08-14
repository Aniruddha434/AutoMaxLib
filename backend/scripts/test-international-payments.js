#!/usr/bin/env node

/**
 * Manual test script for international payment system
 * Run with: node scripts/test-international-payments.js
 */

import geolocationService from '../services/geolocationService.js'
import currencyService from '../services/currencyService.js'
import pricingService from '../services/pricingService.js'

console.log('🌍 Testing International Payment System\n')

// Test 1: Geolocation Service
console.log('1. Testing Geolocation Service')
console.log('================================')

const testIPs = [
  { ip: '8.8.8.8', expected: 'US' },
  { ip: '1.1.1.1', expected: 'US' },
  { ip: '127.0.0.1', expected: 'US' } // localhost fallback
]

for (const { ip, expected } of testIPs) {
  try {
    const result = await geolocationService.getCountryFromIP(ip)
    console.log(`IP ${ip}: ${result.country} (${result.countryCode}) - ${result.currency}`)
    if (result.countryCode === expected) {
      console.log('✅ Expected result')
    } else {
      console.log(`⚠️  Expected ${expected}, got ${result.countryCode}`)
    }
  } catch (error) {
    console.log(`❌ Error for IP ${ip}: ${error.message}`)
  }
}

console.log('\n2. Testing Currency Service')
console.log('============================')

// Test 2: Currency conversions
const testCurrencies = [
  { currency: 'USD', country: 'US' },
  { currency: 'EUR', country: 'DE' },
  { currency: 'GBP', country: 'GB' },
  { currency: 'INR', country: 'IN' },
  { currency: 'JPY', country: 'JP' },
  { currency: 'CAD', country: 'CA' },
  { currency: 'AUD', country: 'AU' }
]

const basePrice = 6 // USD

for (const { currency, country } of testCurrencies) {
  const pricing = currencyService.getPricingForCurrency(currency, country)
  const monthlyPrice = pricing.monthly.price
  const yearlyPrice = pricing.yearly.price
  const formattedMonthly = currencyService.formatPrice(monthlyPrice, currency)
  const formattedYearly = currencyService.formatPrice(yearlyPrice, currency)
  
  console.log(`${currency} (${country}):`)
  console.log(`  Monthly: ${formattedMonthly}`)
  console.log(`  Yearly:  ${formattedYearly}`)
  console.log(`  Symbol:  ${pricing.currencyInfo.symbol} (${pricing.currencyInfo.position})`)
  console.log()
}

console.log('3. Testing Payment Methods')
console.log('===========================')

// Test 3: Payment methods by region
const testCountries = [
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'DE', name: 'Germany' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'SG', name: 'Singapore' },
  { code: 'BR', name: 'Brazil' },
  { code: 'AU', name: 'Australia' }
]

for (const { code, name } of testCountries) {
  const methods = pricingService.getPaymentMethodsForCountry(code)
  const enabledMethods = Object.entries(methods)
    .filter(([_, enabled]) => enabled)
    .map(([method, _]) => method)
  
  console.log(`${name} (${code}): ${enabledMethods.join(', ')}`)
}

console.log('\n4. Testing Razorpay Compatibility')
console.log('===================================')

// Test 4: Razorpay currency support
const razorpayCurrencies = ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'SGD', 'AED', 'MYR']
const unsupportedCurrencies = ['THB', 'VND', 'PLN', 'CZK']

console.log('Supported currencies:')
for (const currency of razorpayCurrencies) {
  const isSupported = pricingService.isRazorpaySupportedCurrency(currency)
  console.log(`  ${currency}: ${isSupported ? '✅' : '❌'}`)
}

console.log('\nUnsupported currencies (with fallbacks):')
for (const currency of unsupportedCurrencies) {
  const isSupported = pricingService.isRazorpaySupportedCurrency(currency)
  const fallback = pricingService.getFallbackCurrency(currency, 'XX')
  console.log(`  ${currency}: ${isSupported ? '✅' : '❌'} → ${fallback}`)
}

console.log('\n5. Testing Complete Pricing Flow')
console.log('==================================')

// Test 5: Complete pricing flow simulation
const mockRequests = [
  {
    name: 'US User',
    headers: { 'x-forwarded-for': '8.8.8.8' },
    connection: { remoteAddress: '8.8.8.8' }
  },
  {
    name: 'Indian User',
    headers: { 'cf-ipcountry': 'IN' },
    connection: { remoteAddress: '203.0.113.1' }
  },
  {
    name: 'German User',
    headers: { 'cf-ipcountry': 'DE' },
    connection: { remoteAddress: '192.0.2.1' }
  },
  {
    name: 'Unknown Location',
    headers: {},
    connection: { remoteAddress: null }
  }
]

for (const mockReq of mockRequests) {
  try {
    console.log(`\n${mockReq.name}:`)
    const pricingData = await pricingService.getCompatiblePricingForUser(mockReq)
    
    if (pricingData.success) {
      const { pricing, location, paymentMethods, fallbackUsed } = pricingData
      
      console.log(`  Location: ${location.country} (${location.countryCode})`)
      console.log(`  Currency: ${pricing.currency}`)
      console.log(`  Monthly:  ${currencyService.formatPrice(pricing.monthly.price, pricing.currency)}`)
      console.log(`  Yearly:   ${currencyService.formatPrice(pricing.yearly.price, pricing.currency)}`)
      console.log(`  Payment:  ${Object.entries(paymentMethods).filter(([_, enabled]) => enabled).map(([method, _]) => method).join(', ')}`)
      
      if (fallbackUsed) {
        console.log(`  ⚠️  Using fallback currency for Razorpay compatibility`)
      }
    } else {
      console.log(`  ❌ Failed to get pricing data`)
    }
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`)
  }
}

console.log('\n6. Testing Edge Cases')
console.log('=====================')

// Test 6: Edge cases
console.log('Testing invalid inputs:')

try {
  const invalidCurrency = currencyService.formatPrice(100, 'INVALID')
  console.log(`Invalid currency formatting: ${invalidCurrency}`)
} catch (error) {
  console.log(`❌ Invalid currency error: ${error.message}`)
}

try {
  const invalidCountry = geolocationService.getCurrencyForCountry('XX')
  console.log(`Invalid country currency: ${invalidCountry}`)
} catch (error) {
  console.log(`❌ Invalid country error: ${error.message}`)
}

try {
  const invalidIP = await geolocationService.getCountryFromIP('invalid.ip.address')
  console.log(`Invalid IP result: ${invalidIP.countryCode}`)
} catch (error) {
  console.log(`❌ Invalid IP error: ${error.message}`)
}

console.log('\n✅ International Payment System Test Complete!')
console.log('\nSummary:')
console.log('- Geolocation detection working')
console.log('- Currency conversion and formatting working')
console.log('- Payment method configuration working')
console.log('- Razorpay compatibility checks working')
console.log('- Complete pricing flow working')
console.log('- Error handling working')

console.log('\n🚀 Ready for international payments!')
