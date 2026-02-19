'use client'
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

// Mock data representing "Performance Containers" (Blocks)
const blockData = [
  { block: '08:00', talkTime: 45, seeds: 12, conversion: 15 },
  { block: '10:00', talkTime: 52, seeds: 18, conversion: 22 },
  { block: '12:00', talkTime: 30, seeds: 8,  conversion: 10 },
  { block: '14:00', talkTime: 48, seeds: 15, conversion: 19 },
  { block: '16:00', talkTime: 38, seeds: 10, conversion: 12 },
];

export function PerBlockBarChart() {
  return (
    <div className="bg-white dark:bg-[#1e2330] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm mt-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Block Performance Bar Chart</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Time-Window Productivity Container </p>
        </div>
        <div className="px-4 py-1 rounded-full bg-green-500/10 border border-green-500/20">
          <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Efficiency View</span>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={blockData} 
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            barGap={8}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.1} />
            <XAxis 
              dataKey="block" 
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
              cursor={{ fill: 'rgba(34, 197, 94, 0.05)' }}
              contentStyle={{ 
                backgroundColor: '#1e2330', 
                borderRadius: '16px', 
                border: 'none',
                fontSize: '12px',
                fontWeight: 'bold',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend 
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '40px' }}
              formatter={(value) => (
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                  {value === 'talkTime' ? 'Talk Time (min)' : value === 'seeds' ? 'Seeds logged' : 'Conversion %'}
                </span>
              )}
            />
            
            {/* 1. Talk Time per Block [cite: 109] */}
            <Bar 
              dataKey="talkTime" 
              fill="#22c55e" 
              radius={[6, 6, 0, 0]} 
              barSize={18} 
            />
            
            {/* 2. Seeds per Block [cite: 110] */}
            <Bar 
              dataKey="seeds" 
              fill="#0ea5e9" 
              radius={[6, 6, 0, 0]} 
              barSize={18} 
            />

            {/* 3. Conversion per Block [cite: 111] */}
            <Bar 
              dataKey="conversion" 
              fill="#8b5cf6" 
              radius={[6, 6, 0, 0]} 
              barSize={18} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5">
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
          <span className="text-green-500">Insight:</span> This data allows the company to answer which blocks are most productive and identify where agents lose consistency[cite: 35, 38].
        </p>
      </div>
    </div>
  );
}