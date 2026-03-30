'use client'
import { LineChart } from '@/components/charts/LineChart'
import { TalkTime } from '@/components/TalkTime'
import { useTheme } from 'next-themes'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { getAgentDayInsights, getAgentWeeklyGrowth, getAssignedSchema, getProfileImg, registerAgentState, uploadProfile } from '@/apiHandlers/agentDashboard'
import { logoutUser } from '@/apiHandlers/auth'

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // LOADING & ERROR STATES
  const [isLoading, setIsLoading] = useState(true)
  const [isRegistering, setIsRegistering] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' as 'error' | 'success' })
  const fileInputRef = useRef<HTMLInputElement>(null);

  // MINDSET COMPONENT
  const [profileImg, setProfileImg] = useState<string|null>(null)
  const [assignedSchema, setAssignedSchema] = useState<{
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
  } | null>(null);

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

  // Toast Helper
  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 5000);
  };

  useEffect(() => setMounted(true), [])
  
  useEffect(() => {
    const fetchData = async (isBackgroundUpdate = false) => {
      if (!isBackgroundUpdate) setIsLoading(true);
      
      try {
        const date = new Date();
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
        
        if (!isBackgroundUpdate) {
          setMindset({ energy: insights.energy, focus: insights.focus, motivation: insights.motivation });
        }
      } catch (error) {
        console.log("error agent dashboard", error);
        if (isBackgroundUpdate) {
          showToast("Connection unstable. Cannot update data, refetching in 20 seconds...", "error");
        } else {
          showToast("Something went wrong fetching your dashboard data.", "error");
        }
      } finally {
        if (!isBackgroundUpdate) setIsLoading(false);
      }
    };

    // 1. Run immediately on mount
    fetchData(false);
  }, []); 

  useEffect(()=>{
    (async()=>{
      const result = await getProfileImg()
      setProfileImg(result?.url||null)
    })()
  }, [])

  useEffect(() => {
    // Get token from localStorage just like in your Axios utility
    const token = localStorage.getItem('jwt');
    
    if (!token) return;

    // Append both the screen AND the token to the URL
    const url = `http://localhost:3001/api/events?screen=office-display&token=${token}`;

    const es = new EventSource(url);

    es.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Ra")
      if (data.type === 'WEBHOOK_TRIGGERED') {
        console.log("webhook trigeeeerrredd")
      }
    };

    es.onerror = (err) => {
      console.error("SSE Connection Error. Check if token is valid.");
      es.close();
    };

    return () => es.close();
  }, []);


  

const handleUploadImg = () => {
  fileInputRef.current?.click(); // Open the file picker
};

