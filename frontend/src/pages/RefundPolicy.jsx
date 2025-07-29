import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            No Refund Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              1. No Refund Policy
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                <strong>All sales are final.</strong> We do not offer refunds for any premium subscriptions
                or services purchased through AutoGitPilot. By purchasing our services, you acknowledge
                and agree to this no-refund policy.
              </p>
              <p>
                This policy applies to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>All premium subscriptions (monthly or annual)</li>
                <li>All upgrades from free to premium plans</li>
                <li>All one-time purchases</li>
                <li>All additional services or features</li>
              </ul>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-4">
                <p className="text-red-800 dark:text-red-200 font-medium">
                  ⚠️ Important: Please carefully review our service features and try our free trial
                  before making any purchase, as no refunds will be provided under any circumstances.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              2. Exceptions to No Refund Policy
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                While our general policy is no refunds, we may consider refunds only in the following
                <strong>extremely limited circumstances</strong>:
              </p>

              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Very Limited Exceptions:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Duplicate charges due to technical payment errors (verified by our system)</li>
                <li>Unauthorized transactions (with proper documentation and police report)</li>
                <li>Service completely unavailable for more than 7 consecutive days due to our technical failure</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Refunds Under Any Circumstances:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Change of mind or dissatisfaction with service</li>
                <li>Technical issues on user's end (internet, device, browser)</li>
                <li>Failure to use the service after purchase</li>
                <li>Violation of our Terms of Service</li>
                <li>Partial usage of subscription period</li>
                <li>Service working as advertised but not meeting user expectations</li>
                <li>User error or misunderstanding of features</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              3. Dispute Process for Exceptional Cases
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                For the very limited exceptions mentioned above, you may contact us with proper documentation:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Contact our support team at supportautomaxlib@gmail.com</li>
                <li>Subject line must include "DISPUTE - [Transaction ID]"</li>
                <li>Provide complete documentation proving the exceptional circumstance</li>
                <li>Include all transaction details and payment references</li>
                <li>Allow 15-30 business days for investigation</li>
              </ol>

              <p><strong>Required documentation for dispute review:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account email address and transaction ID</li>
                <li>Bank statements showing duplicate charges (for duplicate charge claims)</li>
                <li>Police report (for unauthorized transaction claims)</li>
                <li>Detailed explanation with supporting evidence</li>
                <li>Screenshots or system logs (if applicable)</li>
              </ul>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-4">
                <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                  ⚠️ Note: Submitting a dispute does not guarantee a refund. Each case is reviewed individually
                  and refunds are granted only in verified exceptional circumstances.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              4. Processing Time for Approved Disputes
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                <strong>Only if a dispute is approved</strong> after thorough investigation (which is extremely rare):
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Investigation Period:</strong> 15-30 business days</li>
                <li><strong>Credit/Debit Cards:</strong> 7-14 business days after approval</li>
                <li><strong>Net Banking:</strong> 7-14 business days after approval</li>
                <li><strong>UPI/Wallets:</strong> 3-7 business days after approval</li>
                <li><strong>International Cards:</strong> 14-21 business days after approval</li>
              </ul>

              <p>
                <strong>Important:</strong> Most disputes are rejected after investigation. Processing times
                are only applicable to the rare cases where a refund is approved.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              5. Subscription Cancellation
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">How to Cancel</h3>
              <p>You can cancel your subscription at any time through:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your account settings dashboard</li>
                <li>Contacting our support team</li>
                <li>Email request to support@autogitpilot.com</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Cancellation Effects</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your subscription will remain active until the end of the current billing period</li>
                <li>You will retain access to premium features until expiration</li>
                <li>No further charges will be made</li>
                <li>Your account will automatically downgrade to the free plan</li>
                <li>Data and settings will be preserved for 90 days</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              6. Prorated Refunds
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                For annual subscriptions cancelled within the 30-day guarantee period, 
                we provide full refunds regardless of usage.
              </p>
              <p>
                For cancellations due to service issues or billing errors outside the 
                30-day window, we may provide prorated refunds at our discretion.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              7. Failed Payments and Account Suspension
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>If a payment fails:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We will attempt to retry the payment up to 3 times</li>
                <li>You will receive email notifications about failed payments</li>
                <li>Your account will be suspended after 7 days of failed payment</li>
                <li>Premium features will be disabled during suspension</li>
                <li>Your data will be preserved for 30 days during suspension</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              8. Dispute Resolution
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                If you have any disputes regarding charges or refunds, please contact us first 
                before initiating a chargeback with your bank or payment provider.
              </p>
              <p>
                We are committed to resolving all payment-related issues fairly and promptly. 
                Most disputes can be resolved within 2-3 business days.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              9. Changes to This Policy
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                We may update this Refund Policy from time to time. Any changes will be posted 
                on this page with an updated revision date. Continued use of our service after 
                changes constitutes acceptance of the new policy.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              10. Contact Information
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>For dispute requests or questions about this policy, contact us:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email: supportautomaxlib@gmail.com</li>
                <li>Subject Line: "DISPUTE - [Transaction ID]"</li>
                <li>Response Time: Within 24-48 hours</li>
                <li>Address: Nimbhora MIDC Road, Amravati, Maharashtra, India</li>
              </ul>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
                <p className="text-blue-800 dark:text-blue-200 font-medium">
                  💡 Tip: Before requesting a refund, try reaching out to our support team. 
                  We're often able to resolve issues and help you get the most out of AutoGitPilot!
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default RefundPolicy
