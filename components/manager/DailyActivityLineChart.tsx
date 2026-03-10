'use client'
import { getDailyActivity } from '@/apiHandlers/dataVis';
import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { Spinner } from '@/components/Spinner';

// Reusable Chart Component remains the same
const MiniLineChart = ({ title, subtitle, data, dataKey, color, label }: any) => (
  <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2rem] border border-slate-200 dark:border-white/5">
    <div className="flex justify-between items-start mb-6">
      <div>
        <h3 className="text-xs font-black uppercase tracking-[0.15em] text-slate-400">{title}</h3>
        <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{subtitle}</p>
      </div>
      <div 
        className="w-2 h-2 rounded-full animate-pulse" 
        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} 
      />
    </div>

    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.1} />
          <XAxis dataKey="date" hide />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e2330', borderRadius: '12px', border: 'none', fontSize: '11px' }}
            itemStyle={{ color: color, fontSize: '10px', textTransform: 'uppercase' }}
          />
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            name={label}
            stroke={color} 
            strokeWidth={3} 
            dot={{ r: 3, fill: color, strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export function DailyActivityLineCharts({triggerPerAgentSearch, agentsSelected, fromDate, toDate}:{triggerPerAgentSearch:boolean, agentsSelected:number[], fromDate: string, toDate: string}) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const result = await getDailyActivity(fromDate, toDate, { agents:agentsSelected });
        setData(result);
      } catch (error) {
        console.error("Daily activity fetch error:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [fromDate, toDate, triggerPerAgentSearch]); 

  return (
    <div className='bg-white dark:bg-[#1e2330] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm mt-8'>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Daily Activity Analysis</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Performance Trend Analysis</p>
        </div>
      </div>

      {isLoading ? (
        <div className="w-full flex flex-col items-center justify-center py-24 min-h-[300px]">
          <Spinner size="w-10 h-10" color="text-indigo-500" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-6 animate-pulse">
            Processing activity trends...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          <MiniLineChart title="Talk Time" subtitle="Minutes Analysis" data={data} dataKey="talkTime" color="#22c55e" label="Minutes" />
          <MiniLineChart title="Logged Calls" subtitle="Volume Trend" data={data} dataKey="calls" color="#0ea5e9" label="Calls" />
          <MiniLineChart title="Seeds Logged" subtitle="Growth Tracking" data={data} dataKey="seeds" color="#8b5cf6" label="Seeds" />
        </div>
      )}
    </div>
  );
}