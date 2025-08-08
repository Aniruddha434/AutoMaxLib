import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ClerkProvider } from "@clerk/clerk-react"
import { BrowserRouter, useNavigate } from "react-router-dom"
import App from "./App.jsx"
import "./index.css"
import "./services/errorLogger.js" // Initialize error logger

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key")
}

// Add error handling for Clerk
const handleClerkError = (error) => {
  console.error('Clerk Error:', error)
  // You can add additional error reporting here
}

const ClerkWithRouter = ({ children }) => {
  const navigate = useNavigate()
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      onError={handleClerkError}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      appearance={{
        elements: {
          // Ensure OTP inputs are properly styled and stable
          formFieldInput: 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          otpCodeFieldInput: 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center',
        }
      }}
    >
      {children}
    </ClerkProvider>
  )
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkWithRouter>
        <App />
      </ClerkWithRouter>
    </BrowserRouter>
  </StrictMode>
)
