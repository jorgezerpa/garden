'use client'
import { TalkTime } from '@/components/TalkTime'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // MINDSET COMPONENT
  const [mindset, setMindset] = useState({ energy: 80, focus: 45, motivation: 70 });

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  // Reusable card style for the "Glow" and "Blur" look
  const cardStyle = `
    bg-white dark:bg-[#252b39]/80 
    backdrop-blur-md 
    border border-slate-200 dark:border-white/10 
    shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.4)] 
    rounded-2xl p-4 transition-all duration-500
  `;

  return (
    <div className="min-h-screen transition-colors duration-500 bg-slate-100 dark:bg-[#1a1f2b] text-slate-800 dark:text-slate-200 p-4 md:p-6 flex flex-col gap-4 font-sans selection:bg-green-500/30">
      
      {/* Background Glow Decorations (Dark Mode Only) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-1000">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-green-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[120px]" />
      </div>

      {/* --- Header / Top Bar --- */}
      <header className={`${cardStyle} flex items-center justify-between !py-3 relative z-10`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow-lg shadow-green-500/20" />
          <h1 className="font-bold text-lg hidden sm:block tracking-tight text-slate-700 dark:text-slate-100">Sales Garden</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end text-sm">
            <span className="opacity-70">Welcome, <span className="font-bold text-green-500 dark:text-green-400">Sarah</span></span>
            <span className="text-[10px] uppercase tracking-widest opacity-40 font-semibold">Wednesday, April 24</span>
          </div>
          
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-green-500/10 border border-slate-200 dark:border-white/10 transition-all active:scale-95"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* --- Main Content Grid --- */}
      <main className="flex flex-col lg:flex-row gap-6 flex-1 relative z-10">
        
        {/* Left Column */}
        <section className="flex flex-col gap-4 w-full lg:w-1/4">
          {/* --- Mindset Section --- */}
          <div className={`${cardStyle} h-auto min-h-48`}>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-6">
              Mindset Check
            </h3>
            
            <div className="flex flex-col">
              <MindsetSlider 
                label="Energy" 
                color="bg-green-500" 
                value={mindset.energy} 
                onChange={(v) => setMindset({...mindset, energy: v})} 
              />
              <MindsetSlider 
                label="Focus" 
                color="bg-yellow-500" 
                value={mindset.focus} 
                onChange={(v) => setMindset({...mindset, focus: v})} 
              />
              <MindsetSlider 
                label="Motivation" 
                color="bg-orange-500" 
                value={mindset.motivation} 
                onChange={(v) => setMindset({...mindset, motivation: v})} 
              />
            </div>
          </div>

          {/* --- Reset Zone Section --- */}
          <div className={`${cardStyle} h-auto flex flex-col gap-3`}>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2">
              Reset Zone
            </h3>
            
            <div className="flex flex-col gap-2">
              <ResetButton 
                label="Back to Line" 
                onClick={() => console.log("Back to Line clicked")} 
              />
              <ResetButton 
                label="Bad Call Reset" 
                onClick={() => console.log("Bad Call Reset clicked")} 
              />
              <ResetButton 
                label="Let It Go" 
                onClick={() => console.log("Let It Go clicked")} 
              />
            </div>
          </div>
          {/* /* --- Reset Zone Section --- */} 
          <div className="bg-white dark:bg-[#252b39]/80 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.4)] rounded-2xl p-4 flex-1 min-h-[180px] flex flex-col relative overflow-hidden transition-all duration-500">
            
            {/* 1. Section Header */}
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4">
              Historical Overview
            </h3>

            {/* 2. Sub-label for the Graph Area */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[12px] font-medium text-slate-600 dark:text-slate-300">
                Weekly Growth
              </span>
              {/* Subtle indicator dot */}
              <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
            </div>

            {/* 3. Graph Placeholder Area */}
            <div className="flex-1 w-full bg-slate-50/50 dark:bg-black/20 rounded-xl border border-dashed border-slate-200 dark:border-white/5 flex items-center justify-center relative">
              {/* Atmospheric Glow inside the graph area */}
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-green-500/5 to-transparent pointer-events-none" />
              
              <span className="text-[10px] uppercase tracking-widest text-slate-300 dark:text-slate-600 font-bold">
                Graph Component Area
              </span>
            </div>

            {/* 4. X-Axis Labels Placeholder */}
            <div className="flex justify-between mt-2 px-1">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                <span key={day} className="text-[9px] font-bold uppercase tracking-tighter text-slate-400 dark:text-slate-600">
                  {day}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Middle Column */}
        <section className="flex flex-col gap-4 w-full lg:w-1/2">
          {/* --- Talk Time --- */}
          <TalkTime />

          {/* --- streak tracker Section --- */}
          <div className="bg-white dark:bg-[#252b39]/80 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.4)] rounded-2xl p-4 flex-1 min-h-[140px] relative  group transition-all duration-500">
            
            {/* 1. Atmospheric Glows (The "Meadow" Effect) */}
            <div className='absolute inset-0 overflow-hidden'>
              <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 via-transparent to-transparent opacity-60 pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-48 h-24 bg-green-500/20 blur-[50px] rounded-full pointer-events-none group-hover:bg-green-500/30 transition-colors duration-700" />
            </div>
            
            {/* 2. Header Label with decorative lines */}
            <div className="relative z-10 flex items-center justify-center gap-3 mb-6">
              <div className="h-[1px] w-6 bg-slate-200 dark:bg-white/5" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Streak Tracker
              </h3>
              <div className="h-[1px] w-6 bg-slate-200 dark:bg-white/5" />
            </div>

            {/* 3. Stats Display */}
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-around gap-4 px-4">
              
              {/* Current Streak Container */}
              <div className="text-center">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-1">
                  Current Streak
                </span>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl font-bold tracking-tight text-slate-700 dark:text-white">42</span>
                  <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">min</span>
                </div>
              </div>

              {/* Vertical Divider (Visible only on desktop) */}
              <div className="hidden md:block h-8 w-[1px] bg-slate-200 dark:bg-white/10" />

              {/* Best Streak Container */}
              <div className="text-center">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-1">
                  Best Streak
                </span>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl font-bold tracking-tight text-slate-700 dark:text-white">1h 15m</span>
                </div>
              </div>
            </div>

            {/* 4. Tiny Decorative Glows (Sparkles) */}
            <div className="absolute bottom-4 right-12 w-1 h-1 bg-white rounded-full blur-[1px] animate-pulse opacity-30" />
            <div className="absolute bottom-6 right-20 w-1.5 h-1.5 bg-green-300 rounded-full blur-[2px] animate-pulse opacity-20" />

            <ManualSeeding />
          </div>
        </section>

        {/* Right Column */}
        <section className="flex flex-col gap-4 w-full lg:w-1/4">
          {/* --- Today's Stats Section --- */}
          <div className={`${cardStyle} p-6`}>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4">
              Today&apos;s Stats
            </h3>
            
            <div className="flex flex-col h-full justify-between pb-4">
              <StatRow label="Seeds" value={14} />
              <StatRow label="Callback" value={6} />
              <StatRow label="Lead" value={3} />
              <StatRow label="Sale" value={1} />
            </div>
          </div>
          {/* --- Call Blocks Section --- */}
          <div className={`${cardStyle} flex flex-col`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Call Blocks
              </h3>
              {/* Icon Placeholder */}
              <div className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
            
            <div className="flex flex-col gap-1">
              <CallBlock time="08:30 - 09:00" status="upcoming" />
              <CallBlock time="09:30 - 11:30" status="active" />
              <CallBlock time="12:15 - 15:00" status="upcoming" />
              <CallBlock time="15:30 - 18:30" status="locked" />
            </div>
          </div>
        </section>

      </main>

      {/* --- Footer --- */}
      <footer className="flex items-center justify-between px-2 py-2 text-[10px] font-bold opacity-40 uppercase tracking-widest relative z-10">
        <div>Version 1.0</div>
        <div className="italic text-center hidden md:block lowercase tracking-normal opacity-80">&quot;Seeds now, harvest later!&quot;</div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
          Connected
        </div>
      </footer>
    </div>
  )
}




//////////////////////////////////
// MINDSET COMPONENT
/////////////////////////////////
interface MindsetSliderProps {
  label: string;
  color: string; // Tailwind color class like 'bg-green-500' or 'bg-orange-400'
  value: number;
  onChange: (val: number) => void;
}

const MindsetSlider = ({ label, color, value, onChange }: MindsetSliderProps) => {
  return (
    <div className="flex flex-col gap-2 w-full mb-4 group">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </span>
      </div>
      
      <div className="relative flex items-center h-4">
        {/* Custom Track Background */}
        <div className="absolute w-full h-[3px] bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          {/* Progress fill */}
          <div 
            className={`h-full ${color} opacity-80 shadow-[0_0_8px_rgba(0,0,0,0.2)] dark:shadow-none`} 
            style={{ width: `${value}%` }}
          />
        </div>

        {/* The Range Input */}
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute w-full h-full appearance-none bg-transparent cursor-pointer 
                     accent-white dark:accent-slate-200 
                     [&::-webkit-slider-thumb]:appearance-none 
                     [&::-webkit-slider-thumb]:w-3 
                     [&::-webkit-slider-thumb]:h-3 
                     [&::-webkit-slider-thumb]:rounded-full 
                     [&::-webkit-slider-thumb]:bg-white 
                     [&::-webkit-slider-thumb]:border-2 
                     [&::-webkit-slider-thumb]:border-slate-400
                     dark:[&::-webkit-slider-thumb]:border-slate-100
                     [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,0,0,0.2)]"
        />
      </div>
    </div>
  );
};


