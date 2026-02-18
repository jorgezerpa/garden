import { useState } from 'react';

export function TalkTime() {
  const [progress, setProgress] = useState(80); 

  const radius = 127;
  const circumference = 2 * Math.PI * radius;
  const gapSize = 6;
  const segmentCount = 9;
  const segmentLength = (circumference - (segmentCount * gapSize)) / segmentCount;
  
  const microLineHeight = 18;
  const microLineCount = 8;
  const microDashWidth = 2;
  const microGapWidth = (segmentLength / microLineCount) - microDashWidth;
  const microDashArray = `${microDashWidth} ${microGapWidth}`;

  const hue = (progress / 100) * 120;
  const activeColor = getActiveColor(progress);
  const offset = circumference - (progress / 100) * circumference;

  
  function getActiveColor(progress:number): string {
    const segmentColors = [
      '#00C950'
    ];
    
    return segmentColors[0]
}

  return (
    <div className="overflow-hidden bg-white dark:bg-[#252b39]/80 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm rounded-2xl p-8 flex-[2.5] min-h-[450px] flex flex-col items-center justify-between relative transition-all duration-500 text-slate-800 dark:text-white">
      
      {/* Top Header */}
      <div className="text-center z-10">
        <h3 className="text-base uppercase tracking-[0.2em] opacity-60 font-medium">
          Talk Time Today
        </h3>
      </div>

      {/* Main Visual Container */}
      <div className="relative w-[300px] h-[300px] flex items-center justify-center">
        
        {/* SVG Indicator */}
        <svg 
          width="300" height="300" viewBox="0 0 300 300" 
          className="-rotate-90 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]"
        >
          <defs>
            <mask id="segment-mask">
              <circle cx="150" cy="150" r={radius} stroke="white" strokeWidth="30" fill="none" strokeDasharray={`${segmentLength} ${gapSize}`} />
            </mask>
            <mask id="micro-lines-mask">
              <circle cx="150" cy="150" r={radius} stroke="white" strokeWidth={microLineHeight} fill="none" strokeDasharray={microDashArray} />
            </mask>
          </defs>

          {/* Thin Outer Border */}
          <circle cx="150" cy="150" r="149" stroke="currentColor" strokeWidth="1" fill="none" className="opacity-10" />

          {/* Active Progress */}
          <circle 
            cx="150" cy="150" r={radius} 
            stroke={activeColor} strokeWidth="30" fill="none"
            mask="url(#segment-mask)"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-in-out"
          />

          {/* Micro-Lines */}
          <g mask="url(#segment-mask)">
            <circle 
              cx="150" cy="150" r={radius} 
              stroke="white" strokeWidth={microLineHeight} fill="none"
              mask="url(#micro-lines-mask)"
              strokeDasharray={circumference} strokeDashoffset={offset}
              className="transition-all duration-700 ease-in-out opacity-40"
            />
          </g>
        </svg>

        {/* Inner Circle Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center z-10">
            <span className="text-[14px] font-semibold uppercase tracking-widest text-green-500 dark:drop-shadow-[0_0_8px_rgba(34,197,94,0.4)] mb-2 block">
              On Fire!
            </span>
            <h2 className="text-4xl font-mono tracking-tighter text-slate-800 dark:text-white dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              02:15:30
            </h2>
            {/* Leaves/Icon placeholder */}
            <div className="mt-4 flex justify-center opacity-40">
              <div className="w-6 h-6 bg-slate-400 dark:bg-slate-600 rounded-full blur-[1px]" />
            </div>
          </div>
        </div>




      </div>


      {/* Bottom Stats Footer */}
      <div className="w-full flex justify-between items-center px-4">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest opacity-40">Calls</span>
          <span className="text-xl font-medium">26</span>
        </div>

        {/* Small separator line */}
        <div className="h-8 w-[1px] bg-white/10" />

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
            <span className="text-[10px] uppercase tracking-widest opacity-40">Deep Calls</span>
          </div>
          <span className="text-xl font-medium">8</span>
        </div>
      </div>
      
    </div>
  );
}