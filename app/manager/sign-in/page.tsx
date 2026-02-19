'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

export default function ManagerAuth() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isLogin, setIsLogin] = useState(true)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0f1219] flex items-center justify-center p-6 transition-colors duration-500 font-sans relative overflow-hidden">
      
      {/* Structural Background Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-green-500/20 to-transparent" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-green-500/10 to-transparent" />
      </div>

      <div className="w-full max-w-[480px] relative z-10">
        
        {/* --- Top Branding --- */}
        <div className="flex justify-between items-end mb-6 px-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-green-600 dark:text-green-400">Executive Tier</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tighter text-slate-800 dark:text-white">Garden Oversight</h1>
          </div>
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-sm hover:scale-105 transition-all"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        {/* --- Main Bento Card --- */}
        <div className="bg-white dark:bg-[#1e2330]/90 backdrop-blur-3xl border border-slate-200 dark:border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden">
          
          {/* Progress Visual */}
          <div className="h-1.5 w-full bg-slate-100 dark:bg-black/20">
            <div className={`h-full bg-green-500 transition-all duration-700 shadow-[0_0_10px_#22c55e] ${isLogin ? 'w-1/2' : 'w-full'}`} />
          </div>

          <div className="p-8 md:p-10">
            {/* Mode Switcher */}
            <div className="flex bg-slate-100 dark:bg-black/20 p-1 rounded-2xl mb-8">
                <button 
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isLogin ? 'bg-white dark:bg-white/10 text-slate-800 dark:text-white shadow-sm' : 'text-slate-400'}`}
                >
                  Log In
                </button>
                <button 
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isLogin ? 'bg-white dark:bg-white/10 text-slate-800 dark:text-white shadow-sm' : 'text-slate-400'}`}
                >
                  Register
                </button>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              {/* Only visible on Register/Sign In */}
              {!isLogin && (
                 <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Enterprise Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:border-green-500/50 transition-all"
                    placeholder="Global Harvest Inc."
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:border-green-500/50 transition-all font-medium"
                  placeholder="admin@enterprise.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                <input 
                  type="password" 
                  className="w-full bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:border-green-500/50 transition-all font-medium"
                  placeholder="••••••••••••"
                />
              </div>

              <button className="w-full py-4.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-green-500 dark:hover:bg-green-500 dark:hover:text-white transition-all shadow-xl mt-4">
                {isLogin ? 'Login' : 'SignUp'}
              </button>
            </form>
          </div>

          {/* Bottom Data Ribbon */}
          <div className="bg-slate-50/50 dark:bg-black/20 px-8 py-5 border-t border-slate-100 dark:border-white/5 flex justify-end items-center">
            {/* <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">Server Cluster</span>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 italic underline decoration-green-500/40">US-EAST-G01</span>
            </div> */}
            <div className="text-right">
                <span className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">Auth Status</span>
                <div className="flex items-center gap-1.5 justify-end">
                    <span className="text-[10px] font-bold text-green-500">READY</span>
                    <div className="w-1 h-1 rounded-full bg-green-500" />
                </div>
            </div>
          </div>
        </div>

        {/* Technical Footer */}
        <div className="mt-8 flex justify-center gap-8 opacity-20">
          {['Security Audit', 'v2.4.0'].map(item => (
            <span key={item} className="text-[8px] font-black uppercase tracking-widest text-slate-500">{item}</span>
          ))}
        </div>
      </div>
    </div>
  )
}