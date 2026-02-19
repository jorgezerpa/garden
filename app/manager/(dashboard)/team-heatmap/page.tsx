'use client'
import React, { useState } from 'react';

// Mock Data: 7 Days x 8 Time Blocks (08:00 - 16:00)
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeBlocks = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'
];

// Generate Team Performance Intensity (0-100)
const generateHeatmapData = () => {
  return days.map(day => ({
    day,
    blocks: timeBlocks.map(time => ({
      time,
      intensity: Math.floor(Math.random() * 100),
      topAgent: "Sarah Chen",
      avgSeeds: Math.floor(Math.random() * 40) + 10,
    }))
  }));
};

const heatmapData = generateHeatmapData();

export default function TeamHeatmap() {
  const [selectedBlock, setSelectedBlock] = useState<any>(null);

  const getIntensityColor = (val: number) => {
    if (val > 80) return 'bg-green-600 shadow-[inset_0_0_15px_rgba(34,197,94,0.4)]';
    if (val > 60) return 'bg-green-500/70';
    if (val > 40) return 'bg-green-500/40';
    if (val > 20) return 'bg-green-500/20';
    return 'bg-slate-100 dark:bg-white/5';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight text-slate-800 dark:text-white">
            Organizational <span className="text-green-500">Pulse</span>
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">
            Global Productivity & Block Efficiency
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-white dark:bg-[#1e2330] p-3 rounded-2xl border border-slate-200 dark:border-white/10">
          <span className="text-[8px] font-black uppercase text-slate-400 mr-2">Intensity:</span>
          {[20, 40, 60, 80, 100].map(v => (
            <div key={v} className={`w-3 h-3 rounded-sm ${getIntensityColor(v)}`} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* The Grid Container */}
        <div className="xl:col-span-3 bg-white dark:bg-[#1e2330] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Time Labels */}
            <div className="grid grid-cols-9 mb-4">
              <div /> {/* Spacer for day labels */}
              {timeBlocks.map(time => (
                <div key={time} className="text-[9px] font-black text-slate-400 uppercase text-center tracking-widest">
                  {time}
                </div>
              ))}
            </div>

            {/* Heatmap Rows */}
            <div className="space-y-2">
              {heatmapData.map((row) => (
                <div key={row.day} className="grid grid-cols-9 items-center group">
                  <div className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
                    {row.day}
                  </div>
                  {row.blocks.map((block, idx) => (
                    <button
                      key={idx}
                      onMouseEnter={() => setSelectedBlock({ ...block, day: row.day })}
                      className={`h-12 m-1 rounded-xl transition-all duration-300 hover:scale-105 hover:z-10 ${getIntensityColor(block.intensity)}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

{/* Intelligence Sidebar */}
<div className="xl:col-span-1 space-y-6">
  <div className="bg-white dark:bg-[#1e2330] p-6 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm h-full">
    <h3 className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-6 italic">Block Insight</h3>
    
    {selectedBlock ? (
      <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
        <div>
          <span className="text-[8px] font-black text-slate-400 uppercase block">Selected Window</span>
          <p className="text-sm font-black dark:text-white">{selectedBlock.day} @ {selectedBlock.time}</p>
        </div>

        {/* Top Performer Card */}
        <div className="p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5">
          <span className="text-[8px] font-black text-green-500 uppercase block mb-1">Top Performer</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-xs font-black dark:text-white">{selectedBlock.topAgent}</p>
          </div>
        </div>

        {/* Performance Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-50 dark:bg-black/10 rounded-xl border border-slate-100 dark:border-white/5">
            <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Avg Seeds</span>
            <p className="text-sm font-black dark:text-white">{selectedBlock.avgSeeds}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-black/10 rounded-xl border border-slate-100 dark:border-white/5">
            <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Intensity</span>
            <p className="text-sm font-black text-green-500">{selectedBlock.intensity}%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-black/10 rounded-xl border border-slate-100 dark:border-white/5">
            <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Avg Call Time</span>
            <p className="text-sm font-black dark:text-white">4m 12s</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-black/10 rounded-xl border border-slate-100 dark:border-white/5">
            <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Avg Sales</span>
            <p className="text-sm font-black dark:text-white">2.4</p>
          </div>
        </div>

        {/* Behavioral Metrics */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-2">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Conv. Rate</span>
            <span className="text-[10px] font-black text-green-500">12.4%</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-2">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Long Call Ratio</span>
            <span className="text-[10px] font-black dark:text-slate-200">42.8%</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-2">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Drop-off Rate</span>
            <span className="text-[10px] font-black text-red-500">5.2%</span>
          </div>
        </div>

        {/* Dynamic AI Observation */}
        <div className="pt-4">
           <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/10">
             <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase">
               <span className="text-green-500 font-black">Admin Note:</span> This block shows peak efficiency. Suggest increasing outbound volume by 15% to capitalize on collective momentum.
             </p>
           </div>
        </div>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-200 dark:border-white/10 mb-4 animate-[spin_3s_linear_infinite]" />
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Select a block to<br/>reveal energy data</p>
      </div>
    )}
  </div>
</div>
      </div>
    </div>
  );
}