'use client';

import React from 'react';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { LandingNavbar } from './components/LandingNavbar';
import { LandingHero } from './components/LandingHero';
import { InteractiveDashboardPreview } from './components/InteractiveDashboardPreview';
import { FeatureGrid } from './components/FeatureGrid';
import { Zap, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function Home() {
  const scrollToPreview = () => {
    const el = document.getElementById('interactive-preview');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-900 font-sans selection:bg-indigo-600 selection:text-white relative">
      
      {/* 1. Light Ceramic & Blended Pastel Mesh Canvas with Background Figures */}
      <BackgroundCanvas />

      {/* 2. Top Navigation Bar */}
      <LandingNavbar onLaunchDemoClick={scrollToPreview} />

      {/* Main Content Flow */}
      <main className="relative z-10">
        
        {/* 3. Hero Section */}
        <LandingHero onScrollToDemo={scrollToPreview} />

        {/* 4. Bento Grid Workspace Preview */}
        <InteractiveDashboardPreview />

        {/* 5. Core Feature Grid */}
        <FeatureGrid />

        {/* 6. Call To Action Banner */}
        <section className="py-16 px-6 max-w-5xl mx-auto my-12 text-center z-10 relative">
          <div className="glass-card p-10 sm:p-14 rounded-3xl border border-slate-200/90 bg-gradient-to-tr from-indigo-50/70 via-white/80 to-sky-50/70 relative overflow-hidden shadow-lg">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 font-mono">
              INTELLIGENT ACADEMIC WORKSPACE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
              Elevate Your Academic Workflows with <span className="text-gradient-accent">Nexus Academia</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mt-4 leading-relaxed font-medium">
              Experience the student productivity engine designed to eliminate study burnout and maximize focus.
            </p>

            <div className="mt-8 flex items-center justify-center">
              <button
                onClick={scrollToPreview}
                className="px-8 py-3.5 rounded-xl font-bold text-xs tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
              >
                <span>START USING NEXUS</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* 7. Footer */}
      <footer className="relative z-10 border-t border-slate-200/80 py-8 px-6 text-center text-xs text-slate-500 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold">
            <Zap className="w-4 h-4 text-indigo-600" />
            <span className="font-extrabold text-slate-900">NEXUS ACADEMIA</span>
            <span>— Student Productivity System v1.0</span>
          </div>

          <div className="flex items-center gap-6 text-slate-500 font-medium">
            <span>Built with Next.js 16 & Tailwind</span>
            <span className="flex items-center gap-1 text-indigo-700 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> V1.0 RELEASE
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
