'use client'
import React, { useState, useEffect, useRef } from 'react';
import { getConsistencyStreak } from '@/apiHandlers/dataVis';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea 
} from 'recharts';
import { getCompanyGoals } from '@/apiHandlers/admin';
import { Spinner } from '@/components/Spinner';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function ConsistencyGraph({triggerPerAgentSearch, agentsSelected, fromDate, toDate}:{triggerPerAgentSearch:boolean, agentsSelected:number[], fromDate: string, toDate: string}) {

  const [data, setData] = useState<any[]>([]);
  const [goals, setGoals] = useState<{ name: string, id: number }[]>([])
  const [selectedGoal, setSelectedGoal] = useState<number>(1)
  const [streaks, setStreaks] = useState({ current: 0, best: 0 });
  const [activeDays, setActiveDays] = useState([true, true, true, true, true, false, false]);

  // Loading States
  const [isUpdatingForDates, setIsUpdatingForDates] = useState(false);
  const [isUpdatingForFilters, setIsUpdatingForFilters] = useState(false);
  const prevContextRef = useRef({ fromDate, toDate, triggerPerAgentSearch });

  useEffect(() => {
    (async () => {
      const contextChanged = 
        prevContextRef.current.fromDate !== fromDate || 
        prevContextRef.current.toDate !== toDate || 
        prevContextRef.current.triggerPerAgentSearch !== triggerPerAgentSearch;

      if (contextChanged) {
        setIsUpdatingForDates(true);
      } else {
        setIsUpdatingForFilters(true);
      }

      try {
        const result = await getConsistencyStreak(selectedGoal, fromDate, toDate, { agents: agentsSelected, days: activeDays });
        setData(result.history || result); 
        setStreaks({
          current: result.currentStreak || 0,
          best: result.bestStreak || 0
        });
      } catch (error) {
        console.error("Consistency fetch error:", error);
        setData([]);
      } finally {
        setIsUpdatingForDates(false);
        setIsUpdatingForFilters(false);
        prevContextRef.current = { fromDate, toDate, triggerPerAgentSearch };
      }
    })();
  }, [fromDate, toDate, selectedGoal, activeDays, triggerPerAgentSearch]);
  
  useEffect(() => {
    (async () => {
      try {
        const result = await getCompanyGoals();
        setGoals(result)
      } catch (error) {
        console.error("Goals fetch error:", error);
      }
    })();
  }, []);

  const toggleDay = (index: number) => {
    const nextDays = [...activeDays];
    nextDays[index] = !nextDays[index];
    setActiveDays(nextDays);
  };

  const GraphLoader = ({ message }: { message: string }) => (
    <div className="h-[300px] w-full flex flex-col items-center justify-center animate-in fade-in duration-500">
      <Spinner size="w-10 h-10" color="text-green-500" />
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-6 animate-pulse">
        {message}
      </p>
    </div>
  );

  return (
    <div className="bg-white dark:bg-[#1e2330] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm mt-8 min-h-[550px]">
      {/* --- Header Section --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Consistency & Streak History</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Behavioral Reliability Metric</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex gap-6">
            <div className={`text-right transition-opacity duration-300 ${isUpdatingForFilters ? 'opacity-30' : 'opacity-100'}`}>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Current Streak</span>
              <span className="text-lg font-black text-green-500">{streaks.current} Days</span>
            </div>
            <div className={`text-right transition-opacity duration-300 ${isUpdatingForFilters ? 'opacity-30' : 'opacity-100'}`}>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Best Streak</span>
              <span className="text-lg font-black text-slate-700 dark:text-white">{streaks.best} Days</span>
            </div>
          </div>
        </div>
      </div>

      {isUpdatingForDates ? (
        <GraphLoader message="Re-calculating Behavioral Streaks..." />
      ) : (
        <div className="animate-in fade-in duration-700">
          {/* --- Filters Section --- */}
          <div className="space-y-8 mb-10">
            <div className="flex flex-col gap-3">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Consider Days:</span>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day, idx) => (
                  <button
                    key={day}
                    disabled={isUpdatingForFilters}
                    onClick={() => toggleDay(idx)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${
                      activeDays[idx] 
                        ? 'bg-green-500 border-green-500 text-white shadow-[0_0_12px_rgba(34,197,94,0.3)]' 
                        : 'bg-transparent border-slate-200 dark:border-white/10 text-slate-400 hover:border-slate-300'
                    } ${isUpdatingForFilters ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {goals.map((goal) => (
                <div 
                  onClick={() => !isUpdatingForFilters && setSelectedGoal(goal.id)} 
                  key={"Goal-"+goal.id} 
                  className={`flex items-center justify-between p-5 bg-slate-50 dark:bg-white/[0.02] rounded-3xl border transition-all group cursor-pointer ${
                    selectedGoal === goal.id ? 'border-green-500 ring-1 ring-green-500/20' : 'border-slate-200 dark:border-white/5 hover:border-green-500/30'
                  } ${isUpdatingForFilters ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <div>
                    <h4 className="text-[11px] font-black uppercase tracking-tight text-slate-700 dark:text-slate-200">{goal.name}</h4>
                    <button className="text-[9px] font-bold uppercase text-green-500 mt-1 hover:underline underline-offset-4">See Details</button>
                  </div>
                  <input 
                    checked={selectedGoal === goal.id}
                    type="radio" 
                    readOnly
                    name="goal-select" 
                    className="w-4 h-4 accent-green-500 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          <hr className="border-slate-100 dark:border-white/5 mb-10" />

          {/* --- The Graph --- */}
          {isUpdatingForFilters ? (
            <GraphLoader message="Updating Consistency Map..." />
          ) : (
            <div className="h-[300px] w-full animate-in zoom-in-95 duration-500">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="consistencyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.1} />
                  <ReferenceArea y1={80} y2={100} fill="#22c55e" fillOpacity={0.05} />
                  <ReferenceLine y={80} stroke="#22c55e" strokeDasharray="3 3" opacity={0.3} label={{ value: 'Target', position: 'insideLeft', fill: '#22c55e', fontSize: 8, fontWeight: 900 }} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} />
                  <Tooltip 
                    cursor={{ stroke: '#22c55e', strokeWidth: 1 }}
                    contentStyle={{ backgroundColor: '#1e2330', borderRadius: '12px', border: 'none', fontSize: '11px', fontWeight: 'bold' }}
                  />
                  <Area type="stepAfter" dataKey="score" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#consistencyGradient)" animationDuration={2000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="mt-6 p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                <span className="text-slate-800 dark:text-white">Analysis:</span> Consistency is the "Real Product". Use this to detect <span className="text-green-500">Declining Performance Early</span>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}