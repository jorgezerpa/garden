'use client'
import React, { useState, useEffect } from 'react';
import { getSeedTimelineHeatmap, getSeedTimelineHeatmapPerDay } from '@/apiHandlers/dataVis';

const monthLabels = ['Jan', 'Jun', 'Dec'];

// Define the hourly data interface based on your specific response format
interface HourlyData {
  hour: number;
  intensity: number;
  seeds: number;
  label: string;
}

export function SeedHeatmap({triggerPerAgentSearch, agentsSelected}:{triggerPerAgentSearch:boolean, agentsSelected:number[]}) {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [data, setData] = useState<{ date: Date, intensity: number, seeds: number }[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  // Helper to format Date object to YYYY-MM-DD string
  const formatDateToString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    (async () => {
      try {
        const result = await getSeedTimelineHeatmap(selectedYear, { agents: agentsSelected });
        const formattedResult = result.map((d: any) => {
          const [year, month, day] = d.date.split('-').map(Number);

          return {
            ...d,
            date: new Date(year, month - 1, day, 0, 0, 0, 0)
          }
        });
        
        setData(formattedResult);
        
        // if (formattedResult.length > 0) {
        //   const lastDay = formattedResult[formattedResult.length - 1];
        //   setSelectedDay(lastDay);
        //   // Fetch initial hourly data for the default selected day
        //   const dateString = formatDateToString(lastDay.date);
        //   const hourlyResult = await getSeedTimelineHeatmapPerDay(dateString, { agents: agentsSelected });
        //   setHourlyData(hourlyResult);
        // }
      } catch (error) {
        setData([]);
      }
    })();
  }, [selectedYear, triggerPerAgentSearch]);

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
      {/* --- Header & Year Picker --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Seed Timeline Heatmap</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Behavioral Consistency Tracker</p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 dark:bg-black/20 p-2 px-4 rounded-2xl border border-slate-200 dark:border-white/10">
          <div className="flex flex-col">
            <label className="text-[9px] font-black text-slate-400 uppercase">Selected Year</label>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent text-xs font-bold focus:outline-none dark:text-white cursor-pointer appearance-none pr-4"
            >
              {years.map(year => (
                <option key={year} value={year} className="dark:bg-[#1e2330]">{year}</option>
              ))}
            </select>
          </div>
          <div className="text-slate-400 text-[10px]">▼</div>
        </div>
      </div>

      {/* --- The Heatmap Grid --- */}
      <div className="flex-1 overflow-x-auto pb-6 scrollbar-hide">
        <div className="w-fit min-w-full lg:min-w-0">
          <div className="inline-grid grid-flow-col grid-rows-7 gap-1.5">
            {data.map((day, idx) => (
              <button
                key={idx}
                onClick={async () => {
                  setSelectedDay(day);
                  try {
                    const dateString = formatDateToString(day.date);
                    const result = await getSeedTimelineHeatmapPerDay(dateString, { agents: agentsSelected });
                    setHourlyData(result);
                  } catch (error) {
                    setHourlyData([]);
                  }
                }}
                className={`w-3.5 h-3.5 rounded-sm transition-all duration-200 hover:scale-125 hover:z-10 ${getIntensityClass(day.intensity)} 
                  ${selectedDay?.date.getTime() === day.date.getTime() ? 'ring-2 ring-green-500 ring-offset-2 dark:ring-offset-[#1e2330]' : ''}`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-3 text-[9px] font-black uppercase text-slate-400 tracking-widest border-t border-slate-100 dark:border-white/5 pt-2">
            {monthLabels.map((m, i) => (
              <span key={i} className="opacity-40 hover:opacity-100 transition-opacity cursor-default px-1">{m}</span>
            ))}
          </div>
        </div>
      </div>

      {/* --- Footer / Legend & Hourly Drill-down --- */}
      <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mr-2">Less</span>
          {[0, 1, 2, 3, 4].map(i => <div key={i} className={`w-3 h-3 rounded-sm ${getIntensityClass(i)}`} />)}
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-2">More</span>
        </div>

        {selectedDay && (
          <div className="bg-slate-50 dark:bg-black/40 p-5 rounded-3xl border border-slate-100 dark:border-white/5 flex flex-col gap-4 min-w-[320px] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-3">
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase text-slate-400">Activity for</span>
                <span className="text-[11px] font-black uppercase">
                  {selectedDay.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black uppercase text-green-500">Total Seeds</span>
                <span className="text-sm font-black text-green-500">{selectedDay.seeds}</span>
              </div>
            </div>

            {/* Hourly 24-Block Grid */}
            <div>
              <span className="text-[8px] font-black uppercase text-slate-400 mb-2 block tracking-tighter">Hourly Intensity Breakdown</span>
              <div className="grid grid-cols-12 gap-1">
                {hourlyData.length > 0 ? (
                  hourlyData.map((h) => (
                    <div
                      key={h.hour+"hourlyHeatmap"}
                      title={`${h.label}: ${h.seeds} seeds`}
                      className={`h-4 rounded-sm transition-colors duration-500 ${getIntensityClass(h.intensity)}`}
                    />
                  ))
                ) : (
                  // Skeleton state while fetching
                  Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="h-4 bg-slate-200 dark:bg-white/5 rounded-sm animate-pulse" />
                  ))
                )}
              </div>
              <div className="flex justify-between mt-1.5 text-[7px] font-black text-slate-400 uppercase">
                <span>00:00</span>
                <span>12:00</span>
                <span>23:00</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}