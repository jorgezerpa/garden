'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation' // For redirect
import { registerCompany, loginUser, logoutUser } from '@/apiHandlers/auth'
import jwt from 'jsonwebtoken';

export default function ManagerAuth() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false) // Start as false
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null)

  // --- Form State ---
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [enterpriseName, setEnterpriseName] = useState('')
  const [adminName, setAdminName] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})


    useEffect(() => {
      // if no token, stay
      const token = localStorage.getItem('jwt');
      if(!token) return

      // if token, get role
      const decoded = jwt.decode(token) as any;
      
      // if role is not an admin or manager, redirect to sign in
      if(!decoded.role || (decoded.role !== "MAIN_ADMIN" && decoded.role !== "MANAGER")) {
        logoutUser("/manager/sign-in")
        return 
      }

      // if valid role, redirect to manager dashboard
      router.push('/manager/');      
    }, [router]);

    

  // Auto-hide toast after 4 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  useEffect(() => {
    setEmail('')
    setPassword('')
    setEnterpriseName('')
    setAdminName('')
    setErrors({})
    setToast(null)
  }, [isLogin])

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    const newErrors: { [key: string]: string } = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) newErrors.email = 'Invalid email format'
    if (password.length < 6) newErrors.password = 'Minimum 6 characters required'

    if (!isLogin) {
      if (enterpriseName.trim().length < 3) newErrors.enterprise = 'Enterprise name too short'
      if (adminName.trim().length < 2) newErrors.adminName = 'Name is required'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      try {
        setIsLoading(true)
        if (isLogin) {
          await loginUser({ email, password })
        } else {
          await registerCompany({ 
            admin_email: email, 
            admin_name: adminName, 
            password, 
            companyName: enterpriseName 
          })
          await loginUser({ email, password })
        }
        router.push('/manager')
      } catch (error: any) {
        setIsLoading(false)
        setToast({ 
          message: error?.message || 'Authentication failed. Please check your credentials.', 
          type: 'error' 
        })
      }
    }
  }


  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0f1219] flex items-center justify-center p-6 transition-colors duration-500 font-sans relative overflow-hidden">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right fade-in duration-300">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl ${
            toast.type === 'error' 
              ? 'bg-red-500/10 border-red-500/20 text-red-500' 
              : 'bg-green-500/10 border-green-500/20 text-green-500'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full animate-pulse ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`} />
              <span className="text-xs font-black uppercase tracking-widest">{toast.message}</span>
            </div>
          </div>
        </div>
      )}

      {/* Background Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-green-500/20 to-transparent" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-green-500/10 to-transparent" />
      </div>

      <div className="w-full max-w-[480px] relative z-10">
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

        <div className="bg-white dark:bg-[#1e2330]/90 backdrop-blur-3xl border border-slate-200 dark:border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden">
          <div className="h-1.5 w-full bg-slate-100 dark:bg-black/20">
            <div className={`h-full bg-green-500 transition-all duration-700 shadow-[0_0_10px_#22c55e] ${isLogin ? 'w-1/2' : 'w-full'}`} />
          </div>

          <div className="p-8 md:p-10">
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

            <form className="space-y-5" onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Enterprise Name</label>
                    <input 
                      type="text" 
                      value={enterpriseName}
                      onChange={(e) => setEnterpriseName(e.target.value)}
                      className={`w-full bg-slate-50 dark:text-gray-100 dark:bg-black/30 border ${errors.enterprise ? 'border-red-500/50' : 'border-slate-200 dark:border-white/5'} rounded-2xl px-5 py-4 text-sm outline-none focus:border-green-500/50 transition-all`}
                      placeholder="Global Harvest Inc."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Main Manager Name</label>
                    <input 
                      type="text" 
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      className={`w-full bg-slate-50 dark:text-gray-100 dark:bg-black/30 border ${errors.adminName ? 'border-red-500/50' : 'border-slate-200 dark:border-white/5'} rounded-2xl px-5 py-4 text-sm outline-none focus:border-green-500/50 transition-all`}
                      placeholder="Jane Doe"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-slate-50 dark:text-gray-100 dark:bg-black/30 border ${errors.email ? 'border-red-500/50' : 'border-slate-200 dark:border-white/5'} rounded-2xl px-5 py-4 text-sm outline-none focus:border-green-500/50 transition-all font-medium`}
                  placeholder="admin@enterprise.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-slate-50 dark:text-gray-100 dark:bg-black/30 border ${errors.password ? 'border-red-500/50' : 'border-slate-200 dark:border-white/5'} rounded-2xl px-5 py-4 text-sm outline-none focus:border-green-500/50 transition-all font-medium`}
                  placeholder="••••••••••••"
                />
              </div>

              <div className="pt-4">
                {isLoading ? (
                  <div className="w-full h-[52px] bg-slate-100 dark:bg-white/5 rounded-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-green-500/20 animate-pulse" />
                    <div className="h-full bg-green-500 animate-[loading_2s_ease-in-out_infinite] w-1/3 shadow-[0_0_20px_#22c55e]" />
                  </div>
                ) : (
                  <button 
                    type="submit"
                    className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-green-500 dark:hover:bg-green-500 dark:hover:text-white transition-all shadow-xl"
                  >
                    {isLogin ? 'Login' : 'SignUp'}
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="bg-slate-50/50 dark:bg-black/20 px-8 py-5 border-t border-slate-100 dark:border-white/5 flex justify-end items-center">
            <div className="text-right">
                <span className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">Auth Status</span>
                <div className="flex items-center gap-1.5 justify-end">
                    <span className="text-[10px] font-bold text-green-500">READY</span>
                    <div className="w-1 h-1 rounded-full bg-green-500" />
                </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  )
}