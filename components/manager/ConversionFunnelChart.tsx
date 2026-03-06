'use client'
import React, { useState, useEffect } from 'react';
import { getConversionFunnel } from '@/apiHandlers/dataVis';
import { 
  FunnelChart, Funnel, Tooltip, ResponsiveContainer, LabelList, Cell 
} from 'recharts';

export function ConversionFunnelChart({triggerPerAgentSearch, agentsSelected, fromDate, toDate}:{triggerPerAgentSearch:boolean, agentsSelected:number[], fromDate: string, toDate: string}) {
  const getToday = () => new Date().toISOString().split('T')[0];

  const [data, setData] = useState<{ value: number, name: string, fill: string, sub: string }[]>([]);
  // const [fromDate, setFromDate] = useState(lastCallDate);
  // const [toDate, setToDate] = useState(lastCallDate);

  useEffect(() => {
    (async () => {
      try {
        const result = await getConversionFunnel(fromDate, toDate, { agents: agentsSelected });
        
        const GREEN_GRADIENT = ['#10b981', '#059669', '#047857', '#065f46'];
        const LIGHT_GREENS = ['#34d399', '#10b981', '#059669', '#047857'];
        
        const formattedData = result.map((item:any, index:number) => ({
          ...item,
          fill: item.fill || GREEN_GRADIENT[index % 4] 
        }));
        setData(formattedData);
      } catch (error) {
        setData([]);
      }
    })();
  }, [fromDate, toDate, triggerPerAgentSearch]);

  // Dynamic Calculations based on data
  const calculateYield = () => {
    if (data.length < 2) return "0%";
    const first = data[0].value;
    const last = data[data.length - 1].value;
    return first > 0 ? ((last / first) * 100).toFixed(1) + "%" : "0%";
  };

  const getMetric = (indexA: number, indexB: number) => {
    if (!data[indexA] || !data[indexB] || data[indexA].value === 0) return "0%";
    return ((data[indexB].value / data[indexA].value) * 100).toFixed(1) + "%";
  };

  return (
    <div className="bg-white dark:bg-[#1e2330] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm mt-8">
      {/* Header with Date Inputs */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Conversion Funnel Chart</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Behavioral Drop-off Analysis</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
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

          <div className="text-right hidden sm:block">
             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Overall Efficiency</span>
             <span className="text-sm font-black text-green-500">{calculateYield()} Yield</span>
          </div>
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
              data={data}
              isAnimationActive
              lastShapeType="rectangle"
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
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>

      {/* Analytical Breakdown with Dynamic Values */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Seed-to-Callback', val: getMetric(0, 1), desc: 'Initial interest retention' },
          { label: 'Lead-to-Sale', val: getMetric(2, 3), desc: 'Closing team efficiency' },
          { label: 'Total Drop-off', val: data.length > 0 ? (100 - parseFloat(calculateYield())) + "%" : "0%", desc: 'Volume lost in funnel' },
        ].map((metric) => (
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