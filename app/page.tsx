'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { loginUser, logoutUser } from '@/apiHandlers/auth'
import { useRouter } from 'next/navigation'
import jwt from 'jsonwebtoken';

export default function SignIn() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '', name: '' })
  
  // New State for Validation
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    // if no token, stay
    const token = localStorage.getItem('jwt');
    if(!token) return
    // if token, get role
    const decoded = jwt.decode(token) as any;
    
    // if role is not an agent, return 
    if(!decoded.role || (decoded.role !== "AGENT")) {
      logoutUser("/")
      return 
    }
    // if valid role, redirect to manager dashboard
    router.push('/agent-dashboard');      
  }, [router]);
  

  // Clear error when user retypes
  useEffect(() => {
    if (error) setError(null)
  }, [formData.email, formData.password])

  if (!mounted) return null

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  }

  const handleSubmit = async () => {
    // 1. Validate Email Format
    if (!validateEmail(formData.email)) {
      setError("Please enter a valid garden email")
      return
    }

    // 2. Validate Password Presence
    if (formData.password.length < 1) {
      setError("Password is required to enter")
      return
    }

    setIsLoading(true)
    try {
      await loginUser({ email: formData.email, password: formData.password })
      router.push('/agent-dashboard')
    } catch (err: any) {
      setError(err?.response?.data?.message || "Access Denied: Invalid Credentials")
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

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
              Welcome Back
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Enter your seeds to continue growing.
            </p>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1">Email Address</label>
              <input 
                onChange={(e)=>setFormData(curr=> ({ ...curr, email: e.target.value }))}
                value={formData.email}
                type="text" 
                placeholder="sarah@garden.com"
                className={`dark:text-gray-200 w-full bg-slate-50 dark:bg-black/20 border rounded-2xl px-5 py-3.5 text-sm outline-none transition-all placeholder:opacity-30 ${
                  error && !validateEmail(formData.email) ? 'border-red-500/50 bg-red-500/5' : 'border-slate-200 dark:border-white/5 focus:border-green-500/50'
                }`}
              />
            </div>

            <div className="space-y-1.5 pb-2">
              <div className="flex justify-between">
                <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1">Password</label>
              </div>
              <input 
                onChange={(e)=>setFormData(curr=> ({ ...curr, password: e.target.value }))}
                value={formData.password}
                type="password" 
                placeholder="••••••••"
                className={`dark:text-gray-200 w-full bg-slate-50 dark:bg-black/20 border rounded-2xl px-5 py-3.5 text-sm outline-none transition-all placeholder:opacity-30 ${
                  error && formData.password.length < 1 ? 'border-red-500/50 bg-red-500/5' : 'border-slate-200 dark:border-white/5 focus:border-green-500/50'
                }`}
              />
            </div>

            {/* Error UI Section */}
            {error && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 py-2 px-1">
                <p className="text-[10px] font-black uppercase tracking-tighter text-red-500 dark:text-red-200 bg-red-500/10 py-2 px-3 rounded-lg border border-red-500/20 inline-block">
                  {error}
                </p>
              </div>
            )}

            <button 
              disabled={isLoading}
              type='submit' 
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg transition-all active:scale-[0.98] mt-4 flex justify-center items-center ${
                isLoading 
                ? 'bg-slate-400 cursor-not-allowed opacity-70' 
                : 'bg-green-500 hover:bg-green-400 text-white shadow-green-500/30'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Login'}
            </button>
          </form>
          
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-[10px] uppercase tracking-[0.3em] font-black opacity-30 text-slate-500">
          Encrypted Garden Access 1.0
        </p>
      </div>
    </div>
  )
}