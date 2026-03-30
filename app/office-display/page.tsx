'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes'
import { getAgentsPositions, getTeamHeat } from '@/apiHandlers/officeDisplay';
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
  const [teamHeat, setTeamHeat] = useState<number>(0)
  const [activeEvent, setActiveEvent] = useState<EventData | null>(null);
  const [showEvent, setShowEvent] = useState(false);
  
  const bgMain = theme === 'dark' ? 'bg-[#121212]' : 'bg-slate-50';
  const textMain = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textMuted = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')



  useEffect(() => {
    // Initial data fetching 
    fetchData();

    // Get token from localStorage just like in your Axios utility
    const token = localStorage.getItem('jwt');
    
    if (!token) return;

    // Append both the screen AND the token to the URL
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/events?screen=office-display&token=${token}`;

    const es = new EventSource(url);

    es.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'WEBHOOK_TRIGGERED') {
        fetchData();
      }
    };

    es.onerror = (err) => {
      console.error("SSE Connection Error. Check if token is valid.");
      es.close();
    };

    return () => es.close();
  }, [])

  
  // SHOWS EVENT 
  useEffect(() => {
    if (showEvent) {
      const timer = setTimeout(() => {
        setShowEvent(false);
        // We wait for the exit animation before clearing data
        setTimeout(() => setActiveEvent(null), 500);
      }, 5000); // Display for 5 seconds
      return () => clearTimeout(timer);
    }
  }, [showEvent]);
  
  // Helper to trigger an event (You can call this when your API detects a change)
  const triggerEvent = (agentName: string, type: EventData['type']) => {
    setActiveEvent({ agentName, type });
    setShowEvent(true);
  };

  const fetchData = async() => { 
    try {
      const today = getCurrentDay() // yyyy-mm-dd
      const startOfTheWeek = calculateMondayOfTheWeek(today)
      const endOfTheWeek = calculateSundayOfTheWeek(today)
      const responseToday =  await getAgentsPositions(getUTCISOStringStartOfDay(today), getUTCISOStringEndOfDay(today))
      const responseWeek =  await getAgentsPositions(getUTCISOStringStartOfDay(startOfTheWeek), getUTCISOStringEndOfDay(endOfTheWeek))
      const heatResponse = await getTeamHeat(today)
      setWeeklyData(responseWeek)      
      setDailyData(responseToday)
      setTeamHeat(heatResponse.heatScore)
    } catch (error) {
      setWeeklyData([])      
      setDailyData([])
      setTeamHeat(0)
    }
  }

  // // PROVICIONAL FOR TESTING NOTIFICATIONS 
  // useeEffect(() => {
  //   // Only run simulation if we have agents to show
  //   if (dailyData.length === 0) return;

  //   const eventTypes: EventData['type'][] = [
  //     'fire', 'streak', 'big_deal', 'level_up', 'first_sale', 'target_hit'
  //   ];

  //   const interval = setInterval(() => {
  //     // 1. Pick a random agent from your state
  //     const randomAgent = dailyData[Math.floor(Math.random() * dailyData.length)];
      
  //     // 2. Pick a random event type
  //     const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

  //     // 3. Trigger the animation
  //     if (randomAgent) {
  //       triggerEvent(randomAgent.name, randomType);
  //     }
  //   }, 10000); // Runs every 10 seconds

  //   return () => clearInterval(interval);
  // }, [dailyData]); // Re-run if dailyData updates



  return (
    <div className={`min-h-screen w-full ${bgMain} ${textMain} p-8 font-sans transition-colors duration-300`}>
      <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-8 h-full">
        
        {/* LEFT COLUMN: WEEKLY */}
        <div className="col-span-4 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-6 italic tracking-tight uppercase">Weekly Leaderboard</h2>
          <div className="w-full space-y-1">
            <HeaderRow />
            {weeklyData.map((agent,i) => (
              <AgentRow key={agent.name+"weeklyy"+i} agent={agent} isDark={theme === 'dark'} />
            ))}
          </div>
        </div>

        {/* CENTER COLUMN: HEATMETER & ANIMATION */}
        <div className="col-span-4 flex flex-col items-center justify-start pt-10">
          <HeatMeter score={teamHeat} isDark={theme==="dark"} />
          
        <div className="mt-20 w-full min-h-64">
          {showEvent && activeEvent ? (
            <EventNotification event={activeEvent} isDark={theme === 'dark'} />
          ) : (
            /* Idle state: Show a subtle goal progress or placeholder */
            <div className={`w-full h-64 border-2 border-dashed ${borderColor} rounded-2xl flex items-center justify-center flex-col opacity-40`}>
               <p className={textMuted}>Listening for achievements...</p>
            </div>
          )}
        </div>


        </div>

        {/* RIGHT COLUMN: LIVE DAILY */}
        <div className="col-span-4 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-6 italic tracking-tight uppercase">Live Daily</h2>
          <div className="w-full space-y-1">
            <HeaderRow />
            {dailyData.map((agent, i) => (
              <AgentRow key={agent.name+"dailyyy"+i} agent={agent} isDark={theme === 'dark'} isDaily />
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



interface HeatMeterProps {
  score: number;
  isDark: boolean;
}

const HeatMeter: React.FC<HeatMeterProps> = ({ score, isDark }) => {
  // Clamp score between 0 and 100
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  
  // Circular Constants
  const radius = 175;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  // Configuration for levels
  const getLevelConfig = (val: number) => {
    if (val <= 20) return { color: '#3b82f6', label: 'Ice Cold', icon: '❄️' };
    if (val <= 40) return { color: '#06b6d4', label: 'Cooling', icon: '🌬️' };
    if (val <= 60) return { color: '#eab308', label: 'Warming Up', icon: '☀️' };
    if (val <= 80) return { color: '#f97316', label: 'Heating Up', icon: '✨' };
    return { color: '#ef4444', label: 'ON FIRE', icon: '🔥' };
  };

  const { color, label, icon } = getLevelConfig(normalizedScore);

  return (
    <div className="relative flex items-center justify-center">
      {/* SVG Circle */}
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90 transition-all duration-1000 ease-out"
      >
        {/* Background Track */}
        <circle
          stroke={isDark ? '#27272a' : '#e4e4e7'}
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress Bar */}
        <circle
          stroke={color}
          fill="transparent"
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center Content */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-4xl mb-1 animate-bounce" style={{ animationDuration: '3s' }}>
          {icon}
        </span>
        <span className={`text-5xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {normalizedScore}
        </span>
        <span 
          className="text-[10px] font-bold uppercase tracking-widest mt-1"
          style={{ color: color }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};


interface EventData {
  agentName: string;
  type: 'fire' | 'streak' | 'big_deal' | 'level_up' | 'first_sale' | 'target_hit';
}

const EVENT_CONFIG = {
  fire: { icon: '🔥', text: 'IS ON FIRE!', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500' },
  streak: { icon: '⚡', text: 'STREAKING!', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400' },
  big_deal: { icon: '💰', text: 'BIG DEAL!', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500' },
  level_up: { icon: '🆙', text: 'LEVEL UP!', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500' },
  first_sale: { icon: '🌱', text: 'FIRST SEED!', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400' },
  target_hit: { icon: '🎯', text: 'TARGET HIT!', color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500' },
};

function EventNotification({ event, isDark }: { event: EventData; isDark: boolean }) {
  const config = EVENT_CONFIG[event.type];

  return (
    <div className={`w-full h-64 border-2 ${config.border} ${config.bg} rounded-2xl flex items-center justify-center flex-col overflow-hidden relative animate-in fade-in zoom-in duration-500`}>
      {/* Background Pulse Circle */}
      <div className={`absolute w-32 h-32 ${config.bg} rounded-full animate-ping opacity-20`} />
      
      <div className="relative z-10 flex flex-col items-center">
        <span className="text-6xl mb-4 drop-shadow-lg animate-bounce">
          {config.icon}
        </span>
        <h3 className={`text-3xl font-black uppercase italic tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {event.agentName}
        </h3>
        <p className={`text-xl font-black uppercase italic ${config.color}`}>
          {config.text}
        </p>
      </div>
      
      {/* Subtle scanline effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
}
