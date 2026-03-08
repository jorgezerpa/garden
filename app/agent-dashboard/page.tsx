'use client'
import { LineChart } from '@/components/charts/LineChart'
import { TalkTime } from '@/components/TalkTime'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getAgentDayInsights, getAgentWeeklyGrowth, getAssignedSchema, registerAgentState } from '@/apiHandlers/agentDashboard'

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // MINDSET COMPONENT
  
  const [assignedSchema, setAssignedSchema] = useState<
  {
    id: number
    name: string
    companyId: number
    creatorId: 1
    blocks: { 
      id: number
      startMinutesFromMidnight: number
      endMinutesFromMidnight: number
      blockType: "WORKING"|"REST"
      name: string
      schemaId: number,
   }[]
  }
  |null>(null);

  const [mindset, setMindset] = useState({ energy: 0, focus: 0, motivation: 0 });
  const [agentInsights, setAgentInsights] = useState<{
    seeds: number,
    leads: number,
    sales: number,
    currentStreak: number,
    number_of_calls: number,
    number_of_deep_call: number,
    energy: number,
    focus: number,
    motivation: number,
    talkTime: number,
    goalSeeds: number,
    goalLeads: number, 
    goalSales: number,
    goalNumberOfCalls: number,
    goalNumberOfLongCalls: number,
    goalTalkTimeMinutes: number,
  }>({
    seeds: 0,
    leads: 0,
    sales: 0,
    currentStreak: 0,
    number_of_calls: 0,
    number_of_deep_call: 0,
    energy: 0,
    focus: 0,
    motivation: 0,
    talkTime: 0,
    goalSeeds: 0,
    goalLeads: 0, 
    goalSales: 0,
    goalNumberOfCalls: 0,
    goalNumberOfLongCalls: 0,
    goalTalkTimeMinutes: 0,
  })

  const [weeklyGrowthData, setWeeklyGrowthData] = useState<{day:string, growth: number}[]>([])

  type AgentInsights = typeof agentInsights;

  useEffect(() => setMounted(true), [])
  
  useEffect(()=>{
    (async()=>{
      try {
        const dateStr = [
          date.getFullYear(),
          String(date.getMonth() + 1).padStart(2, '0'),
          String(date.getDate()).padStart(2, '0')
        ].join('-');
        const response = await getAgentDayInsights(dateStr)
        setMindset({ energy: response.energy, focus: response.focus, motivation: response.motivation })
      } catch (error) {
        console.log("error agent dashboard")
      }
    })()
  }, [])

  useEffect(() => {
  const fetchData = async () => {
    try {
      const dateStr = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0')
      ].join('-');

      const [insights, weeklyGrowth, schema] = await Promise.all([
        getAgentDayInsights(dateStr),
        getAgentWeeklyGrowth(dateStr),
        getAssignedSchema(dateStr)
      ]);

      setAgentInsights(insights);
      setWeeklyGrowthData(weeklyGrowth);
      setAssignedSchema(schema);
    } catch (error) {
      console.log("error agent dashboard", error);
    }
  };

  // 1. Run immediately on mount
  fetchData();

  // 2. Set up the 10-second interval
  const intervalId = setInterval(fetchData, 20000);

  // 3. Clean up on unmount
  return () => clearInterval(intervalId);
}, []); 

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  const handleRegisterMinset = () => {
    try {

      registerAgentState(mindset.energy, mindset.focus, mindset.motivation)
    } catch (error) {
      console.log(error)
    }
  }

  // Reusable card style for the "Glow" and "Blur" look
  const cardStyle = `
    bg-white dark:bg-[#252b39]/80 
    backdrop-blur-md 
    border border-slate-200 dark:border-white/10 
    shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.4)] 
    rounded-2xl p-4 transition-all duration-500
  `;

  const date = new Date(); // or pass your specific date object
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(date);

  if (!mounted) return null

  const getFormatedHour = (minutesFromMidnight0: number, minutesFromMidnight1: number): string => {
    const formatTime = (totalMinutes: number): string => {
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      
      // Ensure 2-digit military format (00:00 - 23:59)
      const HH = String(hours).padStart(2, '0');
      const MM = String(mins).padStart(2, '0');
      
      return `${HH}:${MM}`;
    };

    return `${formatTime(minutesFromMidnight0)} - ${formatTime(minutesFromMidnight1)}`;
  };

