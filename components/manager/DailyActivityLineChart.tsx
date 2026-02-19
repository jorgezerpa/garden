'use client'
import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

// Mock data tracking core activity metrics [cite: 16]
const trendData = [
  { date: '2024-05-01', talkTime: 320, calls: 120, seeds: 45 },
  { date: '2024-05-02', talkTime: 400, calls: 145, seeds: 52 },
  { date: '2024-05-03', talkTime: 380, calls: 130, seeds: 48 },
  { date: '2024-05-04', talkTime: 450, calls: 160, seeds: 61 },
  { date: '2024-05-05', talkTime: 300, calls: 110, seeds: 38 },
  { date: '2024-05-06', talkTime: 420, calls: 155, seeds: 55 },
  { date: '2024-05-07', talkTime: 480, calls: 175, seeds: 68 },
];

export function DailyActivityLineChart() {
  // State to manage visibility of lines (On/Off toggle)
  const [activeLines, setActiveLines] = useState({
    talkTime: true,
    calls: true,
    seeds: true
  });

  const handleLegendClick = (e: any) => {
    const { dataKey } = e;
    setActiveLines((prev) => ({
      ...prev,
      [dataKey]: !prev[dataKey as keyof typeof activeLines]
    }));
  };

  return (
    <div className="bg-white dark:bg-[#1e2330] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm mt-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Daily Activity Line Chart</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Performance Trend Analysis [cite: 106]</p>
        </div>
        <div className="flex gap-2">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.1} />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e2330', 
                borderRadius: '16px', 
                border: '1px solid rgba(255,255,255,0.1)',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
              itemStyle={{ fontSize: '11px', textTransform: 'uppercase' }}
            />
            <Legend 
              onClick={handleLegendClick}
              wrapperStyle={{ paddingTop: '20px', cursor: 'pointer' }}
              formatter={(value) => (
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-green-500 transition-colors">
                  {value === 'talkTime' ? 'Talk Time (min)' : value === 'calls' ? 'Logged Calls' : 'Seeds Logged'}
                </span>
              )}
            />
            
            {/* 1. Talk Time Line [cite: 18, 105] */}
            <Line 
              type="monotone" 
              dataKey="talkTime" 
              name="talkTime"
              stroke="#22c55e" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#22c55e', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              hide={!activeLines.talkTime}
            />
            
            {/* 2. Total Calls Line [cite: 19, 105] */}
            <Line 
              type="monotone" 
              dataKey="calls" 
              name="calls"
              stroke="#0ea5e9" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              hide={!activeLines.calls}
            />

            {/* 3. Total Seeds Line [cite: 41, 105] */}
            <Line 
              type="monotone" 
              dataKey="seeds" 
              name="seeds"
              stroke="#8b5cf6" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              hide={!activeLines.seeds}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}