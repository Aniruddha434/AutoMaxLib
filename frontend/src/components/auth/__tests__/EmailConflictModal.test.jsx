import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import EmailConflictModal from '../EmailConflictModal'

// Mock Clerk
const mockSignOut = jest.fn()
jest.mock('@clerk/clerk-react', () => ({
  ...jest.requireActual('@clerk/clerk-react'),
  useClerk: () => ({
    signOut: mockSignOut
  })
}))

// Mock navigate
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ClerkProvider publishableKey="test-key">
        {component}
      </ClerkProvider>
    </BrowserRouter>
  )
}

describe('EmailConflictModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onRetry: jest.fn(),
    email: 'test@example.com'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders when open', () => {
    renderWithProviders(<EmailConflictModal {...defaultProps} />)
    
    expect(screen.getByText('Email Already in Use')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    renderWithProviders(<EmailConflictModal {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText('Email Already in Use')).not.toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    renderWithProviders(<EmailConflictModal {...defaultProps} />)
    
    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)
    
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('calls onRetry when retry button is clicked', () => {
    renderWithProviders(<EmailConflictModal {...defaultProps} />)
    
    const retryButton = screen.getByText('Try with Different Email')
    fireEvent.click(retryButton)
    
    expect(defaultProps.onRetry).toHaveBeenCalled()
  })

  it('handles sign in button click', async () => {
    renderWithProviders(<EmailConflictModal {...defaultProps} />)
    
    const signInButton = screen.getByText('Sign In to Existing Account')
    fireEvent.click(signInButton)
    
    expect(mockSignOut).toHaveBeenCalled()
  })

  it('opens email client when contact support is clicked', () => {
    // Mock window.open
    const mockOpen = jest.fn()
    window.open = mockOpen

    renderWithProviders(<EmailConflictModal {...defaultProps} />)
    
    const supportButton = screen.getByText('Contact Support')
    fireEvent.click(supportButton)
    
    expect(mockOpen).toHaveBeenCalledWith(
      expect.stringContaining('mailto:support@automaxlib.com'),
      '_blank'
    )
  })
})
