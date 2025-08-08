import { Routes, Route } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { ThemeProvider } from './contexts/ThemeContext'
import { UserProvider } from './contexts/UserContext'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import ConnectGitHub from './pages/ConnectGitHub'
import Settings from './pages/Settings'
import Upgrade from './pages/Upgrade'
import PublicBadge from './pages/PublicBadge'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import PatternGenerator from './components/PatternGenerator'
import ReadmeGeneratorPage from './pages/ReadmeGeneratorPage'
import ProtectedRoute from './components/auth/ProtectedRoute'

import ImageTest from './components/ImageTest'
import PremiumFeatureTest from './components/PremiumFeatureTest'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import RefundPolicy from './pages/RefundPolicy'
import ContactUs from './pages/ContactUs'
import AboutUs from './pages/AboutUs'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <UserProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/sign-in/*" element={<SignInPage />} />
              <Route path="/sign-up/*" element={<SignUpPage />} />
              <Route path="/badge/:userId" element={<PublicBadge />} />
              <Route path="/image-test" element={<ImageTest />} />
              <Route path="/premium-test" element={<PremiumFeatureTest />} />

              {/* Legal Pages */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/about" element={<AboutUs />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/connect" element={
                <ProtectedRoute>
                  <ConnectGitHub />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/upgrade" element={
                <ProtectedRoute>
                  <Upgrade />
                </ProtectedRoute>
              } />
              <Route path="/patterns" element={
                <ProtectedRoute>
                  <div className="container mx-auto px-4 py-8">
                    <PatternGenerator />
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/readme-generator" element={
                <ProtectedRoute>
                  <ReadmeGeneratorPage />
                </ProtectedRoute>
              } />
            </Routes>
            </main>
            <Footer />
          </div>
        </UserProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
