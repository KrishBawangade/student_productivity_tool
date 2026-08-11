'use client';

import React from 'react';
import { Zap, ShieldCheck, ArrowRight, LayoutGrid, User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from './AuthProvider';

interface LandingNavbarProps {
  onLaunchDemoClick: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onLaunchDemoClick }) => {
  const { user, openAuthModal } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/75 border-b border-slate-200/80 px-6 py-4 transition-all duration-300 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-sky-500 to-emerald-500 p-[1px] shadow-xs">
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
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
          <a href="#interactive-preview" className="hover:text-indigo-600 transition-colors">Bento Workspace</a>
          <a href="#features" className="hover:text-indigo-600 transition-colors">Core Features</a>
          <Link href="/dashboard" className="hover:text-indigo-600 transition-colors font-bold text-indigo-600 flex items-center gap-1">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Launch App</span>
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={openAuthModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-4 h-4 rounded-full object-cover" />
            ) : (
              <User className="w-3.5 h-3.5 text-indigo-600" />
            )}
            <span className="hidden sm:inline truncate max-w-[100px]">{user?.name || 'Account'}</span>
          </button>

          <Link
            href="/dashboard"
            className="group relative inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-xs text-white transition-all duration-200 bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>LAUNCH DASHBOARD</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

      </div>
    </header>
  );
};

