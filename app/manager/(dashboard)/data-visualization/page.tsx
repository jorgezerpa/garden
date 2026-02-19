'use client'
import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, FunnelChart, Funnel, LabelList 
} from 'recharts';
import { DailyActivityLineChart } from '@/components/manager/DailyActivityLineChart';
import { PerBlockBarChart } from '@/components/manager/PerBlockBarChart';
import { CallDurationHistogram } from '@/components/manager/CallsDurationHistogram';
import { SeedHeatmap } from '@/components/manager/SeedsHeatmap';
import { ConversionFunnelChart } from '@/components/manager/ConversionFunnelChart';
import { ConsistencyGraph } from '@/components/manager/ConsistencyGraph';

// --- Mock Data ---
const weeklyData = [
  { day: 'Mon', talkTime: 320, seeds: 45 },
  { day: 'Tue', talkTime: 400, seeds: 52 },
  { day: 'Wed', talkTime: 380, seeds: 48 },
  { day: 'Thu', talkTime: 450, seeds: 61 },
  { day: 'Fri', talkTime: 300, seeds: 38 },
];

const users = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  name: `Agent ${i + 1}`,
  email: `agent${i + 1}@garden.com`,
  status: 'Active'
}));

export default function AdminStats() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'group' | 'user'>('group');
  const [timeRange, setTimeRange] = useState('Last 7 Days');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0f1219] p-4 md:p-8 transition-colors duration-500 font-sans text-slate-800 dark:text-slate-200">
      
      {/* --- 1. Header & Primary Navigation --- */}
      <header className="flex flex-col gap-6 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase">Performance Intelligence</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Behavioral Analytics Engine </p>
          </div>
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-sm hover:scale-105 transition-all"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        {/* --- 2. Dual Selectors Section --- */}
        <div className="flex flex-wrap gap-4 items-center bg-white dark:bg-[#1e2330]/80 backdrop-blur-xl p-4 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm">
          {/* View Mode Toggle */}
          <div className="flex bg-slate-100 dark:bg-black/20 p-1 rounded-xl">
            {(['group', 'user'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  viewMode === mode ? 'bg-white dark:bg-white/10 text-green-500 shadow-sm' : 'text-slate-400'
                }`}
              >
                {mode === 'group' ? 'General Group' : 'Per User'}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-white/10 hidden md:block" />

          {/* Time Range Selector [cite: 81, 84] */}
          <div className="flex gap-2">
            {['Today', 'Last 7 Days', 'Last 30 Days'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all ${
                  timeRange === range ? 'text-green-500 border border-green-500/30 bg-green-500/5' : 'text-slate-400 border border-transparent'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* --- 3. Per-User Selection Interface --- */}
      {viewMode === 'user' && (
        <section className="mb-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="relative max-w-md">
            <input 
              type="text"
              placeholder="Search user by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#1e2330] border border-slate-200 dark:border-white/10 rounded-2xl px-12 py-4 text-sm outline-none focus:border-green-500/50 transition-all shadow-sm"
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
          </div>

          {/* 3-Row Horizontal Scroll Grid  */}
          <div className="bg-slate-200/30 dark:bg-black/20 rounded-[2.5rem] p-6">
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x">
              <div className="grid grid-rows-3 grid-flow-col gap-4">
                {users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).map((user) => (
                  <div key={user.id} className="w-64 snap-start bg-white dark:bg-[#1e2330] p-4 rounded-[1.5rem] border border-slate-200 dark:border-white/10 shadow-sm hover:border-green-500/50 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-800 dark:text-white truncate">{user.name}</span>
                        <span className="text-[10px] text-slate-400 truncate">{user.email}</span>
                      </div>
                      <input type="checkbox" className="accent-green-500 w-4 h-4 rounded-md" />
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
        </section>
      )}

      {/* --- 4. Data Dashboard (KPI Overview) [cite: 93, 94] --- */}
      <main className="space-y-6">

        {/* SUMMARY  */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {[
                { 
                label: 'Total Talk Time', 
                val: '184h 12m', 
                sub: 'Effective duration ',
                color: 'bg-green-500' 
                },
                { 
                label: 'Total Calls', 
                val: '2,840', 
                sub: 'Logged sessions ',
                color: 'bg-emerald-500' 
                },
                { 
                label: 'Total Seeds', 
                val: '1,240', 
                sub: 'Initial logging ',
                color: 'bg-lime-500' 
                },
                { 
                label: 'Total Leads', 
                val: '412', 
                sub: 'Qualified interest ',
                color: 'bg-green-400' 
                },
                { 
                label: 'Total Sales', 
                val: '86', 
                sub: 'Closed conversions ',
                color: 'bg-emerald-600' 
                },
                { 
                label: 'Conversion Rate', 
                val: '12.4%', 
                sub: 'Seed-to-Sale',
                color: 'bg-green-600' 
                },
                { 
                label: 'Avg Call Duration', 
                val: '4m 32s', 
                sub: 'Baseline productivity ',
                color: 'bg-lime-600' 
                },
            ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-[#1e2330] p-5 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                {/* Dynamic Background Glow */}
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                    <div className={`w-12 h-12 ${stat.color} rounded-full blur-xl`} />
                </div>
                
                {/* KPI Label */}
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 relative z-10 block mb-1">
                    {stat.label}
                </span>
                
                {/* KPI Value */}
                <div className="text-xl font-black tracking-tighter text-slate-800 dark:text-white relative z-10">
                    {stat.val}
                </div>
                
                {/* Subtext with Citation Reference */}
                <p className="text-[7px] text-slate-400 uppercase mt-2 tracking-widest font-bold opacity-80 relative z-10">
                    {stat.sub}
                </p>

                {/* Decorative Bottom Bar */}
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 ${stat.color} opacity-20 rounded-t-full group-hover:w-16 transition-all`} />
                </div>
            ))}
            </div>

        {/* Daily Activity Line Chart */}
        <DailyActivityLineChart />

        {/* Per block bar chart */}
        <PerBlockBarChart />

        {/* Call duration histogram */}
        <CallDurationHistogram />

        {/* Seeds heatmap */}
        <SeedHeatmap />

        {/* Convertion funnel Chart */}
        <ConversionFunnelChart />

        {/* Consistency graph */}
        {/* Only available when 1 user is selected */}
        <ConsistencyGraph />

      </main>

      {/* Footer Meta [cite: 181] */}
      <footer className="mt-8 flex justify-between px-4 opacity-30 text-[9px] font-black uppercase tracking-widest">
        <span>Performance Intelligence Layer v1.0</span>
        <span>Operational Integrity: High</span>
      </footer>
    </div>
  );
}