const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Optional: Basic client-side validation
  if (!file.type.startsWith('image/')) {
    showToast("Please select a valid image file", "error");
    return;
  }

  const formData = new FormData();
  formData.append('profile', file); // 'profile' must match your Multer .single('profile')

  setIsLoading(true); // Re-use your existing loading state or create a specific one
  try {
    const result = await uploadProfile(formData);
    setProfileImg(result.url);
    showToast("Profile image updated!", "success");
  } catch (error) {
    console.error(error);
    showToast("Failed to upload image", "error");
  } finally {
    setIsLoading(false);
    // Clear the input so the same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  }
};


  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  const handleRegisterMinset = async () => {
    if (isRegistering) return;
    setIsRegistering(true);
    try {
      await registerAgentState(mindset.energy, mindset.focus, mindset.motivation);
      showToast("Mindset registered successfully!", "success");
    } catch (error) {
      console.log(error);
      showToast("Something went wrong registering your mindset.", "error");
    } finally {
      setIsRegistering(false);
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

  const date = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(date);

  const getFormatedHour = (minutesFromMidnight0: number, minutesFromMidnight1: number): string => {
    const formatTime = (totalMinutes: number): string => {
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      
      const HH = String(hours).padStart(2, '0');
      const MM = String(mins).padStart(2, '0');
      
      return `${HH}:${MM}`;
    };

    return `${formatTime(minutesFromMidnight0)} - ${formatTime(minutesFromMidnight1)}`;
  };

  if (!mounted) return null

  return (
    <div className="min-h-screen transition-colors duration-500 bg-slate-100 dark:bg-[#1a1f2b] text-slate-800 dark:text-slate-200 p-4 md:p-6 flex flex-col gap-4 font-sans selection:bg-green-500/30 overflow-x-hidden">
      
      {/* Background Glow Decorations (Dark Mode Only) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-1000">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-green-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[120px]" /> 
      </div>

      {/* --- Header / Top Bar --- */}
      <header className={`${cardStyle} flex items-center justify-between !py-3 relative z-10`}>
        <div className="flex items-center gap-3">
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
              Welcome, 
              {/* <span className="font-bold text-green-500 dark:text-green-400">Sarah</span> */}
            </span>
            <span className="text-[10px] uppercase tracking-widest opacity-40 font-semibold">
              { formattedDate }
            </span>
          </div>
          
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-green-500/10 border border-slate-200 dark:border-white/10 transition-all active:scale-95"
          >
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

          <div onClick={handleUploadImg} className="cursor-pointer w-8 h-8 bg-gray-500/20 flex items-center justify-center text-[10px] relative overflow-hidden rounded-full">
            <Image 
              src={profileImg || "/icons-agent-dashboard/profile.png"} 
              alt={ "profile" } 
              fill 
              className="object-contain"
            />
          </div>

          <button type='button' className='text-[10px] uppercase tracking-[0.2em] cursor-pointer' onClick={()=>logoutUser("/")}>
            logout
          </button>
        </div>
      </header>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={onFileChange} 
        accept="image/*" 
        className="hidden" 
    />

      {/* --- Main Content Grid --- */}
      <main className="flex flex-col lg:flex-row gap-6 flex-1 relative z-10">
        
        {/* Left Column */}
        <section className="flex flex-col gap-4 w-full lg:w-1/4">
          {/* --- Mindset Section --- */}
          <div className={`${cardStyle} h-auto min-h-48 flex flex-col`}>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-6">
              Mindset Check
            </h3>
            
            <div className="flex flex-col flex-1">
              {isLoading ? (
                <div className="flex flex-col gap-6 py-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>

            <button 
              onClick={handleRegisterMinset} 
              disabled={isRegistering || isLoading}
              className={`mt-4 w-full rounded-xl py-3 text-center text-[13px] tracking-[0.2em] font-medium transition-all
                ${isRegistering || isLoading
                  ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed' 
                  : 'bg-[#00C950] dark:bg-[#1A4F3D] text-white dark:text-[#00C950] hover:bg-green-600 dark:hover:bg-green-900 cursor-pointer active:scale-95'
                }`}
            >
              {isRegistering ? 'REGISTERING...' : 'REGISTER MINDSET'}
            </button>
          </div>

        
          {/* --- Historical Overview Section --- */} 
          <div className="bg-white dark:bg-[#252b39]/80 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.4)] rounded-2xl p-4 flex-1 min-h-[180px] flex flex-col relative overflow-hidden transition-all duration-500">
            
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4">
              Historical Overview
            </h3>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[12px] font-medium text-slate-600 dark:text-slate-300">
                Weekly Growth
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
            </div>

            <div className="flex-1 w-full bg-slate-50/50 dark:bg-black/20 rounded-xl border border-dashed border-slate-200 dark:border-white/5 flex items-center justify-center relative min-h-[100px]">
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-green-500/5 to-transparent pointer-events-none" />
              
              {isLoading ? (
                <Skeleton className="w-full h-full absolute inset-0 rounded-xl" />
              ) : (
                <LineChart data={weeklyGrowthData} />
              )}
            </div>

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
          {isLoading ? (
            <div className={`${cardStyle} flex-1 flex items-center justify-center`}>
              <Skeleton className="w-48 h-48 rounded-full" />
            </div>
          ) : (
             <TalkTime time={agentInsights.talkTime} goal={agentInsights.goalTalkTimeMinutes || 0} total_calls={agentInsights.number_of_calls} total_deep_calls={agentInsights.number_of_deep_call} /> 
          )}

          {/* --- Streak Tracker Section --- */}
          <div className="bg-white dark:bg-[#252b39]/80 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.4)] rounded-2xl p-4 flex-1 relative  group transition-all duration-500">

            <div className="relative z-10 flex flex-col items-center justify-center gap-3 mb-6">
              <h3 className="text-[15px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-gray-100">
                Current Streak
              </h3>
              <div className="flex items-baseline justify-center gap-1">
                {isLoading ? (
                  <Skeleton className="w-16 h-8" />
                ) : (
                  <span className="text-2xl font-bold tracking-tight text-slate-700 dark:text-white">{ agentInsights.currentStreak }%</span>
                )}
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
                  <div className="text-center" key={item.label}>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-200 block mb-1">
                      { item.label }
                    </span>
                    <div className="flex items-baseline justify-center gap-1">
                      {isLoading ? (
                        <Skeleton className="w-10 h-6 mx-auto" />
                      ) : (
                        <span className="text-lg font-bold tracking-tight text-slate-700 dark:text-white">{agentInsights[item.currentValueKey]}/{ agentInsights[item.goalKey] }</span>
                      )}
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
            
            <div className="flex flex-col h-full justify-between pb-4 gap-2">
              <StatRow id="seeds" label="Seeds" value={agentInsights.seeds} isLoading={isLoading} />
              {/* <StatRow id="callback" label="Callback" value={agentInsights.} isLoading={isLoading} /> */}
              <StatRow id="lead" label="Lead" value={agentInsights.leads} isLoading={isLoading} />
              <StatRow id="sale" label="Sale" value={agentInsights.sales} isLoading={isLoading} />
            </div>
          </div>
          
          {/* --- Call Blocks Section --- */}
          <div className={`${cardStyle} flex flex-col flex-1`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Call Blocks
              </h3>
            </div>
            
            <div className="flex flex-col gap-1 max-h-[400px] overflow-y-auto pr-1">
              {isLoading ? (
                <>
                  <Skeleton className="w-full h-10 mb-2" />
                  <Skeleton className="w-full h-10 mb-2" />
                  <Skeleton className="w-full h-10" />
                </>
              ) : (
                <>
                  {assignedSchema?.blocks.map(block => (
                    <CallBlock 
                      key={block.id} 
                      time={getFormatedHour(block.startMinutesFromMidnight, block.endMinutesFromMidnight)} 
                      status={block.blockType} 
                    />
                  ))}
                  {!assignedSchema && (
                    <div className='text-[11px] tracking-[0.2em] text-slate-400'>No schema assigned today</div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

      </main>

      {/* --- Footer --- */}
      <footer className="flex items-center justify-between px-2 py-2 text-[10px] font-bold opacity-40 uppercase tracking-widest relative z-10">
        <div>Version 1.0</div>
        <div className="italic text-center hidden md:block lowercase tracking-normal opacity-80"></div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${toast.type === 'error' && toast.show ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-green-500 shadow-[0_0_8px_#22c55e]'}`} />
          {toast.type === 'error' && toast.show ? 'Error' : 'Connected'}
        </div>
      </footer>

      {/* --- Toast Notification System --- */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md
          ${toast.type === 'error' 
            ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400' 
            : 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`} />
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      </div>
    </div>
  )
}


//////////////////////////////////
// UTILS / HELPERS
/////////////////////////////////
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-200/60 dark:bg-white/5 rounded-md ${className}`} />
);

//////////////////////////////////
// MINDSET COMPONENT
/////////////////////////////////
interface MindsetSliderProps {
  id: string;
  label: string;
  color: string; 
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
  isLoading?: boolean;
}

const StatRow = ({ id, label, value, isLoading }: StatRowProps) => {
  let iconSrc = `/icons-agent-dashboard/`;
  if(id ==="seeds") iconSrc += "Seeds.svg"
  if(id ==="callback") iconSrc += "Callbacks.svg"
  if(id ==="lead") iconSrc += "Leads.svg"
  if(id ==="sale") iconSrc += "Sales.svg"

  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5 last:border-0 group">
      <div className="flex items-center gap-3">
        <div className="relative w-6 h-6 rounded-md transition-colors  overflow-hidden">
          <Image
            src={iconSrc}
            alt={`${label} icon`}
            fill
            className="object-contain p-0.5" 
          />
        </div>
        
        <span className="text-[12px] font-medium text-slate-600 dark:text-slate-300">
          {label}
        </span>
      </div>
      
      {isLoading ? (
        <Skeleton className="w-8 h-5" />
      ) : (
        <span className="text-sm font-bold tabular-nums text-slate-700 dark:text-white">
          {value}
        </span>
      )}
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
  return (
    <div className={`flex items-center justify-between py-2.5 px-2 rounded-xl transition-colors ${status === 'WORKING' ? 'bg-green-500/5' : ''}`}>
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${status === 'WORKING' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-slate-300 dark:bg-slate-600'}`} />
        
        <span className={`text-[12px] tabular-nums ${status === 'WORKING' ? 'text-slate-700 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400 font-medium'}`}>
          {time}
        </span>
      </div>
      
      <div className={`text-[9px] px-2.5 py-1 rounded-lg border uppercase tracking-tighter font-bold ${status === 'WORKING' ? 'bg-green-500/20 text-green-500 border-green-500/30' : 'bg-slate-100 dark:bg-white/5 text-slate-500 border-slate-200 dark:border-white/10'}`}>
        {status}
      </div>
    </div>
  );
};