// Example Usage:
// getFormatedHour(540, 1020); // "09:00 - 17:00"
// getFormatedHour(30, 90);    // "00:30 - 01:30"

  return (
    <div className="min-h-screen transition-colors duration-500 bg-slate-100 dark:bg-[#1a1f2b] text-slate-800 dark:text-slate-200 p-4 md:p-6 flex flex-col gap-4 font-sans selection:bg-green-500/30">
      
      {/* Background Glow Decorations (Dark Mode Only) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-1000">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-green-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[120px]" /> 
      </div>

      {/* --- Header / Top Bar --- */}
      <header className={`${cardStyle} flex items-center justify-between !py-3 relative z-10`}>
      <div className="flex items-center gap-3">
        {/* The Parent Container controls the size */}
        <div className="relative w-10 h-10 rounded-lg shadow-sm dark:shadow-lg shadow-green-500/20 overflow-hidden">
          <Image
            src="/icons-agent-dashboard/Logo.svg"
            alt="Sales Garden Logo"
            fill
            className="object-cover"
            priority
          />
        </div>
  
  <h1 className="font-bold text-lg hidden sm:block tracking-tight text-slate-700 dark:text-slate-100">
    Sales Garden
  </h1>
</div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end text-sm">
            <span className="opacity-70">
              Welcome, <span className="font-bold text-green-500 dark:text-green-400">Sarah</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest opacity-40 font-semibold">
              { formattedDate }
            </span>
          </div>
          
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-green-500/10 border border-slate-200 dark:border-white/10 transition-all active:scale-95"
          >
            {/* Container is w-5 h-5 to match standard icon sizing. 
              Using 'relative' so the Image component can 'fill' it.
            */}
            <div className="relative w-6 h-6">
              {theme === 'dark' ? (
                <Image 
                  src="/icons-agent-dashboard/Light.svg" 
                  alt="Switch to light mode" 
                  fill 
                  className="object-contain"
                  priority
                />
              ) : (
                <Image 
                  src="/icons-agent-dashboard/Dark.svg" 
                  alt="Switch to dark mode" 
                  fill 
                  className="object-contain"
                  priority
                />
              )}
            </div>
          </button>
        </div>


      </header>

      {/* --- Main Content Grid --- */}
      <main className="flex flex-col lg:flex-row gap-6 flex-1 relative z-10">
        
        {/* Left Column */}
        <section className="flex flex-col gap-4 w-full lg:w-1/4">
          {/* --- Mindset Section --- */}
          <div className={`${cardStyle} h-auto min-h-48`}>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-6">
              Mindset Check
            </h3>
            
            <div className="flex flex-col">
              <MindsetSlider 
                id="energy"
                label="Energy" 
                color="bg-green-500" 
                value={mindset.energy} 
                onChange={(v) => setMindset({...mindset, energy: v})} 
              />
              <MindsetSlider
                id="focus" 
                label="Focus" 
                color="bg-yellow-500" 
                value={mindset.focus} 
                onChange={(v) => setMindset({...mindset, focus: v})} 
              />
              <MindsetSlider 
                id="motivation"
                label="Motivation" 
                color="bg-orange-500" 
                value={mindset.motivation} 
                onChange={(v) => setMindset({...mindset, motivation: v})} 
              />
            </div>


            <div onClick={handleRegisterMinset} className='cursor-pointer mx-auto rounded-xl py-3 bg-[#00C950] dark:bg-[#1A4F3D] text-white dark:text-[#00C950] text-center text-[13px] tracking-[0.2em]'>Register Mindset</div>
          </div>

        
          {/* /* --- Reset Zone Section --- */} 
          <div className="bg-white dark:bg-[#252b39]/80 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.4)] rounded-2xl p-4 flex-1 min-h-[180px] flex flex-col relative overflow-hidden transition-all duration-500">
            
            {/* 1. Section Header */}
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4">
              Historical Overview
            </h3>

            {/* 2. Sub-label for the Graph Area */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[12px] font-medium text-slate-600 dark:text-slate-300">
                Weekly Growth
              </span>
              {/* Subtle indicator dot */}
              <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
            </div>

            {/* 3. Graph Placeholder Area */}
            <div className="flex-1 w-full bg-slate-50/50 dark:bg-black/20 rounded-xl border border-dashed border-slate-200 dark:border-white/5 flex items-center justify-center relative">
              {/* Atmospheric Glow inside the graph area */}
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-green-500/5 to-transparent pointer-events-none" />
              
              {/* <span className="text-[10px] uppercase tracking-widest text-slate-300 dark:text-slate-600 font-bold">
                Graph Component Area
              </span> */}
              <LineChart data={weeklyGrowthData} />
            </div>

            {/* 4. X-Axis Labels Placeholder */}
            <div className="flex justify-between mt-2 px-1">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                <span key={day} className="text-[9px] font-bold uppercase tracking-tighter text-slate-400 dark:text-slate-600">
                  {day}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Middle Column */}
        <section className="flex flex-col gap-4 w-full lg:w-1/2">
          {/* --- Talk Time --- */}
          {/* @TODO replace with current day goal  */}
          <TalkTime time={agentInsights.talkTime} goal={0} total_calls={agentInsights.number_of_calls} total_deep_calls={agentInsights.number_of_deep_call} /> 

          {/* --- streak tracker Section --- */}
          <div className="bg-white dark:bg-[#252b39]/80 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.4)] rounded-2xl p-4 flex-1 relative  group transition-all duration-500">

            
            {/* 2. Header Label with decorative lines */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-3 mb-6">

              <h3 className="text-[15px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-gray-100">
                Current Streak
              </h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-2xl font-bold tracking-tight text-slate-700 dark:text-white">{ agentInsights.currentStreak }%</span>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-3 gap-4 px-4">
              {
                [
                  { label: "Seeds", currentValueKey: "seeds" as keyof AgentInsights, goalKey: "goalSeeds" as keyof AgentInsights },
                  { label: "Leads", currentValueKey: "leads" as keyof AgentInsights, goalKey: "goalLeads" as keyof AgentInsights },
                  { label: "Sales", currentValueKey: "sales" as keyof AgentInsights, goalKey: "goalSales" as keyof AgentInsights },
                  { label: "Calls", currentValueKey: "number_of_calls" as keyof AgentInsights, goalKey: "goalNumberOfCalls" as keyof AgentInsights },
                  { label: "Long Calls", currentValueKey: "number_of_deep_call" as keyof AgentInsights, goalKey: "goalNumberOfLongCalls" as keyof AgentInsights },
                  { label: "Talk Time (min)", currentValueKey: "talkTime" as keyof AgentInsights, goalKey: "goalTalkTimeMinutes" as keyof AgentInsights }
                ].map(item => (
                  <div className="text-center">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-200 block mb-1">
                      { item.label }
                    </span>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-lg font-bold tracking-tight text-slate-700 dark:text-white">{agentInsights[item.currentValueKey]}/{ agentInsights[item.goalKey] }</span>
                    </div>
                  </div>
                ))
              }              

            </div>
          </div>
        </section>

        {/* Right Column */}
        <section className="flex flex-col gap-4 w-full lg:w-1/4">
          {/* --- Today's Stats Section --- */}
          <div className={`${cardStyle} p-6`}>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4">
              Today&apos;s Stats
            </h3>
            
            <div className="flex flex-col h-full justify-between pb-4">
              <StatRow id="seeds" label="Seeds" value={agentInsights.seeds} />
              {/* <StatRow id="callback" label="Callback" value={agentInsights.} /> */}
              <StatRow id="lead" label="Lead" value={agentInsights.leads} />
              <StatRow id="sale" label="Sale" value={agentInsights.sales} />
            </div>
          </div>
          {/* --- Call Blocks Section --- */}
          <div className={`${cardStyle} flex flex-col`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Call Blocks
              </h3>
              {/* Icon Placeholder */}
              {/* <div className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded" /> */}
            </div>
            
            <div className="flex flex-col gap-1 max-h-[400px] overflow-y-scroll">
              {
                assignedSchema?.blocks.map(block => (
                  <CallBlock time={getFormatedHour(block.startMinutesFromMidnight, block.endMinutesFromMidnight)} status={block.blockType} />

                ))
              }
              {
                !assignedSchema && <div className='text-[11px] tracking-[0.2em]'>No schema assigned today</div>
              }
            </div>
          </div>
        </section>

      </main>

      {/* --- Footer --- */}
      <footer className="flex items-center justify-between px-2 py-2 text-[10px] font-bold opacity-40 uppercase tracking-widest relative z-10">
        <div>Version 1.0</div>
        {/* <div className="italic text-center hidden md:block lowercase tracking-normal opacity-80">&quot;Seeds now, harvest later!&quot;</div> */}
        <div className="italic text-center hidden md:block lowercase tracking-normal opacity-80"></div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
          Connected
        </div>
      </footer>
    </div>
  )
}




//////////////////////////////////
// MINDSET COMPONENT
/////////////////////////////////
interface MindsetSliderProps {
  id: string;
  label: string;
  color: string; // Tailwind color class like 'bg-green-500' or 'bg-orange-400'
  value: number;
  onChange: (val: number) => void;
}

const MindsetSlider = ({ id, label, color, value, onChange }: MindsetSliderProps) => {

  let styles = `
            absolute w-full h-full appearance-none bg-transparent cursor-pointer 
            /* Chrome, Safari, Edge, Opera */
            [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:w-6 
            [&::-webkit-slider-thumb]:h-6 
            [&::-webkit-slider-thumb]:bg-[url('/icons-agent-dashboard/Energy.svg')] 
            [&::-webkit-slider-thumb]:bg-contain 
            [&::-webkit-slider-thumb]:bg-no-repeat 
            [&::-webkit-slider-thumb]:bg-center
            [&::-webkit-slider-thumb]:border-0
            /* Firefox */
            [&::-moz-range-thumb]:w-6 
            [&::-moz-range-thumb]:h-6 
            [&::-moz-range-thumb]:bg-[url('/icons-agent-dashboard/Energy.svg')] 
            [&::-moz-range-thumb]:bg-contain 
            [&::-moz-range-thumb]:bg-no-repeat 
            [&::-moz-range-thumb]:bg-center
            [&::-moz-range-thumb]:border-0  
          `
    if(id==="energy") styles = `
            absolute w-full h-full appearance-none bg-transparent cursor-pointer 
            /* Chrome, Safari, Edge, Opera */
            [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:w-7 
            [&::-webkit-slider-thumb]:h-7 
            [&::-webkit-slider-thumb]:bg-[url('/icons-agent-dashboard/Energy.svg')] 
            [&::-webkit-slider-thumb]:bg-contain 
            [&::-webkit-slider-thumb]:bg-no-repeat 
            [&::-webkit-slider-thumb]:bg-center
            [&::-webkit-slider-thumb]:border-0
            /* Firefox */
            [&::-moz-range-thumb]:w-6 
            [&::-moz-range-thumb]:h-6 
            [&::-moz-range-thumb]:bg-[url('/icons-agent-dashboard/Energy.svg')] 
            [&::-moz-range-thumb]:bg-contain 
            [&::-moz-range-thumb]:bg-no-repeat 
            [&::-moz-range-thumb]:bg-center
            [&::-moz-range-thumb]:border-0  
          `
    if(id==="focus") styles = `
            absolute w-full h-full appearance-none bg-transparent cursor-pointer 
            /* Chrome, Safari, Edge, Opera */
            [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:w-6 
            [&::-webkit-slider-thumb]:h-6 
            [&::-webkit-slider-thumb]:bg-[url('/icons-agent-dashboard/Focus.svg')] 
            [&::-webkit-slider-thumb]:bg-contain 
            [&::-webkit-slider-thumb]:bg-no-repeat 
            [&::-webkit-slider-thumb]:bg-center
            [&::-webkit-slider-thumb]:border-0
            /* Firefox */
            [&::-moz-range-thumb]:w-6 
            [&::-moz-range-thumb]:h-6 
            [&::-moz-range-thumb]:bg-[url('/icons-agent-dashboard/Focus.svg')] 
            [&::-moz-range-thumb]:bg-contain 
            [&::-moz-range-thumb]:bg-no-repeat 
            [&::-moz-range-thumb]:bg-center
            [&::-moz-range-thumb]:border-0  
          `
    if(id==="motivation") styles = `
            absolute w-full h-full appearance-none bg-transparent cursor-pointer 
            /* Chrome, Safari, Edge, Opera */
            [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:w-6 
            [&::-webkit-slider-thumb]:h-6 
            [&::-webkit-slider-thumb]:bg-[url('/icons-agent-dashboard/Motivation.svg')] 
            [&::-webkit-slider-thumb]:bg-contain 
            [&::-webkit-slider-thumb]:bg-no-repeat 
            [&::-webkit-slider-thumb]:bg-center
            [&::-webkit-slider-thumb]:border-0
            /* Firefox */
            [&::-moz-range-thumb]:w-6 
            [&::-moz-range-thumb]:h-6 
            [&::-moz-range-thumb]:bg-[url('/icons-agent-dashboard/Motivation.svg')] 
            [&::-moz-range-thumb]:bg-contain 
            [&::-moz-range-thumb]:bg-no-repeat 
            [&::-moz-range-thumb]:bg-center
            [&::-moz-range-thumb]:border-0  
          `



  return (
    <div className="flex flex-col gap-2 w-full mb-4 group">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </span>
      </div>
      
      <div className="relative flex items-center h-4">
        {/* Custom Track Background */}
        <div className="absolute w-full h-[3px] bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div 
            className={`h-full ${color} opacity-80`} 
            style={{ width: `${value*10}%` }}
          />
        </div>

        {/* The Range Input */}
        <input
          type="range"
          min="0"
          max="10"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className={styles}
        />
      </div>
    </div>
  );
};


//////////////////////////////////
// RESET ZONE
/////////////////////////////////
interface ResetButtonProps {
  label: string;
  onClick?: () => void;
}

const ResetButton = ({ label, onClick }: ResetButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full py-2.5 px-4 rounded-xl
        /* Typography */
        text-[11px] font-bold uppercase tracking-widest
        text-slate-600 dark:text-slate-300
        /* Visuals */
        bg-slate-200/50 dark:bg-white/5 
        border border-slate-300/50 dark:border-white/10
        shadow-sm
        /* Transitions & Interactions */
        transition-all duration-200
        hover:bg-slate-300/50 dark:hover:bg-white/10
        hover:border-slate-400/50 dark:hover:border-white/20
        active:scale-[0.97] active:bg-slate-400/20 dark:active:bg-black/20
      `}
    >
      {label}
    </button>
  );
};

//////////////////////////////////
// TODAY'S STATS
/////////////////////////////////
interface StatRowProps {
  id: string;
  label: string;
  value: number | string;
  // We'll keep a slot for the icon placeholder as requested earlier
}

const StatRow = ({ id, label, value }: StatRowProps) => {
  // Map the labels to your svg filenames in the public folder
  let iconSrc = `/icons-agent-dashboard/`;
  if(id ==="seeds") iconSrc += "Seeds.svg"
  if(id ==="callback") iconSrc += "Callbacks.svg"
  if(id ==="lead") iconSrc += "Leads.svg"
  if(id ==="sale") iconSrc += "Sales.svg"

  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5 last:border-0 group">
      <div className="flex items-center gap-3">
        {/* Container for the Next.js Image */}
        <div className="relative w-6 h-6 rounded-md transition-colors  overflow-hidden">
          <Image
            src={iconSrc}
            alt={`${label} icon`}
            fill
            className="object-contain p-0.5" // object-contain is usually better for icons
          />
        </div>
        
        <span className="text-[12px] font-medium text-slate-600 dark:text-slate-300">
          {label}
        </span>
      </div>
      
      <span className="text-sm font-bold tabular-nums text-slate-700 dark:text-white">
        {value}
      </span>
    </div>
  );
};

interface CallBlockProps {
  time: string;
  status: string;
}


//////////////////////////////////
// CALL BLOCKS
/////////////////////////////////
const CallBlock = ({ time, status }: CallBlockProps) => {
  // Logic for color variants
  const statusConfig = {
    active: {
      dot: "bg-green-500 shadow-[0_0_8px_#22c55e]",
      badge: "bg-green-500/20 text-green-500 border-green-500/30",
      text: "text-slate-700 dark:text-white font-bold",
      label: "Active"
    },
    upcoming: {
      dot: "bg-slate-300 dark:bg-slate-600",
      badge: "bg-slate-100 dark:bg-white/5 text-slate-500 border-slate-200 dark:border-white/10",
      text: "text-slate-500 dark:text-slate-400 font-medium",
      label: "Upcoming"
    },
    locked: {
      dot: "bg-slate-200 dark:bg-slate-800",
      badge: "bg-slate-50 dark:bg-black/20 text-slate-400 border-transparent",
      text: "text-slate-400 dark:text-slate-600 font-medium",
      label: "Locked"
    }
  };

  // const config = statusConfig[status];

  return (
    <div className={`flex items-center justify-between py-2.5 px-2 rounded-xl transition-colors ${status === 'active' ? 'bg-green-500/5' : ''}`}>
      <div className="flex items-center gap-3">
        {/* Status Dot */}
        {/* <div className={`w-2 h-2 rounded-full ${config.dot}`} /> */}
        <div className={`w-2 h-2 rounded-full`} />
        
        {/* <span className={`text-[12px] tabular-nums ${config.text}`}> */}
        <span className={`text-[12px] tabular-nums`}>
          {time}
        </span>
      </div>
      
      {/* Status Badge */}
      {/* <div className={`text-[9px] px-2.5 py-1 rounded-lg border uppercase tracking-tighter font-bold ${config.badge}`}> */}
      <div className={`text-[9px] px-2.5 py-1 rounded-lg border uppercase tracking-tighter font-bold`}>
        {status}
      </div>
    </div>
  );
};

