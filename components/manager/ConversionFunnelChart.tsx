'use client'
import React from 'react';
import { 
  FunnelChart, Funnel, Tooltip, ResponsiveContainer, LabelList, Cell 
} from 'recharts';

// Data structured to show the behavioral drop-off points [cite: 127, 128]
const funnelData = [
  { value: 1240, name: 'Seeds', fill: '#22c55e', sub: 'Initial Logging' },
  { value: 780,  name: 'Callbacks', fill: '#16a34a', sub: 'Engagement' },
  { value: 412,  name: 'Leads', fill: '#15803d', sub: 'Qualified' },
  { value: 86,   name: 'Sales', fill: '#14532d', sub: 'Closed' },
];

export function ConversionFunnelChart() {
  return (
    <div className="bg-white dark:bg-[#1e2330] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm mt-8">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Conversion Funnel Chart</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Behavioral Drop-off Analysis</p>
        </div>
        <div className="text-right">
           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Overall Efficiency</span>
           <span className="text-sm font-black text-green-500">6.9% Yield</span>
        </div>
      </div>

      <div className="h-[450px] w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip 
              cursor={false}
              contentStyle={{ 
                backgroundColor: '#1e2330', 
                borderRadius: '12px', 
                border: 'none',
                fontSize: '12px',
                fontWeight: 'bold',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)'
              }}
              itemStyle={{ color: '#fff' }}
            />
            <Funnel
              dataKey="value"
              data={funnelData}
              isAnimationActive
              lastShapeType="rectangle" // Ensures straight block at the bottom
            >
              <LabelList 
                position="right" 
                fill="#94a3b8" 
                stroke="none" 
                dataKey="name" 
                style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }} 
              />
              <LabelList 
                position="center" 
                fill="#fff" 
                stroke="none" 
                dataKey="value" 
                style={{ fontSize: '14px', fontWeight: '900' }} 
              />
              {funnelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>

      {/* Analytical Breakdown  */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Seed-to-Callback', val: '62.9%', desc: 'Initial interest retention' },
          { label: 'Lead-to-Sale', val: '20.8%', desc: 'Closing team efficiency' },
          { label: 'Total Drop-off', val: '93.1%', desc: 'Volume lost in funnel' },
        ].map((metric, i) => (
          <div key={metric.label} className="p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">{metric.label}</span>
            <p className="text-md font-black text-slate-800 dark:text-white">{metric.val}</p>
            <p className="text-[8px] text-slate-500 font-bold uppercase mt-1 opacity-60">{metric.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}