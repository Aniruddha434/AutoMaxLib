# International Payment System Documentation

## Overview

The AutoMaxLib platform now supports international payments with region-specific pricing and payment methods. The system automatically detects user location and provides appropriate currency, pricing, and payment options.

## Features

### 1. Automatic Location Detection
- **IP-based Geolocation**: Uses ipapi.co service for accurate country detection
- **Browser Locale Fallback**: Falls back to browser language/locale settings
- **Header-based Detection**: Supports Cloudflare and other proxy headers

### 2. Multi-Currency Support
- **60+ Currencies**: Supports major world currencies with real-time conversion
- **Regional Pricing**: Purchasing power parity adjustments for developing countries
- **Currency Formatting**: Proper symbol placement and decimal handling per locale

### 3. Payment Method Configuration
- **India**: Cards, UPI, NetBanking, Wallets
- **International**: Cards (Visa, Mastercard, Amex)
- **Europe**: Cards with 3D Secure support
- **Middle East**: Cards with local currency support

## Architecture

### Backend Services

#### GeolocationService (`backend/services/geolocationService.js`)
- Detects user country from IP address
- Provides fallback methods for location detection
- Caches results for 24 hours to improve performance
- Maps countries to currencies and regions

#### CurrencyService (`backend/services/currencyService.js`)
- Manages exchange rates for 60+ currencies
- Handles regional pricing adjustments (PPP)
- Formats currency display with proper symbols
- Supports both before/after symbol positioning

#### PricingService (`backend/services/pricingService.js`)
- Combines geolocation and currency services
- Provides complete pricing configuration
- Handles Razorpay currency compatibility
- Configures payment methods per region

### Frontend Integration

#### GeolocationService (`frontend/src/services/geolocationService.js`)
- Browser-based location detection
- Timezone and locale detection
- Currency formatting utilities
- Combines client and server location data

#### Updated Components
- **Upgrade.jsx**: Dynamic pricing display based on user location
- **PaymentService**: International order creation and verification

## Supported Regions

### Tier 1 (Full Support)
- **United States**: USD, Cards
- **India**: INR, Cards + UPI + NetBanking + Wallets
- **European Union**: EUR, Cards + 3D Secure
- **United Kingdom**: GBP, Cards
- **Canada**: CAD, Cards
- **Australia**: AUD, Cards

### Tier 2 (Card Support)
- **Asia-Pacific**: Singapore, Hong Kong, Japan, South Korea
- **Middle East**: UAE, Saudi Arabia, Qatar, Kuwait
- **Latin America**: Brazil, Mexico, Argentina, Chile

### Tier 3 (USD Fallback)
- All other countries with USD pricing and card payments

## Pricing Strategy

### Base Pricing (USD)
- **Monthly**: $6 USD
- **Yearly**: $60 USD (17% discount)

### Regional Adjustments (PPP)
- **India**: 25% of USD price (₹125/month, ₹1,250/year)
- **Southeast Asia**: 40-50% of USD price
- **Eastern Europe**: 65-80% of USD price
- **Latin America**: 60-75% of USD price
- **Africa**: 40-60% of USD price

### Currency Conversion
- Real-time exchange rates (updated periodically)
- Proper rounding to local currency standards
- Fallback to Razorpay-supported currencies when needed

## Payment Flow

### 1. User Visits Upgrade Page
```javascript
// Frontend detects location
const locationData = await geolocationService.getCompleteLocation()

// Backend provides pricing
const pricingData = await paymentService.getInternationalPricing()
```

### 2. Dynamic Pricing Display
```javascript
// Format price with local currency
const formatPrice = (price) => {
  const currencyInfo = pricingData.pricing.currencyInfo
  return currencyInfo.position === 'before' 
    ? `${currencyInfo.symbol}${price}` 
    : `${price} ${currencyInfo.symbol}`
}
```

### 3. Payment Processing
```javascript
// Create order with user's currency
const orderResponse = await paymentService.createOrder(plan.price, plan.id)

// Configure Razorpay with regional settings
const options = {
  currency: orderResponse.pricingConfig.currency,
  method: orderResponse.pricingConfig.paymentMethods,
  // ... other options
}
```

## API Endpoints

### GET `/api/payment/pricing`
Returns complete pricing configuration for user's location:
```json
{
  "success": true,
  "pricing": {
    "currency": "EUR",
    "currencyInfo": { "symbol": "€", "position": "before", "decimals": 2 },
    "monthly": { "price": 5.1, "id": "premium_monthly" },
    "yearly": { "price": 51, "id": "premium_yearly" }
  },
  "location": {
    "country": "Germany",
    "countryCode": "DE",
    "currency": "EUR"
  },
  "paymentMethods": {
    "card": true,
    "netbanking": false,
    "wallet": false,
    "upi": false
  }
}
```

### POST `/api/payment/create-order`
Creates payment order with international support:
```json
{
  "amount": 510,
  "planId": "premium_monthly"
}
```

Response includes pricing configuration:
```json
{
  "success": true,
  "order": { "id": "order_xxx", "amount": 510, "currency": "EUR" },
  "pricingConfig": {
    "currency": "EUR",
    "paymentMethods": { "card": true },
    "razorpayConfig": { "theme": { "color": "#3B82F6" } }
  }
}
```

## Configuration

### Environment Variables
```bash
# Optional: Currency API for real-time rates
CURRENCY_API_KEY=your_api_key

# Razorpay (required)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

### Razorpay Setup
1. Enable international payments in Razorpay dashboard
2. Configure supported currencies
3. Set up webhooks for payment notifications
4. Enable 3D Secure for international cards

## Testing

### Test Different Regions
```javascript
// Simulate different countries by setting headers
curl -H "CF-IPCountry: IN" http://localhost:5000/api/payment/pricing
curl -H "CF-IPCountry: US" http://localhost:5000/api/payment/pricing
curl -H "CF-IPCountry: DE" http://localhost:5000/api/payment/pricing
```

### Test Payment Flow
1. Visit upgrade page from different IP addresses
2. Verify correct currency and pricing display
3. Test payment with international test cards
4. Verify payment method options per region

## Monitoring

### Key Metrics
- Payment success rate by region
- Currency conversion accuracy
- Geolocation detection accuracy
- Payment method usage by region

### Error Handling
- Graceful fallback to USD pricing
- Retry logic for geolocation services
- Comprehensive error logging
- User-friendly error messages

## Future Enhancements

### Planned Features
- Real-time currency API integration
- More local payment methods (SEPA, Alipay, etc.)
- Dynamic pricing based on market conditions
- A/B testing for regional pricing
- Subscription management with currency changes

### Considerations
- Tax calculation for different regions
- Compliance with local payment regulations
- Multi-language support for payment UI
- Advanced fraud detection for international payments
