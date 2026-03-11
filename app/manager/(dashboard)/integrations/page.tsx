'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveLeadDeskAuthString, getLeadDeskAuthString } from '@/apiHandlers/admin';
import { Toast } from '@/components/Toast'; // Assuming this is the path

export default function AdminStats() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for logic
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showKey, setShowKey] = useState<boolean>(false)

  // Initial Data Fetch
  useEffect(() => {
    setMounted(true);
    const fetchExistingKey = async () => {
      try {
        setIsFetching(true);
        const data = await getLeadDeskAuthString();
        // Assuming the data returned has an authString property based on your API
        if (data && data.authString) {
          setApiKey(data.authString);
        }
      } catch (err) {
        setError("Failed to fetch existing configuration");
      } finally {
        setIsFetching(false);
      }
    };

    fetchExistingKey();
  }, []);

  const handleSaveKey = async () => {
    if (!apiKey || isLoading) return;
    
    try {
      setIsLoading(true);
      setError(null);
      await saveLeadDeskAuthString(apiKey);
      // Optional: Show success logic here if you had a success toast
    } catch (err) {
      setError("Failed to save the API key. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0e14] p-6 md:p-12 transition-colors duration-500 font-sans text-slate-800 dark:text-slate-200">
      {/* --- Header --- */}
      <header className="max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">
          Data <span className="text-green-500">Integrations</span>
        </h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">
          Infrastructure / External Services
        </p>
        <div className="h-1 w-12 bg-green-500 mt-6" />
      </header>

      <main className="max-w-3xl mx-auto">
        <div className="space-y-16 relative">
          <h3 className="text-center text-2xl font-bold dark:text-gray-200 text-gray-700 uppercase tracking-[0.2em]">
            LeadDesk Connection Guide
          </h3>
          
          <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-slate-100 dark:bg-white/5" />

          {/* Step 1: The Input Step */}
          <section className="relative pl-12">
            <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white dark:bg-[#0b0e14] border-2 border-green-500 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <span className="text-[10px] font-black text-green-500">01</span>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-bold tracking-tight mb-2">Get your API Key</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Get your LeadDesk API key and <span className="text-slate-900 dark:text-white font-semibold">paste it directly below</span> to authorize the dashboard to fetch data from the LeadDesk API.
              </p>
            </div>

            {/* Input Area */}
            <div className={`max-w-md bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 p-5 rounded-2xl group transition-all focus-within:border-green-500/50 ${isFetching ? 'animate-pulse opacity-60' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3 text-green-500">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3L15.5 7.5z"/>
                  </svg>
                  LeadDesk API Key
                </label>
               
                <div onClick={()=>setShowKey(!showKey)} className='cursor-pointer tracking-wide text-[14px] text-gray-700 dark:text-gray-200'>
                  { showKey ? "hide key" : "show key" }
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type={showKey?"text":"password"}
                  disabled={isFetching || isLoading}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={isFetching ? "Loading..." : "Ex: ld_live_..."}
                  className="flex-1 px-4 py-2.5 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-green-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 disabled:cursor-not-allowed"
                />
                <button 
                  type='button' 
                  onClick={handleSaveKey} 
                  disabled={isLoading || isFetching}
                  className="px-6 py-2.5 bg-slate-900 dark:bg-green-600 hover:bg-black dark:hover:bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : "Save Key"}
                </button>
              </div>
            </div>
          </section>

          {/* Step 2 */}
          <section className="relative pl-12">
            <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white dark:bg-[#0b0e14] border-2 border-slate-200 dark:border-white/10 flex items-center justify-center z-10">
              <span className="text-[10px] font-black text-slate-400">02</span>
            </div>
            <h3 className="font-bold text-sm uppercase tracking-tight mb-2">Configure Webhook</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Generate a new key-pair on the <span onClick={() => router.push("api-keys")} className="text-green-500 font-semibold cursor-pointer underline decoration-green-500/20 underline-offset-4">api keys</span> tab, then provide the next url to the LeadDesk webhook: 
            </p>
            <div className="group relative">
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl font-mono text-[11px] text-slate-600 dark:text-slate-400 break-all pr-12">
                https://[your_public_key]:[your_private_key]@garden-backend-omega.vercel.com/api/leaddesk/webhook
              </div>
              <button 
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-green-500 transition-colors"
                onClick={() => navigator.clipboard.writeText('https://[your_public_key]:[your_private_key]@garden-backend-omega.vercel.com/api/leaddesk/webhook')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              </button>
            </div>
          </section>

          {/* Step 3 */}
          <section className="relative pl-12">
            <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white dark:bg-[#0b0e14] border-2 border-slate-200 dark:border-white/10 flex items-center justify-center z-10">
              <span className="text-[10px] font-black text-slate-400">03</span>
            </div>
            <h3 className="font-bold text-sm uppercase tracking-tight mb-2">Syncing Data</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Once the key is saved and the webhook is active, your calls data will be recorded automatically.
            </p>
          </section>
        </div>
      </main>

      {/* --- Help Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#12161f] w-full max-w-md rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-green-500">
                    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
                  </svg>
                </div>
                <h3 className="font-black uppercase tracking-tight text-xs">API Key Location</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="p-8">
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                To find your key, open your <strong>LeadDesk Admin</strong> account and navigate to <strong>Settings {'>'} API Keys</strong>. If you don't see this option, contact your account administrator for permissions.
              </p>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full py-3 bg-slate-900 dark:bg-white/5 text-white font-bold text-[10px] uppercase tracking-widest rounded-xl"
              >
                Close Information
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {error && <Toast message={error} onClose={() => setError(null)} />}
    </div>
  );
}