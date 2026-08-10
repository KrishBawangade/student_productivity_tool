'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { audioEngine } from '../lib/audioEngine';

interface PomodoroSoundscapeProps {
  onSessionComplete: (xpGain: number) => void;
}

export const PomodoroSoundscape: React.FC<PomodoroSoundscapeProps> = ({ onSessionComplete }) => {
  const [mode, setMode] = useState<'work' | 'short' | 'long' | 'custom'>('work');
  const [targetSeconds, setTargetSeconds] = useState(1500); // 25 mins default
  const [secondsLeft, setSecondsLeft] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  const [activeSound, setActiveSound] = useState<'cyber' | 'rain' | 'cafe' | 'binaural' | 'none'>('cyber');
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [customMins, setCustomMins] = useState(25);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          const xp = mode === 'work' ? 150 : 30;
          onSessionComplete(xp);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, mode, onSessionComplete]);

  const toggleTimer = () => {
    const nextState = !isRunning;
    setIsRunning(nextState);
    if (nextState && activeSound !== 'none') {
      audioEngine?.playSound(activeSound);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(targetSeconds);
  };

  const changeMode = (newMode: 'work' | 'short' | 'long' | 'custom', seconds: number) => {
    setMode(newMode);
    setTargetSeconds(seconds);
    setSecondsLeft(seconds);
    setIsRunning(false);
  };

  const handleSoundChange = (type: 'cyber' | 'rain' | 'cafe' | 'binaural' | 'none') => {
    const nextSound = activeSound === type ? 'none' : type;
    setActiveSound(nextSound);
    if (!isMuted) {
      audioEngine?.playSound(nextSound);
    }
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    if (!isMuted) {
      audioEngine?.setVolume(v);
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (nextMute) {
      audioEngine?.setVolume(0);
    } else {
      audioEngine?.setVolume(volume);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = targetSeconds > 0 ? ((targetSeconds - secondsLeft) / targetSeconds) * 100 : 0;

  return (
    <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/90 flex flex-col justify-between relative overflow-hidden group">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-sm">
          <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
          <span>Ambient Focus Soundscape</span>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => changeMode('work', 1500)}
            className={`px-3 py-1 rounded-lg transition-all ${
              mode === 'work' ? 'bg-indigo-600 text-white shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Work (25m)
          </button>
          <button
            onClick={() => changeMode('short', 300)}
            className={`px-3 py-1 rounded-lg transition-all ${
              mode === 'short' ? 'bg-indigo-600 text-white shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rest (5m)
          </button>
          <button
            onClick={() => changeMode('long', 900)}
            className={`px-3 py-1 rounded-lg transition-all ${
              mode === 'long' ? 'bg-indigo-600 text-white shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Break (15m)
          </button>
        </div>
      </div>

      {/* Main Timer Graphic */}
      <div className="my-6 flex flex-col items-center justify-center relative">
        <div className="relative w-48 h-48 sm:w-52 sm:h-52 rounded-full border-4 border-indigo-100 flex items-center justify-center bg-indigo-50/40 shadow-inner">
          
          {/* Circular SVG Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-indigo-100 stroke-current"
              strokeWidth="4"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-indigo-600 stroke-current transition-all duration-500"
              strokeWidth="4"
              strokeDasharray={276}
              strokeDashoffset={276 - (276 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="text-center z-10">
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 font-mono">
              {formatTime(secondsLeft)}
            </span>
            <p className="text-[11px] text-indigo-600 font-extrabold mt-1.5 uppercase tracking-wider font-mono flex items-center justify-center gap-1">
              {isRunning ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>FLOW STATE ACTIVE</span>
                </>
              ) : (
                <span>PAUSED FOCUS</span>
              )}
            </p>
          </div>
        </div>

        {/* Play/Pause & Reset Controls */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={toggleTimer}
            className="w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center text-white shadow-xl shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all"
          >
            {isRunning ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
          </button>
          <button
            onClick={resetTimer}
            className="w-11 h-11 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-all"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Custom Duration Slider */}
      <div className="mb-4 bg-white/70 p-3 rounded-2xl border border-slate-200/80">
        <div className="flex items-center justify-between text-xs mb-1 font-semibold text-slate-700">
          <span>Custom Duration Sprints:</span>
          <span className="text-indigo-600 font-mono font-bold">{customMins} mins</span>
        </div>
        <input
          type="range"
          min="5"
          max="90"
          step="5"
          value={customMins}
          onChange={(e) => {
            const val = Number(e.target.value);
            setCustomMins(val);
            changeMode('custom', val * 60);
          }}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
      </div>

      {/* Web Audio Soundscape Generators */}
      <div className="pt-4 border-t border-slate-200/80">
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-700">
            <Volume2 className="w-4 h-4 text-indigo-600" />
            <span>Procedural Soundscape Engine</span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="text-slate-500 hover:text-indigo-600 transition-colors">
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-16 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>

        {/* Audio Track Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => handleSoundChange('cyber')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border text-left flex items-center justify-between ${
              activeSound === 'cyber'
                ? 'bg-indigo-100 border-indigo-300 text-indigo-800 shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span>🎧 Cyber Lofi</span>
            {activeSound === 'cyber' && <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />}
          </button>

          <button
            onClick={() => handleSoundChange('rain')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border text-left flex items-center justify-between ${
              activeSound === 'rain'
                ? 'bg-sky-100 border-sky-300 text-sky-800 shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span>🌧️ Rain Noise</span>
            {activeSound === 'rain' && <span className="w-2 h-2 rounded-full bg-sky-600 animate-ping" />}
          </button>

          <button
            onClick={() => handleSoundChange('cafe')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border text-left flex items-center justify-between ${
              activeSound === 'cafe'
                ? 'bg-amber-100 border-amber-300 text-amber-800 shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span>☕ Cafe Chill</span>
            {activeSound === 'cafe' && <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />}
          </button>

          <button
            onClick={() => handleSoundChange('binaural')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border text-left flex items-center justify-between ${
              activeSound === 'binaural'
                ? 'bg-emerald-100 border-emerald-300 text-emerald-800 shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span>🧠 10Hz Alpha</span>
            {activeSound === 'binaural' && <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />}
          </button>
        </div>
      </div>
    </div>
  );
};
