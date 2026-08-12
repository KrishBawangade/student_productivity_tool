'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Zap, Mail, ArrowRight, ArrowLeft, ShieldCheck, 
  CheckCircle2, AlertCircle, RefreshCw, KeyRound 
} from 'lucide-react';
import { BackgroundCanvas } from '../components/BackgroundCanvas';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid student email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 800);
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

        <Link
          href="/login"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </header>

      {/* Main Form Section */}
      <main className="relative z-10 my-auto py-8 px-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/90 bg-white/85 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-600 to-emerald-500" />

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mb-3 shadow-inner">
                <KeyRound className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Reset Password
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Enter your university or personal email to receive recovery instructions.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {isSent ? (
              <div className="text-center space-y-4 py-4 animate-in fade-in">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Reset Email Sent!</h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                    We sent password reset instructions to <strong className="text-slate-900">{email}</strong>. Please check your inbox or spam folder.
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    href="/login"
                    className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow-xs"
                  >
                    Return to Sign In
                  </Link>
                  <button
                    onClick={() => setIsSent(false)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Didn&apos;t receive email? Try again
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>SEND RESET INSTRUCTIONS</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 px-6 text-center text-xs text-slate-400">
        © 2026 Nexus Academia Inc. All rights reserved.
      </footer>

    </div>
  );
}
