'use client'
import React, { useState, useEffect } from 'react';
import { getBlockPerformance } from '@/apiHandlers/dataVis';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { getSchemasList } from '@/apiHandlers/schema';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const BLOCK_TYPES = ['WORKING', 'REST', 'EXTRA_TIME'];

export function PerBlockBarChart({triggerPerAgentSearch, agentsSelected, fromDate, toDate}:{triggerPerAgentSearch:boolean, agentsSelected:number[], fromDate: string, toDate: string}) {
  const getToday = () => new Date().toISOString().split('T')[0];

  // States
  const [data, setData] = useState<any[]>([]);
  const [schemas, setSchemas] = useState<{name:string, id:number}[]>([]);
  const [selectedSchemaId, setSelectedSchemaId] = useState<number>(1); // default first schema
  // const [fromDate, setFromDate] = useState(lastCallDate);
  // const [toDate, setToDate] = useState(lastCallDate);
  const [activeDays, setActiveDays] = useState([true, true, true, true, true, false, false]); // Mon-Fri active by default
  const [activeTypes, setActiveTypes] = useState([true, true, true]); // Mon-Fri active by default

  useEffect(() => {
    (async () => {
      try {
        const result = await getBlockPerformance(selectedSchemaId, fromDate, toDate, { days:activeDays, types: activeTypes, agents:agentsSelected });
        
        // Transform the data so Recharts can find the keys
        const formattedData = result.map((item: any) => {
          const hours = Math.floor(item.blockStartTimeMinutesFromMidnight / 60);
          const mins = item.blockStartTimeMinutesFromMidnight % 60;
          const timeLabel = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
          
          return {
            ...item,
            block: timeLabel, // This matches your <XAxis dataKey="block" />
          };
        });

        setData(formattedData);
      } catch (error) {
        setData([]);
      }
    })();
  }, [fromDate, toDate, activeDays, activeTypes, selectedSchemaId, triggerPerAgentSearch]);

  useEffect(()=>{
    (async()=>{
      const result = await getSchemasList()
      setSchemas(result.data)
    })()
  },[])

  const schemaChanged = (id: number) => {
    setSelectedSchemaId(id);
  };

  const toggleDay = (index: number) => {
    const nextDays = [...activeDays];
    nextDays[index] = !nextDays[index];
    setActiveDays(nextDays);
  };

  const toggleType = (index: number) => {
    const nextTypes = [...activeTypes];
    nextTypes[index] = !nextTypes[index];
    setActiveTypes(nextTypes);
  };

  return (
    <div className="bg-white dark:bg-[#1e2330] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm mt-8">
      {/* --- Header Section --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Block Performance Bar Chart</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Time-Window Productivity Container</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Date Range Inputs */}
          {/* <div className="flex items-center gap-3 bg-slate-50 dark:bg-black/20 p-2 rounded-2xl border border-slate-200 dark:border-white/10">
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
          </div> */}
        </div>
      </div>

      {/* --- NEW: Filters & Schema Section --- */}
      <div className="mb-10 space-y-8">
        {/* Day Toggle Filter */}
        <div className="flex flex-col gap-3">
          <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Consider Days:</span>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day, idx) => (
              <button
                key={day}
                onClick={() => toggleDay(idx)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${
                  activeDays[idx] 
                    ? 'bg-green-500 border-green-500 text-white shadow-[0_0_12px_rgba(34,197,94,0.3)]' 
                    : 'bg-transparent border-slate-200 dark:border-white/10 text-slate-400 hover:border-slate-300'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Block types:</span>
          <div className="flex flex-wrap gap-2">
            {BLOCK_TYPES.map((type, idx) => (
              <button
                key={type}
                onClick={() => toggleType(idx)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${
                  activeTypes[idx] 
                    ? 'bg-green-500 border-green-500 text-white shadow-[0_0_12px_rgba(34,197,94,0.3)]' 
                    : 'bg-transparent border-slate-200 dark:border-white/10 text-slate-400 hover:border-slate-300'
                  }`}
              >
                {type.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Schema Cards Grid (3 Columns) */}
        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Block Schemas</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {schemas.map((s, i) => (
            <label // Changed to label for better UX (clicking the card triggers the radio)
              key={"schema"+i} 
              className={`flex items-center justify-between p-5 bg-slate-50 dark:bg-white/[0.02] rounded-3xl border transition-all cursor-pointer group ${
                selectedSchemaId === s.id ? 'border-green-500 ring-1 ring-green-500/20' : 'border-slate-200 dark:border-white/5 hover:border-green-500/30'
              }`}
            >
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-tight text-slate-700 dark:text-slate-200">
                  { s.name }
                </h4>
                <button type="button" className="text-[9px] font-bold uppercase text-green-500 mt-1 hover:underline underline-offset-4 decoration-2">
                  See Details
                </button>
              </div>
              <input 
                type="radio" 
                name="schema-group" 
                checked={selectedSchemaId === s.id}
                onChange={() => schemaChanged(s.id)} // Trigger function
                className="w-4 h-4 accent-green-500 cursor-pointer"
              />
            </label>
          ))}
        </div>
      </div>

      <hr className="border-slate-100 dark:border-white/5 mb-8" />

      {/* --- Chart Section --- */}
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.1} />
            <XAxis dataKey="block" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} allowDecimals={false} />
            <Tooltip 
              cursor={{ fill: 'rgba(34, 197, 94, 0.05)' }}
              contentStyle={{ backgroundColor: '#1e2330', borderRadius: '16px', border: 'none', fontSize: '12px', fontWeight: 'bold' }}
            />
            <Legend 
              verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '40px' }}
              formatter={(value) => (
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                  {value === 'talkTime' ? 'Talk Time' : value === 'seeds' ? 'Seeds' : 'Conversion'}
                </span>
              )}
            />
            <Bar dataKey="talkTime" fill="#22c55e" radius={[6, 6, 0, 0]} barSize={18} />
            <Bar dataKey="seeds" fill="#0ea5e9" radius={[6, 6, 0, 0]} barSize={18} />
            <Bar dataKey="sales" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5">
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
          <span className="text-green-500">Insight:</span> This data allows the company to answer which blocks are most productive and identify where agents lose consistency.
        </p>
      </div>
    </div>
  );
}