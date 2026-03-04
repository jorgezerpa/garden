'use client'
import React, { useEffect, useState } from 'react';
import { getLongCallDistribution } from '@/apiHandlers/dataVis';
import { 
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

const COLORS = ['#94a3b8', '#64748b', '#22c55e', '#16a34a', '#14532d'];

export function CallDurationHistogram({triggerPerAgentSearch, agentsSelected}:{triggerPerAgentSearch:boolean, agentsSelected:number[]}) {
  // Helper to get today's date in YYYY-MM-DD
  const getToday = () => new Date().toISOString().split('T')[0];

  const [data, setData] = useState<{ range: string, count: number }[]>([])
  const [fromDate, setFromDate] = useState(getToday());
  const [toDate, setToDate] = useState(getToday());

  useEffect(() => {
    (async () => {
      try {
        // Re-fetches automatically when fromDate or toDate changes
        const result = await getLongCallDistribution(fromDate, toDate, { agents:agentsSelected })
        setData(result)  
      } catch (error) {
        setData([])
      }
    })()
  }, [fromDate, toDate, triggerPerAgentSearch])

  return (
    <div className="bg-white dark:bg-[#1e2330] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm mt-8">
      {/* Header Section with Integrated Inputs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Long Call Distribution</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Duration Density & Trend Envelope</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Date Inputs Container */}
          <div className="flex items-center gap-3 bg-slate-100 dark:bg-black/20 p-2 rounded-2xl border border-slate-200 dark:border-white/5">
            <div className="flex flex-col px-2">
              <label className="text-[9px] font-black text-slate-400 uppercase">From</label>
              <input 
                type="date" 
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="bg-transparent text-xs font-bold focus:outline-none dark:text-white cursor-pointer"
              />
            </div>
            <div className="h-8 w-[1px] bg-slate-300 dark:bg-white/10" />
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
          
          <div className="hidden lg:flex bg-slate-100 dark:bg-black/20 p-1 rounded-xl h-fit">
             <span className="text-[9px] font-black px-3 py-1 text-green-500 uppercase tracking-widest">Histogram Mode</span>
          </div>
        </div>
      </div>

      <div className="h-[380px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={data} 
            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.1} />
            <XAxis 
              dataKey="range" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
              dy={15}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
            />
            <Tooltip 
              cursor={{ fill: 'rgba(34, 197, 94, 0.05)' }}
              contentStyle={{ 
                backgroundColor: '#1e2330', 
                borderRadius: '16px', 
                border: 'none',
                fontSize: '11px',
                fontWeight: 'bold',
              }}
            />
            
            <Bar 
              dataKey="count" 
              radius={[12, 12, 0, 0]} 
              barSize={65}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
              ))}
            </Bar>

            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#22c55e" 
              strokeWidth={3} 
              dot={{ r: 5, fill: '#22c55e', strokeWidth: 3, stroke: '#fff' }}
              activeDot={{ r: 7, strokeWidth: 0 }}
              animationDuration={1500}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Insight Footer */}
      <div className="mt-8 flex items-center gap-4 p-4 bg-green-500/5 rounded-2xl border border-green-500/10">
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">📈</div>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">
          <span className="text-green-600 dark:text-green-400">Trend Analysis:</span> The curve indicates a "High Churn" pattern. The architecture suggests coaching agents to push interactions from the <span className="text-slate-800 dark:text-white">1-3 min</span> bucket into the <span className="text-slate-800 dark:text-white">5+ min</span> "Success Zone".
        </p>
      </div>
    </div>
  );
}