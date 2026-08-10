'use client';

import React from 'react';
import { Sparkles, Flame, ArrowRight, ArrowDown, Zap, CheckCircle2, TrendingUp, Brain } from 'lucide-react';
import Link from 'next/link';
import { Button, Badge, Card } from './ui';

interface LandingHeroProps {
  onScrollToDemo: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onScrollToDemo }) => {
  return (
    <section className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto text-center z-10">
      
      {/* Top Floating Pill Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill mb-8 border border-indigo-200/80 text-indigo-900 text-xs font-bold tracking-wide shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
        <span>INTELLIGENT ACADEMIC WORKSPACE v1.0</span>
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 max-w-5xl mx-auto leading-[1.12]">
        Supercharge Your{' '}
        <span className="text-gradient-accent drop-shadow-xs">
          Academic Velocity
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
        A high-performance student productivity system built to eliminate procrastination, forecast subject grades, and turn study sessions into rewarding focus streaks.
      </p>

      {/* CTA Button Group */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link href="/dashboard">
          <Button
            variant="primary"
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            LAUNCH DASHBOARD APP
          </Button>
        </Link>

        <Button variant="secondary" size="lg" onClick={onScrollToDemo}>
          EXPLORE BENTO DEMO
        </Button>
      </div>

      {/* KPI Stats Bar */}
      <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <Card variant="glass" padding="sm" className="text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">+38%</div>
          <div className="text-xs text-slate-500 font-semibold mt-1">Average Grade Boost</div>
        </Card>

        <Card variant="glass" padding="sm" className="text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 font-mono">120K+</div>
          <div className="text-xs text-slate-500 font-semibold mt-1">Focus Hours Logged</div>
        </Card>

        <Card variant="glass" padding="sm" className="text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-sky-600 flex items-center justify-center gap-1 font-mono">
            <span>4.9</span>
            <span className="text-amber-500 text-base font-sans">★</span>
          </div>
          <div className="text-xs text-slate-500 font-semibold mt-1">Student Satisfaction</div>
        </Card>

        <Card variant="glass" padding="sm" className="text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 flex items-center justify-center gap-1 font-mono">
            <Flame className="w-5 h-5 text-emerald-600" />
            <span>7x</span>
          </div>
          <div className="text-xs text-slate-500 font-semibold mt-1">Longer Study Streaks</div>
        </Card>
      </div>

      {/* 3D FLOATING SHOWCASE */}
      <div className="mt-16 max-w-5xl mx-auto perspective-1200 relative group">
        <div className="absolute -top-6 -left-4 sm:left-4 z-30 animate-bounce glass-pill px-4 py-2 rounded-2xl border border-emerald-300 bg-white/90 text-emerald-900 text-xs font-bold shadow-xl flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <Flame className="w-4 h-4 text-emerald-600" />
          <span className="font-mono">7-Day Focus Streak Active (+1.5x XP)</span>
        </div>

        <div className="absolute -top-6 -right-4 sm:right-4 z-30 glass-pill px-4 py-2 rounded-2xl border border-indigo-300 bg-white/90 text-indigo-900 text-xs font-bold shadow-xl flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-600" />
          <span className="font-mono">⚡ Pomodoro Sprint: 25:00</span>
        </div>

        <div className="absolute -bottom-6 right-6 z-30 glass-pill px-4 py-2 rounded-2xl border border-sky-300 bg-white/90 text-slate-900 text-xs font-bold shadow-xl flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-sky-600" />
          <span className="font-mono">Grade Goal: 92% (A Grade Target)</span>
        </div>

        <div className="hero-showcase-tilt hero-mockup-shadow rounded-3xl bg-white border border-slate-200/90 overflow-hidden text-left relative">
          <div className="bg-slate-100/90 backdrop-blur-md px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
            </div>

            <div className="px-4 py-1 rounded-full bg-white border border-slate-200 text-[11px] text-slate-500 font-mono tracking-wide">
              https://nexus.academia/workspace
            </div>

            <Badge variant="indigo" size="sm" pulse>
              LIVE WORKSPACE
            </Badge>
          </div>

          <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-50 to-white grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-600">
                <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Focus Lab</span>
                <Badge variant="indigo" size="sm">Sprint</Badge>
              </div>
              <div className="my-6 text-center">
                <div className="w-24 h-24 mx-auto rounded-full border-4 border-indigo-500/20 flex items-center justify-center bg-indigo-50/50">
                  <span className="text-2xl font-extrabold text-slate-900 font-mono">25:00</span>
                </div>
              </div>
              <div className="text-[11px] text-center font-bold text-emerald-600 bg-emerald-50 py-1.5 rounded-lg border border-emerald-200 font-mono">
                🎧 Cyber Beats Lo-Fi Active
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Quest Matrix</span>
                <Badge variant="emerald" size="sm">2/3 Done</Badge>
              </div>
              <div className="space-y-2.5 my-4">
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-slate-500 line-through flex items-center justify-between">
                  <span>Neural Net Backprop</span>
                  <span className="text-emerald-700 font-mono">+50 XP</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-900 flex items-center justify-between">
                  <span>Linear Algebra HW</span>
                  <span className="text-indigo-600 font-mono">+35 XP</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 font-semibold flex items-center justify-between pt-2 border-t border-slate-100">
                <span>Streak Bonus</span>
                <span className="text-indigo-600 font-bold font-mono">1.5x XP</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span className="flex items-center gap-1.5"><Brain className="w-3.5 h-3.5 text-indigo-600" /> AI Copilot</span>
                <Badge variant="indigo" size="sm">GPT-4o</Badge>
              </div>
              <div className="my-4 bg-slate-900 text-slate-100 p-3 rounded-xl text-[11px] font-mono leading-relaxed shadow-inner">
                Dijkstra pathfinding completed in O((V + E) log V). Min-heap queue verified.
              </div>
              <div className="text-[11px] text-slate-500 font-semibold flex items-center justify-between pt-2 border-t border-slate-100 font-mono">
                <span>Response Time</span>
                <span className="text-emerald-600 font-bold">0.18s</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 flex justify-center">
        <a href="#interactive-preview" className="text-slate-400 hover:text-indigo-600 transition-colors flex flex-col items-center gap-2 text-xs font-medium">
          <span>Scroll to explore interactive tools</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </a>
      </div>
    </section>
  );
};
