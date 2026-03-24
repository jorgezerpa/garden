'use client'
import { useState, useEffect } from 'react';
import { DailyActivityLineCharts } from '@/components/manager/DailyActivityLineChart';
import { PerBlockBarChart } from '@/components/manager/PerBlockBarChart';
import { CallDurationHistogram } from '@/components/manager/CallsDurationHistogram';
import { SeedHeatmap } from '@/components/manager/SeedsHeatmap';
import { ConversionFunnelChart } from '@/components/manager/ConversionFunnelChart';
import { ConsistencyGraph } from '@/components/manager/ConsistencyGraph';
import { getAgentsList } from '@/apiHandlers/admin';
import { getLastCallDate } from '@/apiHandlers/dataVis';
import { GeneralInsights } from '@/components/manager/GeneralInsights';
import { Spinner } from '@/components/Spinner';
import { getUTCISOStringEndOfDay, getUTCISOStringStartOfDay } from '@/utils/Date';

export default function AdminStats() {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'group' | 'user'>('group');
  const [searchQuery, setSearchQuery] = useState('');
  //
  const [agents, setAgents] = useState<{ id: number, name: string, email:string}[]>([])
  const [agentsSelected, setAgentsSelected] = useState<number[]>([])
  //
  const [triggerPerAgentSearch, setTriggerPerAgentSearch] = useState(false)
  const [enableSearchButton, setEnableSearchButton] = useState(false)

  const [fromDate, setFromDate] = useState<string|null>(null)
  const [toDate, setToDate] = useState<string|null>(null)
  const [fetchingAgents, setFetchingAgents] = useState<boolean>(false)

  useEffect(() => setMounted(true), []);
  
  useEffect(()=>{
    (async()=>{
      if(viewMode=="user") {
        try {
          setFetchingAgents(true)
          const response = await getAgentsList(1,200)
          setAgents(response.data || [])
        } catch (error) {
          
        }
        finally {
          setFetchingAgents(false)
        }
      }
    })()
  }, [viewMode])

  useEffect(() => {
    (async () => {
      try {
        const { lastCallDate:lcd } = await getLastCallDate()
        setFromDate(new Date(lcd).toISOString().split('T')[0])
        setToDate(new Date(lcd).toISOString().split('T')[0])
      } catch (error) {
        console.log(error)
        setFromDate(new Date().toISOString().split('T')[0])
        setToDate(new Date().toISOString().split('T')[0])
      }
    })();
  }, []);
    

  const handleAgentSelection = (agentId: number) => {
    setEnableSearchButton(true)
    setAgentsSelected(curr => curr.includes(agentId) ? curr.filter(id => id!=agentId) : [...curr, agentId])
  }
  
  const handleClearAgentSelection = () => {
    setAgentsSelected([])
    setEnableSearchButton(true)
  }

  const handleTriggerPerAgentSearch = () => {
    setTriggerPerAgentSearch(curr=>!curr)
    setEnableSearchButton(false)
  }

  if (!mounted) return null;
  if (!fromDate || !toDate) return null;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0f1219] p-4 md:p-8 transition-colors duration-500 font-sans text-slate-800 dark:text-slate-200">
      
      {/* --- 1. Header --- */}
      <header className="flex flex-col gap-6 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase">
              Data <span className="text-green-500">Visualization</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">
              Behavioral Analytics Engine
            </p>
          </div>

          {/* Export Report Button */}
          <button className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm hover:border-green-500/50 hover:text-green-500 transition-all active:scale-95 group">
            <svg 
              className="w-4 h-4 text-slate-400 group-hover:text-green-500 transition-colors" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-widest">Export Report</span>
          </button>
        </div>

        {/* --- 2. Dual Selectors Section --- */}
        <div className="flex flex-wrap gap-4 justify-between items-center bg-white dark:bg-[#1e2330]/80 backdrop-blur-xl p-4 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm">
          {/* View Mode Toggle */}
          <div className="flex bg-slate-100 dark:bg-black/20 p-1 rounded-xl">
            {(['group', 'user'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setViewMode(mode)
                  setEnableSearchButton(false)
                  setAgentsSelected([])
                }}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  viewMode === mode ? 'bg-white dark:bg-white/10 text-green-500 shadow-sm' : 'text-slate-400'
                }`}
              >
                {mode === 'group' ? 'General Group' : 'Per Agents'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 bg-slate-50 dark:bg-black/20 p-2 rounded-2xl border border-slate-200 dark:border-white/10 ">
            <div className="flex flex-col px-2">
              <label className="text-[9px] font-black text-slate-400 uppercase">From</label>
              <input 
                type="date" 
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="bg-transparent text-xs font-bold focus:outline-none dark:text-white cursor-pointer"
              />
            </div>
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10" />
            <div className="flex flex-col px-2">
              <label className="text-[9px] font-black text-slate-400 uppercase">To</label>
              <input 
                type="date" 
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="bg-transparent text-xs font-bold focus:outline-none dark:text-white cursor-pointer"
              />
            </div>
          </div>

        </div>
      </header>

      {/* --- 3. Per-User Selection Interface --- */}
      {viewMode === 'user' && (
        <section className="mb-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="relative max-w-md mx-auto md:mx-0">
            <input 
              type="text"
              placeholder="Search user by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#1e2330] border border-slate-200 dark:border-white/10 rounded-2xl px-12 py-4 text-sm outline-none focus:border-green-500/50 transition-all shadow-sm"
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
          </div>

          <div>
            <p onClick={agentsSelected.length>0 ? handleClearAgentSelection : ()=>{}} className={`${agentsSelected.length==0 ? "opacity-35 cursor-not-allowed" : "cursor-pointer"} text-sm text-gray-800 dark:text-green-500 tracking-widest font-bold`}>Clear search</p>
          </div>

          {
            fetchingAgents && (
                <div className='w-full flex justify-center items-center py-3'>
                  <Spinner size="w-10 h-10" color="text-green-500" />
                </div>
              )
          }
          {
            !fetchingAgents && (
              <div className="bg-slate-200/30 dark:bg-black/20 rounded-[2.5rem] p-6 border border-slate-200 dark:border-white/5">
                <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x">
                  <div className="grid grid-rows-3 grid-flow-col gap-4">
                    {agents.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).map((user) => (
                      <div key={user.id} className="w-64 snap-start bg-white dark:bg-[#1e2330] p-4 rounded-[1.5rem] border border-slate-200 dark:border-white/10 shadow-sm hover:border-green-500/50 transition-all group">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-slate-800 dark:text-white truncate">{user.name}</span>
                            <span className="text-[10px] text-slate-400 truncate">{user.email}</span>
                          </div>
                          <input onChange={()=>handleAgentSelection(user.id)} checked={agentsSelected.includes(user.id)} type="checkbox" className="accent-green-500 w-4 h-4 rounded-md cursor-pointer" />
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-50 dark:border-white/5 flex justify-between items-center">
                          <span className="text-[8px] font-black uppercase text-green-500 tracking-widest">Select Agent</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          }

        </section>
      )}

      {
        viewMode == "user" && (
          <div className="flex flex-col items-center justify-center mb-12 mt-4 space-y-4">
            <button disabled={!enableSearchButton} onClick={handleTriggerPerAgentSearch} className={`${enableSearchButton?"hover:scale-105":"opacity-35"} relative group px-10 py-3 bg-green-500 hover:bg-green-600 text-white rounded-4xl transition-all active:scale-95 shadow-[0_20px_40px_-12px_rgba(34,197,94,0.4)] overflow-hidden`}>
              {/* Pulsing Aura Effect */}
              <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-full" />
              
              <div className="relative flex items-center gap-4">
                <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-xs font-black uppercase tracking-[0.3em]">Execute search per agents</span>
              </div>
            </button>
          </div>
        )
      }

      {/* --- 5. Data Dashboard --- */}
      <main className="space-y-6">
        {
          (fromDate && toDate) && (
            <>
              <GeneralInsights fromDate={getUTCISOStringStartOfDay(fromDate)} toDate={getUTCISOStringEndOfDay(toDate)} triggerPerAgentSearch={triggerPerAgentSearch} agentsSelected={agentsSelected} />
              <DailyActivityLineCharts fromDate={getUTCISOStringStartOfDay(fromDate)} toDate={getUTCISOStringEndOfDay(toDate)} triggerPerAgentSearch={triggerPerAgentSearch} agentsSelected={agentsSelected} />
              <PerBlockBarChart fromDate={getUTCISOStringStartOfDay(fromDate)} toDate={getUTCISOStringEndOfDay(toDate)} triggerPerAgentSearch={triggerPerAgentSearch} agentsSelected={agentsSelected} /> 
              <CallDurationHistogram fromDate={getUTCISOStringStartOfDay(fromDate)} toDate={getUTCISOStringEndOfDay(toDate)} triggerPerAgentSearch={triggerPerAgentSearch} agentsSelected={agentsSelected} />
              <SeedHeatmap fromDate={getUTCISOStringStartOfDay(fromDate)} toDate={getUTCISOStringEndOfDay(toDate)} triggerPerAgentSearch={triggerPerAgentSearch} agentsSelected={agentsSelected} />
              <ConversionFunnelChart fromDate={getUTCISOStringStartOfDay(fromDate)} toDate={getUTCISOStringEndOfDay(toDate)} triggerPerAgentSearch={triggerPerAgentSearch} agentsSelected={agentsSelected} />
              <ConsistencyGraph fromDate={getUTCISOStringStartOfDay(fromDate)} toDate={getUTCISOStringEndOfDay(toDate)} triggerPerAgentSearch={triggerPerAgentSearch} agentsSelected={agentsSelected} />
            </>
          )
        }
      </main>

      <footer className="mt-8 flex justify-between px-4 opacity-30 text-[9px] font-black uppercase tracking-widest border-t border-slate-200 dark:border-white/5 pt-8">
        <span>Performance Intelligence Layer v1.0</span>
        <span>Operational Integrity: High</span>
      </footer>
    </div>
  );
}