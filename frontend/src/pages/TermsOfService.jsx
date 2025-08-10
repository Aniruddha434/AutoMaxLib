import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const TermsOfService = () => {
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
            Terms of Service
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                By accessing and using AutoMaxLib ("the Service"), you accept and agree to be bound
                by the terms and provision of this agreement. If you do not agree to abide by the
                above, please do not use this service.
              </p>
              <p>
                These Terms of Service ("Terms") govern your use of our website located at
                automaxlib.online and our service operated by AutoMaxLib.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              2. Description of Service
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>AutoMaxLib is a GitHub automation service that provides:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Automated commit scheduling and management</li>
                <li>GitHub repository integration and monitoring</li>
                <li>AI-powered commit message generation</li>
                <li>Profile README generation and management</li>
                <li>Analytics and reporting features</li>
                <li>Premium features for enhanced functionality</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              3. User Accounts and Registration
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>To use our service, you must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create an account with accurate and complete information</li>
                <li>Be at least 13 years of age</li>
                <li>Have a valid GitHub account</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
              <p>
                You are responsible for safeguarding the password and for all activities that occur 
                under your account.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              4. Acceptable Use Policy
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>You agree not to use the Service to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Upload malicious code or harmful content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service</li>
                <li>Use the service for spam or unsolicited communications</li>
                <li>Create fake commits or misleading contribution data</li>
                <li>Abuse GitHub's terms of service through our platform</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              5. Subscription and Payment Terms
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Free Trial</h3>
              <p>
                We offer a 15-day free trial for new users. No payment information is required 
                during the trial period.
              </p>

              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Premium Subscription</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Premium subscriptions are billed monthly or annually</li>
                <li>Payments are processed securely through Razorpay</li>
                <li>Subscriptions automatically renew unless cancelled</li>
                <li>Price changes will be communicated 30 days in advance</li>
                <li>You can cancel your subscription at any time</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Refunds</h3>
              <p>
                <strong>All sales are final.</strong> We do not offer refunds for any premium subscriptions.
                Please review our service carefully during the free trial period before purchasing.
                See our Refund Policy for complete details.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              6. GitHub Integration
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>By connecting your GitHub account, you authorize us to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your public and private repositories (as permitted)</li>
                <li>Create commits on your behalf</li>
                <li>Read repository metadata and commit history</li>
                <li>Generate and update files in your repositories</li>
              </ul>
              <p>
                You retain full ownership of your repositories and can revoke access at any time 
                through GitHub's settings or our platform.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              7. Intellectual Property Rights
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                The Service and its original content, features, and functionality are and will remain 
                the exclusive property of AutoMaxLib and its licensors. The Service is protected
                by copyright, trademark, and other laws.
              </p>
              <p>
                You retain ownership of any content you create or upload through our service, 
                including code, commits, and repository content.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              8. Privacy and Data Protection
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Your privacy is important to us. Please review our Privacy Policy, which also 
                governs your use of the Service, to understand our practices.
              </p>
              <p>
                We implement appropriate security measures to protect your personal information 
                and repository data.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              9. Service Availability and Modifications
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                We strive to provide reliable service but cannot guarantee 100% uptime. We may 
                temporarily suspend the service for maintenance or updates.
              </p>
              <p>
                We reserve the right to modify or discontinue the Service (or any part thereof) 
                with or without notice. We shall not be liable to you or any third party for any 
                modification, suspension, or discontinuance of the Service.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              10. Limitation of Liability
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                In no event shall AutoMaxLib, nor its directors, employees, partners, agents,
                suppliers, or affiliates, be liable for any indirect, incidental, special, 
                consequential, or punitive damages, including without limitation, loss of profits, 
                data, use, goodwill, or other intangible losses, resulting from your use of the Service.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              11. Termination
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                We may terminate or suspend your account and bar access to the Service immediately, 
                without prior notice or liability, under our sole discretion, for any reason 
                whatsoever, including without limitation if you breach the Terms.
              </p>
              <p>
                You may terminate your account at any time by contacting us or using the account 
                deletion feature in your settings.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              12. Governing Law
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                These Terms shall be interpreted and governed by the laws of India, without regard 
                to its conflict of law provisions. Any disputes arising from these Terms will be 
                subject to the jurisdiction of courts in [Your City], India.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              13. Changes to Terms
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms 
                at any time. If a revision is material, we will provide at least 30 days notice 
                prior to any new terms taking effect.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              14. Contact Information
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>If you have any questions about these Terms, please contact us:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email: supportautomaxlib@gmail.com</li>
                <li>Address: Nimbhora MIDC Road, Amravati, Maharashtra, India</li>
                <li>Phone: +91 8624829427</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService
