'use client';
import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

// --- Mock Data ---
const performanceTrend = [
  { day: 'Mon', talkTime: 120, seeds: 40 },
  { day: 'Tue', talkTime: 150, seeds: 35 },
  { day: 'Wed', talkTime: 180, seeds: 55 },
  { day: 'Thu', talkTime: 140, seeds: 42 },
  { day: 'Fri', talkTime: 210, seeds: 60 },
];

const mockAgents = [
  { 
    id: 1, 
    name: 'Alex Rivera', 
    email: 'alex@garden.ai', 
    hired: '2023-10-12', 
    streak: 12, 
    seeds: 450, 
    status: 'active',
    behavior: {
      history: "Total: 4,280 calls | Lifetime Seed-to-Sale: 8.4%",
      trends: "Consistency +12% vs last month | Avg Call length increasing",
      strengths: "Block 2 (10:00-12:00) | Mid-week peak efficiency",
      weaknesses: "Friday afternoons | High churn in 0-1 min bucket",
      patterns: "High seed volume / Low callback ratio"
    }
  },
  { 
    id: 2, 
    name: 'Jordan Smith', 
    email: 'jordan@garden.ai', 
    hired: '2024-01-05', 
    streak: 5, 
    seeds: 210, 
    status: 'active',
    behavior: {
      history: "Total: 1,120 calls | Lifetime Seed-to-Sale: 6.2%",
      trends: "Steady growth | Maintaining baseline targets",
      strengths: "Morning blocks | High engagement on 5+ min calls",
      weaknesses: "Low talk time on Mondays",
      patterns: "Quality-focused / Slower seed logging pace"
    }
  },
  { 
    id: 3, 
    name: 'Sarah Chen', 
    email: 'sarah.c@garden.ai', 
    hired: '2023-08-20', 
    streak: 24, 
    seeds: 890, 
    status: 'active',
    behavior: {
      history: "Total: 8,400 calls | Lifetime Seed-to-Sale: 11.5%",
      trends: "Elite consistency | Top 1% of the organization",
      strengths: "All blocks | Exceptional 'Closing' window efficiency",
      weaknesses: "None identified | Consistent across all buckets",
      patterns: "Predictable, high-output mechanical consistency"
    }
  },
  { 
    id: 4, 
    name: 'Marcus Thorne', 
    email: 'm.thorne@garden.ai', 
    hired: '2024-02-14', 
    streak: 2, 
    seeds: 85, 
    status: 'active',
    behavior: {
      history: "Total: 340 calls | New Hire Probation",
      trends: "Learning phase | Volatile daily talk time",
      strengths: "High energy in Block 1 (08:00-10:00)",
      weaknesses: "Drop-off in data entry (seeds) during Block 4",
      patterns: "Inconsistent follow-through / High churn rate"
    }
  },
  { 
    id: 5, 
    name: 'Elena Rodriguez', 
    email: 'elena@garden.ai', 
    hired: '2023-11-30', 
    streak: 0, 
    seeds: 320, 
    status: 'paused',
    behavior: {
      history: "Total: 2,800 calls | Burnout Warning Signal",
      trends: "Declining performance | -30% activity vs last week",
      strengths: "Historically strong in late-afternoon blocks",
      weaknesses: "Current high absenteeism | Broken streaks",
      patterns: "Pattern suggests external burnout / Fatigue"
    }
  },
  { 
    id: 6, 
    name: 'David Vance', 
    email: 'dvance@garden.ai', 
    hired: '2023-09-15', 
    streak: 8, 
    seeds: 512, 
    status: 'active',
    behavior: {
      history: "Total: 5,100 calls | Solid Mid-Tier Performer",
      trends: "Recovering from slump | Upward streak trend",
      strengths: "Block 3 (13:00-15:00) | Mid-day focus",
      weaknesses: "Slow starts in Block 1",
      patterns: "Reactive behavior / Responds well to morning coaching"
    }
  },
  { 
    id: 7, 
    name: 'Sasha Ivanov', 
    email: 'sasha@garden.ai', 
    hired: '2023-12-01', 
    streak: 15, 
    seeds: 440, 
    status: 'active',
    behavior: {
      history: "Total: 3,900 calls | Seed Specialist",
      trends: "Stable | High data-entry compliance",
      strengths: "Consistently hits seed targets before 14:00",
      weaknesses: "Low talk-to-lead conversion",
      patterns: "Efficient data processor / Needs closing support"
    }
  },
  { 
    id: 8, 
    name: 'Liam O’Connor', 
    email: 'liam.oc@garden.ai', 
    hired: '2024-03-01', 
    streak: 4, 
    seeds: 115, 
    status: 'active',
    behavior: {
      history: "Total: 450 calls | Emerging Talent",
      trends: "Rapidly increasing talk time",
      strengths: "Block 4 (15:00-17:00) | Strong closer",
      weaknesses: "High seed churn | Needs admin training",
      patterns: "Aggressive sales style / Low admin discipline"
    }
  },
  { 
    id: 9, 
    name: 'Chloe Baptiste', 
    email: 'chloe@garden.ai', 
    hired: '2023-07-10', 
    streak: 1, 
    seeds: 920, 
    status: 'active',
    behavior: {
      history: "Total: 9,200 calls | Senior Representative",
      trends: "Cyclical consistency | High performance bursts",
      strengths: "Expert-level conversation management",
      weaknesses: "Frequent streak resets | Needs flexibility",
      patterns: "High value / Medium reliability pattern"
    }
  },
  { 
    id: 10, 
    name: 'Musa Abebe', 
    email: 'musa.a@garden.ai', 
    hired: '2024-01-20', 
    streak: 9, 
    seeds: 280, 
    status: 'active',
    behavior: {
      history: "Total: 1,800 calls | Dependable Associate",
      trends: "Consistent 2% weekly growth",
      strengths: "Balanced performance across all blocks",
      weaknesses: "Short call average is slightly high",
      patterns: "Steady progress / Low risk profile"
    }
  }
];

