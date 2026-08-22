'use client';

import React from 'react';

export const BackgroundCanvas: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#FAFAFC]">
      
      {/* 1. Light Geometric Dot Grid Pattern */}
      <div className="absolute inset-0 bg-light-grid opacity-60" />

      {/* 2. Soft Organic Pastel Gradient Mesh Blends */}
      {/* Indigo Blob - Top Center */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-gradient-to-b from-indigo-200/50 via-sky-100/40 to-transparent blur-[130px]" />

      {/* Sky Blue Blob - Top Right */}
      <div className="absolute top-[15%] -right-20 w-[600px] h-[600px] bg-sky-200/45 blur-[140px]" />

      {/* Mint Emerald Blob - Middle Left */}
      <div className="absolute top-[45%] -left-32 w-[650px] h-[650px] bg-emerald-100/50 blur-[150px]" />

      {/* Soft Rose Blob - Bottom Right */}
      <div className="absolute bottom-10 right-10 w-[700px] h-[700px] bg-purple-200/40 blur-[160px]" />

      {/* 3. Floating Abstract Background Figures (Blended Glass Shapes) */}
      
      {/* Figure A: Rotated Glass Squircle Pod (Top Left) */}
      <div className="absolute top-24 left-[8%] w-44 h-44 rounded-3xl bg-gradient-to-br from-white/70 via-indigo-100/40 to-white/20 border border-white/80 shadow-[0_20px_50px_rgba(99,102,241,0.08)] backdrop-blur-xl rotate-12 animate-float-1" />

      {/* Figure B: Floating Glass Ring / Pill Pod (Top Right Hero area) */}
      <div className="absolute top-36 right-[12%] w-56 h-28 rounded-full bg-gradient-to-tr from-white/80 via-sky-100/30 to-white/30 border border-white/90 shadow-[0_20px_45px_rgba(14,165,233,0.08)] backdrop-blur-xl -rotate-6 animate-float-2" />

      {/* Figure C: Soft Diamond Glass Prism (Middle Right) */}
      <div className="absolute top-[52%] right-[5%] w-40 h-40 rounded-3xl bg-gradient-to-tl from-white/75 via-emerald-100/40 to-white/20 border border-white/80 shadow-[0_25px_50px_rgba(16,185,129,0.07)] backdrop-blur-xl rotate-45 animate-float-1" />

      {/* Figure D: Floating Curved Glass Ribbon (Lower Left) */}
      <div className="absolute bottom-28 left-[6%] w-64 h-32 rounded-3xl bg-gradient-to-r from-white/80 via-purple-100/30 to-white/30 border border-white/80 shadow-[0_20px_50px_rgba(168,85,247,0.07)] backdrop-blur-xl -rotate-12 animate-float-2" />

      {/* 4. Soft Vignette Edge Blending */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_90%_at_50%_10%,transparent_40%,rgba(248,250,252,0.6)_100%)] pointer-events-none" />

    </div>
  );
};
