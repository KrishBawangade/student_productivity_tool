'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Zap, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, 
  Sparkles, CheckCircle2, AlertCircle, RefreshCw, KeyRound, UserCheck, LayoutGrid 
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { BackgroundCanvas } from '../components/BackgroundCanvas';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithCredentials, socialLogin, sendMagicLink, isAuthenticated, user, logout } = useAuth();

  const [authMode, setAuthMode] = useState<'credentials' | 'magic'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginWithCredentials(email, password);
      if (res.success) {
        setSuccessMsg('Successfully authenticated! Redirecting to workspace...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 600);
      } else {
        setErrorMsg(res.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err: any) {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      await sendMagicLink(email);
      setSuccessMsg('Magic link sent! Sign in verified. Redirecting to workspace...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 700);
    } catch {
      setErrorMsg('Failed to send magic link.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'github') => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      await socialLogin(provider, email || undefined);
      setSuccessMsg(`Signed in with ${provider === 'google' ? 'Google' : 'GitHub'}! Redirecting...`);
      setTimeout(() => {
        router.push('/dashboard');
      }, 600);
    } catch {
      setErrorMsg('Social login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-900 font-sans selection:bg-indigo-600 selection:text-white relative flex flex-col justify-between overflow-x-hidden">
      
      {/* Background Graphic Elements */}
      <BackgroundCanvas />

      {/* Header Bar */}
      <header className="relative z-20 w-full px-6 py-5 max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-sky-500 to-emerald-500 p-[1px] shadow-xs group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center">
              <Zap className="w-4 h-4 text-indigo-600 fill-indigo-600/20" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              NEXUS<span className="text-indigo-600">.</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
              ACADEMIA
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Don&apos;t have an account?</span>
          <Link
            href="/signup"
            className="px-4 py-2 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-all shadow-xs"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Main Form Section */}
      <main className="relative z-10 my-auto py-8 px-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          
          {/* Glass Container Card */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/90 bg-white/85 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500" />

            {/* Header branding */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mb-3 shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Sign in to access your AI study copilot, flashcards & grade targets.
              </p>
            </div>

            {/* If user is already signed in banner */}
            {isAuthenticated && user && user.provider !== 'guest' && (
              <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="truncate">
                    <span className="font-bold text-slate-900 block truncate">{user.name}</span>
                    <span className="text-slate-500 block truncate">{user.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href="/dashboard"
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1"
                  >
                    <LayoutGrid className="w-3 h-3" />
                    <span>Open</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="px-2 py-1 rounded-lg bg-slate-200 text-slate-700 hover:bg-rose-100 hover:text-rose-700 transition-colors font-medium"
                  >
                    Switch
                  </button>
                </div>
              </div>
            )}

            {/* Alerts */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Social OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => handleSocialAuth('google')}
                disabled={isLoading}
                className="flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs hover:border-slate-300 disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialAuth('github')}
                disabled={isLoading}
                className="flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-xl border border-slate-900 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-2xs disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub</span>
              </button>
            </div>

            {/* Separator */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white/90 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                or sign in with email
              </span>
            </div>

            {/* Toggle Mode Selector */}
            <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
              <button
                type="button"
                onClick={() => setAuthMode('credentials')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'credentials'
                    ? 'bg-white text-indigo-600 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Password Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('magic')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'magic'
                    ? 'bg-white text-indigo-600 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Magic Link
              </button>
            </div>

            {/* Form */}
            {authMode === 'credentials' ? (
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex.vance@university.edu"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                    />
                    <span className="text-xs text-slate-600 font-medium">Keep me signed in</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs tracking-wider transition-all shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>SIGN IN TO WORKSPACE</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex.vance@university.edu"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs tracking-wider transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending Magic Link...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>SEND MAGIC LINK</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Guest Mode Quick Link */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => {
                  router.push('/dashboard');
                }}
                className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1.5 mx-auto"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Continue as Guest (No Registration Required)</span>
              </button>
            </div>

          </div>

          {/* Footer note */}
          <p className="text-center text-[11px] text-slate-400 mt-6 font-medium">
            Protected by Nexus Academia Security • Encrypted local sync
          </p>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 px-6 text-center text-xs text-slate-400">
        © 2026 Nexus Academia Inc. All rights reserved.
      </footer>

    </div>
  );
}
