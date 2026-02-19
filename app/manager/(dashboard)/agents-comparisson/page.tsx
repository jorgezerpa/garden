'use client';
import React, { useState, useMemo } from 'react';

// Extended Mock Data for Comparison
const initialAgents = [
  { id: 1, name: 'Alex Rivera', talkTime: 420, seeds: 45, conversion: 8.4, consistency: 92, longCallRatio: 45 },
  { id: 2, name: 'Jordan Smith', talkTime: 310, seeds: 28, conversion: 6.2, consistency: 78, longCallRatio: 38 },
  { id: 3, name: 'Sarah Chen', talkTime: 510, seeds: 62, conversion: 11.5, consistency: 98, longCallRatio: 52 },
  { id: 4, name: 'Marcus Thorne', talkTime: 180, seeds: 12, conversion: 3.1, consistency: 45, longCallRatio: 22 },
  { id: 5, name: 'Elena Rodriguez', talkTime: 290, seeds: 31, conversion: 7.2, consistency: 65, longCallRatio: 41 },
  { id: 6, name: 'David Vance', talkTime: 380, seeds: 40, conversion: 8.1, consistency: 84, longCallRatio: 44 },
  { id: 7, name: 'Sasha Ivanov', talkTime: 400, seeds: 38, conversion: 7.8, consistency: 88, longCallRatio: 40 },
  { id: 8, name: 'Liam O’Connor', talkTime: 350, seeds: 33, conversion: 6.9, consistency: 81, longCallRatio: 37 },
  { id: 9, name: 'Chloe Baptiste', talkTime: 440, seeds: 48, conversion: 9.2, consistency: 90, longCallRatio: 48 },
  { id: 10, name: 'Musa Abebe', talkTime: 330, seeds: 29, conversion: 7.5, consistency: 80, longCallRatio: 39 },
];

type SortConfig = {
  key: keyof typeof initialAgents[0] | null;
  direction: 'asc' | 'desc';
};

export default function AgentsComparison() {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'talkTime', direction: 'desc' });

  // Sorting Logic
  const sortedAgents = useMemo(() => {
    let sortableItems = [...initialAgents];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [sortConfig]);

  const requestSort = (key: SortConfig['key']) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  // Helper for sort arrows
  const getSortIndicator = (key: string) => {
    if (sortConfig.key !== key) return <span className="opacity-20">⇅</span>;
    return sortConfig.direction === 'desc' ? ' ↓' : ' ↑';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black uppercase tracking-tight text-slate-800 dark:text-white">
          Performance <span className="text-green-500">Ranking</span>
        </h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">
          Stack-Rank Agents by Key Productivity Drivers
        </p>
      </div>

      {/* Excel Style Table Container */}
      <div className="bg-white dark:bg-[#1e2330] rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
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
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {sortedAgents.map((agent, index) => (
                <tr 
                  key={agent.id} 
                  className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group"
                >
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tactical Insight Footer */}
      <div className="flex gap-4 p-6 bg-green-500/5 rounded-3xl border border-green-500/10">
        <div className="w-10 h-10 rounded-2xl bg-green-500 flex items-center justify-center text-white shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase text-green-600 tracking-widest mb-1">Comparative Analytics</h4>
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
            Sorting by **Consistency Score** reveals your most reliable long-term assets. 
            Cross-referencing **Talk Time** with **Long Call Ratio** identifies agents who are working hard vs. agents who are working effectively.
          </p>
        </div>
      </div>
    </div>
  );
}