'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes'
import { getAgentsPositions } from '@/apiHandlers/officeDisplay';
import { calculateMondayOfTheWeek, calculateSundayOfTheWeek, getCurrentDay, getUTCISOStringEndOfDay, getUTCISOStringStartOfDay } from '@/utils/Date';

// 1. Updated Interface
interface AgentData {
  id: number;
  name: string;
  callingTime: string;
  seeds: number;
  sales: number;
  currentLevel: 1 | 2 | 3; // 1: Bronze, 2: Silver, 3: Gold
  averageScore: number;
  isOnFire?: boolean;
  profileImg?: string;
}


export default function OfficeDisplay() {
  const { theme, setTheme } = useTheme()
  const [weeklyData, setWeeklyData] = useState<AgentData[]>([]);
  const [dailyData, setDailyData] = useState<AgentData[]>([]);

  const isDark = theme === 'dark';
  
  const bgMain = isDark ? 'bg-[#121212]' : 'bg-slate-50';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  useEffect(()=>{
    (async()=>{
      const today = getCurrentDay() // yyyy-mm-dd
      const startOfTheWeek = calculateMondayOfTheWeek(today)
      const endOfTheWeek = calculateSundayOfTheWeek(today)
      const responseToday =  await getAgentsPositions(getUTCISOStringStartOfDay(today), getUTCISOStringEndOfDay(today))
      const responseWeek =  await getAgentsPositions(getUTCISOStringStartOfDay(startOfTheWeek), getUTCISOStringEndOfDay(endOfTheWeek))

      setWeeklyData(responseWeek)      
      setDailyData(responseToday)
    })()
  }, [])

  return (
    <div className={`min-h-screen w-full ${bgMain} ${textMain} p-8 font-sans transition-colors duration-300`}>
      <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-8 h-full">
        
        {/* LEFT COLUMN: WEEKLY */}
        <div className="col-span-4 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-6 italic tracking-tight uppercase">Weekly Leaderboard</h2>
          <div className="w-full space-y-1">
            <HeaderRow />
            {weeklyData.map((agent) => (
              <AgentRow key={agent.id} agent={agent} isDark={isDark} />
            ))}
          </div>
        </div>

        {/* CENTER COLUMN: HEATMETER & ANIMATION */}
        <div className="col-span-4 flex flex-col items-center justify-start pt-10">
          <div className={`w-full aspect-square max-w-[350px] ${isDark ? 'bg-white/5' : 'bg-white shadow-lg'} rounded-full border-4 ${borderColor} flex items-center justify-center flex-col`}>
             <span className={textMuted}>Heatmeter Placeholder</span>
             <p className="text-4xl font-black mt-2">74</p>
          </div>
          <p className={`mt-4 uppercase tracking-tighter font-bold ${textMuted}`}>Team heat meter (score)</p>

          <div className={`mt-20 w-full h-64 border-2 border-dashed ${borderColor} rounded-2xl flex items-center justify-center flex-col`}>
             <div className="w-16 h-16 bg-orange-500 rounded-full animate-pulse mb-4" />
             <p className={textMuted}>Goal Animation Slot</p>
             <h3 className="text-2xl font-black mt-4 uppercase italic">Carlos is on fire!</h3>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE DAILY */}
        <div className="col-span-4 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-6 italic tracking-tight uppercase">Live Daily</h2>
          <div className="w-full space-y-1">
            <HeaderRow />
            {dailyData.map((agent) => (
              <AgentRow key={agent.id} agent={agent} isDark={isDark} isDaily />
            ))}
          </div>
        </div>
      </div>

      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 p-3 rounded-full bg-white dark:bg-zinc-800 shadow-xl border border-gray-200 dark:border-zinc-700 transition-all hover:scale-110 active:scale-95 z-50"
      >
        <div className="relative w-6 h-6">
          <Image 
            src={theme === 'dark' ? "/icons-agent-dashboard/Light.svg" : "/icons-agent-dashboard/Dark.svg"} 
            alt="Toggle theme" 
            fill 
            className="object-contain"
          />
        </div>
      </button>
    </div>
  );
}

function HeaderRow() {
  const labelStyle = "text-[10px] uppercase font-bold text-gray-500 text-center px-1";
  return (
    <div className="grid grid-cols-[40px_1fr_70px_45px_45px] px-2 mb-2">
      <div className={labelStyle}>(pic)</div>
      <div className={`${labelStyle} text-left`}>Name</div>
      <div className={labelStyle}>Calling</div>
      <div className={labelStyle}>Seeds</div>
      <div className={labelStyle}>Deals</div>
    </div>
  );
}

function AgentRow({ agent, isDark }: { agent: AgentData, isDark: boolean, isDaily?: boolean }) {
  const rowBg = isDark ? 'bg-zinc-900/40' : 'bg-white shadow-sm';
  const borderColor = isDark ? 'border-zinc-800' : 'border-zinc-100';

  // 2. Helper to get subtle level-based colors
  const getLevelColor = (level: number, dark: boolean) => {
    switch(level) {
      case 3: // Gold
        return dark ? 'bg-amber-500/20 text-amber-200' : 'bg-amber-100/60 text-amber-900';
      case 2: // Silver
        return dark ? 'bg-slate-400/20 text-slate-200' : 'bg-slate-100/80 text-slate-700';
      case 1: // Bronze
        return dark ? 'bg-orange-800/20 text-orange-200' : 'bg-orange-50/80 text-orange-900';
      default:
        return dark ? 'bg-zinc-800' : 'bg-zinc-50';
    }
  };

  return (
    <div className={`grid grid-cols-[40px_1fr_70px_45px_45px] items-center border ${borderColor} ${rowBg} rounded-lg overflow-hidden h-10 transition-colors`}>
      <div className="flex justify-center items-center">
        <div className="w-6 h-6 bg-gray-500/20 rounded-full flex items-center justify-center text-[10px] relative">
          <Image 
            src={agent.profileImg || "/icons-agent-dashboard/profile.png"} 
            alt={ agent.name } 
            fill 
            className="object-contain"
          />
        </div>
      </div>

      {/* Name with Level-based highlight */}
      <div className={`h-full flex items-center px-3 font-bold text-xs truncate ${getLevelColor(agent.currentLevel, isDark)} border-r border-l ${borderColor}`}>
        {agent.name}
      </div>

      <div className="text-center font-mono text-[11px] opacity-80">
        {agent.callingTime} min
      </div>

      <div className="flex items-center justify-center gap-1 font-bold text-sm">
        {agent.seeds}
        <span className="text-[10px] grayscale opacity-50">🍃</span>
      </div>

      <div className={`text-center font-black ${agent.sales > 0 ? 'text-green-500' : 'opacity-30'}`}>
        {agent.sales}
      </div>
    </div>
  );
}