'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

export default function SignIn() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ email: '', password: '', name: '' })

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#1a1f2b] flex items-center justify-center p-6 transition-colors duration-500 font-sans selection:bg-green-500/30 relative overflow-hidden">
      
      {/* Background Decorative Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-green-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-[420px] relative z-10">
        {/* --- Top Branding & Theme Toggle --- */}
        <div className="flex justify-between items-center mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-lg shadow-green-500/20" />
            <h1 className="font-bold text-xl tracking-tight text-slate-800 dark:text-white">Sales Garden</h1>
          </div>
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-green-500/10 transition-all active:scale-95 shadow-sm"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        {/* --- Main Card --- */}
        <div className="bg-white dark:bg-[#252b39]/80 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(0,0,0,0.4)] rounded-[2.5rem] p-8 md:p-10 transition-all duration-500">
          
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
              {isLogin ? 'Welcome Back' : 'Create Garden'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
              {isLogin ? 'Enter your seeds to continue growing.' : 'Start your sales journey with us today.'}
            </p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Sarah Green"
                  className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-green-500/50 transition-all placeholder:opacity-30"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="sarah@garden.com"
                className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-green-500/50 transition-all placeholder:opacity-30"
              />
            </div>

            <div className="space-y-1.5 pb-2">
              <div className="flex justify-between">
                <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1">Password</label>
                {isLogin && <span className="text-[10px] font-bold text-green-500 cursor-pointer hover:underline">Forgot?</span>}
              </div>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-green-500/50 transition-all placeholder:opacity-30"
              />
            </div>

            <button className="w-full py-4 rounded-2xl bg-green-500 hover:bg-green-400 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-green-500/30 transition-all active:scale-[0.98] mt-4">
              {isLogin ? 'Sign In' : 'Begin Harvest'}
            </button>
          </form>

          {/* --- Switch Mode --- */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-green-500 transition-colors"
            >
              {isLogin ? (
                <>Don't have an account? <span className="text-green-500 font-bold">Sign Up</span></>
              ) : (
                <>Already have a garden? <span className="text-green-500 font-bold">Log In</span></>
              )}
            </button>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-[10px] uppercase tracking-[0.3em] font-black opacity-30 text-slate-500">
          Encrypted Garden Access 1.0
        </p>
      </div>
    </div>
  )
}