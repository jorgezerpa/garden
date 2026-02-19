'use client'
import { useState, useEffect } from 'react';

export function TalkTime() {
  const [progress, setProgress] = useState(20);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const radius = 120; // Slightly smaller to allow for glow overflow
  const circumference = 2 * Math.PI * radius;
  
  // Progress calculations
  const offset = circumference - (progress / 100) * circumference;

  if (!mounted) return null;

  return (
    <div className="overflow-hidden bg-white dark:bg-[#252b39]/80 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl rounded-3xl p-8 flex-[2.5] min-h-[480px] flex flex-col items-center justify-between relative transition-all duration-500 text-slate-800 dark:text-white">
      
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/10 blur-[100px] pointer-events-none" />

      {/* Top Header */}
      <div className="text-center z-10">
        <h3 className="text-[11px] uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 font-bold">
          Talk Time Today
        </h3>
      </div>

      {/* Main Visual Container */}
      <div className="relative w-[320px] h-[320px] flex items-center justify-center">
        
        <svg 
          width="320" height="320" viewBox="0 0 320 320" 
          className="-rotate-90"
        >
          <defs>
            {/* Gradient for the main progress line */}
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>

            {/* Tapered Mask for the Outer Half-Ring */}
            <mask id="taperMask">
               <radialGradient id="taperGrad">
                 <stop offset="90%" stopColor="white" />
                 <stop offset="100%" stopColor="transparent" />
               </radialGradient>
               {/* This creates the "thick in middle, thin at ends" look via a stroke-dasharray and linecap */}
            </mask>
          </defs>

          {/* 1. The Tapered Outer Half-Ring (Visual Flare) */}
          <path
            d="M 160,160 m -158,0 a 158,158 0 1,1 316,0"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="opacity-20"
          />
          <path
            d="M 60,280 A 150,150 0 0 1 60,40"
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            className="opacity-40"
          />

          {/* 2. Background Track (Ghost ring) */}
          <circle 
            cx="160" cy="160" r={radius} 
            stroke="currentColor" strokeWidth="12" fill="none"
            className="text-slate-200 dark:text-white/5"
          />

          {/* 3. The Main Glowing Progress Bar */}
          <circle 
            cx="160" cy="160" r={radius} 
            stroke="url(#progressGradient)" strokeWidth="12" fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out drop-shadow-[0_0_12px_rgba(34,197,94,0.5)]"
          />

          {/* 4. The Cyber-Ticks (Inner Dial) */}
          <circle 
            cx="160" cy="160" r={radius - 20} 
            stroke="currentColor" strokeWidth="4" fill="none"
            strokeDasharray="2 12"
            className="opacity-10"
          />
        </svg>

        {/* Center UI */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center bg-white/5 dark:bg-black/5 p-8 rounded-full backdrop-blur-sm border border-white/5">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500 mb-1 block animate-pulse">
              Active Session
            </span>
            <h2 className="text-5xl font-light tracking-tighter tabular-nums text-slate-800 dark:text-white">
              02:15<span className="opacity-30 text-3xl">:30</span>
            </h2>
            <div className="flex items-center justify-center gap-2 mt-2">
                <div className="w-1 h-1 rounded-full bg-green-500" />
                <span className="text-[14px] font-bold opacity-40 uppercase tracking-widest">Goal: 4h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats Footer */}
      <div className="w-full flex justify-between items-end px-2">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">Call Volume</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">26</span>
            <span className="text-[10px] text-green-500 font-bold">+12% above yesterday</span>
          </div>
        </div>

        {/* Center Aesthetic Divider */}
        <div className="flex gap-1 pb-2">
            {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-slate-300 dark:bg-white/10" />)}
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">Deep Calls</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">8</span>
            <div className="w-4 h-4 rounded-full bg-orange-500/20 border border-orange-500/50 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}