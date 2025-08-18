import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSignIn } from '@clerk/clerk-react'
import Logo from '../components/ui/Logo'
import { useTheme } from '../contexts/ThemeContext'

// A lightweight, Clerk-native reset password flow with 3 simple steps
// 1) Request email code  2) Verify code  3) Set new password
export default function ForgotPassword() {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const { signIn, isLoaded } = useSignIn()

  const [step, setStep] = useState('request') // request | verify | reset
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const firstFieldRef = useRef(null)

  useEffect(() => {
    firstFieldRef.current?.focus({ preventScroll: true })
  }, [step])

  const requestCode = async (e) => {
    e.preventDefault()
    if (!isLoaded || loading) return
    setLoading(true)
    setError('')
    try {
      await signIn.create({ strategy: 'reset_password_email_code', identifier: email })
      setStep('verify')
    } catch (err) {
      console.error('Request reset error:', err)
      setError(err?.errors?.[0]?.message || err?.message || 'Failed to send reset code')
    } finally {
      setLoading(false)
    }
  }

  const verifyCode = async (e) => {
    e.preventDefault()
    if (!isLoaded || loading) return
    setLoading(true)
    setError('')
    try {
      const res = await signIn.attemptFirstFactor({ strategy: 'reset_password_email_code', code })
      if (res?.status === 'needs_new_password') {
        setStep('reset')
      } else {
        setError('Invalid or expired code. Please try again.')
      }
    } catch (err) {
      console.error('Verify code error:', err)
      setError(err?.errors?.[0]?.message || err?.message || 'Failed to verify code')
    } finally {
      setLoading(false)
    }
  }

  const setNewPassword = async (e) => {
    e.preventDefault()
    if (!isLoaded || loading) return
    if (!password || password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await signIn.resetPassword({ password, signOutOfOtherSessions: false })
      if (res?.status === 'complete') {
        navigate('/sign-in', { replace: true })
      } else {
        setError('Could not set new password. Please try again.')
      }
    } catch (err) {
      console.error('Set new password error:', err)
      setError(err?.errors?.[0]?.message || err?.message || 'Failed to set new password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-400/10 dark:bg-indigo-400/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className={`overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl ${
          isDark ? 'border-white/20 bg-slate-900/40' : 'border-slate-200/50 bg-white/80 shadow-lg'
        }`}>
          <div className="px-6 pt-6">
            <div className="flex justify-center mb-4">
              <Logo variant="auth" size="lg" />
            </div>
            <h1 className={`text-center text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {step === 'request' && 'Forgot your password?'}
              {step === 'verify' && 'Verify code'}
              {step === 'reset' && 'Set a new password'}
            </h1>
            <p className={`text-center text-sm mb-6 ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
              {step === 'request' && 'Enter your email and we will send you a verification code.'}
              {step === 'verify' && 'Enter the 6-digit code sent to your email.'}
              {step === 'reset' && 'Create a strong password for your account.'}
            </p>
          </div>

          <div className="px-6 pb-6">
            {error && (
              <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {step === 'request' && (
              <form onSubmit={requestCode} className="space-y-3">
                <label className="block">
                  <span className={`mb-1 block text-sm font-medium ${isDark ? 'text-white/90' : 'text-slate-900'}`}>Email</span>
                  <input
                    ref={firstFieldRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`w-full rounded-xl border px-3 py-2.5 outline-none bg-transparent ${
                      isDark
                        ? 'text-white placeholder-white/50 border-white/20 focus:border-white/40'
                        : 'text-slate-900 placeholder-slate-400 border-slate-200/60 focus:border-slate-400/70'
                    }`}
                    required
                  />
                </label>
                <button
                  type="submit"
                  disabled={loading || !email}
                  className={`mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    isDark ? 'border-white/20 bg-white text-black hover:bg-white/90' : 'border-slate-400/50 bg-slate-800 text-white hover:bg-slate-900'
                  }`}
                >
                  {loading ? 'Sending…' : 'Send code'}
                </button>
              </form>
            )}

            {step === 'verify' && (
              <form onSubmit={verifyCode} className="space-y-3">
                <label className="block">
                  <span className={`mb-1 block text-sm font-medium ${isDark ? 'text-white/90' : 'text-slate-900'}`}>Verification code</span>
                  <input
                    ref={firstFieldRef}
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="123456"
                    inputMode="numeric"
                    className={`w-full rounded-xl border px-3 py-2.5 outline-none bg-transparent tracking-widest text-center ${
                      isDark
                        ? 'text-white placeholder-white/50 border-white/20 focus:border-white/40'
                        : 'text-slate-900 placeholder-slate-400 border-slate-200/60 focus:border-slate-400/70'
                    }`}
                    required
                  />
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('request')}
                    className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium ${
                      isDark ? 'border-white/15 text-white/80 hover:bg-white/5' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !code}
                    className={`flex-1 rounded-xl border px-4 py-2.5 font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      isDark ? 'border-white/20 bg-white text-black hover:bg-white/90' : 'border-slate-400/50 bg-slate-800 text-white hover:bg-slate-900'
                    }`}
                  >
                    {loading ? 'Verifying…' : 'Verify code'}
                  </button>
                </div>
              </form>
            )}

            {step === 'reset' && (
              <form onSubmit={setNewPassword} className="space-y-3">
                <label className="block">
                  <span className={`mb-1 block text-sm font-medium ${isDark ? 'text-white/90' : 'text-slate-900'}`}>New password</span>
                  <input
                    ref={firstFieldRef}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className={`w-full rounded-xl border px-3 py-2.5 outline-none bg-transparent ${
                      isDark
                        ? 'text-white placeholder-white/50 border-white/20 focus:border-white/40'
                        : 'text-slate-900 placeholder-slate-400 border-slate-200/60 focus:border-slate-400/70'
                    }`}
                    required
                  />
                </label>
                <label className="block">
                  <span className={`mb-1 block text-sm font-medium ${isDark ? 'text-white/90' : 'text-slate-900'}`}>Confirm password</span>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className={`w-full rounded-xl border px-3 py-2.5 outline-none bg-transparent ${
                      isDark
                        ? 'text-white placeholder-white/50 border-white/20 focus:border-white/40'
                        : 'text-slate-900 placeholder-slate-400 border-slate-200/60 focus:border-slate-400/70'
                    }`}
                    required
                  />
                </label>
                <button
                  type="submit"
                  disabled={loading || !password || !confirm}
                  className={`mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    isDark ? 'border-white/20 bg-white text-black hover:bg-white/90' : 'border-slate-400/50 bg-slate-800 text-white hover:bg-slate-900'
                  }`}
                >
                  {loading ? 'Saving…' : 'Set new password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