//////////////////////////////////
// RESET ZONE
/////////////////////////////////
interface ResetButtonProps {
  label: string;
  onClick?: () => void;
}

const ResetButton = ({ label, onClick }: ResetButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full py-2.5 px-4 rounded-xl
        /* Typography */
        text-[11px] font-bold uppercase tracking-widest
        text-slate-600 dark:text-slate-300
        /* Visuals */
        bg-slate-200/50 dark:bg-white/5 
        border border-slate-300/50 dark:border-white/10
        shadow-sm
        /* Transitions & Interactions */
        transition-all duration-200
        hover:bg-slate-300/50 dark:hover:bg-white/10
        hover:border-slate-400/50 dark:hover:border-white/20
        active:scale-[0.97] active:bg-slate-400/20 dark:active:bg-black/20
      `}
    >
      {label}
    </button>
  );
};

//////////////////////////////////
// TODAY'S STATS
/////////////////////////////////
interface StatRowProps {
  label: string;
  value: number | string;
  // We'll keep a slot for the icon placeholder as requested earlier
}

const StatRow = ({ label, value }: StatRowProps) => {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5 last:border-0 group">
      <div className="flex items-center gap-3">
        {/* Icon Placeholder: Fixed dimensions as requested */}
        <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700/50 rounded-md transition-colors group-hover:bg-green-500/20" />
        
        <span className="text-[12px] font-medium text-slate-600 dark:text-slate-300">
          {label}
        </span>
      </div>
      
      <span className="text-sm font-bold tabular-nums text-slate-700 dark:text-white">
        {value}
      </span>
    </div>
  );
};

interface CallBlockProps {
  time: string;
  status: 'active' | 'upcoming' | 'locked';
}


//////////////////////////////////
// CALL BLOCKS
/////////////////////////////////
const CallBlock = ({ time, status }: CallBlockProps) => {
  // Logic for color variants
  const statusConfig = {
    active: {
      dot: "bg-green-500 shadow-[0_0_8px_#22c55e]",
      badge: "bg-green-500/20 text-green-500 border-green-500/30",
      text: "text-slate-700 dark:text-white font-bold",
      label: "Active"
    },
    upcoming: {
      dot: "bg-slate-300 dark:bg-slate-600",
      badge: "bg-slate-100 dark:bg-white/5 text-slate-500 border-slate-200 dark:border-white/10",
      text: "text-slate-500 dark:text-slate-400 font-medium",
      label: "Upcoming"
    },
    locked: {
      dot: "bg-slate-200 dark:bg-slate-800",
      badge: "bg-slate-50 dark:bg-black/20 text-slate-400 border-transparent",
      text: "text-slate-400 dark:text-slate-600 font-medium",
      label: "Locked"
    }
  };

  const config = statusConfig[status];

  return (
    <div className={`flex items-center justify-between py-2.5 px-2 rounded-xl transition-colors ${status === 'active' ? 'bg-green-500/5' : ''}`}>
      <div className="flex items-center gap-3">
        {/* Status Dot */}
        <div className={`w-2 h-2 rounded-full ${config.dot}`} />
        
        <span className={`text-[12px] tabular-nums ${config.text}`}>
          {time}
        </span>
      </div>
      
      {/* Status Badge */}
      <div className={`text-[9px] px-2.5 py-1 rounded-lg border uppercase tracking-tighter font-bold ${config.badge}`}>
        {config.label}
      </div>
    </div>
  );
};

// -------------------------------
// MANUAL SEEDING
// -------------------------------
const ManualSeeding = () => {
  return (
    <>
          {/* --- High-Visibility Manual Seeding Bar --- */}
      <div className="max-w-2xl mx-auto relative top-[20%] mt-5 md:mt-0">
        <div className={`
          /* Background & Glass - Darker and less transparent for visibility */
          bg-white/95 dark:bg-[#1e2330] 
          backdrop-blur-2xl
          
          /* The "Pop" - Thick saturated border and a neon perimeter glow */
          border-2 border-green-500/30 dark:border-green-400/20
          shadow-[0_0_30px_rgba(34,197,94,0.15)] dark:shadow-[0_0_50px_rgba(0,0,0,0.6)]
          
          rounded-3xl p-4 flex items-center justify-between gap-4
        `}>
          
          {/* Status Indicator (Left) */}
          <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-slate-200 dark:border-white/10">
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute inset-0 opacity-20" />
              <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-green-600 dark:text-green-400 leading-none">
                Live Seeding
              </span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-bold mt-1">
                Garden Active
              </span>
            </div>
          </div>

          {/* Buttons Container */}
          <div className="flex-1 flex flex-col md:flex-row items-center gap-2 sm:gap-3">
            
            {/* Standard Seed */}
            <button className="w-full md:w-auto flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-green-500/50 transition-all active:scale-90 group">
              <div className="w-4 h-4 bg-slate-400/50 rounded-sm group-hover:bg-green-500 transition-colors" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Seed</span>
            </button>

            {/* Callback */}
            <button className="w-full md:w-auto flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-blue-500/50 transition-all active:scale-90 group">
              <div className="w-4 h-4 bg-slate-400/50 rounded-sm group-hover:bg-blue-500 transition-colors" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Callback</span>
            </button>

            {/* Connection */}
            <button className="w-full md:w-auto flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-purple-500/50 transition-all active:scale-90 group">
              <div className="w-4 h-4 bg-slate-400/50 rounded-sm group-hover:bg-purple-500 transition-colors" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Connect</span>
            </button>

            {/* Harvest (The main action) */}
            <button className="w-full md:w-auto flex-[1.2] flex flex-col items-center justify-center gap-1 py-2 rounded-2xl bg-green-500 text-white shadow-lg shadow-green-500/40 hover:bg-green-400 transition-all active:scale-95">
              <div className="w-4 h-4 bg-white/30 rounded-sm" />
              <span className="text-[10px] font-black uppercase tracking-widest">Harvest</span>
            </button>

          </div>
        </div>
      </div>
    </>
  )
}


