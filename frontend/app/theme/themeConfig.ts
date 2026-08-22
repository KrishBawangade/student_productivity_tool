/**
 * Nexus Academia Design System & Theme Configuration
 * Centralized design tokens for colors, typography, glassmorphism, buttons, and badges.
 */

export const THEME_COLORS = {
  // Base Surface
  bgCanvas: '#FAFAFC',
  bgCard: 'rgba(255, 255, 255, 0.8)',
  bgCardHover: 'rgba(255, 255, 255, 0.95)',
  borderGlass: 'rgba(226, 232, 240, 0.9)',
  borderGlassHover: 'rgba(99, 102, 241, 0.35)',

  // Primary Brand & Accents
  primary: {
    DEFAULT: '#4F46E5', // Indigo 600
    hover: '#4338CA',   // Indigo 700
    light: '#EEF2FF',   // Indigo 50
    border: '#C7D2FE',  // Indigo 200
  },
  accentSky: {
    DEFAULT: '#0284C7', // Sky 600
    light: '#F0F9FF',   // Sky 50
    border: '#BAE6FD',  // Sky 200
  },
  accentAmber: {
    DEFAULT: '#D97706', // Amber 600
    light: '#FFFBEB',   // Amber 50
    border: '#FDE68A',  // Amber 200
  },
  accentEmerald: {
    DEFAULT: '#059669', // Emerald 600
    light: '#ECFDF5',   // Emerald 50
    border: '#A7F3D0',  // Emerald 200
  },
  accentPurple: {
    DEFAULT: '#9333EA', // Purple 600
    light: '#FAF5FF',   // Purple 50
    border: '#E9D5FF',  // Purple 200
  },

  // Text Neutral Scale
  text: {
    primary: '#0F172A',   // Slate 900
    secondary: '#334155', // Slate 700
    muted: '#64748B',     // Slate 500
    subtle: '#94A3B8',    // Slate 400
  },
};

export const THEME_TYPOGRAPHY = {
  fontSans: 'var(--font-sans, "Plus Jakarta Sans", sans-serif)',
  fontMono: 'var(--font-mono, "JetBrains Mono", monospace)',
};

export const GLASS_PRESETS = {
  cardBase: 'glass-card rounded-3xl p-6',
  pillBase: 'glass-pill rounded-full px-3 py-1 text-xs font-semibold',
  inputBase: 'w-full px-4 py-2.5 rounded-xl bg-white/80 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400 font-medium',
};

export type ThemeVariant = 'indigo' | 'amber' | 'emerald' | 'sky' | 'purple' | 'slate' | 'rose';
