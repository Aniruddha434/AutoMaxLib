import { useState } from 'react'
import { useUserData } from '../contexts/UserContext'
import { paymentService } from '../services/paymentService'
import { 
  Crown, 
  Check, 
  Zap, 
  Star, 
  Clock,
  GitBranch,
  Mail,
  BarChart3,
  Shield,
  Sparkles
} from 'lucide-react'

const Upgrade = () => {
  const { userData, isPremium } = useUserData()
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('monthly')

  const features = {
    free: [
      '15-day free trial with auto-commits',
      'Daily auto-commit (10 AM IST)',
      '1 repository connection',
      'Basic commit messages',
      '7-day commit history',
      'Manual commit button',
      'Dark mode support'
    ],
    premium: [
      'Custom commit scheduling',
      'Multiple repositories',
      'AI-generated commit messages',
      'AI-Powered Profile README Generation',
      'Smart file generation',
      'Past commit generation',
      'GitHub contribution patterns',
      'Email notifications',
      'Full analytics dashboard',
      'GitHub OAuth support',
      'Priority support',
      'Public shareable profile',
      'Backup & restore settings'
    ]
  }

  const plans = {
    monthly: {
      id: 'premium_monthly',
      name: 'Premium Monthly',
      price: 500, // Temporarily using INR for testing
      period: 'month',
      description: 'Perfect for individual developers',
      currency: '₹'
    },
    yearly: {
      id: 'premium_yearly',
      name: 'Premium Yearly',
      price: 5000, // Temporarily using INR for testing
      period: 'year',
      description: 'Best value - 2 months free!',
      discount: '17% off',
      currency: '₹'
    }
  }

  const handleUpgrade = async () => {
    try {
      setLoading(true)
      const plan = plans[selectedPlan]
      
      // Create Razorpay order
      const order = await paymentService.createOrder(plan.price, plan.id)
      
      // Initialize Razorpay checkout with international payment support
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'AutoMaxLib',
        description: plan.name,
        order_id: order.id,
        handler: async (response) => {
          try {
            // Verify payment on backend
            await paymentService.verifyPayment(response)
            // Redirect to dashboard
            window.location.href = '/dashboard'
          } catch (error) {
            console.error('Payment verification failed:', error)
            alert('Payment verification failed. Please contact support.')
          }
        },
        prefill: {
          name: userData?.fullName || '',
          email: userData?.email || '',
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
          }
        },
        // Enable Indian payment methods for INR
        config: {
          display: {
            preferences: {
              show_default_blocks: true
            }
          }
        },
        // Enable Indian payment methods
        method: {
          card: true,
          netbanking: true,
          wallet: true,
          upi: true,
          emi: false
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Failed to initiate payment. Please try again.')
      setLoading(false)
    }
  }

  if (isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/20 dark:from-neutral-950 dark:to-primary-950/10 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-8 py-4 rounded-2xl mb-8 shadow-elegant">
              <Crown className="h-6 w-6" />
              <span className="text-lg font-semibold">Premium Active</span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              You're all set!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              You have access to all premium features. Enjoy automating your GitHub commits!
            </p>
            
            <div className="card max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Your Premium Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.premium.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/20 dark:from-neutral-950 dark:to-primary-950/10 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-2xl mb-6 shadow-elegant">
            <Sparkles className="h-5 w-5" />
            <span className="font-medium">Upgrade to Premium</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Unlock the Full Power of AutoMaxLib
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Take your GitHub automation to the next level with advanced features, 
            multiple repositories, and AI-powered commit messages.
          </p>
        </div>

        {/* Feature Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <div className="card">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Free Plan
              </h3>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                ₹0<span className="text-lg text-gray-500">/forever</span>
              </div>
            </div>
            
            <ul className="space-y-3 mb-6">
              {features.free.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="text-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Current Plan</span>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="card ring-2 ring-primary-600 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Recommended
              </span>
            </div>
            
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Crown className="h-6 w-6 text-yellow-500" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Premium Plan
                </h3>
              </div>
              
              {/* Plan Toggle */}
              <div className="flex items-center justify-center space-x-4 mb-4">
                <button
                  onClick={() => setSelectedPlan('monthly')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedPlan === 'monthly'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setSelectedPlan('yearly')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
                    selectedPlan === 'yearly'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Yearly
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1 rounded">
                    Save 17%
                  </span>
                </button>
              </div>
              
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {plans[selectedPlan].currency || '₹'}{plans[selectedPlan].price}
                <span className="text-lg text-gray-500">/{plans[selectedPlan].period}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {plans[selectedPlan].description}
              </p>
            </div>
            
            <ul className="space-y-3 mb-8">
              {features.premium.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="btn-primary w-full text-lg py-3"
            >
              {loading ? 'Processing...' : 'Upgrade Now'}
            </button>
          </div>
        </div>

        {/* Premium Features Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg mb-4">
              <Clock className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Custom Scheduling
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Set your own commit times and never miss your preferred schedule
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg mb-4">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              AI-Powered Messages
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Generate meaningful commit messages using advanced AI technology
            </p>
          </div>


        </div>

        {/* FAQ */}
        <div className="card max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, you can cancel your subscription at any time. You'll continue to have access 
                to premium features until the end of your billing period.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Is my GitHub data secure?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Absolutely. We use bank-level encryption and never store your GitHub password. 
                Only the minimal required permissions are requested.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We accept all major credit cards, debit cards, UPI, and net banking through 
                our secure payment partner Razorpay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Upgrade
