'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  saveLeadDeskAuthString, 
  getLeadDeskAuthString, 
  saveLeadDeskEventsIds, 
  getLeadDeskEventsIds 
} from '@/apiHandlers/admin';
import { Toast } from '@/components/Toast';

// Helper Component for the dynamic ID lists
const IdListInput = ({ 
  label, 
  ids, 
  setIds, 
  placeholder 
}: { 
  label: string, 
  ids: string[], 
  setIds: (ids: string[]) => void, 
  placeholder: string 
}) => {
  const addId = () => setIds([...ids, '']);
  const updateId = (index: number, val: string) => {
    const newIds = [...ids];
    newIds[index] = val;
    setIds(newIds);
  };
  const removeId = (index: number) => setIds(ids.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
        {label}
      </label>
      {ids.map((id, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={id}
            onChange={(e) => updateId(index, e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-4 py-2 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-green-500 transition-all"
          />
          <button 
            onClick={() => removeId(index)}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      ))}
      <button
        onClick={addId}
        className="text-[10px] font-bold text-green-500 uppercase tracking-wider flex items-center gap-1 hover:opacity-80 transition-opacity"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Add New ID
      </button>
    </div>
  );
};

export default function AdminStats() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [apiKey, setApiKey] = useState('');
  
  // New State for Event IDs
  const [seedEventIds, setSeedEventIds] = useState<string[]>([]);
  const [saleEventIds, setSaleEventIds] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isEventsLoading, setIsEventsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showKey, setShowKey] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const [authData, eventData] = await Promise.all([
          getLeadDeskAuthString(),
          getLeadDeskEventsIds()
        ]);

        if (authData?.authString) setApiKey(authData.authString);
        if (eventData) {
          setSeedEventIds(eventData.seedEventIds || []);
          setSaleEventIds(eventData.saleEventIds || []);
        }
      } catch (err) {
        setError("Failed to fetch existing configuration");
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveKey = async () => {
    if (!apiKey || isLoading) return;
    try {
      setIsLoading(true);
      setError(null);
      await saveLeadDeskAuthString(apiKey);
    } catch (err) {
      setError("Failed to save the API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEventIds = async () => {
    try {
      setIsEventsLoading(true);
      setError(null);
      // Clean up empty strings before saving
      const cleanSeeds = seedEventIds.filter(id => id.trim() !== '');
      const cleanSales = saleEventIds.filter(id => id.trim() !== '');
      await saveLeadDeskEventsIds(cleanSeeds, cleanSales);
    } catch (err) {
      setError("Failed to save Event IDs.");
    } finally {
      setIsEventsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0e14] p-6 md:p-12 transition-colors duration-500 font-sans text-slate-800 dark:text-slate-200">
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

          {/* Step 1: API Key */}
          <section className="relative pl-12">
            <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white dark:bg-[#0b0e14] border-2 border-green-500 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <span className="text-[10px] font-black text-green-500">01</span>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-bold tracking-tight mb-2">Authorize LeadDesk</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Enter your API key to allow the dashboard to communicate with LeadDesk.
              </p>
            </div>

            <div className={`max-w-md bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 p-5 rounded-2xl ${isFetching ? 'animate-pulse' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">API Key</label>
                <button onClick={()=>setShowKey(!showKey)} className='text-[12px] text-slate-500 hover:text-green-500 transition-colors'>
                  { showKey ? "Hide" : "Show" }
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type={showKey?"text":"password"}
                  disabled={isFetching || isLoading}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="ld_live_..."
                  className="flex-1 px-4 py-2.5 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-green-500 transition-all"
                />
                <button onClick={handleSaveKey} disabled={isLoading || isFetching} className="px-6 py-2.5 bg-slate-900 dark:bg-green-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black dark:hover:bg-green-500 transition-all disabled:opacity-50">
                  {isLoading ? 'Saving...' : 'Save Key'}
                </button>
              </div>
            </div>
          </section>

          {/* Step 2: NEW - Event IDs */}
          <section className="relative pl-12">
            <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white dark:bg-[#0b0e14] border-2 border-green-500 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <span className="text-[10px] font-black text-green-500">02</span>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-bold tracking-tight mb-2">Define Event IDs</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Specify which LeadDesk event IDs should be categorized as <span className="text-slate-900 dark:text-white font-semibold">Seeds</span> or <span className="text-slate-900 dark:text-white font-semibold">Sales</span>.
              </p>
            </div>

            <div className={`max-w-md space-y-8 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 p-6 rounded-2xl ${isFetching ? 'animate-pulse' : ''}`}>
              <IdListInput 
                label="Seed Event IDs" 
                ids={seedEventIds} 
                setIds={setSeedEventIds} 
                placeholder="Ex: 101" 
              />
              <div className="h-px bg-slate-200 dark:bg-white/5" />
              <IdListInput 
                label="Sale Event IDs" 
                ids={saleEventIds} 
                setIds={setSaleEventIds} 
                placeholder="Ex: 205" 
              />
              <button 
                onClick={handleSaveEventIds}
                disabled={isEventsLoading || isFetching}
                className="w-full py-3 bg-green-600 hover:bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
              >
                {isEventsLoading ? 'Saving Events...' : 'Update Event Configuration'}
              </button>
            </div>
          </section>

          {/* Step 3: Webhook */}
          <section className="relative pl-12">
            <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white dark:bg-[#0b0e14] border-2 border-slate-200 dark:border-white/10 flex items-center justify-center z-10">
              <span className="text-[10px] font-black text-slate-400">03</span>
            </div>
            <h3 className="font-bold text-sm uppercase tracking-tight mb-2">Configure Webhook</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Generate a new key-pair on the <span onClick={() => router.push("api-keys")} className="text-green-500 font-semibold cursor-pointer underline decoration-green-500/20 underline-offset-4">api keys</span> tab, then provide this URL to LeadDesk:
            </p>
            <div className="group relative">
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl font-mono text-[11px] text-slate-600 dark:text-slate-400 break-all pr-12">
                https://[your_public_key]:[your_private_key]@garden-api.vercel.app/api/leaddesk/webhook
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

          {/* Step 4: Syncing */}
          <section className="relative pl-12">
            <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white dark:bg-[#0b0e14] border-2 border-slate-200 dark:border-white/10 flex items-center justify-center z-10">
              <span className="text-[10px] font-black text-slate-400">04</span>
            </div>
            <h3 className="font-bold text-sm uppercase tracking-tight mb-2">Syncing Data</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Once the keys and events are saved, your calls data will be recorded and categorized automatically.
            </p>
          </section>
        </div>
      </main>

      {error && <Toast message={error} onClose={() => setError(null)} />}
    </div>
  );
}