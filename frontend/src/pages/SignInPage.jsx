import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth, useSignIn } from '@clerk/clerk-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import Logo from '../components/ui/Logo';

const SignInPage = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const modalRef = useRef(null);
  const firstFieldRef = useRef(null);

  // Handle successful authentication
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      console.log('SignInPage: User authenticated, redirecting to', redirectTo);
      setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 100);
    }
  }, [isLoaded, isSignedIn, navigate, location.state]);

  useEffect(() => {
    const toFocus = firstFieldRef.current;
    toFocus?.focus({ preventScroll: true });
  }, []);

  const handleSocial = async (provider) => {
    if (loading || !signInLoaded) return;

    setLoading(true);
    setError("");

    try {
      await signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: '/dashboard',
        redirectUrlComplete: '/dashboard',
      });
    } catch (err) {
      console.error('Social auth error:', err);
      setError(err.errors?.[0]?.message || err.message || 'Social authentication failed');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || !signInLoaded) return;

    setLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        // Authentication successful, will be handled by useEffect
      } else {
        setError("Sign in failed. Please check your credentials.");
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.errors?.[0]?.message || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-400/10 dark:bg-indigo-400/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Modal panel */}
      <motion.div
        className="relative z-10 w-full max-w-md mx-auto"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        {/* Secured by Clerk Badge - Desktop (Vertical Tab) */}
        <div className="absolute -left-5 top-8 z-20 hidden sm:block">
          <div className={`w-8 h-40 rounded-l-xl rounded-r-none shadow-lg backdrop-blur-sm border-l border-t border-b flex items-center justify-center ${
            isDark
              ? 'bg-indigo-600/95 border-indigo-500/50'
              : 'bg-indigo-600 border-indigo-500'
          }`}>
            <div className="transform -rotate-90 whitespace-nowrap">
              <div className="flex items-center gap-2 text-white text-xs font-semibold">
                {/* Clerk Logo */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.19 0 2.34-.21 3.41-.6.39-.14.65-.5.65-.92 0-.55-.45-1-1-1-.21 0-.4.07-.57.17-.8.29-1.65.44-2.49.44-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7c0 .84-.15 1.69-.44 2.49-.1.17-.17.36-.17.57 0 .55.45 1 1 1 .42 0 .78-.26.92-.65.39-1.07.6-2.22.6-3.41C22 6.48 17.52 2 12 2z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <span>Secured by Clerk</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Badge - Bottom Left */}
        <div className="absolute -left-1 -bottom-3 z-20 block sm:hidden">
          <div className={`px-2 py-1 rounded-md text-xs font-medium shadow-md backdrop-blur-sm border ${
            isDark
              ? 'bg-indigo-600/90 text-white border-indigo-500/50'
              : 'bg-indigo-600 text-white border-indigo-500'
          }`}>
            <div className="flex items-center gap-1">
              {/* Clerk Logo */}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.19 0 2.34-.21 3.41-.6.39-.14.65-.5.65-.92 0-.55-.45-1-1-1-.21 0-.4.07-.57.17-.8.29-1.66.45-2.49.45-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7c0 .83-.16 1.69-.45 2.49-.1.17-.17.36-.17.57 0 .55.45 1 1 1 .42 0 .78-.26.92-.65.39-1.07.6-2.22.6-3.41 0-5.52-4.48-10-10-10z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <span>Secured by Clerk</span>
            </div>
          </div>
        </div>

        <div
          className={`overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl ${
            isDark
              ? "border-white/20 bg-slate-900/40 dark:border-white/10"
              : "border-slate-200/50 bg-white/80 shadow-lg"
          }`}
        >
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent ${
              isDark ? "via-white/40 dark:via-white/10" : "via-slate-300/40"
            }`}
          />

          {/* Header */}
          <div className="flex items-center justify-between px-5 pb-2 pt-4 sm:px-6">
            <div className="flex justify-center w-full mb-4">
              <Logo variant="auth" size="lg" />
            </div>
          </div>

          <div className="text-center mb-6 px-5 sm:px-6">
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Welcome back
            </h2>
            <p className={`text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
              Sign in to your account to continue automating your GitHub commits
            </p>
          </div>

          {/* Body */}
          <div className="px-5 pb-5 sm:px-6 sm:pb-6">
            {error && (
              <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Social auth */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <SocialButton
                label="Google"
                onClick={() => handleSocial("google")}
                loading={loading}
                isDark={isDark}
                Icon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className={isDark ? "text-white/90" : "text-slate-700"}
                  >
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                }
              />
              <SocialButton
                label="GitHub"
                onClick={() => handleSocial("github")}
                loading={loading}
                isDark={isDark}
                Icon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    fill="currentColor"
                    className={isDark ? "text-white/90" : "text-slate-700"}
                  >
                    <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58 0-.28-.01-1.02-.02-2-3.34.73-4.04-1.6-4.04-1.6-.55-1.4-1.35-1.77-1.35-1.77-1.1-.76.08-.75.08-.75 1.22.09 1.86 1.25 1.86 1.25 1.08 1.85 2.83 1.32 3.52 1.01.11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.31 1.23a11.5 11.5 0 0 1 6.02 0c2.3-1.55 3.31-1.23 3.31-1.23.66 1.65.25 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.29 0 .32.21.7.83.58A12 12 0 0 0 12 .5Z" />
                  </svg>
                }
              />
              <SocialButton
                label="x.com"
                onClick={() => handleSocial("x")}
                loading={loading}
                isDark={isDark}
                Icon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    fill="currentColor"
                    className={isDark ? "text-white/90" : "text-slate-700"}
                  >
                    <path d="M18.244 2H21l-6.63 7.57L22 22h-7.137l-4.99-6.567L3.4 22H1l7.1-8.12L2 2h7.24l4.54 6.083L18.244 2Zm-1.25 18h2.052L8.097 4H6.03l10.964 16Z" />
                  </svg>
                }
              />
            </div>

            {/* Divider */}
            <div className={`my-4 flex items-center gap-3 ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
              <div className={`h-px flex-1 ${isDark ? 'bg-white/20 dark:bg-white/10' : 'bg-slate-200/70'}`} />
              <span className="text-xs uppercase tracking-wide">or</span>
              <div className={`h-px flex-1 ${isDark ? 'bg-white/20 dark:bg-white/10' : 'bg-slate-200/70'}`} />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <Field
                ref={firstFieldRef}
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                isDark={isDark}
              />

              <Field
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                isDark={isDark}
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className={`rounded-md px-2 py-1 text-xs hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 ${
                      isDark
                        ? 'text-white/80 hover:text-white focus:ring-white/30'
                        : 'text-slate-700 hover:bg-slate-100/50 hover:text-slate-900 focus:ring-slate-300'
                    }`}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                }
              />

              <div className="flex items-center justify-between pt-1">
                <label className={`flex items-center gap-2 text-sm ${isDark ? 'text-white/80' : 'text-slate-800'}`}>
                  <input
                    type="checkbox"
                    className={`h-4 w-4 rounded border-white/30 bg-white/10 text-white/90 focus:ring-white/30 ${
                      isDark
                        ? 'border-white/30 bg-white/10 text-white/90 focus:ring-white/30'
                        : 'border-slate-300/50 bg-slate-100/30 text-slate-600 focus:ring-slate-400'
                    }`}
                  />
                  Remember me
                </label>
                <Link
                  to="/forgot-password"
                  className={`text-sm underline-offset-4 hover:underline ${
                    isDark ? 'text-white/80 hover:text-white' : 'text-slate-800 hover:text-slate-950'
                  }`}
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password}
                className={`mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 font-semibold shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 ${
                  isDark
                    ? 'border-white/20 bg-white/80 text-black hover:bg-white dark:border-white/10 dark:bg-white dark:hover:bg-white/90'
                    : 'border-slate-400/50 bg-slate-600 text-white hover:bg-slate-700'
                }`}
              >
                {loading && (
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
                    />
                  </svg>
                )}
                Sign in
              </button>

              <p className={`pt-1 text-center text-xs ${isDark ? 'text-white/70' : 'text-slate-700'}`}>
                Don't have an account?{' '}
                <Link
                  to="/sign-up"
                  className={`font-medium underline-offset-4 hover:underline ${
                    isDark ? 'text-white/90 hover:text-white' : 'text-slate-900 hover:text-slate-950'
                  }`}
                >
                  Create account
                </Link>
              </p>

              <p className={`pt-1 text-center text-xs ${isDark ? 'text-white/70' : 'text-slate-700'}`}>
                By continuing you agree to our Terms and acknowledge the Privacy Policy.
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

const Field = React.forwardRef(function Field(
  { label, trailing, className = "", isDark, ...rest },
  ref,
) {
  const id = React.useId();
  return (
    <label htmlFor={id} className="block">
      <span className={`mb-1 block text-sm font-medium ${isDark ? 'text-white/90' : 'text-slate-900'}`}>
        {label}
      </span>
      <div
        className={`flex items-stretch rounded-xl border backdrop-blur-md focus-within:border-opacity-70 ${
          isDark
            ? 'border-white/20 bg-white/10 focus-within:border-white/40 dark:border-white/10 dark:bg-white/5'
            : 'border-slate-200/50 bg-slate-50/50 focus-within:border-slate-400/70'
        }`}
      >
        <input
          ref={ref}
          id={id}
          className={`w-full rounded-xl bg-transparent px-3 py-2.5 outline-none [color-scheme:dark] ${
            isDark
              ? 'text-white placeholder-white/50 light:text-slate-950 light:placeholder-slate-400/70 light:[color-scheme:light]'
              : 'text-slate-950 placeholder-slate-400/70 [color-scheme:light]'
          } ${className}`}
          {...rest}
        />
        {trailing ? <div className="flex items-center pr-2">{trailing}</div> : null}
      </div>
    </label>
  );
});

function SocialButton({
  label,
  Icon,
  onClick,
  loading,
  isDark,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`group inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium shadow-sm backdrop-blur-md transition hover:scale-[0.98] active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-60 ${
        isDark
          ? 'border-white/20 bg-white/10 text-white hover:bg-white/15 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10'
          : 'border-slate-300/50 bg-slate-100/30 text-slate-900 hover:bg-slate-100/50'
      }`}
    >
      <span className={isDark ? 'text-white/90' : 'text-slate-700'}>
        {Icon}
      </span>
      <span className={`${isDark ? 'text-white' : 'text-slate-900'} hidden sm:inline`}>
        {label}
      </span>
    </button>
  );
}

export default SignInPage
