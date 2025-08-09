import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

/**
 * Environment validation utility
 * Validates required environment variables and provides defaults
 */

const requiredEnvVars = {
  // Server Configuration
  PORT: {
    required: false,
    default: '5000',
    type: 'number'
  },
  NODE_ENV: {
    required: false,
    default: 'development',
    type: 'string',
    allowedValues: ['development', 'production', 'test']
  },
  HOST: {
    required: false,
    default: '0.0.0.0',
    type: 'string'
  },

  // Security
  JWT_SECRET: {
    required: true,
    type: 'string',
    minLength: 32
  },
  SESSION_SECRET: {
    required: true,
    type: 'string',
    minLength: 32
  },

  // Database
  MONGODB_URI: {
    required: true,
    type: 'string'
  },

  // Authentication
  CLERK_SECRET_KEY: {
    required: true,
    type: 'string'
  },
  CLERK_PUBLISHABLE_KEY: {
    required: true,
    type: 'string'
  },

  // Frontend
  FRONTEND_URL: {
    required: true,
    type: 'string'
  },

  // Logging
  LOG_LEVEL: {
    required: false,
    default: 'info',
    type: 'string',
    allowedValues: ['error', 'warn', 'info', 'debug']
  }
}

const optionalEnvVars = {
  // Payment (Optional)
  RAZORPAY_KEY_ID: { type: 'string' },
  RAZORPAY_KEY_SECRET: { type: 'string' },
  RAZORPAY_WEBHOOK_SECRET: { type: 'string' },

  // AI Services (Optional)
  OPENAI_API_KEY: { type: 'string' },
  GEMINI_API_KEY: { type: 'string' },
  OPENROUTER_API_KEY: { type: 'string' },

  // Email (Optional)
  SMTP_HOST: { type: 'string' },
  SMTP_PORT: { type: 'number', default: '587' },
  SMTP_USER: { type: 'string' },
  SMTP_PASS: { type: 'string' },

  // GitHub (Optional)
  GITHUB_CLIENT_ID: { type: 'string' },
  GITHUB_CLIENT_SECRET: { type: 'string' },

  // Redis (Optional)
  REDIS_URL: { type: 'string' },

  // Monitoring (Optional)
  SENTRY_DSN: { type: 'string' }
}

/**
 * Validates environment variables
 * @returns {Object} Validation result with errors and warnings
 */
export function validateEnvironment() {
  const errors = []
  const warnings = []
  const config = {}

  // Validate required variables
  for (const [key, rules] of Object.entries(requiredEnvVars)) {
    const value = process.env[key]

    if (!value && rules.required) {
      if (rules.default) {
        config[key] = rules.default
        warnings.push(`Using default value for ${key}: ${rules.default}`)
      } else {
        errors.push(`Missing required environment variable: ${key}`)
        continue
      }
    } else {
      config[key] = value || rules.default
    }

    // Type validation
    if (config[key] && rules.type === 'number' && isNaN(Number(config[key]))) {
      errors.push(`${key} must be a number, got: ${config[key]}`)
    }

    // Length validation
    if (config[key] && rules.minLength && config[key].length < rules.minLength) {
      errors.push(`${key} must be at least ${rules.minLength} characters long`)
    }

    // Allowed values validation
    if (config[key] && rules.allowedValues && !rules.allowedValues.includes(config[key])) {
      errors.push(`${key} must be one of: ${rules.allowedValues.join(', ')}, got: ${config[key]}`)
    }
  }

  // Validate optional variables
  for (const [key, rules] of Object.entries(optionalEnvVars)) {
    const value = process.env[key]

    if (value) {
      config[key] = value

      // Type validation for optional vars
      if (rules.type === 'number' && isNaN(Number(value))) {
        warnings.push(`${key} should be a number, got: ${value}`)
      }
    } else if (rules.default) {
      config[key] = rules.default
    }
  }

  // Environment-specific validations
  if (config.NODE_ENV === 'production') {
    // Production-specific validations
    if (config.JWT_SECRET === 'CHANGE_THIS_IN_PRODUCTION_32_CHARS_MIN') {
      errors.push('JWT_SECRET must be changed from default value in production')
    }
    if (config.SESSION_SECRET === 'CHANGE_THIS_IN_PRODUCTION_32_CHARS_MIN') {
      errors.push('SESSION_SECRET must be changed from default value in production')
    }
    if (!config.SENTRY_DSN) {
      warnings.push('SENTRY_DSN not configured for production error tracking')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    config
  }
}

/**
 * Gets validated configuration
 * @returns {Object} Validated configuration object
 */
export function getConfig() {
  const validation = validateEnvironment()

  if (!validation.isValid) {
    console.error('❌ Environment validation failed:')
    validation.errors.forEach(error => console.error(`  - ${error}`))
    process.exit(1)
  }

  if (validation.warnings.length > 0) {
    console.warn('⚠️ Environment warnings:')
    validation.warnings.forEach(warning => console.warn(`  - ${warning}`))
  }

  return validation.config
}

/**
 * Prints environment status
 */
export function printEnvironmentStatus() {
  const validation = validateEnvironment()
  
  console.log('\n🔧 Environment Configuration Status:')
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`   Port: ${process.env.PORT || '5000'}`)
  console.log(`   Database: ${process.env.MONGODB_URI ? '✅ Configured' : '❌ Missing'}`)
  console.log(`   Authentication: ${process.env.CLERK_SECRET_KEY ? '✅ Configured' : '❌ Missing'}`)
  console.log(`   Payment: ${process.env.RAZORPAY_KEY_ID ? '✅ Configured' : '⚠️ Optional'}`)
  console.log(`   AI Services: ${process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || process.env.OPENROUTER_API_KEY ? '✅ Configured' : '⚠️ Optional'}`)
  console.log(`   Email: ${process.env.SMTP_USER ? '✅ Configured' : '⚠️ Optional'}`)
  console.log(`   Redis: ${process.env.REDIS_URL ? '✅ Configured' : '⚠️ Optional'}`)
  console.log(`   Monitoring: ${process.env.SENTRY_DSN ? '✅ Configured' : '⚠️ Optional'}`)
  
  if (validation.errors.length > 0) {
    console.log('\n❌ Configuration Errors:')
    validation.errors.forEach(error => console.log(`   - ${error}`))
  }
  
  if (validation.warnings.length > 0) {
    console.log('\n⚠️ Configuration Warnings:')
    validation.warnings.forEach(warning => console.log(`   - ${warning}`))
  }
  
  console.log('')
}
