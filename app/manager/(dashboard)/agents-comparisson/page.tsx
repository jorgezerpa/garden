'use client';
import { getAgentsComparison } from '@/apiHandlers/dataVis';
import React, { useState, useEffect, useCallback } from 'react';
import { Spinner } from '@/components/Spinner';
import { Toast } from '@/components/Toast';

const initialLoading = {
  isFetchingTable: false,
};

type SortConfig = {
  key: 'talkTime' | 'seeds' | 'conversion' | 'consistency' | 'longCallRatio' | null;
  direction: 'asc' | 'desc';
};

export default function AgentsComparison() {
  const [loading, setLoading] = useState(initialLoading);
  const [toastError, setToastError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'talkTime', direction: 'desc' });
  const [sortedAgents, setSortedAgents] = useState<{ id: number, name: string, talkTime: number, seeds: number, conversion: number, consistency: number, longCallRatio: number }[]>([]);
  const [fromDate, setFromDate] = useState<string>(new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0]);
  const [toDate, setToDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const fetchComparison = useCallback(async () => {
    setLoading({ isFetchingTable: true });
    try {
      const response = await getAgentsComparison(fromDate, toDate, { sortConfig, agents: [] });
      setSortedAgents(response);
    } catch (error) {
      setToastError("Failed to load performance ranking data.");
    } finally {
      setLoading({ isFetchingTable: false });
    }
  }, [fromDate, toDate, sortConfig]);

  useEffect(() => {
    fetchComparison();
  }, [fetchComparison]);

  const requestSort = (key: SortConfig['key']) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: string) => {
    if (sortConfig.key !== key) return <span className="opacity-20">⇅</span>;
    return sortConfig.direction === 'desc' ? ' ↓' : ' ↑';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 p-4 font-sans">
      
      {toastError && <Toast message={toastError} onClose={() => setToastError(null)} />}

      <div>
        <h2 className="text-xl font-black uppercase tracking-tight text-slate-800 dark:text-white">
          Performance <span className="text-green-500">Ranking</span>
        </h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">
          Stack-Rank Agents by Key Productivity Drivers
        </p>
      </div>

      <div className="flex items-center gap-3 bg-slate-50 dark:bg-black/20 p-2 rounded-2xl border border-slate-200 dark:border-white/10 w-fit">
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

      {/* Visualizing these performance metrics in a ranked table allows for quick identification of high-performers. */}
      
      
      <div className="bg-white dark:bg-[#1e2330] rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-black/20 border-b border-slate-100 dark:border-white/5">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Agent</th>
                {[
                  { id: 'talkTime', label: 'Talk Time (min)' },
                  { id: 'seeds', label: 'Seeds' },
                  { id: 'conversion', label: 'Conv %' },
                  { id: 'consistency', label: 'Score' },
                  { id: 'longCallRatio', label: 'Long Call %' }
                ].map((col) => (
                  <th 
                    key={col.id}
                    onClick={() => requestSort(col.id as any)}
                    className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer hover:text-green-500 transition-colors group"
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <span className="text-green-500 font-bold">{getSortIndicator(col.id)}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 relative">
              {loading.isFetchingTable ? (
                <tr>
                  <td colSpan={6} className="p-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Spinner size="w-10 h-10" color="text-green-500" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recalculating Ranks...</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedAgents.map((agent, index) => (
                  <tr key={agent.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-300 w-4">#{index + 1}</span>
                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-[11px] font-black text-green-500">
                          {agent.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-xs font-bold dark:text-slate-200">{agent.name}</span>
                      </div>
                    </td>
                    <td className="p-6 text-xs font-bold dark:text-white">{agent.talkTime}m</td>
                    <td className="p-6 text-xs font-bold dark:text-white">{agent.seeds}</td>
                    <td className="p-6">
                      <span className={`text-xs font-black ${agent.conversion > 8 ? 'text-green-500' : 'text-slate-400'}`}>
                        {agent.conversion}%
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                         <div className="w-12 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full" 
                              style={{ width: `${agent.consistency}%` }}
                            />
                         </div>
                         <span className="text-[10px] font-black dark:text-slate-400">{agent.consistency}</span>
                      </div>
                    </td>
                    <td className="p-6">
                       <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-[10px] font-black dark:text-slate-300">
                        {agent.longCallRatio}%
                       </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-4 p-6 bg-green-500/5 rounded-3xl border border-green-500/10">
        <div className="w-10 h-10 rounded-2xl bg-green-500 flex items-center justify-center text-white shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase text-green-600 tracking-widest mb-1">Comparative Analytics</h4>
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
            Sorting by **Consistency Score** reveals your most reliable assets.
          </p>
        </div>
      </div>
    </div>
  );
}