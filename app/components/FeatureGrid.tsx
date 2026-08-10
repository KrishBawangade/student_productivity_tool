'use client';

import React from 'react';
import { Flame, Sparkles, BarChart3, Music } from 'lucide-react';
import { Card, Badge } from './ui';
import { ThemeVariant } from '../theme/themeConfig';

export const FeatureGrid: React.FC = () => {
  const features: Array<{
    icon: React.ReactNode;
    badge: string;
    badgeVariant: ThemeVariant;
    title: string;
    description: string;
    gradient: string;
    border: string;
  }> = [
    {
      icon: <Flame className="w-6 h-6 text-amber-600" />,
      badge: 'Gamification',
      badgeVariant: 'amber',
      title: 'Gamified XP & Streaks',
      description: 'Turn study tasks into quests. Earn +50 XP per assignment, build 7-day streaks, and level up your scholar rank.',
      gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
      border: 'border-amber-200/80',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-indigo-600" />,
      badge: 'Visual Design',
      badgeVariant: 'indigo',
      title: 'Pastel Mesh & Light Glass',
      description: 'Clean ceramic canvas blended with soft pastel gradient mesh, abstract 3D figures, and frosted glass cards.',
      gradient: 'from-indigo-500/10 via-indigo-500/5 to-transparent',
      border: 'border-indigo-200/80',
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-emerald-600" />,
      badge: 'Analytics',
      badgeVariant: 'emerald',
      title: 'Grade Target Forecaster',
      description: 'Calculate the exact final exam score needed for an A grade in real-time. Never guess your academic standing.',
      gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      border: 'border-emerald-200/80',
    },
    {
      icon: <Music className="w-6 h-6 text-purple-600" />,
      badge: 'Focus Tools',
      badgeVariant: 'purple',
      title: 'Lo-Fi Ambient Engine',
      description: 'Built-in soundscape generator with Lo-Fi Rain, Cyber Beats, and Cafe Ambience. Zero app-switching needed.',
      gradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
      border: 'border-purple-200/80',
    },
  ];

  return (
    <section id="features" className="py-16 px-6 max-w-7xl mx-auto z-10 relative">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase font-mono">
          ENGINEERED FOR MODERN STUDENTS
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mt-2">
          Why Nexus Academia <span className="text-gradient-accent">Stands Out</span>
        </h2>
        <p className="text-slate-600 text-sm sm:text-base mt-4 font-medium">
          Built from the ground up to solve student fatigue with high-density bento architecture and rewarding micro-interactions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feat, idx) => (
          <Card
            key={idx}
            variant="interactive"
            className={`border ${feat.border} bg-gradient-to-b ${feat.gradient} flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  {feat.icon}
                </div>
                <Badge variant={feat.badgeVariant} size="sm">
                  {feat.badge}
                </Badge>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{feat.description}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
              <span className="font-mono">Module 0{idx + 1}</span>
              <span className="text-indigo-600 font-bold">Explore Feature →</span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
