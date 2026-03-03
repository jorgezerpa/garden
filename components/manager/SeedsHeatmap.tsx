'use client'
import React, { useState, useEffect } from 'react';
import { getSeedTimelineHeatmap } from '@/apiHandlers/dataVis';

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function SeedHeatmap() {
  const getToday = () => new Date().toISOString().split('T')[0];

  const [data, setData] = useState<{ date: string, intensity: number, seeds: number, talkTime: number }[]>([]);
  const [fromDate, setFromDate] = useState(getToday());
  const [toDate, setToDate] = useState(getToday());
  const [selectedDay, setSelectedDay] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const result = await getSeedTimelineHeatmap(fromDate, toDate);
        // Ensure we parse the date strings into Date objects for the UI logic
        const formattedResult = result.map((d: any) => ({
          ...d,
          date: new Date(d.date)
        }));
        setData(formattedResult);
        if (formattedResult.length > 0) {
          setSelectedDay(formattedResult[formattedResult.length - 1]);
        }
      } catch (error) {
        setData([]);
      }
    })();
  }, [fromDate, toDate]);

  const getIntensityClass = (level: number) => {
    switch (level) {
      case 0: return 'bg-slate-200 dark:bg-white/5';
      case 1: return 'bg-green-500/20';
      case 2: return 'bg-green-500/40';
      case 3: return 'bg-green-500/70';
      case 4: return 'bg-green-500 shadow-[0_0_8px_#22c55e]';
      default: return 'bg-slate-200 dark:bg-white/5';
    }
  };

  return (
    <div className="bg-white dark:bg-[#1e2330] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm mt-8">
      {/* --- Header & Date Pickers --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Seed Timeline Heatmap</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Behavioral Consistency Tracker</p>
        </div>

        {/* Reusable Date Input Design */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-black/20 p-2 rounded-2xl border border-slate-200 dark:border-white/10">
          <div className="flex flex-col px-2">
            <label className="text-[9px] font-black text-slate-400 uppercase">From</label>
            <input 
              type="date" 
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-transparent text-xs font-bold focus:outline-none dark:text-white cursor-pointer"
            />
          </div>
          <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10" />
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
      </div>

      {/* --- The Heatmap Grid --- */}
      <div className="flex gap-3">
        {/* Y-Axis Labels (Days) */}
        <div className="flex flex-col justify-between py-1 h-[116px] text-[8px] font-black uppercase text-slate-400">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>

        <div className="flex-1 overflow-x-auto pb-6 scrollbar-hide">
          <div className="inline-grid grid-flow-col grid-rows-7 gap-1.5">
            {data.map((day, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDay(day)}
                className={`w-3.5 h-3.5 rounded-sm transition-all duration-200 hover:scale-125 hover:z-10 ${getIntensityClass(day.intensity)} 
                  ${selectedDay?.date.getTime() === new Date(day.date).getTime() ? 'ring-2 ring-green-500 ring-offset-2 dark:ring-offset-[#1e2330]' : ''}`}
              />
            ))}
          </div>
          
          {/* X-Axis Labels (Dynamic Month Indicators) */}
          <div className="flex mt-3 text-[9px] font-black uppercase text-slate-400 tracking-widest border-t border-slate-100 dark:border-white/5 pt-2">
             {/* Using a simplified layout for the labels based on data length */}
             {monthLabels.map((m, i) => (
               <span key={i} className="flex-1 text-center opacity-40 hover:opacity-100 transition-opacity cursor-default">{m}</span>
             ))}
          </div>
        </div>
      </div>

      {/* --- Footer / Legend & Selected Day Info --- */}
      <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mr-2">Less</span>
          {[0, 1, 2, 3, 4].map(i => <div key={i} className={`w-3 h-3 rounded-sm ${getIntensityClass(i)}`} />)}
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-2">More</span>
        </div>

        {selectedDay && (
          <div className="bg-slate-50 dark:bg-black/40 px-6 py-3 rounded-2xl flex items-center gap-8 border border-slate-100 dark:border-white/5 animate-in fade-in zoom-in duration-300">
             <div className="flex flex-col">
               <span className="text-[8px] font-black uppercase text-slate-400">Date</span>
               <span className="text-[11px] font-black">{selectedDay.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
             </div>
             <div className="flex flex-col">
               <span className="text-[8px] font-black uppercase text-green-500">Seeds</span>
               <span className="text-sm font-black text-green-500">{selectedDay.seeds}</span>
             </div>
             <div className="flex flex-col">
               <span className="text-[8px] font-black uppercase text-slate-400">Talk Time</span>
               <span className="text-sm font-black">{Math.floor(selectedDay.talkTime/60)}h {selectedDay.talkTime%60}m</span>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}