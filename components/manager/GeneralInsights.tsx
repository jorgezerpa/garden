'use client'
import React, { useState, useEffect } from 'react';
import { getConsistencyStreak, getGeneralInsights } from '@/apiHandlers/dataVis';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea 
} from 'recharts';
import { getCompanyGoals } from '@/apiHandlers/admin';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function GeneralInsights({triggerPerAgentSearch, agentsSelected, fromDate, toDate}:{triggerPerAgentSearch:boolean, agentsSelected:number[], fromDate: string, toDate: string}) {
    const [generalInsights, setGeneralInsights] = useState<{
      totalTalkTime: number,
      totalCalls: number,
      totalSeeds: number,
      totalLeads: number,
      totalSales: number,
      conversionRate: number,
      avgCallDuration: number
    }>({
      totalTalkTime: 0,
      totalCalls: 0,
      totalSeeds: 0,
      totalLeads: 0,
      totalSales: 0,
      conversionRate: 0,
      avgCallDuration: 0
    })
    // const [fromDate, setFromDate] = useState(lastCallDate);
    // const [toDate, setToDate] = useState(lastCallDate);

    useEffect(() => {
      (async () => {
        try {
          const result = await getGeneralInsights(fromDate, toDate, { agents: agentsSelected });
          setGeneralInsights({
            totalTalkTime: result.totalTalkTime,
            totalCalls: result.totalCalls,
            totalSeeds: result.totalSeeds,
            totalLeads: result.totalLeads,
            totalSales: result.totalSales,
            conversionRate: result.conversionRate,
            avgCallDuration: result.avgCallDuration
          })
        } catch (error) {
        }
      })();
    }, [triggerPerAgentSearch, fromDate, toDate]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {[
            { label: 'Total Talk Time', val: generalInsights.totalTalkTime, sub: 'Effective duration', color: 'bg-green-500' },
            { label: 'Total Calls', val: generalInsights.totalCalls, sub: 'Logged sessions', color: 'bg-emerald-500' },
            { label: 'Total Seeds', val: generalInsights.totalSeeds, sub: 'Initial logging', color: 'bg-lime-500' },
            { label: 'Total Leads', val: generalInsights.totalLeads, sub: 'Qualified interest', color: 'bg-green-400' },
            { label: 'Total Sales', val: generalInsights.totalSales, sub: 'Closed conversions', color: 'bg-emerald-600' },
            { label: 'Conversion Rate', val: generalInsights.conversionRate, sub: 'Seed-to-Sale', color: 'bg-green-600' },
            { label: 'Avg Call Duration', val: generalInsights.avgCallDuration, sub: 'Baseline productivity', color: 'bg-lime-600' },
        ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-[#1e2330] p-5 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                  <div className={`w-12 h-12 ${stat.color} rounded-full blur-xl`} />
              </div>
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 relative z-10 block mb-1">{stat.label}</span>
              <div className="text-xl font-black tracking-tighter text-slate-800 dark:text-white relative z-10">{stat.val}</div>
              <p className="text-[7px] text-slate-400 uppercase mt-2 tracking-widest font-bold opacity-80 relative z-10">{stat.sub}</p>
              <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 ${stat.color} opacity-20 rounded-t-full group-hover:w-16 transition-all`} />
            </div>
        ))}
    </div>
  );
}