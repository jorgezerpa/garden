export function TalkTime() {

  return (
        <div className="bg-white dark:bg-[#252b39]/80 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.4)] rounded-2xl p-6 flex-[2.5] min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500">
      
            {/* 1. Atmospheric Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            {/* The "Golden Dust" sparkle effect from the image */}
            <div className="absolute top-1/2 right-10 w-32 h-32 bg-yellow-500/10 blur-[50px] rounded-full pointer-events-none" />

            {/* 2. Top Label */}
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-8 z-10">
              Talk Time Today
            </h3>

            {/* 3. The Main Glowing Ring Container */}
            <div className="relative w-72 h-72 flex items-center justify-center">
              
              {/* Outer Static Ring */}
              <div className="absolute inset-0 rounded-full border border-slate-200 dark:border-white/5 shadow-[inset_0_0_40px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_60px_rgba(0,0,0,0.3)]" />
              
              {/* The Glowing Progress Segment (Represented as a thick border with glow) */}
              <div className="absolute inset-2 rounded-full border-[10px] border-transparent border-t-green-500 border-r-green-400 dark:drop-shadow-[0_0_15px_rgba(34,197,94,0.6)] rotate-45" />

              {/* Inner Content */}
              <div className="text-center z-10">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-green-500 dark:drop-shadow-[0_0_8px_rgba(34,197,94,0.4)] mb-2 block">
                  On Fire!
                </span>
                <h2 className="text-5xl font-mono tracking-tighter text-slate-800 dark:text-white dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                  02:15:30
                </h2>
                {/* Leaves/Icon placeholder */}
                <div className="mt-4 flex justify-center opacity-40">
                  <div className="w-6 h-6 bg-slate-400 dark:bg-slate-600 rounded-full blur-[1px]" />
                </div>
              </div>
            </div>

            {/* 4. Bottom Stats (Calls vs Deep Calls) */}
            <div className="flex w-full justify-between mt-10 px-4 z-10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Calls:</span>
                <span className="text-sm font-bold tabular-nums">26</span>
              </div>
              
              <div className="flex items-center gap-2 border-l border-slate-200 dark:border-white/10 pl-6">
                <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Deep Calls:</span>
                <span className="text-sm font-bold tabular-nums">8</span>
              </div>
            </div>
          </div> 
  );
}