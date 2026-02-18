'use client'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return (
    <div className="min-h-screen transition-colors duration-300 bg-slate-100 dark:bg-[#1a1f2b] text-slate-800 dark:text-slate-200 p-4 md:p-6 flex flex-col gap-4 font-sans">
      
      {/* --- Header / Top Bar --- */}
      <header className="flex items-center justify-between bg-white dark:bg-[#252b39] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 w-full">
          {/* Logo Placeholder */}
          <div className="w-8 h-8 bg-green-500 rounded-md" />
          <h1 className="font-bold text-lg hidden sm:block">Sales Garden</h1>
        </div>

        <div className="flex flex-col items-center text-sm w-full justify-center text-center md:text-left">
          <span className="block opacity-70">Welcome, <span className="font-semibold text-green-500">Sarah</span></span>
        </div>

        <div className="flex items-center justify-end gap-6 w-full">
          <div className='hidden md:flex justify-center items-center'>
            <span className="text-sm text-center md:text-left opacity-60">Wednesday, April 24</span>
            <span className='font-light text-xl px-1'>|</span>
            <span className='text-sm pr-1 opacity-60'>In Block:</span>
            <span className='text-sm font-bold'>9:30 - 11:30 </span>
          </div>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:ring-2 ring-green-400 transition-all"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <div className='mb-5 flex flex-col md:hidden justify-center items-center w-full bg-white dark:bg-[#252b39] p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700'>
        <span className="text-sm text-center opacity-60">Wednesday, April 24</span>
        <span className='text-sm '>In Block: <span className='text-sm font-bold'>9:30 - 11:30 </span></span>
      </div>

      {/* --- Main Content Grid --- */}
      <main className="flex flex-col lg:flex-row gap-6 flex-1">
        
        {/* Left Column (Stats/Checks) */}
        <section className="flex flex-col gap-4 w-full lg:w-1/4">
          <div className="h-48 bg-white dark:bg-[#252b39] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-4">
            <h3 className="text-xs uppercase tracking-wider opacity-60 mb-2">Mindset Check</h3>
            {/* Content goes here */}
          </div>
          <div className="h-40 bg-white dark:bg-[#252b39] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-4">
            <h3 className="text-xs uppercase tracking-wider opacity-60 mb-2">Reset Zone</h3>
          </div>
          <div className="flex-1 min-h-[150px] bg-white dark:bg-[#252b39] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-4">
            <h3 className="text-xs uppercase tracking-wider opacity-60 mb-2">Historical Overview</h3>
          </div>
        </section>

        {/* Middle Column (Main Focus) */}
        <section className="flex flex-col gap-4 w-full lg:w-1/2">
          <div className="flex-[2] min-h-[400px] bg-white dark:bg-[#252b39] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl relative overflow-hidden p-6 flex items-center justify-center">
             {/* Main Graphic/Timer Placeholder */}
             <div className="text-center">
                <h3 className="text-xs uppercase tracking-widest opacity-60 mb-4">Talk Time Today</h3>
                <div className="w-64 h-64 rounded-full border-8 border-slate-100 dark:border-slate-800 flex items-center justify-center">
                    <div className="w-10 h-10 bg-gray-400 rounded" /> {/* Icon placeholder */}
                </div>
             </div>
          </div>
          <div className="flex-1 min-h-[150px] bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/20 dark:to-[#252b39] rounded-2xl border border-green-200 dark:border-green-800/30 p-4">
            <h3 className="text-xs uppercase tracking-wider opacity-60 mb-2">Streak Tracker</h3>
          </div>
        </section>

        {/* Right Column (Blocks/Stats) */}
        <section className="flex flex-col gap-4 w-full lg:w-1/4">
          <div className="h-1/2 bg-white dark:bg-[#252b39] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-4">
            <h3 className="text-xs uppercase tracking-wider opacity-60 mb-2">Today&apos;s Stats</h3>
          </div>
          <div className="h-1/2 bg-white dark:bg-[#252b39] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-4">
            <h3 className="text-xs uppercase tracking-wider opacity-60 mb-2">Call Blocks</h3>
          </div>
        </section>

      </main>

      {/* --- Footer --- */}
      <footer className="flex items-center justify-between px-2 py-1 text-[10px] opacity-50 uppercase tracking-tighter">
        <div>Version 1.0</div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Connected
        </div>
      </footer>
    </div>
  )
}