export default function AgentsManagement() {
  // Track which agent is expanded AND which mode (details vs modify)
  const [expanded, setExpanded] = useState<{ id: number | null, mode: 'details' | 'modify' | null }>({
    id: null,
    mode: null
  });

  const toggleExpand = (id: number, mode: 'details' | 'modify') => {
    if (expanded.id === id && expanded.mode === mode) {
      setExpanded({ id: null, mode: null });
    } else {
      setExpanded({ id, mode });
    }
  };

  return (
    <div className="space-y-8 pb-20 font-sans">
      {/* 1. Header & Search Bar */}
      <div className="flex flex-col lg:flex-row justify-between gap-6 items-end">
        <div className="w-full lg:max-w-md">
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Search</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Filter by name or email..." 
              className="w-full bg-white dark:bg-[#1e2330] border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-xs font-bold focus:ring-2 focus:ring-green-500 outline-none transition-all shadow-sm"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
        </div>

        {/* 2. Advanced Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <select className="bg-white dark:bg-[#1e2330] dark:text-gray-200 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none">
            <option>Min Streak: All</option>
            <option>5+ Days</option>
            <option>10+ Days</option>
          </select>
          {/* <input type="date" className="bg-white dark:bg-[#1e2330] dark:text-gray-200 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none" /> */}
        </div>
      </div>

      <div className="space-y-4">
        {mockAgents.map((agent) => (
          <div key={agent.id} className="bg-white dark:bg-[#1e2330] rounded-[2rem] border border-slate-200 dark:border-white/10 overflow-hidden transition-all duration-500 shadow-sm">
            
            {/* Visible Part */}
            <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 font-black text-xl">
                  {agent.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-black dark:text-white leading-none">{agent.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">{agent.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Hired</span>
                  <span className="text-[11px] font-bold dark:text-slate-200">{agent.hired}</span>
                </div>
                <div>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Streak</span>
                  <span className={`text-[11px] font-black ${agent.streak > 10 ? 'text-green-500' : 'text-amber-500'}`}>{agent.streak} Days</span>
                </div>
                <div className="hidden md:block">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Status</span>
                  <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${agent.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{agent.status}</span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => toggleExpand(agent.id, 'modify')}
                  className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-md border ${
                    expanded.id === agent.id && expanded.mode === 'modify' 
                    ? 'bg-amber-500 border-amber-500 text-white' 
                    : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-amber-500/50'
                  }`}
                >
                  Modify User
                </button>
                <button 
                  onClick={() => toggleExpand(agent.id, 'details')}
                  className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-md ${
                    expanded.id === agent.id && expanded.mode === 'details'
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-green-500 dark:hover:bg-green-500 dark:hover:text-white'
                  }`}
                >
                  {expanded.id === agent.id && expanded.mode === 'details' ? 'Hide Details' : 'See Details'}
                </button>
              </div>
            </div>

            {/* --- DROPDOWN 1: MODIFY USER (Administrative) --- */}
            {expanded.id === agent.id && expanded.mode === 'modify' && (
              <div className="px-6 pb-8 pt-4 border-t border-slate-100 dark:border-white/5 animate-in slide-in-from-top-4 duration-500">
                <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-dashed border-slate-200 dark:border-white/10">
                  <div className="flex flex-col xl:flex-row gap-8 justify-between">
                    <div className="space-y-4">
                      <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Administrative Actions</h5>
                      <div className="flex flex-wrap gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
                          Pause User
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
                          Terminate
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 max-w-2xl">
                      <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Edit Credentials</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="text" defaultValue={agent.name} placeholder="Name" className="bg-white dark:bg-black/40 dark:text-gray-300 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-[11px] font-bold outline-none" />
                        <input type="email" defaultValue={agent.email} placeholder="Email" className="bg-white dark:bg-black/40 dark:text-gray-300 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-[11px] font-bold outline-none" />
                        <input type="password" placeholder="New Password" className="bg-white dark:bg-black/40 dark:text-gray-300 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-[11px] font-bold outline-none" />
                      </div>
                    </div>

                    <div className="flex items-end">
                      <button className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[9px] font-black uppercase rounded-xl hover:bg-green-500 transition-all">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- DROPDOWN 2: SEE DETAILS (Behavioral) --- */}
            {expanded.id === agent.id && expanded.mode === 'details' && (
              <div className="px-6 pb-8 pt-4 border-t border-slate-100 dark:border-white/5 animate-in slide-in-from-top-4 duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Summary List */}
                  <div className="lg:col-span-1 space-y-4">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Summary</h5>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
                        <div>
                          <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Performance History</p>
                          <p className="text-[11px] font-bold dark:text-slate-200">{agent.behavior.history}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                        <div>
                          <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Historical Trends</p>
                          <p className="text-[11px] font-bold dark:text-slate-200">{agent.behavior.trends}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5" />
                        <div>
                          <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Behavioral Patterns</p>
                          <p className="text-[11px] font-bold dark:text-slate-200">{agent.behavior.patterns}</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Chart Overlay */}
                  <div className="lg:col-span-2 bg-slate-50 dark:bg-black/20 rounded-[2rem] p-6 border border-slate-100 dark:border-white/5">
                    <div className="flex justify-between items-center mb-6">
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">30-Day Activity Overlay</h5>
                    </div>
                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={performanceTrend}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: '700', fill: '#94a3b8'}} />
                          <Tooltip contentStyle={{backgroundColor: '#1e2330', border: 'none', borderRadius: '12px', fontSize: '10px'}} />
                          <Area type="monotone" dataKey="seeds" stroke="#22c55e" strokeWidth={3} fillOpacity={0.1} fill="#22c55e" />
                          <Area type="monotone" dataKey="talkTime" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}