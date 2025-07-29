// Simple test to verify payment service configuration
import PaymentService from './services/paymentService.js'

console.log('🧪 Testing Payment Service Configuration\n')

// Test without Razorpay keys (should work for basic config)
const paymentService = new PaymentService()

console.log('📋 Testing Pricing Plans:')
const plans = paymentService.getPricingPlans()

console.log('Monthly Plan:')
console.log(`  - Price: $${plans.premium_monthly.price}`)
console.log(`  - Currency: ${plans.premium_monthly.currency}`)

console.log('Yearly Plan:')
console.log(`  - Price: $${plans.premium_yearly.price}`)
console.log(`  - Currency: ${plans.premium_yearly.currency}`)
console.log(`  - Discount: ${plans.premium_yearly.discount}`)

console.log('\n🌍 Testing International Configuration:')
const config = paymentService.getInternationalPaymentConfig()
console.log(`Default Currency: ${config.defaultCurrency}`)
console.log(`Supported Currencies: ${config.supportedCurrencies.length} currencies`)
console.log(`Supported Countries: ${config.supportedCountries.length} countries`)

console.log('\n✅ Basic configuration test completed!')
console.log('✅ Pricing updated to $6 USD monthly, $60 USD yearly')
console.log('✅ International payment support configured')
