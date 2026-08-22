'use client';

import React, { useState } from 'react';
import { Zap, ArrowRight, LayoutGrid, User, LogOut, ChevronDown, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from './AuthProvider';

interface LandingNavbarProps {
  onLaunchDemoClick: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onLaunchDemoClick }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/75 border-b border-slate-200/80 px-6 py-4 transition-all duration-300 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Identity */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-sky-500 to-emerald-500 p-[1px] shadow-xs group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center">
              <Zap className="w-4 h-4 text-indigo-600 fill-indigo-600/20" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                NEXUS<span className="text-indigo-600">.</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
                ACADEMIA
              </span>
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
          <a href="#interactive-preview" className="hover:text-indigo-600 transition-colors">Bento Workspace</a>
          <a href="#features" className="hover:text-indigo-600 transition-colors">Core Features</a>
          <Link href="/dashboard" className="hover:text-indigo-600 transition-colors font-bold text-indigo-600 flex items-center gap-1">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Workspace App</span>
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user && user.provider !== 'guest' ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover ring-2 ring-indigo-500/30" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {user.name[0]?.toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline truncate max-w-[120px]">{user.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Account Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    {user.major && (
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono">
                        {user.major}
                      </span>
                    )}
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span>Go to Workspace</span>
                  </Link>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-indigo-600" />
                <span>Sign In</span>
              </Link>

              <Link
                href="/signup"
                className="group relative inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs text-white transition-all duration-200 bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>GET STARTED</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </>
          )}

          <Link
            href="/dashboard"
            className="hidden lg:inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-all"
          >
            <span>Demo</span>
          </Link>
        </div>

      </div>
    </header>
  );
};


