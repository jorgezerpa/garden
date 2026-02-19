'use client'
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea 
} from 'recharts';

// Mock data: Values represent a "Consistency Score" (0-100) based on 
// meeting daily talk time and seed targets.
const consistencyData = [
  { day: '01', score: 85 }, { day: '02', score: 85 }, { day: '03', score: 90 },
  { day: '04', score: 90 }, { day: '05', score: 40 }, { day: '06', score: 40 },
  { day: '07', score: 95 }, { day: '08', score: 95 }, { day: '09', score: 95 },
  { day: '10', score: 100 }, { day: '11', score: 100 }, { day: '12', score: 70 },
  { day: '13', score: 80 }, { day: '14', score: 85 }, { day: '15', score: 90 },
];

export function ConsistencyGraph() {
  return (
    <div className="bg-white dark:bg-[#1e2330] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm mt-8">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Consistency & Streak History</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Behavioral Reliability Metric</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Current Streak</span>
            <span className="text-lg font-black text-green-500">9 Days</span>
          </div>
          <div className="text-right">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Best Streak</span>
            <span className="text-lg font-black text-slate-700 dark:text-white">22 Days</span>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={consistencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="consistencyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.1} />
            
            {/* Target "Optimal Zone" */}
            <ReferenceArea y1={80} y2={100} fill="#22c55e" fillOpacity={0.05} />
            <ReferenceLine y={80} stroke="#22c55e" strokeDasharray="3 3" opacity={0.3} label={{ value: 'Target', position: 'insideLeft', fill: '#22c55e', fontSize: 8, fontWeight: 900 }} />

            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} 
            />
            <YAxis 
              domain={[0, 100]} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} 
            />
            
            <Tooltip 
              cursor={{ stroke: '#22c55e', strokeWidth: 1 }}
              contentStyle={{ 
                backgroundColor: '#1e2330', 
                borderRadius: '12px', 
                border: 'none',
                fontSize: '11px',
                fontWeight: 'bold',
              }}
            />

            {/* Step line shows the "Blocky" nature of consistency streaks */}
            <Area 
              type="stepAfter" 
              dataKey="score" 
              stroke="#22c55e" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#consistencyGradient)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
            <span className="text-slate-800 dark:text-white">Analysis:</span> Consistency is the "Real Product". Use this to detect <span className="text-green-500">Declining Performance Early</span> [cite: 171] before a total burnout occurs.
          </p>
        </div>
      </div>
    </div>
  );
}



// Based on the Data & Performance Intelligence Architecture document, here is the breakdown of what the Consistency Graph represents and why it is a core pillar of the system:

// 1. The Definition of Consistency
// In this architecture, consistency is not just a general feeling; it is a measurable behavioral metric. It represents an agent's ability to maintain high performance across defined "calling blocks" throughout the day, week, and month.
// +4

// 2. What the Data Points Represent
// The graph tracks a Consistency Score, which is calculated by the system using several variables:


// Block Completion: Whether the agent started and ended their assigned calling blocks on time.
// +1


// Activity Stability: Maintaining a steady level of "Effective Talk Time" and "Logged Seeds" instead of having huge peaks followed by long periods of idle time.
// +2


// Target Adherence: How closely the agent stays within the "Optimal Zone" (the target range defined by the company).
// +2

// 3. The "Streak" Logic
// The graph highlights Streak History, which represents how many consecutive days an agent has hit their baseline productivity targets.


// Why it matters: In call centers, the "real product" is the data engine that reveals who can perform reliably over the long term.
// +1


// Identifying Risk: A break in a streak or a declining step-pattern is used by admins as a Burnout Signal or a sign of Declining Performance before it results in a total loss of productivity.
// +1

// 4. Strategic Purpose
// Unlike traditional dialers that only show total sales, this metric provides Behavioral Intelligence. It allows managers to answer:
// +1

// "Where do agents lose consistency?".

// "Who is a reliable long-term performer versus a 'flash in the pan'?".
// +1

// "What is the ideal work structure for this specific agent to keep them consistent?".

// Essentially, it is the "Reliability Index" of the salesperson

/*
So, should be good to divide this by:
- streak of completed block
- streak of sells per day
- streak of ...

by separeated grapsh OR all in one with diferent color lines 

*/