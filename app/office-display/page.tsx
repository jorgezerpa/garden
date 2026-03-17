'use client'

const THEME_MODE = 'dark'; 

export default function OfficeDisplay() {
  const teamHeat = 87;
  const agents = [
    { name: 'Thomas', score: 94 }, { name: 'Sara', score: 91 }, { name: 'David', score: 84 },
    { name: 'Alex', score: 77 }, { name: 'Mike', score: 63 }, { name: 'Emma', score: 58 },
    { name: 'John', score: 52 }, { name: 'Lisa', score: 49 }, { name: 'Paul', score: 45 },
    { name: 'Kate', score: 42 }, { name: 'Ryan', score: 38 }, { name: 'Jill', score: 35 }
  ];

  const topFive = agents.slice(0, 5);
  const remaining = agents.slice(5);

  const isDark = THEME_MODE === 'dark';
  const bgColor = isDark ? 'bg-[#0a0e17]' : 'bg-slate-50';
  const cardBg = isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-md';

  return (
    <div className={`h-screen w-screen ${bgColor} text-white p-6 font-sans flex items-center justify-center overflow-hidden`}>
      
      {/* Container to hold both panels, centered horizontally */}
      <div className="flex gap-8 max-w-7xl w-full">
        
        {/* LEFT SIDE: Fixed Stats & Heat */}
        <section className="w-[45%] flex flex-col justify-center items-center border-r border-white/5">
          <h2 className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-6">Team Heat</h2>
          
          <div className="relative flex items-center justify-center mb-10">
            <svg className="w-[320px] h-[320px] transform -rotate-90">
              <circle className="text-white/5" strokeWidth="12" stroke="currentColor" fill="transparent" r="120" cx="160" cy="160" />
              <circle className="transition-all duration-1000 ease-out" strokeWidth="12" strokeDasharray={2 * Math.PI * 120} strokeDashoffset={2 * Math.PI * 120 * (1 - teamHeat/100)} strokeLinecap="round" stroke="#22c55e" fill="transparent" r="120" cx="160" cy="160" 
                      style={{ filter: 'drop-shadow(0 0 10px #22c55e)' }} />
            </svg>
            <div className="absolute text-[140px] font-black tracking-tighter drop-shadow-[0_0_25px_rgba(34,197,94,0.4)]">
              {teamHeat}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 w-full px-10">
            {[ { label: 'Active', val: 14 }, { label: 'Seeds', val: 42 }, { label: 'Harvest', val: 6 } ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-slate-500 text-[9px] uppercase tracking-widest">{item.label}</p>
                <p className="text-4xl font-black">{item.val}</p>
              </div>
            ))}
          </div>
        </section>

        {/* RIGHT SIDE: Ranking List & Grid */}
        <section className="w-[55%] flex flex-col gap-6 overflow-hidden">
          
          {/* Top 5 List */}
          <div>
            <h3 className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.3em] mb-4">Top Agents</h3>
            <div className="space-y-2">
              {topFive.map((a, i) => (
                <div key={a.name} className={`${cardBg} backdrop-blur-md px-6 py-3 rounded-xl flex justify-between items-center border`}>
                  <span className="font-black text-lg text-green-500">#{i + 1} {a.name}</span>
                  <span className="font-black text-xl">{a.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grid of remaining users with Index */}
          <div className="flex-1">
            <h3 className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.3em] mb-4">All Agents</h3>
            <div className="grid grid-cols-4 gap-3">
              {remaining.map((a, i) => (
                <div key={a.name} className={`${cardBg} p-3 rounded-lg text-center border hover:border-green-500/50 transition-colors`}>
                  <p className="text-[9px] font-bold text-slate-500">#{i + 6}</p>
                  <p className="text-[10px] font-bold truncate">{a.name}</p>
                  <p className="text-lg font-black text-green-400">{a.score}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}