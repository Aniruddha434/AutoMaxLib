import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!clerkPubKey) {
  throw new Error("Missing Publishable Key")
}

// Wrapper component to provide navigate function to Clerk
const ClerkProviderWithRouter = ({ children }) => {
  const navigate = useNavigate()

  // Enhanced navigation function with better error handling and logging
  const handleNavigation = (to) => {
    console.log('Clerk navigation requested:', to)

    try {
      // Ensure the path is valid
      if (!to || typeof to !== 'string') {
        console.error('Invalid navigation path:', to)
        navigate('/dashboard') // Fallback to dashboard
        return
      }

      // Handle relative paths
      const path = to.startsWith('/') ? to : `/${to}`

      // Add a small delay to ensure authentication state is settled
      setTimeout(() => {
        console.log('Executing navigation to:', path)
        navigate(path, { replace: true })
      }, 100)

    } catch (error) {
      console.error('Navigation error:', error)
      // Fallback navigation
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      navigate={handleNavigation}
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#6366f1'
        }
      }}
      localization={{
        signUp: {
          start: {
            title: "Create your account",
            subtitle: "to continue to AutoMaxLib"
          }
        }
      }}
    >
      {children}
    </ClerkProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkProviderWithRouter>
        <App />
      </ClerkProviderWithRouter>
    </BrowserRouter>
  </React.StrictMode>,
)
