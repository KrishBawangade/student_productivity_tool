'use client';

import React from 'react';
import confetti from 'canvas-confetti';
import { Award, Flame, Shield, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';

interface LevelProgressModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const LevelProgressModal: React.FC<LevelProgressModalProps> = ({ user, isOpen, onClose }) => {
  if (!isOpen) return null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#0284C7', '#059669', '#F59E0B'],
      });
    } catch {
      // fallback
    }
  };

  const ranks = [
    { levelRange: 'L1–L4', title: 'Novice Scholar', color: 'text-amber-700 bg-amber-50 border-amber-200', unlocked: user.level >= 1 },
    { levelRange: 'L5–L9', title: 'Focus Apprentice', color: 'text-slate-700 bg-slate-100 border-slate-300', unlocked: user.level >= 5 },
    { levelRange: 'L10–L14', title: 'Academic Architect', color: 'text-indigo-700 bg-indigo-50 border-indigo-200', unlocked: user.level >= 10 },
    { levelRange: 'L15–L19', title: 'Mind Master', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', unlocked: user.level >= 15 },
    { levelRange: 'L20+', title: 'Grand Luminary', color: 'text-purple-700 bg-purple-50 border-purple-200', unlocked: user.level >= 20 },
  ];

  const currentLevelXpNeeded = Math.floor(500 * Math.pow(user.level, 1.25));
  const nextLevelXpNeeded = Math.floor(500 * Math.pow(user.level + 1, 1.25));
  const xpInCurrentLevel = user.xp - currentLevelXpNeeded;
  const xpSpan = nextLevelXpNeeded - currentLevelXpNeeded;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpSpan) * 100)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex p-3.5 rounded-2xl bg-indigo-100 border border-indigo-200 text-indigo-700 mb-3 shadow-inner">
            <Award className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Level {user.level} — <span className="text-indigo-600">{user.rankTitle}</span>
          </h3>

          <p className="text-xs text-slate-500 font-medium mt-1">
            Exponential Level Formula: Total XP = ⌊500 × Level<sup>1.25</sup>⌋
          </p>
        </div>

        {/* Level XP Progress Bar */}
        <div className="bg-slate-100/90 p-4 rounded-2xl border border-slate-200/90 mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2 font-mono">
            <span>XP Progress to Level {user.level + 1}:</span>
            <span className="text-indigo-600 font-extrabold">
              {user.xp} / {nextLevelXpNeeded} XP ({progressPercent}%)
            </span>
          </div>

          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500 rounded-full transition-all duration-700 shadow-md"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-medium">
            <span>Total Focus: {user.totalFocusMinutes} mins</span>
            <span className="flex items-center gap-1 text-amber-600 font-bold font-mono">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              {user.streak} Day Streak
            </span>
          </div>
        </div>

        {/* Scholar Ranks Spectrum */}
        <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-3">
          Scholar Ranks &amp; Title Progression
        </h4>

        <div className="space-y-2">
          {ranks.map((r) => (
            <div
              key={r.title}
              className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                r.unlocked
                  ? `${r.color} font-bold shadow-xs`
                  : 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {r.unlocked ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Shield className="w-4 h-4 text-slate-400" />
                )}
                <div>
                  <div className="text-xs font-extrabold">{r.title}</div>
                  <div className="text-[10px] opacity-80 font-mono">{r.levelRange}</div>
                </div>
              </div>

              {r.unlocked && (
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white/80 border border-current font-mono">
                  UNLOCKED
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center">
          <button
            onClick={triggerConfetti}
            className="px-6 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Celebrate Progress FX</span>
          </button>
        </div>
      </div>
    </div>
  );
};
