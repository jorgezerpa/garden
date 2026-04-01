'use client'

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes'
import { getAgentsPositions, getTeamHeat } from '@/apiHandlers/officeDisplay';
import { calculateMondayOfTheWeek, calculateSundayOfTheWeek, formatMinutes, getCurrentDay, getUTCISOStringEndOfDay, getUTCISOStringStartOfDay } from '@/utils/Date';

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

  const dataRef = useRef(dailyData);
  
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
        let event:EventData["type"] | null = null
        if(data.performanceNotifications.seed) event = "seed"
        if(data.performanceNotifications.sale) event = "sale"
        if(data.performanceNotifications.onFire) event = "onFire"

        if(event) triggerEvent(data.agentName, event, data.agentImg);
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
  const triggerEvent = (agentName: string, type: EventData['type'], img:string|null) => {
    setActiveEvent({ agentName, type, agentImg: img });
    setShowEvent(true);
  };

/////////////////////
  useEffect(() => {
    dataRef.current = dailyData;
  }, [dailyData]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     // 3. Always access data from the ref to avoid stale closures
  //     const currentData = dataRef.current;
      
  //     if (currentData && currentData.length > 0) {
  //       const lastAgent = currentData[currentData.length - 1];
        
  //       setActiveEvent({ 
  //         agentName: lastAgent.name, 
  //         agentImg: lastAgent.profileImg || null, 
  //         type: "stoned" 
  //       });
  //       setShowEvent(true)
  //     }
  //   }, 10000);

  //   // 4. IMPORTANT: The Cleanup Function
  //   return () => clearInterval(interval);
  // }, []); 

  useEffect(() => {
    const interval = setInterval(() => {
      // 3. Always access data from the ref to avoid stale closures
      const currentData = dataRef.current;
      
      if (currentData && currentData.length > 0) {
        const eventTypes: EventData['type'][] = ["onFire", "seed", "sale", "stoned"];

        // 1. Pick a random agent from your state
        const randomAgent = currentData[Math.floor(Math.random() * currentData.length)];
        
        // 2. Pick a random event type
        const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

        // 3. Trigger the animation
        if (randomAgent) {
          triggerEvent(randomAgent.name, randomType, randomAgent.profileImg || null);
        }

      }

    }, 10000);

    // 4. IMPORTANT: The Cleanup Function
    return () => clearInterval(interval);
  }, []); 

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


  return (
    <div className={`min-h-screen w-full ${bgMain} ${textMain} p-8 font-sans transition-colors duration-300`}>
      <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-8 h-full">
        
        {/* LEFT COLUMN: WEEKLY */}
        <div className="col-span-4 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-6 italic tracking-tight uppercase">Weekly Leaderboard</h2>
          <div className="w-full space-y-1">
            <HeaderRow />
            <div className={`max-h-[80vh] overflow-y-scroll ${theme=="dark" ? "thin-scrollbar-dark" : "thin-scrollbar"}`}>
              {weeklyData.map((agent,i) => (
                <AgentRow key={agent.name+"weeklyy"+i} agent={agent} isDark={theme === 'dark'} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: HEATMETER & ANIMATION */}
        <div className="col-span-4 flex flex-col items-center justify-start pt-10">
          <HeatMeter score={teamHeat} isDark={theme==="dark"} />
          
        <div className="mt-20 w-full min-h-64">
          {showEvent && activeEvent ? (
            <EventNotification event={activeEvent} isDark={theme === 'dark'}/>
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
            <div className={`max-h-[80vh] overflow-y-scroll ${theme=="dark" ? "thin-scrollbar-dark" : "thin-scrollbar"}`}>
              {dailyData.map((agent, i) => (
                <AgentRow key={agent.name+"dailyyy"+i} agent={agent} isDark={theme === 'dark'} isDaily index={i} />
              ))}
            </div>
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
    <div className="grid grid-cols-[20px_40px_1fr_90px_45px_45px] px-2 mb-2">
      <div className={labelStyle}></div>
      <div className={labelStyle}>(pic)</div>
      <div className={`${labelStyle} text-left`}>Name</div>
      <div className={labelStyle}>Calling</div>
      <div className={labelStyle}>Seeds</div>
      <div className={labelStyle}>Deals</div>
    </div>
  );
}

function AgentRow({ agent, isDark, index }: { agent: AgentData, isDark: boolean, isDaily?: boolean, index:number }) {
  const rowBg = isDark ? 'bg-zinc-900/40' : 'bg-white shadow-sm';
  const borderColor = isDark ? 'border-zinc-800' : 'border-zinc-100';

  // 2. Helper to get subtle level-based colors
  const getLevelColor = (level: number, dark: boolean) => {
    switch(level) {
      case 3: // Gold
        return dark ? 'bg-[rgba(204,142,52,.3)]' : 'bg-amber-100/60';
      case 2: // Silver
        return dark ? 'bg-[rgba(192,192,192,.3)]' : 'bg-slate-100/80';
      case 1: // Bronze
        return dark ? 'bg-[rgba(179,153,33,.4)]' : 'bg-orange-50/80';
      default:
        return dark ? 'bg-zinc-800' : 'bg-zinc-50';
    }
  };

  // const getLevelBorderColor = (level: number, dark: boolean) => {
  //   switch(level) {
  //     case 3: // Gold
  //       return dark ? 'border-2 border-amber-200' : 'border-2 border-amber-900';
  //     case 2: // Silver
  //       return dark ? 'border-2 border-slate-200' : 'border-2 border-slate-700';
  //     case 1: // Bronze
  //       return dark ? 'border-2 border-orange-200' : 'border-2 border-orange-900';
  //     default:
  //       return dark ? '' : '';
  //   }
  // };

  return (
    <div className={`grid grid-cols-[20px_40px_1fr_90px_45px_45px] items-center border ${borderColor} ${rowBg} rounded-lg overflow-hidden h-10 transition-colors`}>
      <div className={`pl-1 h-full flex items-center font-bold text-xs truncate border-r border-l ${borderColor}`}>
        {index+1}
      </div>
      
      <div className="flex justify-center items-center">
        <div className={`w-8 h-8 bg-gray-500/20 rounded-full flex items-center justify-center text-[10px] relative overflow-hidden`}>
          <Image 
            src={agent.profileImg || "/icons-agent-dashboard/profile.png"} 
            alt={ agent.name } 
            fill 
            className="object-contain"
          />
        </div>
      </div>

      {/* Name with Level-based highlight */}
      <div className={`h-full flex items-center justify-between px-3 font-bold text-xs truncate ${getLevelColor(agent.currentLevel, isDark)} border-r border-l ${borderColor}`}>
        <span>{agent.name}</span>
        {agent.currentLevel === 1 && <div className={`w-5 h-5 overflow-hidden flex justify-center items-end relative`}><Image src={"/icons-agent-dashboard/gold-medal1.png"} alt={ "medal" } width={10} height={10} className="w-6 h-6"/></div>}
        {agent.currentLevel === 2 && <div className={`w-5 h-5 overflow-hidden flex justify-center items-end relative`}><Image src={"/icons-agent-dashboard/silver-medal1.png"} alt={ "medal" } width={10} height={10} className="w-6 h-6"/></div>}
        {agent.currentLevel === 3 && <div className={`w-5 h-5 overflow-hidden flex justify-center items-end relative opacity-60`}><Image src={"/icons-agent-dashboard/bronze-medal1.png"} alt={ "medal" } width={10} height={10} className="w-6 h-6"/></div>}
      </div>

      <div className="text-center font-mono text-[12px] opacity-80">
        {formatMinutes(Number(agent.callingTime))}
      </div>

      <div className="flex items-center justify-center gap-1 font-bold text-sm">
        {agent.seeds}
        <span className="text-[12px]">🍃</span>
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
        className="transform rotate-90 transition-all duration-1000 ease-out"
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
  type: 'onFire' | 'seed' | 'sale' | 'stoned';
  agentImg: string | null
}

const EVENT_CONFIG = {
  onFire: { icon: '🔥', text: 'IS ON FIRE!', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500' },
  seed: { icon: '🌱', text: 'MADE A NEW SEED!', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500' },
  sale: { icon: "💰", text: 'PERFORMED A SALE!', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500' },
  stoned: { icon: '/icons-agent-dashboard/Stone.png', text: 'OP DE STEEN!', color: 'text-gray-500', bg: 'bg-gray-200/10', border: 'border-gray-500' },
};

function EventNotification({ event, isDark }: { event: EventData; isDark: boolean }) {
  const config = EVENT_CONFIG[event.type];

  return (
    <div className={`w-full h-64 border-2 ${config.border} ${config.bg} rounded-2xl flex items-center justify-center flex-col overflow-hidden relative animate-in fade-in zoom-in duration-500`}>
      {
        event.agentImg &&
          <div className='w-[40%] absolute top-0 right-0 bottom-[40%] opacity-70 overflow-hidden'>
            <Image 
              src={event.agentImg || ""} 
              alt={ "" } 
              fill 
              className="object-cover"
            />
          </div>
      }
      {/* Background Pulse Circle */}
      <div className={`absolute w-32 h-32 ${config.bg} rounded-full animate-ping opacity-20`} />
      
      <div className="relative z-10 flex flex-col items-center">
        <span className="text-6xl mb-4 drop-shadow-lg animate-bounce">
          { 
            event.type == "stoned"
              ? <div className='rounded-full dark:bg-white/25'>
                  <div className={`w-32 h-32 overflow-hidden flex justify-center items-end relative`}><Image src={config.icon} alt={ "medal" } fill className="object-contain"/></div>
                </div>
              : config.icon
          }
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
